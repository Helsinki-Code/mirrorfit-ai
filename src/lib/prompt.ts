import type { CreateGenerationRequest, Garment, ModelProfile } from "@/lib/types";

export function buildGenerationPrompt(params: {
  request: CreateGenerationRequest;
  garment: Garment;
  model: ModelProfile;
  referenceImageCount: number;
  referenceImageUrls: string[];
  garmentImageUrls: string[];
  modelReferenceTypes: string[];
  garmentReferenceTypes: string[];
}) {
  const {
    request,
    garment,
    model,
    referenceImageCount,
    referenceImageUrls,
    garmentImageUrls,
    modelReferenceTypes,
    garmentReferenceTypes,
  } = params;

  return [
    `Create a professional fashion catalogue render of model "${model.modelName}" wearing "${garment.productName}".`,
    `Identity lock requirements (highest priority): preserve exact face geometry, eye shape, nose shape, lip shape, hairline, eyebrow structure, skin tone, body proportions, and natural silhouette of the selected model.`,
    `Do not replace the person with a different individual. Do not change age appearance, ethnicity, face structure, or body frame.`,
    `Body consistency lock: maintain waist, hip, shoulder, arm, thigh, and belly proportions from references. No slimming, no body reshaping, no stylized anatomy.`,
    `Reference images provided: ${referenceImageCount} images for identity and proportion guidance.`,
    `Model reference type order: ${modelReferenceTypes.join(", ") || "none"}.`,
    `Garment reference type order: ${garmentReferenceTypes.join(", ") || "none"}.`,
    `Model reference URLs: ${referenceImageUrls.join(", ") || "none"}.`,
    `Garment reference URLs: ${garmentImageUrls.join(", ") || "none"}.`,
    `Garment requirements: preserve color (${garment.color}), fabric (${garment.fabric}), seam integrity, neckline, sleeves/straps, and hemline.`,
    `Strict garment fidelity: replicate the same garment construction from references; do not invent alternative cuts or fabric behavior.`,
    `Scene setup: clean professional e-commerce catalogue style, neutral studio background, softbox commercial lighting, natural standing pose, portrait-oriented product framing.`,
    `Safety and tone: adult, fully clothed, tasteful, non-explicit, product-focused, commercial e-commerce presentation.`,
    `User direction: ${request.userMessage}`,
  ].join("\n");
}
