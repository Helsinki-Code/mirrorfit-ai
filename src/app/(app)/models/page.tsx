"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type {
  CreateModelProfileInput,
  ModelProfile,
  ModelReferenceImage,
  ReferenceImageType,
} from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";
import { buildStoragePath } from "@/lib/utils/storage";

const referenceTypes: ReferenceImageType[] = [
  "face",
  "front_body",
  "side_body",
  "back_body",
  "pose",
  "closeup",
];

const defaultForm: CreateModelProfileInput = {
  modelName: "",
  modelType: "authorized_reference",
  adultConfirmed: false,
  usageAuthorized: false,
  defaultStyle: "ecommerce_catalogue",
  defaultBackground: "neutral_studio",
  identityLock: true,
  bodyLock: true,
};

export default function ModelsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<CreateModelProfileInput>(defaultForm);
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [references, setReferences] = useState<ModelReferenceImage[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [uploadType, setUploadType] = useState<ReferenceImageType>("face");
  const [uploadMsg, setUploadMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const modelQuery = query(
      collection(db, "model_profiles"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const refQuery = query(
      collection(db, "model_reference_images"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubModels = onSnapshot(modelQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ModelProfile);
      setModels(items);
      if (!selectedModelId && items[0]?.id) {
        setSelectedModelId(items[0].id);
      }
    });
    const unsubReferences = onSnapshot(refQuery, (snapshot) => {
      setReferences(snapshot.docs.map((d) => d.data() as ModelReferenceImage));
    });

    return () => {
      unsubModels();
      unsubReferences();
    };
  }, [selectedModelId, user]);

  const refCountByModel = useMemo(() => {
    const countMap = new Map<string, number>();
    references.forEach((reference) => {
      countMap.set(reference.modelId, (countMap.get(reference.modelId) ?? 0) + 1);
    });
    return countMap;
  }, [references]);

  const handleCreateModel = async () => {
    if (!user) return;
    if (!form.modelName.trim()) {
      setError("Model name is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const id = crypto.randomUUID();
      const now = nowUnixMs();
      const model: ModelProfile = {
        id,
        userId: user.uid,
        ...form,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, "model_profiles", id), model);
      setForm(defaultForm);
      setSelectedModelId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create model profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user || !selectedModelId) {
      setError("Create or select a model first.");
      return;
    }

    setError("");
    setUploadMsg("Uploading reference image...");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are accepted.");
      }

      const quality = await evaluateImageQuality(file);
      const refId = crypto.randomUUID();
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = buildStoragePath([
        "users",
        user.uid,
        "models",
        selectedModelId,
        "references",
        `${refId}.${ext}`,
      ]);

      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          imageType: uploadType,
        },
      });
      const downloadUrl = await getDownloadURL(storageRef);
      const now = nowUnixMs();

      await setDoc(doc(db, "model_reference_images", refId), {
        id: refId,
        modelId: selectedModelId,
        userId: user.uid,
        imageType: uploadType,
        storagePath,
        downloadUrl,
        width: quality.width,
        height: quality.height,
        qualityScore: quality.score,
        createdAt: now,
      } satisfies ModelReferenceImage);

      setUploadMsg(
        quality.score === "high"
          ? "Reference uploaded. Excellent quality for identity lock."
          : quality.score === "medium"
            ? "Uploaded. For better consistency, use brighter full-body references too."
            : "Uploaded. Consider higher resolution and neutral lighting for stronger consistency.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploadMsg("");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <section className="card p-4">
        <h2 className="text-lg font-semibold text-text-strong">Create Model Profile</h2>
        <p className="mt-1 text-sm text-muted">
          Build reusable model identities for your catalogue workflows.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="subtle-input"
            placeholder="Model name"
            value={form.modelName}
            onChange={(e) => setForm((prev) => ({ ...prev, modelName: e.target.value }))}
          />
          <select
            className="subtle-input"
            value={form.modelType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, modelType: e.target.value as ModelProfile["modelType"] }))
            }
          >
            <option value="synthetic">Synthetic AI model</option>
            <option value="licensed">Licensed fashion model</option>
            <option value="authorized_reference">Authorized reference image</option>
            <option value="brand_owned">Brand-owned avatar</option>
          </select>
          <input
            className="subtle-input"
            placeholder="Default style"
            value={form.defaultStyle}
            onChange={(e) => setForm((prev) => ({ ...prev, defaultStyle: e.target.value }))}
          />
          <input
            className="subtle-input"
            placeholder="Default background"
            value={form.defaultBackground}
            onChange={(e) => setForm((prev) => ({ ...prev, defaultBackground: e.target.value }))}
          />
        </div>

        <div className="mt-4 grid gap-2 text-sm text-text">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.adultConfirmed}
              onChange={(e) => setForm((prev) => ({ ...prev, adultConfirmed: e.target.checked }))}
            />
            Adult confirmation for this model
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.usageAuthorized}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, usageAuthorized: e.target.checked }))
              }
            />
            Usage authorization confirmed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.identityLock}
              onChange={(e) => setForm((prev) => ({ ...prev, identityLock: e.target.checked }))}
            />
            Lock identity
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.bodyLock}
              onChange={(e) => setForm((prev) => ({ ...prev, bodyLock: e.target.checked }))}
            />
            Lock body proportions
          </label>
        </div>

        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

        <button
          type="button"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          onClick={handleCreateModel}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Model Profile"}
        </button>
      </section>

      <section className="space-y-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-text-strong">Reference Upload Manager</h3>
          <p className="mt-1 text-sm text-muted">
            Recommended: face + front body + side body + neutral lighting image.
          </p>

          <div className="mt-3 space-y-3">
            <select
              className="subtle-input"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelName}
                </option>
              ))}
            </select>
            <select
              className="subtle-input"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as ReferenceImageType)}
            >
              {referenceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              type="file"
              className="subtle-input"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </div>

          {uploadMsg ? <p className="mt-3 text-sm text-emerald-600">{uploadMsg}</p> : null}
        </div>

        <div className="card p-4">
          <h3 className="mb-2 text-base font-semibold text-text-strong">Saved Models</h3>
          <div className="space-y-2">
            {models.length === 0 ? (
              <p className="text-sm text-muted">No profiles yet.</p>
            ) : (
              models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{model.modelName}</p>
                    <p className="text-xs text-muted">
                      {model.modelType} · refs: {refCountByModel.get(model.id) ?? 0}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={async () => {
                      await deleteDoc(doc(db, "model_profiles", model.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

async function evaluateImageQuality(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });

  const minEdge = Math.min(dimensions.width, dimensions.height);
  const score = minEdge >= 1024 ? "high" : minEdge >= 700 ? "medium" : "low";
  return { ...dimensions, score } as const;
}
