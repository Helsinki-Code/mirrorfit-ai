"use client";

import { useEffect, useState } from "react";
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
import type { ModelProfile, ModelReferenceImage, ReferenceImageType } from "@/lib/types";
import { buildStoragePath } from "@/lib/utils/storage";
import { nowUnixMs } from "@/lib/utils/time";

const requiredReferenceOrder: ReferenceImageType[] = ["face", "front_body", "side_body"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

async function getImageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const instance = new window.Image();
      instance.onload = () => resolve(instance);
      instance.onerror = () => reject(new Error("Invalid image."));
      instance.src = objectUrl;
    });
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ModelsPage() {
  const { user } = useAuth();
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [refs, setRefs] = useState<ModelReferenceImage[]>([]);
  const [name, setName] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubModels = onSnapshot(
      query(collection(db, "model_profiles"), where("userId", "==", user.uid), orderBy("createdAt", "desc")),
      (snapshot) => {
        const rows = snapshot.docs.map((doc) => doc.data() as ModelProfile);
        setModels(rows);
        if (!selectedModelId && rows[0]) setSelectedModelId(rows[0].id);
      },
    );
    const unsubRefs = onSnapshot(
      query(collection(db, "model_reference_images"), where("userId", "==", user.uid), orderBy("createdAt", "desc")),
      (snapshot) => setRefs(snapshot.docs.map((doc) => doc.data() as ModelReferenceImage)),
    );
    return () => {
      unsubModels();
      unsubRefs();
    };
  }, [selectedModelId, user]);

  const createModel = async () => {
    if (!user || !name.trim()) return;
    const id = crypto.randomUUID();
    const now = nowUnixMs();
    const model: ModelProfile = {
      id,
      userId: user.uid,
      modelName: name.trim(),
      modelType: "authorized_reference",
      adultConfirmed: true,
      usageAuthorized: true,
      defaultStyle: "catalogue",
      defaultBackground: "studio",
      identityLock: true,
      bodyLock: true,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, "model_profiles", id), model);
    setName("");
    setSelectedModelId(id);
  };

  const uploadReference = async (type: ReferenceImageType, file: File) => {
    if (!user || !selectedModelId) return;
    setError("");
    setInfo("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload a valid image file.");
      }
      if (file.size > MAX_FILE_BYTES) {
        throw new Error("Image exceeds 10MB. Use a smaller file.");
      }
      const dimensions = await getImageDimensions(file);
      if (dimensions.width < 600 || dimensions.height < 600) {
        throw new Error("Image resolution is too small. Use at least 600x600.");
      }

      const id = crypto.randomUUID();
      const ext = file.name.split(".").pop() || "png";
      const storagePath = buildStoragePath([
        "users",
        user.uid,
        "models",
        selectedModelId,
        "references",
        `${type}_${id}.${ext}`,
      ]);
      await uploadBytes(ref(storage, storagePath), file, {
        contentType: file.type,
      });
      const downloadUrl = await getDownloadURL(ref(storage, storagePath));
      const row: ModelReferenceImage = {
        id,
        userId: user.uid,
        modelId: selectedModelId,
        imageType: type,
        storagePath,
        downloadUrl,
        width: dimensions.width,
        height: dimensions.height,
        qualityScore:
          dimensions.width >= 1200 && dimensions.height >= 1200
            ? "high"
            : dimensions.width >= 900 && dimensions.height >= 900
              ? "medium"
              : "low",
        createdAt: nowUnixMs(),
      };
      await setDoc(doc(db, "model_reference_images", id), row);
      setInfo(`${type.replace("_", " ")} uploaded.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const selectedRefs = refs.filter((row) => row.modelId === selectedModelId);
  const hasRequired = requiredReferenceOrder.every((type) =>
    selectedRefs.some((ref) => ref.imageType === type),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="card p-4">
        <h2 className="text-lg font-semibold text-text-strong">My Models</h2>
        <p className="mt-1 text-sm text-muted">
          Keep it simple: create a model and upload face + front + side references.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            className="subtle-input"
            placeholder="Model name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
            onClick={createModel}
          >
            Save
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                selectedModelId === model.id ? "border-primary bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <button
                type="button"
                className="text-sm font-medium text-text"
                onClick={() => setSelectedModelId(model.id)}
              >
                {model.modelName}
              </button>
              <button
                type="button"
                className="text-xs text-red-500"
                onClick={async () => deleteDoc(doc(db, "model_profiles", model.id))}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="text-base font-semibold text-text-strong">Required references</h3>
        <p className="mt-1 text-sm text-muted">
          Upload these 3 first for strong face/body lock. Use clear, neutral, well-lit photos (600x600+).
        </p>
        <div className="mt-3 space-y-3">
          {requiredReferenceOrder.map((type) => (
            <label key={type} className="block rounded-md border border-border bg-surface p-3 text-sm text-text">
              <span className="mb-2 block font-medium capitalize">{type.replace("_", " ")}</span>
              <input
                className="subtle-input"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadReference(type, file);
                }}
              />
            </label>
          ))}
        </div>
        <p className={`mt-3 text-sm ${hasRequired ? "text-emerald-600" : "text-amber-600"}`}>
          {hasRequired
            ? "Model is generation-ready."
            : "Still waiting for one or more required references."}
        </p>
        {info ? <p className="mt-2 text-sm text-emerald-600">{info}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      </section>
    </div>
  );
}
