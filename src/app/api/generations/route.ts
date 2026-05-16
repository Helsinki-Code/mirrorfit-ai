import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { z } from "zod";
import { getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import { buildGenerationPrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireServerUser } from "@/lib/server-auth";
import { classifySafety } from "@/lib/safety";
import type { Garment, Generation, ModelProfile } from "@/lib/types";
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

function emitTelemetry(event: string, payload: Record<string, unknown>) {
  console.info(`[mirrorfit-telemetry] ${event}`, payload);
}

function extensionFromMime(mimeType: string) {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  return "png";
}

function sanitizeCommercialPrompt(prompt: string) {
  return prompt
    .replace(/\bsexy\b/gi, "commercial fashion")
    .replace(/\bseductive\b/gi, "product-focused")
    .replace(/\berotic\b/gi, "editorial fashion")
    .replace(/\bhot\b/gi, "professional")
    .replace(/\blingerie\b/gi, "sleepwear fashion")
    .replace(/\bnude|nudity|naked\b/gi, "fully clothed")
    .replace(/\s+/g, " ")
    .trim();
}

function isOpenAISexualSafetyBlock(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    /safety_violations=\[sexual\]/i.test(error.message) ||
    /request was rejected by the safety system/i.test(error.message)
  );
}

type ReferenceRecord = {
  downloadUrl?: string;
  imageType?: string;
  createdAt?: number;
};

const MODEL_REFERENCE_PRIORITY: Record<string, number> = {
  face: 0,
  front_body: 1,
  side_body: 2,
  back_body: 3,
  pose: 4,
  closeup: 5,
};

const GARMENT_REFERENCE_PRIORITY: Record<string, number> = {
  front: 0,
  flat_lay: 1,
  back: 2,
  detail: 3,
  transparent_png: 4,
};

function sortByReferencePriority(
  records: ReferenceRecord[],
  priorityMap: Record<string, number>,
) {
  return [...records].sort((a, b) => {
    const aPriority = priorityMap[a.imageType ?? ""] ?? 99;
    const bPriority = priorityMap[b.imageType ?? ""] ?? 99;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });
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

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const modelName = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

    const modelReferencesSorted = sortByReferencePriority(
      referencesSnap.docs.map((doc) => doc.data() as ReferenceRecord),
      MODEL_REFERENCE_PRIORITY,
    );
    const garmentReferencesSorted = sortByReferencePriority(
      garmentImagesSnap.docs.map((doc) => doc.data() as ReferenceRecord),
      GARMENT_REFERENCE_PRIORITY,
    );

    const modelReferenceTypes = modelReferencesSorted
      .map((entry) => entry.imageType ?? "")
      .filter(Boolean);
    const hasFace = modelReferenceTypes.includes("face");
    const hasFrontBody = modelReferenceTypes.includes("front_body");
    const hasSideBody = modelReferenceTypes.includes("side_body");

    if (!hasFace || !hasFrontBody || !hasSideBody) {
      await generationRef.update({
        status: "failed",
        errorMessage:
          "For strong identity lock, upload at least face, front_body, and side_body references.",
        updatedAt: nowUnixMs(),
      });
      return NextResponse.json(
        {
          error:
            "Please upload required model references: face + full-body front + full-body side.",
          code: "insufficient_model_references",
        },
        { status: 400 },
      );
    }

    const modelReferenceUrls = modelReferencesSorted
      .map((entry) => String(entry.downloadUrl ?? ""))
      .filter(Boolean)
      .slice(0, 5);
    const garmentReferenceUrls = garmentReferencesSorted
      .map((entry) => String(entry.downloadUrl ?? ""))
      .filter(Boolean)
      .slice(0, 3);
    const garmentReferenceTypes = garmentReferencesSorted
      .map((entry) => entry.imageType ?? "")
      .filter(Boolean)
      .slice(0, 3);

    const hasPrimaryGarmentRef =
      garmentReferenceTypes.includes("front") || garmentReferenceTypes.includes("flat_lay");

    if (modelReferenceUrls.length === 0 || garmentReferenceUrls.length === 0 || !hasPrimaryGarmentRef) {
      await generationRef.update({
        status: "failed",
        errorMessage:
          "Missing primary garment reference image (front or flat-lay).",
        updatedAt: nowUnixMs(),
      });
      return NextResponse.json(
        {
          error:
            "Please upload at least one primary garment reference image (front view or flat-lay).",
          code: "insufficient_garment_references",
        },
        { status: 400 },
      );
    }

    const basePrompt = buildGenerationPrompt({
      request: payload,
      model,
      garment,
      referenceImageCount: modelReferenceUrls.length,
      referenceImageUrls: modelReferenceUrls,
      garmentImageUrls: garmentReferenceUrls,
      modelReferenceTypes,
      garmentReferenceTypes,
    });
    const prompt = `${sanitizeCommercialPrompt(basePrompt)}\nStrict tone: fully clothed adult, non-explicit, non-pornographic, product-focused commercial fashion catalogue framing.\nIdentity and body lock are mandatory and take priority over stylistic variation.`;

    const imageSources = [
      ...modelReferenceUrls.slice(0, 4),
      ...garmentReferenceUrls.slice(0, 2),
    ];
    const imageFiles = await Promise.all(
      imageSources.map(async (url, index) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch reference image: ${response.status}`);
        }
        const contentType = response.headers.get("content-type") ?? "image/png";
        const bytes = Buffer.from(await response.arrayBuffer());
        const ext = extensionFromMime(contentType);
        return await toFile(bytes, `reference-${index}.${ext}`, { type: contentType });
      }),
    );

    let imageResponse;
    try {
      imageResponse = await openai.images.edit({
        model: modelName,
        image: imageFiles,
        prompt,
        n: 1,
        size: "auto",
        quality: "auto",
        background: "auto",
      });
    } catch (apiError) {
      if (isOpenAISexualSafetyBlock(apiError)) {
        await generationRef.update({
          status: "failed",
          errorMessage:
            "Generation blocked by safety filter. Use neutral model references (front/side/full-body), avoid intimate/romantic shots, and keep prompts strictly product-catalog.",
          updatedAt: nowUnixMs(),
        });
        return NextResponse.json(
          {
            error:
              "Generation was blocked by safety filters. Please use neutral studio-style model references and product-focused prompt language.",
            code: "safety_blocked",
          },
          { status: 400 },
        );
      }
      throw apiError;
    }

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
