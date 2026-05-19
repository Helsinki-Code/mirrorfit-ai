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
export type ShootJobStatus =
  | "draft"
  | "working"
  | "needs_input"
  | "completed"
  | "failed"
  | "approved"
  | "rejected";

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
  shootJobId?: string;
  modelProfileId?: string;
  garmentId?: string;
  userMessage: string;
  quickFixAction?:
    | "more_catalogue"
    | "improve_garment"
    | "keep_face_same"
    | "change_pose"
    | "generate_back_view";
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

export interface GenerationAttempt {
  attempt: number;
  engineId: string;
  prompt: string;
  outputUrl?: string;
  blockedReason?: string;
  score: {
    faceIdentity: number;
    bodyConsistency: number;
    garmentFidelity: number;
    catalogSuitability: number;
    referenceCoverage: number;
    identityDriftRisk: number;
    total: number;
  };
}

export interface ShootJob {
  id: string;
  userId: string;
  title: string;
  status: ShootJobStatus;
  modelProfileId?: string;
  garmentId?: string;
  latestGenerationId?: string;
  latestOutputUrl?: string;
  lastMessage: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShootMessage {
  id: string;
  jobId: string;
  userId: string;
  role: "user" | "assistant" | "system" | "reviewer";
  content: string;
  imageUrl?: string;
  createdAt: number;
}

export interface BrandMemory {
  id: string;
  userId: string;
  defaultLighting: string;
  preferredModelId?: string;
  approvedModelIds: string[];
  preferredCrop: "1:1" | "4:5" | "9:16" | "16:9";
  preferredOutputPack: "catalog_only" | "catalog_social" | "full_pack";
  avoidedBackgrounds: string[];
  favoriteCatalogueStyle: string;
  updatedAt: number;
}

export interface ShootApproval {
  id: string;
  jobId: string;
  userId: string;
  decision: "approved" | "rejected" | "changes_requested";
  comment: string;
  createdAt: number;
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
