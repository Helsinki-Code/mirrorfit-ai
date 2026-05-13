"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { CreateGenerationRequest, Garment, Generation, ModelProfile } from "@/lib/types";
import { PromptHelper } from "@/components/studio/PromptHelper";

const defaultRequest: Omit<CreateGenerationRequest, "modelProfileId" | "garmentId"> = {
  prompt: "",
  style: "clean professional e-commerce catalogue render",
  background: "neutral studio",
  lighting: "softbox commercial lighting",
  pose: "natural standing full-body",
  outputRatio: "4:5",
};

export default function StudioPage() {
  const { user } = useAuth();
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedGarmentId, setSelectedGarmentId] = useState("");
  const [request, setRequest] = useState(defaultRequest);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const modelQuery = query(
      collection(db, "model_profiles"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const garmentQuery = query(
      collection(db, "garments"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const generationQuery = query(
      collection(db, "generations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubModels = onSnapshot(modelQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ModelProfile);
      setModels(items);
      if (!selectedModelId && items[0]) setSelectedModelId(items[0].id);
    });
    const unsubGarments = onSnapshot(garmentQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as Garment);
      setGarments(items);
      if (!selectedGarmentId && items[0]) setSelectedGarmentId(items[0].id);
    });
    const unsubGenerations = onSnapshot(generationQuery, (snapshot) => {
      setGenerations(snapshot.docs.map((d) => d.data() as Generation));
    });

    return () => {
      unsubModels();
      unsubGarments();
      unsubGenerations();
    };
  }, [selectedGarmentId, selectedModelId, user]);

  const latestOutput = useMemo(
    () => generations.find((item) => item.status === "completed" && item.outputUrl),
    [generations],
  );

  const submitGeneration = async () => {
    if (!user) return;
    if (!selectedModelId || !selectedGarmentId) {
      setError("Please select model and garment.");
      return;
    }

    setError("");
    setGenerating(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelProfileId: selectedModelId,
          garmentId: selectedGarmentId,
          ...request,
        } satisfies CreateGenerationRequest),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Generation failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-text-strong">Try-On Studio</h2>
          <p className="mt-1 text-sm text-muted">
            Select model + garment, refine prompt, then generate your catalogue render.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              className="subtle-input"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              <option value="">Select model profile</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelName}
                </option>
              ))}
            </select>
            <select
              className="subtle-input"
              value={selectedGarmentId}
              onChange={(e) => setSelectedGarmentId(e.target.value)}
            >
              <option value="">Select garment</option>
              {garments.map((garment) => (
                <option key={garment.id} value={garment.id}>
                  {garment.productName}
                </option>
              ))}
            </select>
            <input
              className="subtle-input"
              value={request.style}
              onChange={(e) => setRequest((prev) => ({ ...prev, style: e.target.value }))}
              placeholder="Style"
            />
            <input
              className="subtle-input"
              value={request.background}
              onChange={(e) => setRequest((prev) => ({ ...prev, background: e.target.value }))}
              placeholder="Background"
            />
            <input
              className="subtle-input"
              value={request.lighting}
              onChange={(e) => setRequest((prev) => ({ ...prev, lighting: e.target.value }))}
              placeholder="Lighting"
            />
            <input
              className="subtle-input"
              value={request.pose}
              onChange={(e) => setRequest((prev) => ({ ...prev, pose: e.target.value }))}
              placeholder="Pose"
            />
            <select
              className="subtle-input"
              value={request.outputRatio}
              onChange={(e) =>
                setRequest((prev) => ({
                  ...prev,
                  outputRatio: e.target.value as CreateGenerationRequest["outputRatio"],
                }))
              }
            >
              <option value="1:1">Square 1:1</option>
              <option value="4:5">Instagram 4:5</option>
              <option value="9:16">Story 9:16</option>
              <option value="16:9">Banner 16:9</option>
            </select>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              disabled={generating}
              onClick={submitGeneration}
            >
              {generating ? "Generating..." : "Generate Try-On"}
            </button>
          </div>

          <textarea
            className="subtle-input mt-3 min-h-[130px]"
            value={request.prompt}
            onChange={(e) => setRequest((prev) => ({ ...prev, prompt: e.target.value }))}
            placeholder="Describe garment details, composition, and catalogue intent..."
          />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </div>

        <div className="card p-4">
          <h3 className="mb-3 text-base font-semibold text-text-strong">Main Preview Canvas</h3>
          <div className="relative flex min-h-[540px] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
            {generating ? (
              <div className="flex flex-col items-center gap-3 text-sm text-muted">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                Generating your fashion render...
              </div>
            ) : latestOutput?.outputUrl ? (
              <Image
                src={latestOutput.outputUrl}
                alt="Generated preview"
                width={900}
                height={1200}
                className="h-auto max-h-[520px] w-auto rounded-md object-contain shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
              />
            ) : (
              <p className="text-sm text-muted">No preview yet. Run a generation to see output here.</p>
            )}
          </div>
        </div>
      </section>

      <PromptHelper
        onInsert={(text) =>
          setRequest((prev) => ({
            ...prev,
            prompt: prev.prompt ? `${prev.prompt}\n${text}` : text,
          }))
        }
      />
    </div>
  );
}
