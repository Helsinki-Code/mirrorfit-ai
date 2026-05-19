import type {
  GarmentCategory,
  SafetyClassification,
  CreateGenerationRequest,
  ModelProfile,
} from "@/lib/types";

const SEXUAL_EXPLICIT_KEYWORDS = [
  "porn",
  "pornographic",
  "explicit",
  "nude",
  "erotic",
  "sexual act",
  "remove outfit",
];

const MINOR_RISK_KEYWORDS = [
  "underage",
  "teen",
  "schoolgirl",
  "minor",
  "young-looking child",
];

function detectCategoryFromText(text: string): GarmentCategory {
  const lower = text.toLowerCase();
  if (lower.includes("bikini") || lower.includes("swimwear")) return "swimwear";
  if (lower.includes("saree") || lower.includes("lehenga") || lower.includes("ethnic"))
    return "ethnicwear";
  if (
    lower.includes("sleepwear") ||
    lower.includes("camisole") ||
    lower.includes("robe")
  )
    return "sleepwear";
  if (
    lower.includes("bodycon") ||
    lower.includes("shapewear") ||
    lower.includes("activewear") ||
    lower.includes("gymwear")
  )
    return "shapewear_activewear";
  if (lower.includes("editorial") || lower.includes("gown") || lower.includes("designer")) {
    return "luxury_editorial";
  }
  return "everyday_fashion";
}

export function classifySafety(
  request: CreateGenerationRequest,
  model: ModelProfile,
): SafetyClassification {
  const promptLower = request.userMessage.toLowerCase();

  const sexualIntent = SEXUAL_EXPLICIT_KEYWORDS.some((word) =>
    promptLower.includes(word),
  );
  const minorRisk = MINOR_RISK_KEYWORDS.some((word) => promptLower.includes(word));
  const explicitNudity = /nude|nudity|naked/.test(promptLower);

  const category = detectCategoryFromText(request.userMessage);
  const modelAgeStatus = model.adultConfirmed ? "adult" : "unknown";
  const authorizedModelReference = model.usageAuthorized;

  let decision: "allow" | "reject" = "allow";
  let reason = "";

  if (!authorizedModelReference) {
    decision = "reject";
    reason = "Model authorization confirmation is missing.";
  } else if (minorRisk || modelAgeStatus !== "adult") {
    decision = "reject";
    reason = "Adult verification required for generation.";
  } else if (sexualIntent || explicitNudity) {
    decision = "reject";
    reason = "Explicit sexual content is not allowed.";
  }

  return {
    requestType: "fashion_try_on",
    modelAgeStatus: minorRisk ? "minor_risk" : modelAgeStatus,
    garmentCategory: category,
    presentationStyle: "catalogue",
    sexualIntent,
    explicitNudity,
    minorRisk,
    authorizedModelReference,
    decision,
    reason: reason || undefined,
  };
}
