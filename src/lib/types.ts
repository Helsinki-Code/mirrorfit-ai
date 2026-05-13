export type ThemeMode = "light" | "dark";

export type ModelType =
  | "synthetic"
  | "licensed"
  | "authorized_reference"
  | "brand_owned";

export type ReferenceImageType =
  | "face"
  | "front_body"
  | "side_body"
  | "back_body"
  | "pose"
  | "closeup";

export type GenerationStatus = "queued" | "generating" | "completed" | "failed";

export type SafetyDecision = "allow" | "reject";

export type GarmentCategory =
  | "everyday_fashion"
  | "luxury_editorial"
  | "ethnicwear"
  | "swimwear"
  | "sleepwear"
  | "shapewear_activewear"
  | "other";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: "free" | "starter" | "professional" | "business" | "enterprise";
  authorizedUseConfirmed: boolean;
  adultContentPolicyAck: boolean;
  theme: ThemeMode;
  createdAt: number;
  updatedAt: number;
}

export interface CreateModelProfileInput {
  modelName: string;
  modelType: ModelType;
  adultConfirmed: boolean;
  usageAuthorized: boolean;
  defaultStyle: string;
  defaultBackground: string;
  identityLock: boolean;
  bodyLock: boolean;
}

export interface ModelProfile extends CreateModelProfileInput {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface UploadReferenceImageInput {
  modelId: string;
  imageType: ReferenceImageType;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface ModelReferenceImage {
  id: string;
  modelId: string;
  userId: string;
  imageType: ReferenceImageType;
  storagePath: string;
  downloadUrl: string;
  width: number;
  height: number;
  qualityScore: "high" | "medium" | "low";
  createdAt: number;
}

export interface CreateGarmentInput {
  productName: string;
  sku: string;
  category: GarmentCategory;
  fabric: string;
  color: string;
  notes: string;
}

export interface Garment extends CreateGarmentInput {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface GarmentImage {
  id: string;
  garmentId: string;
  userId: string;
  imageType: "front" | "back" | "detail" | "flat_lay" | "transparent_png";
  storagePath: string;
  downloadUrl: string;
  createdAt: number;
}

export interface BrandPreset {
  id: string;
  userId: string;
  presetName: string;
  background: string;
  lighting: string;
  pose: string;
  camera: string;
  outputRatio: "1:1" | "4:5" | "9:16" | "16:9";
  style: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateGenerationRequest {
  modelProfileId: string;
  garmentId: string;
  style: string;
  background: string;
  lighting: string;
  pose: string;
  outputRatio: "1:1" | "4:5" | "9:16" | "16:9";
  prompt: string;
}

export interface Generation {
  id: string;
  userId: string;
  modelProfileId: string;
  garmentId: string;
  prompt: string;
  style: string;
  background: string;
  lighting: string;
  pose: string;
  outputRatio: "1:1" | "4:5" | "9:16" | "16:9";
  status: GenerationStatus;
  safetyDecision: SafetyDecision;
  outputPath: string;
  outputUrl: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SafetyClassification {
  requestType: "fashion_try_on";
  modelAgeStatus: "adult" | "unknown" | "minor_risk";
  garmentCategory: GarmentCategory;
  presentationStyle: string;
  sexualIntent: boolean;
  explicitNudity: boolean;
  minorRisk: boolean;
  authorizedModelReference: boolean;
  decision: SafetyDecision;
  reason?: string;
}
