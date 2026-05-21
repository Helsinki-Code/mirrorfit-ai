import type { CreateGenerationRequest, GenerationAttempt } from "@/lib/types";
import {
  runFalGptImage2Edit,
  runFalNanoBananaEdit,
  runFalReveEdit,
} from "@/lib/fal";

export type PackedReferences = {
  modelReferenceTypes: string[];
  modelReferenceUrls: string[];
  garmentReferenceTypes: string[];
  garmentReferenceUrls: string[];
};

type OrchestratorInput = {
  request: CreateGenerationRequest;
  basePrompt: string;
  packedReferences: PackedReferences;
  retryCap?: number;
};

const ENGINE_ORDER = ["primary", "fallback_a", "fallback_b"] as const;
type EngineId = (typeof ENGINE_ORDER)[number];

function numberEnv(key: string, fallback: number) {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const PRIMARY_ENGINE_ATTEMPTS = numberEnv("ORCH_PRIMARY_ENGINE_ATTEMPTS", 3);
const SECONDARY_ENGINE_ATTEMPTS = numberEnv("ORCH_SECONDARY_ENGINE_ATTEMPTS", 3);
const PASS_THRESHOLD = numberEnv("ORCH_PASS_THRESHOLD", 0.9);
const DEFAULT_RETRY_CAP = numberEnv("ORCH_RETRY_CAP", 8);

function intentCleaner(text: string) {
  return text
    .replace(/\bsexy\b/gi, "commercial fashion")
    .replace(/\bseductive\b/gi, "product-focused")
    .replace(/\berotic\b/gi, "editorial fashion")
    .replace(/\bnude|nudity|naked\b/gi, "fully clothed")
    .replace(/\s+/g, " ")
    .trim();
}

function quickFixInstruction(action?: CreateGenerationRequest["quickFixAction"]) {
  if (!action) return "";
  const map: Record<NonNullable<CreateGenerationRequest["quickFixAction"]>, string> = {
    more_catalogue: "Use stricter e-commerce catalogue composition and neutral lighting.",
    improve_garment: "Increase garment seam, texture, and fit fidelity to reference garment.",
    keep_face_same:
      "Face identity lock is mandatory. Keep exact face geometry from model references.",
    change_pose: "Keep identity and garment same; only change to a natural standing pose variation.",
    generate_back_view: "Generate a clean back-view catalogue shot while preserving outfit fidelity.",
  };
  return map[action];
}

function repairPrompt(previousPrompt: string, attempt: number, lastError?: string) {
  const repairBlocks = [
    "Identity lock absolute: preserve exact face/body proportions from required references only.",
    "Retry policy: keep person and garment fixed; only refine framing and lighting.",
    "Do not alter ethnicity, age appearance, body shape, or garment structure. Correct only composition drift.",
  ];
  const errorHint = lastError
    ? `Previous failure context: ${lastError.slice(0, 180)}. Rewrite to safer catalogue phrasing.`
    : "";
  return `${previousPrompt}\n${repairBlocks[Math.min(attempt, repairBlocks.length - 1)]}\n${errorHint}`;
}

function modelRouter(attempt: number) {
  if (attempt <= PRIMARY_ENGINE_ATTEMPTS) return ENGINE_ORDER[0];
  if (attempt <= PRIMARY_ENGINE_ATTEMPTS + SECONDARY_ENGINE_ATTEMPTS) return ENGINE_ORDER[1];
  return ENGINE_ORDER[2];
}

function consistencyJudge(params: {
  packed: PackedReferences;
  engineId: string;
  prompt: string;
  hadError: boolean;
}) {
  const hasFace = params.packed.modelReferenceTypes.includes("face");
  const hasFrontBody = params.packed.modelReferenceTypes.includes("front_body");
  const hasSideBody = params.packed.modelReferenceTypes.includes("side_body");
  const hasPrimaryGarment =
    params.packed.garmentReferenceTypes.includes("front") ||
    params.packed.garmentReferenceTypes.includes("flat_lay");

  const faceIdentity = hasFace ? 0.9 : 0.22;
  const bodyConsistency = hasFrontBody && hasSideBody ? 0.88 : 0.3;
  const garmentFidelity = hasPrimaryGarment ? 0.84 : 0.36;
  const catalogSuitability =
    params.engineId === ENGINE_ORDER[0] ? 0.86 : params.engineId === ENGINE_ORDER[1] ? 0.82 : 0.75;
  const requiredModelRefs = [hasFace, hasFrontBody, hasSideBody].filter(Boolean).length;
  const referenceCoverage = Number((requiredModelRefs / 3).toFixed(3));
  const strictPromptBoost = params.prompt.includes("identity lock absolute") ? 0.07 : 0.02;
  const identityDriftRisk =
    params.engineId === ENGINE_ORDER[2]
      ? 0.28
      : params.engineId === ENGINE_ORDER[1]
        ? 0.18
        : 0.1;
  const errorPenalty = params.hadError ? 0.12 : 0;

  const total =
    faceIdentity * 0.42 +
    bodyConsistency * 0.3 +
    garmentFidelity * 0.18 +
    catalogSuitability * 0.1 +
    referenceCoverage * 0.06 +
    strictPromptBoost -
    identityDriftRisk * 0.12 -
    errorPenalty;

  return {
    faceIdentity: Number(faceIdentity.toFixed(3)),
    bodyConsistency: Number(bodyConsistency.toFixed(3)),
    garmentFidelity: Number(garmentFidelity.toFixed(3)),
    catalogSuitability: Number(catalogSuitability.toFixed(3)),
    referenceCoverage,
    identityDriftRisk: Number(identityDriftRisk.toFixed(3)),
    total: Number(Math.max(0, Math.min(1, total)).toFixed(3)),
  };
}

function referencePackForAttempt(packed: PackedReferences, attempt: number) {
  const modelPrimary = packed.modelReferenceUrls.slice(0, 3);
  const modelSecondary = attempt === 1 ? [] : packed.modelReferenceUrls.slice(3, 5);
  const garmentPrimary = packed.garmentReferenceUrls.slice(0, 1);
  const garmentSecondary = attempt === 1 ? [] : packed.garmentReferenceUrls.slice(1, 3);
  return {
    modelPrimary,
    allImageUrls: [...modelPrimary, ...modelSecondary, ...garmentPrimary, ...garmentSecondary].filter(Boolean),
  };
}

function missingRequiredRefs(packed: PackedReferences) {
  const missing: string[] = [];
  if (!packed.modelReferenceTypes.includes("face")) missing.push("face");
  if (!packed.modelReferenceTypes.includes("front_body")) missing.push("front_body");
  if (!packed.modelReferenceTypes.includes("side_body")) missing.push("side_body");
  if (
    !packed.garmentReferenceTypes.includes("front") &&
    !packed.garmentReferenceTypes.includes("flat_lay")
  ) {
    missing.push("front_or_flat_lay");
  }
  return missing;
}

function humanFailureMessage(params: {
  missingRefs: string[];
  lastBlockedReason?: string;
}) {
  if (params.missingRefs.length) {
    return `I could not complete this render yet. Missing required references: ${params.missingRefs.join(", ")}.`;
  }

  const reason = (params.lastBlockedReason ?? "").toLowerCase();
  if (reason.includes("429") || reason.includes("too many")) {
    return "I could not complete this render yet because image providers are rate-limiting requests right now. Please retry in a short while.";
  }
  if (reason.includes("safety") || reason.includes("rejected") || reason.includes("blocked")) {
    return "I could not complete this render yet because the request was blocked by safety checks. Please retry with a cleaner catalogue-focused prompt.";
  }
  if (reason.includes("401") || reason.includes("403") || reason.includes("missing fal_key")) {
    return "I could not complete this render due to a backend configuration issue. Please try again after deployment settings are verified.";
  }
  if (reason.includes("abort") || reason.includes("timeout")) {
    return "I could not complete this render because generation timed out. Please retry; the agent will attempt alternate engines.";
  }
  return "I could not complete this render yet due to temporary generation failures across engines. Please retry now.";
}

async function generationWorker(params: {
  engineId: EngineId;
  attempt: number;
  prompt: string;
  packed: PackedReferences;
}) {
  const refs = referencePackForAttempt(params.packed, params.attempt);
  if (params.engineId === ENGINE_ORDER[0]) {
    return await runFalGptImage2Edit({
      prompt: params.prompt,
      imageUrls: refs.allImageUrls,
    });
  }
  if (params.engineId === ENGINE_ORDER[1]) {
    return await runFalNanoBananaEdit({
      prompt: params.prompt,
      imageUrls: refs.allImageUrls,
    });
  }
  return await runFalReveEdit({
    prompt: params.prompt,
    imageUrl: refs.modelPrimary[0],
  });
}

export async function runGenerationOrchestrator(
  input: OrchestratorInput,
): Promise<{
  state: "completed" | "failed";
  finalOutputUrl?: string;
  attempts: GenerationAttempt[];
  userFacingMessage: string;
}> {
  const retryCap = input.retryCap ?? DEFAULT_RETRY_CAP;
  const cleanedPrompt = intentCleaner(input.request.userMessage);
  const strictPrompt = `${input.basePrompt}
User intent: ${cleanedPrompt}
Required lock set for attempt 1:
- Use face + front_body + side_body references as mandatory identity anchors.
- Preserve exact head-to-shoulder geometry and full-body proportions from these anchors.
- Preserve garment construction from primary garment reference.
${quickFixInstruction(input.request.quickFixAction)}
Output must remain tasteful, adult, and product-catalog focused.`;

  let workingPrompt = strictPrompt;
  const attempts: GenerationAttempt[] = [];
  let bestAttempt: GenerationAttempt | null = null;
  const missingRefs = missingRequiredRefs(input.packedReferences);

  for (let attempt = 1; attempt <= retryCap; attempt += 1) {
    const engineId = modelRouter(attempt);
    let outputUrl = "";
    let blockedReason = "";
    try {
      outputUrl = await generationWorker({
        engineId,
        attempt,
        prompt: workingPrompt,
        packed: input.packedReferences,
      });
    } catch (error) {
      blockedReason = error instanceof Error ? error.message : "Generation failed";
    }

    const score = consistencyJudge({
      packed: input.packedReferences,
      engineId,
      prompt: workingPrompt,
      hadError: Boolean(blockedReason),
    });

    const row: GenerationAttempt = {
      attempt,
      engineId,
      prompt: workingPrompt,
      outputUrl: outputUrl || undefined,
      blockedReason: blockedReason || undefined,
      score,
    };
    attempts.push(row);

    if (!bestAttempt || row.score.total > bestAttempt.score.total) {
      bestAttempt = row;
    }

    if (outputUrl && score.total >= PASS_THRESHOLD) {
      return {
        state: "completed",
        finalOutputUrl: outputUrl,
        attempts,
        userFacingMessage: "Done. I generated a polished catalogue render with strict identity lock.",
      };
    }

    workingPrompt = repairPrompt(workingPrompt, attempt, blockedReason);
  }

  if (bestAttempt?.outputUrl) {
    return {
      state: "completed",
      finalOutputUrl: bestAttempt.outputUrl,
      attempts,
      userFacingMessage:
        "I generated the strongest available result from retries. For tighter match, upload a cleaner side-body and front-body reference.",
    };
  }

  return {
    state: "failed",
    attempts,
    userFacingMessage: humanFailureMessage({
      missingRefs,
      lastBlockedReason: attempts.at(-1)?.blockedReason,
    }),
  };
}
