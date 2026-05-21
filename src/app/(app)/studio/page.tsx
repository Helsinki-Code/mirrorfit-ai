"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ImageGeneration } from "@/components/studio/ImageGeneration";
import { useAuth } from "@/providers/AuthProvider";
import type {
  CreateGenerationRequest,
  Garment,
  GarmentImage,
  ModelProfile,
  ModelReferenceImage,
  ShootJob,
  ShootMessage,
} from "@/lib/types";

const quickFixChips: Array<{
  label: string;
  value: NonNullable<CreateGenerationRequest["quickFixAction"]>;
}> = [
  { label: "Make more catalogue", value: "more_catalogue" },
  { label: "Improve garment", value: "improve_garment" },
  { label: "Keep face same", value: "keep_face_same" },
  { label: "Change pose", value: "change_pose" },
  { label: "Generate back view", value: "generate_back_view" },
];

function roleLabel(role: ShootMessage["role"]) {
  if (role === "assistant") return "MirrorFit Agent";
  if (role === "user") return "You";
  if (role === "reviewer") return "Reviewer";
  return "System";
}

export default function StudioPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [job, setJob] = useState<ShootJob | null>(null);
  const [messages, setMessages] = useState<ShootMessage[]>([]);
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [modelRefs, setModelRefs] = useState<ModelReferenceImage[]>([]);
  const [garmentRefs, setGarmentRefs] = useState<GarmentImage[]>([]);
  const [modelId, setModelId] = useState("");
  const [garmentId, setGarmentId] = useState("");
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);
  const [generationSequence, setGenerationSequence] = useState(0);
  const [error, setError] = useState("");
  const [serverMissing, setServerMissing] = useState<string[]>([]);

  const shootJobId = searchParams.get("job") ?? "";

  useEffect(() => {
    if (!user || !shootJobId) return;
    const unsub = onSnapshot(doc(db, "shoot_jobs", shootJobId), (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data() as ShootJob;
      if (data.userId !== user.uid) return;
      setJob(data);
      if (!modelId && data.modelProfileId) setModelId(data.modelProfileId);
      if (!garmentId && data.garmentId) setGarmentId(data.garmentId);
    });
    return unsub;
  }, [garmentId, modelId, shootJobId, user]);

  useEffect(() => {
    if (!shootJobId || !user) return;
    return onSnapshot(
      query(
        collection(db, "shoot_messages"),
        where("jobId", "==", shootJobId),
        where("userId", "==", user.uid),
      ),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ShootMessage);
        rows.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(rows);
      },
    );
  }, [shootJobId, user]);

  useEffect(() => {
    if (!user) return;
    const unsubModels = onSnapshot(
      query(collection(db, "model_profiles"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ModelProfile);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setModels(rows);
      },
    );
    const unsubGarments = onSnapshot(
      query(collection(db, "garments"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as Garment);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setGarments(rows);
      },
    );
    return () => {
      unsubModels();
      unsubGarments();
    };
  }, [user]);

  useEffect(() => {
    if (!modelId || !user) return;
    return onSnapshot(
      query(
        collection(db, "model_reference_images"),
        where("modelId", "==", modelId),
        where("userId", "==", user.uid),
      ),
      (snapshot) => {
        setModelRefs(snapshot.docs.map((entry) => entry.data() as ModelReferenceImage));
      },
    );
  }, [modelId, user]);

  useEffect(() => {
    if (!garmentId || !user) return;
    return onSnapshot(
      query(
        collection(db, "garment_images"),
        where("garmentId", "==", garmentId),
        where("userId", "==", user.uid),
      ),
      (snapshot) => {
        setGarmentRefs(snapshot.docs.map((entry) => entry.data() as GarmentImage));
      },
    );
  }, [garmentId, user]);

  const latestImage = useMemo(() => {
    const imageMessage = [...messages].reverse().find((item) => item.imageUrl);
    return imageMessage?.imageUrl ?? "";
  }, [messages]);

  const missingCards = useMemo(() => {
    const missing = new Set<string>();
    if (!modelId) missing.add("Select model");
    if (!garmentId) missing.add("Upload or select garment");

    const modelRefTypes = new Set(modelRefs.map((item) => item.imageType));
    if (modelId && !modelRefTypes.has("face")) missing.add("Upload model face reference");
    if (modelId && !modelRefTypes.has("front_body")) missing.add("Upload model front-body reference");
    if (modelId && !modelRefTypes.has("side_body")) missing.add("Upload model side-body reference");

    const garmentRefTypes = new Set(garmentRefs.map((item) => item.imageType));
    if (garmentId && !garmentRefTypes.has("front") && !garmentRefTypes.has("flat_lay")) {
      missing.add("Upload garment front or flat-lay reference");
    }

    for (const serverHint of serverMissing) {
      if (serverHint === "model") missing.add("Select model");
      if (serverHint === "garment") missing.add("Upload or select garment");
    }

    return [...missing];
  }, [garmentId, garmentRefs, modelId, modelRefs, serverMissing]);

  const runGeneration = async (
    payload: Omit<CreateGenerationRequest, "userMessage"> & {
      userMessage: string;
      quickFixAction?: CreateGenerationRequest["quickFixAction"];
    },
  ) => {
    if (!user || !shootJobId) return;
    setGenerationSequence((current) => current + 1);
    setWorking(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shootJobId,
          ...payload,
        }),
      });

      const raw = await response.text();
      let data = {} as {
        status?: string;
        error?: string;
        message?: string;
        missing?: string[];
      };
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        if (!response.ok) {
          throw new Error(`Generation failed (${response.status}). ${raw.slice(0, 220)}`);
        }
      }
      if (!response.ok || data.status === "failed") {
        throw new Error(data.error ?? data.message ?? "Generation failed.");
      }
      if (data.status === "needs_input") {
        setError(data.message ?? "Please provide missing information.");
        setServerMissing(data.missing ?? []);
      } else {
        setServerMissing([]);
      }
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setWorking(false);
    }
  };

  const submitMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return;
    await runGeneration({
      modelProfileId: modelId || undefined,
      garmentId: garmentId || undefined,
      userMessage,
    });
  };

  if (!shootJobId) {
    return (
      <div className="empty-state text-sm">
        Open a job from Shoot Inbox to start the conversational shoot room.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="panel p-5">
          <p className="section-eyebrow">Chat Shoot Room</p>
          <h2 className="editorial-title mt-1 text-3xl text-text-strong">
            {job?.title ?? "Production Thread"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Describe the shoot naturally. I will handle the structure in the background.
          </p>
          <div className="mt-3 rounded-md border border-border bg-surface px-3 py-2 text-xs text-text">
            <span className="font-semibold text-text-strong">Agent online:</span>{" "}
            I check missing inputs, run generation retries, and return the best catalogue result.
          </div>
        </div>

        {missingCards.length > 0 ? (
          <div className="panel p-5">
            <div className="section-header">
              <h3 className="text-sm font-semibold text-text-strong">Missing Info Cards</h3>
              <span className="status-pill">needs input</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {missingCards.map((card) => (
                <div
                  key={card}
                  className="rounded-md border border-amber-500/35 bg-amber-100/25 px-3 py-2 text-sm text-text"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="panel p-5">
          <div className="space-y-3.5">
            {messages.length === 0 ? (
              <div className="thread-bubble thread-bubble-assistant text-sm">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted">MirrorFit Agent</p>
                I am ready. Tell me the shoot request naturally, and I will ask only what is missing.
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`thread-bubble ${
                    item.role === "user"
                      ? "thread-bubble-user"
                      : "thread-bubble-assistant"
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted">
                    {roleLabel(item.role)}
                  </p>
                  <p>{item.content}</p>
                  {item.imageUrl ? (
                    <div className="media-frame mt-3">
                      <Image
                        src={item.imageUrl}
                        alt="Generated output"
                        width={600}
                        height={760}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel p-5">
          <div className="grid gap-2 md:grid-cols-2">
            <select
              className="subtle-input"
              value={modelId}
              onChange={(event) => setModelId(event.target.value)}
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
              value={garmentId}
              onChange={(event) => setGarmentId(event.target.value)}
            >
              <option value="">Select garment</option>
              {garments.map((garment) => (
                <option key={garment.id} value={garment.id}>
                  {garment.productName}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="subtle-input mt-3 min-h-[110px]"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Use Meera model and place this navy satin dress in premium catalogue lighting."
          />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
          <button
            type="button"
            onClick={submitMessage}
            disabled={working}
            className="focus-ring mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
          >
            {working ? "Working..." : "Generate"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-text-strong">Result Message Thread</h3>
          <div className="mt-3">
            <ImageGeneration isActive={working} generationKey={generationSequence}>
              <div className="flex min-h-[340px] items-center justify-center rounded-lg border border-border bg-surface p-2">
                {latestImage ? (
                  <Image
                    src={latestImage}
                    alt="Latest generated fashion catalogue render in MirrorFit Studio"
                    width={540}
                    height={720}
                    className="h-auto max-h-[320px] w-auto rounded-lg object-contain shadow-[0_18px_52px_rgba(5,14,30,0.25)]"
                  />
                ) : (
                  <p className="text-sm text-muted">Latest generated image appears here.</p>
                )}
              </div>
            </ImageGeneration>
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-base font-semibold text-text-strong">Quick Fix Chips</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickFixChips.map((chip) => (
              <button
                key={chip.value}
                type="button"
                disabled={working}
                onClick={async () => {
                  await runGeneration({
                    modelProfileId: modelId || undefined,
                    garmentId: garmentId || undefined,
                    userMessage: `Apply quick fix: ${chip.label}`,
                    quickFixAction: chip.value,
                  });
                }}
                className="action-chip focus-ring disabled:opacity-60"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
