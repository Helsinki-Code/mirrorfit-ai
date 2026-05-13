import type { CreateGenerationRequest, Garment, ModelProfile } from "@/lib/types";

export function buildGenerationPrompt(params: {
  request: CreateGenerationRequest;
  garment: Garment;
  model: ModelProfile;
  referenceImageCount: number;
  referenceImageUrls: string[];
  garmentImageUrls: string[];
}) {
  const { request, garment, model, referenceImageCount, referenceImageUrls, garmentImageUrls } =
    params;

  return [
    `Create a professional fashion catalogue render of model "${model.modelName}" wearing "${garment.productName}".`,
    `Model requirements: preserve face identity, skin tone, body proportions, and natural silhouette consistency.`,
    `Reference images provided: ${referenceImageCount} images for identity and proportion guidance.`,
    `Model reference URLs: ${referenceImageUrls.join(", ") || "none"}.`,
    `Garment reference URLs: ${garmentImageUrls.join(", ") || "none"}.`,
    `Garment requirements: preserve color (${garment.color}), fabric (${garment.fabric}), seam integrity, neckline, sleeves/straps, and hemline.`,
    `Scene setup: style "${request.style}", background "${request.background}", lighting "${request.lighting}", pose "${request.pose}", output ratio "${request.outputRatio}".`,
    `Safety and tone: adult, tasteful, non-explicit, product-focused, commercial e-commerce presentation.`,
    `User direction: ${request.prompt}`,
  ].join("\n");
}
