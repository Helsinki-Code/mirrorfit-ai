import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import { runGenerationOrchestrator } from "@/lib/orchestrator";
import { buildGenerationPrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { setDocSafe, updateDocSafe } from "@/lib/server/firestore-write";
import { requireServerUser } from "@/lib/server-auth";
import { classifySafety } from "@/lib/safety";
import type {
  BrandMemory,
  CreateGenerationRequest,
  Garment,
  Generation,
  ModelProfile,
  ShootJob,
  ShootMessage,
} from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

const requestSchema = z.object({
  shootJobId: z.string().optional(),
  modelProfileId: z.string().optional(),
  garmentId: z.string().optional(),
  userMessage: z.string().min(1),
  quickFixAction: z
    .enum([
      "more_catalogue",
      "improve_garment",
      "keep_face_same",
      "change_pose",
      "generate_back_view",
    ])
    .optional(),
});

export const maxDuration = 300;

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

function buildJobTitle(message: string) {
  const cleaned = message.trim().replace(/\s+/g, " ");
  return cleaned.length > 44 ? `${cleaned.slice(0, 44)}...` : cleaned;
}

async function writeMessage(params: {
  adminDb: ReturnType<typeof getAdminDb>;
  jobId: string;
  userId: string;
  role: ShootMessage["role"];
  content: string;
  imageUrl?: string;
}) {
  const jobSnap = await params.adminDb.collection("shoot_jobs").doc(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.userId !== params.userId) {
    console.warn("tenant.forbidden_job_message_write", {
      userId: params.userId,
      jobId: params.jobId,
      role: params.role,
    });
    throw new Error("Forbidden job message write.");
  }

  const id = crypto.randomUUID();
  const now = nowUnixMs();
  const message: ShootMessage = {
    id,
    jobId: params.jobId,
    userId: params.userId,
    role: params.role,
    content: params.content,
    imageUrl: params.imageUrl,
    createdAt: now,
  };
  await setDocSafe({
    docRef: params.adminDb.collection("shoot_messages").doc(id),
    collection: "shoot_messages",
    docId: id,
    data: message,
  });
  return message;
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser();
    const adminDb = getAdminDb();
    const adminStorage = getAdminStorage();
    const requestMode = request.headers.get("x-mirrorfit-mode") ?? "single";
    const isBulkMode = requestMode === "bulk";
    const bulkLimitRaw = Number(process.env.BULK_GENERATION_RATE_LIMIT_MAX ?? "120");
    const bulkMaxRequests =
      Number.isFinite(bulkLimitRaw) && bulkLimitRaw > 0 ? Math.floor(bulkLimitRaw) : 120;
    const maxRequests = isBulkMode ? bulkMaxRequests : 8;

    const rateLimit = checkRateLimit({
      key: `gen:${user.uid}`,
      windowMs: 60_000,
      maxRequests,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded.", mode: requestMode },
        { status: 429, headers: { "Retry-After": "8" } },
      );
    }

    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { status: "failed", error: "Invalid request payload.", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const payload = parsed.data satisfies CreateGenerationRequest;
    const now = nowUnixMs();
    const brandMemorySnap = await adminDb.collection("brand_memories").doc(user.uid).get();
    const brandMemory = brandMemorySnap.exists
      ? (brandMemorySnap.data() as BrandMemory)
      : null;

    const selectedModelProfileId = payload.modelProfileId ?? brandMemory?.preferredModelId;
    const selectedGarmentId = payload.garmentId;

    let shootJobId = payload.shootJobId;
    if (!shootJobId) {
      shootJobId = crypto.randomUUID();
      const newJob: ShootJob = {
        id: shootJobId,
        userId: user.uid,
        title: buildJobTitle(payload.userMessage),
        status: "draft",
        modelProfileId: selectedModelProfileId,
        garmentId: selectedGarmentId,
        lastMessage: payload.userMessage,
        createdAt: now,
        updatedAt: now,
      };
      await setDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: newJob,
      });
    } else {
      const existing = await adminDb.collection("shoot_jobs").doc(shootJobId).get();
      if (!existing.exists || existing.data()?.userId !== user.uid) {
        console.warn("tenant.forbidden_shoot_job_access", {
          userId: user.uid,
          shootJobId,
        });
        return NextResponse.json(
          { status: "failed", error: "Shoot job not found or unauthorized." },
          { status: 404 },
        );
      }
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        modelProfileId: selectedModelProfileId ?? existing.data()?.modelProfileId,
        garmentId: selectedGarmentId ?? existing.data()?.garmentId,
        lastMessage: payload.userMessage,
        updatedAt: now,
        },
      });
    }

    await writeMessage({
      adminDb,
      jobId: shootJobId,
      userId: user.uid,
      role: "user",
      content: payload.userMessage,
    });

    const missing: string[] = [];
    if (!selectedModelProfileId) missing.push("model");
    if (!selectedGarmentId) missing.push("garment");

    if (missing.length > 0) {
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "needs_input",
        updatedAt: nowUnixMs(),
        },
      });
      const message = `I need ${missing.join(" and ")} to continue. Please select them and I will generate immediately.`;
      await writeMessage({
        adminDb,
        jobId: shootJobId,
        userId: user.uid,
        role: "assistant",
        content: message,
      });
      return NextResponse.json({
        status: "needs_input",
        shootJobId,
        missing,
        message,
      });
    }

    const modelProfileId = selectedModelProfileId as string;
    const garmentId = selectedGarmentId as string;

    const [modelSnap, garmentSnap, referencesSnap, garmentImagesSnap] = await Promise.all([
      adminDb.collection("model_profiles").doc(modelProfileId).get(),
      adminDb.collection("garments").doc(garmentId).get(),
      adminDb
        .collection("model_reference_images")
        .where("modelId", "==", modelProfileId)
        .where("userId", "==", user.uid)
        .get(),
      adminDb
        .collection("garment_images")
        .where("garmentId", "==", garmentId)
        .where("userId", "==", user.uid)
        .get(),
    ]);

    if (!modelSnap.exists || !garmentSnap.exists) {
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "needs_input",
        updatedAt: nowUnixMs(),
        },
      });
      return NextResponse.json({
        status: "needs_input",
        shootJobId,
        message: "Selected model or garment was not found. Please reselect and try again.",
      });
    }

    const model = modelSnap.data() as ModelProfile;
    const garment = garmentSnap.data() as Garment;
    if (model.userId !== user.uid || garment.userId !== user.uid) {
      console.warn("tenant.forbidden_model_or_garment_access", {
        userId: user.uid,
        modelProfileId,
        garmentId,
      });
      return NextResponse.json(
        { status: "failed", error: "Unauthorized resource access." },
        { status: 403 },
      );
    }
    if (
      brandMemory?.approvedModelIds?.length &&
      !brandMemory.approvedModelIds.includes(model.id)
    ) {
      const message =
        "This model is not in your approved model set. Add it in Brand Memory or select another model.";
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "needs_input",
        updatedAt: nowUnixMs(),
        },
      });
      await writeMessage({
        adminDb,
        jobId: shootJobId,
        userId: user.uid,
        role: "assistant",
        content: message,
      });
      return NextResponse.json({
        status: "needs_input",
        shootJobId,
        message,
      });
    }

    const safety = classifySafety(payload, model);
    if (safety.decision === "reject") {
      const message =
        "I cannot generate this as written. I can still help by turning it into a safe, professional fashion catalogue request.";
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "needs_input",
        updatedAt: nowUnixMs(),
        },
      });
      await writeMessage({
        adminDb,
        jobId: shootJobId,
        userId: user.uid,
        role: "assistant",
        content: message,
      });
      return NextResponse.json({
        status: "needs_input",
        shootJobId,
        message,
      });
    }

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
    const garmentReferenceTypes = garmentReferencesSorted
      .map((entry) => entry.imageType ?? "")
      .filter(Boolean);

    const hasFace = modelReferenceTypes.includes("face");
    const hasFrontBody = modelReferenceTypes.includes("front_body");
    const hasSideBody = modelReferenceTypes.includes("side_body");
    const hasPrimaryGarment =
      garmentReferenceTypes.includes("front") || garmentReferenceTypes.includes("flat_lay");

    if (!hasFace || !hasFrontBody || !hasSideBody || !hasPrimaryGarment) {
      const missingModelRefs = [
        !hasFace ? "face" : null,
        !hasFrontBody ? "front_body" : null,
        !hasSideBody ? "side_body" : null,
      ].filter((value): value is string => Boolean(value));
      const missingGarmentRefs = !hasPrimaryGarment ? ["front_or_flat_lay"] : [];
      const missingDetail = [...missingModelRefs, ...missingGarmentRefs];
      const message = missingDetail.length
        ? `I could not complete this render yet. Missing required references for current selection: ${missingDetail.join(", ")}.`
        : "I could not complete this render yet due to required reference validation.";
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "needs_input",
        updatedAt: nowUnixMs(),
        },
      });
      await writeMessage({
        adminDb,
        jobId: shootJobId,
        userId: user.uid,
        role: "assistant",
        content: message,
      });
      return NextResponse.json({
        status: "needs_input",
        shootJobId,
        message,
        missing: missingDetail,
        debug: {
          modelProfileId,
          garmentId,
          modelReferenceTypes,
          garmentReferenceTypes,
        },
      });
    }

    const modelReferenceUrls = modelReferencesSorted
      .map((entry) => String(entry.downloadUrl ?? ""))
      .filter(Boolean)
      .slice(0, 5);
    const garmentReferenceUrls = garmentReferencesSorted
      .map((entry) => String(entry.downloadUrl ?? ""))
      .filter(Boolean)
      .slice(0, 3);

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
    const memoryPrompt = brandMemory
      ? `\nBrand memory defaults: lighting=${brandMemory.defaultLighting}; preferred crop=${brandMemory.preferredCrop}; output pack=${brandMemory.preferredOutputPack}; catalogue style=${brandMemory.favoriteCatalogueStyle}; approved models=${brandMemory.approvedModelIds.join(", ") || "none"}; avoided backgrounds=${brandMemory.avoidedBackgrounds.join(", ") || "none"}.`
      : "";

    const generationId = crypto.randomUUID();
    const generationRef = adminDb.collection("generations").doc(generationId);
    const generation: Generation = {
      id: generationId,
      userId: user.uid,
      modelProfileId,
      garmentId,
      prompt: payload.userMessage,
      style: "auto",
      background: "auto",
      lighting: "auto",
      pose: "auto",
      outputRatio: "4:5",
      status: "generating",
      safetyDecision: "allow",
      outputPath: "",
      outputUrl: "",
      createdAt: nowUnixMs(),
      updatedAt: nowUnixMs(),
    };
    await setDocSafe({
      docRef: generationRef,
      collection: "generations",
      docId: generationId,
      data: generation,
    });
    await updateDocSafe({
      docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
      collection: "shoot_jobs",
      docId: shootJobId,
      data: {
      status: "working",
      latestGenerationId: generationId,
      updatedAt: nowUnixMs(),
      },
    });

    const routeRetryCapRaw = Number(process.env.ORCH_ROUTE_RETRY_CAP ?? "4");
    const routeRetryCap =
      Number.isFinite(routeRetryCapRaw) && routeRetryCapRaw > 0
        ? Math.min(Math.floor(routeRetryCapRaw), 8)
        : 4;

    const orchestrated = await runGenerationOrchestrator({
      request: payload,
      basePrompt: `${basePrompt}${memoryPrompt}`,
      packedReferences: {
        modelReferenceTypes,
        modelReferenceUrls,
        garmentReferenceTypes,
        garmentReferenceUrls,
      },
      retryCap: routeRetryCap,
    });

    if (orchestrated.state === "failed" || !orchestrated.finalOutputUrl) {
      await updateDocSafe({
        docRef: generationRef,
        collection: "generations",
        docId: generationId,
        data: {
        status: "failed",
        errorMessage: orchestrated.userFacingMessage,
        updatedAt: nowUnixMs(),
        attempts: orchestrated.attempts,
        },
      });
      await updateDocSafe({
        docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
        collection: "shoot_jobs",
        docId: shootJobId,
        data: {
        status: "failed",
        updatedAt: nowUnixMs(),
        },
      });
      await writeMessage({
        adminDb,
        jobId: shootJobId,
        userId: user.uid,
        role: "assistant",
        content: orchestrated.userFacingMessage,
      });
      return NextResponse.json({
        status: "failed",
        shootJobId,
        generationId,
        message: orchestrated.userFacingMessage,
        meta: {
          attemptCount: orchestrated.attempts.length,
        },
      });
    }

    const rawOutput = await fetch(orchestrated.finalOutputUrl);
    if (!rawOutput.ok) {
      throw new Error(`Failed to fetch final generated image: ${rawOutput.status}`);
    }
    const imageBytes = Buffer.from(await rawOutput.arrayBuffer());
    const outputPath = `users/${user.uid}/generations/${generationId}/output.png`;
    const file = adminStorage.bucket().file(outputPath);
    await file.save(imageBytes, {
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

    await updateDocSafe({
      docRef: generationRef,
      collection: "generations",
      docId: generationId,
      data: {
      status: "completed",
      outputPath,
      outputUrl: signedUrl,
      updatedAt: nowUnixMs(),
      attempts: orchestrated.attempts,
      },
    });
    await updateDocSafe({
      docRef: adminDb.collection("shoot_jobs").doc(shootJobId),
      collection: "shoot_jobs",
      docId: shootJobId,
      data: {
      status: "completed",
      latestGenerationId: generationId,
      latestOutputUrl: signedUrl,
      updatedAt: nowUnixMs(),
      },
    });
    await writeMessage({
      adminDb,
      jobId: shootJobId,
      userId: user.uid,
      role: "assistant",
      content: orchestrated.userFacingMessage,
      imageUrl: signedUrl,
    });

    return NextResponse.json({
      status: "completed",
      shootJobId,
      generationId,
      outputUrl: signedUrl,
      message: orchestrated.userFacingMessage,
      meta: {
        attemptCount: orchestrated.attempts.length,
        bestScore: Math.max(...orchestrated.attempts.map((attempt) => attempt.score.total)),
      },
    });
  } catch (error) {
    console.error("generation.error", error);
    return NextResponse.json(
      {
        status: "failed",
        error:
          error instanceof Error ? error.message : "Failed to generate image. Please retry.",
      },
      { status: 500 },
    );
  }
}
