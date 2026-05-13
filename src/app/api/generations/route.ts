import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import { buildGenerationPrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireServerUser } from "@/lib/server-auth";
import { classifySafety } from "@/lib/safety";
import type { CreateGenerationRequest, Garment, Generation, ModelProfile } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

const requestSchema = z.object({
  modelProfileId: z.string().min(1),
  garmentId: z.string().min(1),
  style: z.string().min(3),
  background: z.string().min(2),
  lighting: z.string().min(2),
  pose: z.string().min(2),
  outputRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]),
  prompt: z.string().min(10),
});

function ratioToSize(ratio: CreateGenerationRequest["outputRatio"]) {
  if (ratio === "16:9") return "1536x1024";
  if (ratio === "1:1") return "1024x1024";
  return "1024x1536";
}

function emitTelemetry(event: string, payload: Record<string, unknown>) {
  console.info(`[mirrorfit-telemetry] ${event}`, payload);
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser();
    const adminDb = getAdminDb();
    const adminStorage = getAdminStorage();

    const rateLimit = checkRateLimit({
      key: `gen:${user.uid}`,
      windowMs: 60_000,
      maxRequests: 8,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait and try again." },
        { status: 429 },
      );
    }

    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload.", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const generationId = crypto.randomUUID();
    const now = nowUnixMs();
    const generationRef = adminDb.collection("generations").doc(generationId);

    const baseGeneration: Generation = {
      id: generationId,
      userId: user.uid,
      modelProfileId: payload.modelProfileId,
      garmentId: payload.garmentId,
      prompt: payload.prompt,
      style: payload.style,
      background: payload.background,
      lighting: payload.lighting,
      pose: payload.pose,
      outputRatio: payload.outputRatio,
      status: "queued",
      safetyDecision: "allow",
      outputPath: "",
      outputUrl: "",
      createdAt: now,
      updatedAt: now,
    };

    await generationRef.set(baseGeneration);

    const [modelSnap, garmentSnap, referencesSnap, garmentImagesSnap] = await Promise.all([
      adminDb.collection("model_profiles").doc(payload.modelProfileId).get(),
      adminDb.collection("garments").doc(payload.garmentId).get(),
      adminDb
        .collection("model_reference_images")
        .where("userId", "==", user.uid)
        .where("modelId", "==", payload.modelProfileId)
        .get(),
      adminDb
        .collection("garment_images")
        .where("userId", "==", user.uid)
        .where("garmentId", "==", payload.garmentId)
        .get(),
    ]);

    if (!modelSnap.exists || !garmentSnap.exists) {
      await generationRef.update({
        status: "failed",
        errorMessage: "Model or garment not found.",
        updatedAt: nowUnixMs(),
      });
      return NextResponse.json({ error: "Model or garment not found." }, { status: 404 });
    }

    const model = modelSnap.data() as ModelProfile;
    const garment = garmentSnap.data() as Garment;
    if (model.userId !== user.uid || garment.userId !== user.uid) {
      await generationRef.update({
        status: "failed",
        errorMessage: "Unauthorized resource access.",
        updatedAt: nowUnixMs(),
      });
      return NextResponse.json({ error: "Unauthorized resource access." }, { status: 403 });
    }

    const safety = classifySafety(payload, model);
    if (safety.decision === "reject") {
      await generationRef.update({
        status: "failed",
        safetyDecision: "reject",
        errorMessage: safety.reason ?? "Unsafe request.",
        updatedAt: nowUnixMs(),
      });
      return NextResponse.json(
        {
          error:
            "I can't help create explicit or unsafe content, but I can generate a professional fashion catalogue render.",
          decision: "reject",
        },
        { status: 400 },
      );
    }

    await generationRef.update({ status: "generating", updatedAt: nowUnixMs() });

    const prompt = buildGenerationPrompt({
      request: payload,
      model,
      garment,
      referenceImageCount: referencesSnap.size,
      referenceImageUrls: referencesSnap.docs
        .map((doc) => String(doc.data().downloadUrl ?? ""))
        .filter(Boolean)
        .slice(0, 8),
      garmentImageUrls: garmentImagesSnap.docs
        .map((doc) => String(doc.data().downloadUrl ?? ""))
        .filter(Boolean)
        .slice(0, 8),
    });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const modelName = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

    const imageResponse = await openai.images.generate({
      model: modelName,
      prompt,
      size: ratioToSize(payload.outputRatio),
      quality: "high",
    });

    const b64 = imageResponse.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("Image generation returned empty response.");
    }

    const outputPath = `users/${user.uid}/generations/${generationId}/output.png`;
    const buffer = Buffer.from(b64, "base64");
    const bucket = adminStorage.bucket();
    const file = bucket.file(outputPath);

    await file.save(buffer, {
      metadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=3600",
      },
      resumable: false,
    });

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    await generationRef.update({
      status: "completed",
      outputPath,
      outputUrl: signedUrl,
      safetyDecision: "allow",
      updatedAt: nowUnixMs(),
    });

    emitTelemetry("generation.completed", {
      userId: user.uid,
      generationId,
      modelProfileId: payload.modelProfileId,
      garmentId: payload.garmentId,
    });

    return NextResponse.json({ id: generationId, status: "completed" });
  } catch (error) {
    console.error("generation.error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate image. Check backend configuration.",
      },
      { status: 500 },
    );
  }
}
