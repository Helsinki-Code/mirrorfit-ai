"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
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
    if (!shootJobId) return;
    return onSnapshot(
      query(collection(db, "shoot_messages"), where("jobId", "==", shootJobId)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ShootMessage);
        rows.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(rows);
      },
    );
  }, [shootJobId]);

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
    if (!modelId) return;
    return onSnapshot(
      query(collection(db, "model_reference_images"), where("modelId", "==", modelId)),
      (snapshot) => {
        setModelRefs(snapshot.docs.map((entry) => entry.data() as ModelReferenceImage));
      },
    );
  }, [modelId]);

  useEffect(() => {
    if (!garmentId) return;
    return onSnapshot(
      query(collection(db, "garment_images"), where("garmentId", "==", garmentId)),
      (snapshot) => {
        setGarmentRefs(snapshot.docs.map((entry) => entry.data() as GarmentImage));
      },
    );
  }, [garmentId]);

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

      const data = (await response.json()) as {
        status?: string;
        error?: string;
        message?: string;
        missing?: string[];
      };
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
      <div className="card p-6 text-sm text-muted">
        Open a job from Shoot Inbox to start the conversational shoot room.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Chat Shoot Room</p>
          <h2 className="mt-1 text-xl font-semibold text-text-strong">
            {job?.title ?? "Production Thread"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Describe the shoot naturally. I will handle the structure in the background.
          </p>
        </div>

        {missingCards.length > 0 ? (
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-text-strong">Missing Info Cards</h3>
            <div className="mt-3 grid gap-2">
              {missingCards.map((card) => (
                <div
                  key={card}
                  className="rounded-md border border-amber-500/40 bg-amber-100/30 px-3 py-2 text-sm text-text"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="card p-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted">No messages yet. Send your first shoot request.</p>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    item.role === "user"
                      ? "border-border bg-surface text-text"
                      : "border-primary/30 bg-primary/10 text-text-strong"
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted">{item.role}</p>
                  <p>{item.content}</p>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt="Generated output"
                      width={600}
                      height={760}
                      className="mt-3 h-auto w-full rounded-md border border-border object-cover shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
                    />
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-4">
          <div className="grid gap-2 sm:grid-cols-2">
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
            className="subtle-input mt-3 min-h-[96px]"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Use Meera model and place this navy satin dress in premium catalogue lighting."
          />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
          <button
            type="button"
            onClick={submitMessage}
            disabled={working}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {working ? "Working..." : "Generate"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-text-strong">Result Message Thread</h3>
          <div className="relative mt-3 flex min-h-[340px] items-center justify-center rounded-md border border-border bg-surface">
            {latestImage ? (
              <Image
                src={latestImage}
                alt="Latest render"
                width={540}
                height={720}
                className="h-auto max-h-[320px] w-auto rounded-md object-contain shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              />
            ) : (
              <p className="text-sm text-muted">Latest generated image appears here.</p>
            )}
            {working ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs text-text">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Generating...
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card p-4">
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
                className="pill-btn px-3 py-2 text-xs disabled:opacity-60"
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
