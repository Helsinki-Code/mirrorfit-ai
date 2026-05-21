"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "@/lib/firebase/client";
import { storage } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { Garment, GarmentImage, ModelProfile } from "@/lib/types";
import { buildStoragePath } from "@/lib/utils/storage";
import { nowUnixMs } from "@/lib/utils/time";

type OutfitRow = {
  id: string;
  outfitText: string;
  garmentId?: string;
};

type BulkResult = {
  key: string;
  outfitText: string;
  poseIndex: number;
  imageIndex: number;
  status: "completed" | "failed";
  message: string;
  outputUrl?: string;
  shootJobId?: string;
};

type UploadedOutfitImage = {
  id: string;
  garmentId: string;
  name: string;
  downloadUrl: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const BULK_GENERATION_GAP_MS = 2200;

function parseOutfitCsv(csv: string): OutfitRow[] {
  const rows = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) return [];

  const hasHeader = /outfit|garment/i.test(rows[0]);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsed: OutfitRow[] = [];
  for (const line of dataRows) {
    const [outfitTextRaw, garmentIdRaw] = line.split(",");
    const outfitText = (outfitTextRaw ?? "").trim();
    const garmentId = (garmentIdRaw ?? "").trim() || undefined;
    if (!outfitText) continue;
    parsed.push({
      id: crypto.randomUUID(),
      outfitText,
      garmentId,
    });
  }
  return parsed;
}

export default function BulkGeneratorPage() {
  const { user } = useAuth();
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [modelId, setModelId] = useState("");
  const [posesPerOutfit, setPosesPerOutfit] = useState(2);
  const [imagesPerPose, setImagesPerPose] = useState(2);
  const [outfitTextList, setOutfitTextList] = useState("");
  const [csvText, setCsvText] = useState("");
  const [uploadedOutfitImages, setUploadedOutfitImages] = useState<UploadedOutfitImage[]>([]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubModels = onSnapshot(
      query(collection(db, "model_profiles"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ModelProfile);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setModels(rows);
        setModelId((prev) => prev || rows[0]?.id || "");
      },
    );

    return () => {
      unsubModels();
    };
  }, [user]);

  const parsedOutfitRows = useMemo(() => {
    const manualRows = outfitTextList
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({
        id: crypto.randomUUID(),
        outfitText: text,
        garmentId: undefined,
      }));

    const csvRows = parseOutfitCsv(csvText);
    const imageRows = uploadedOutfitImages.map((item) => ({
      id: item.id,
      outfitText: `Use the uploaded outfit image: ${item.name}`,
      garmentId: item.garmentId,
    }));
    return [...manualRows, ...csvRows, ...imageRows];
  }, [csvText, outfitTextList, uploadedOutfitImages]);

  const estimatedJobs = parsedOutfitRows.length * posesPerOutfit * imagesPerPose;

  const runBulkGeneration = async () => {
    if (!user) return;
    setError("");
    setResults([]);

    if (!modelId) {
      setError("Please select a model profile first.");
      return;
    }
    if (!parsedOutfitRows.length) {
      setError("Add at least one outfit line or CSV row.");
      return;
    }
    setRunning(true);
    try {
      const token = await user.getIdToken();
      let count = 0;

      for (const outfit of parsedOutfitRows) {
        const effectiveGarmentId = outfit.garmentId;
        for (let poseIndex = 1; poseIndex <= posesPerOutfit; poseIndex += 1) {
          for (let imageIndex = 1; imageIndex <= imagesPerPose; imageIndex += 1) {
            count += 1;
            setProgressLabel(
              `Agent is generating ${count}/${estimatedJobs}: "${outfit.outfitText}" • pose ${poseIndex} • image ${imageIndex}`,
            );

            const userMessage = [
              `Create a fashion catalogue render for this outfit: ${outfit.outfitText}.`,
              `Pose requirement: pose ${poseIndex} out of ${posesPerOutfit}.`,
              `Variation requirement: image ${imageIndex} out of ${imagesPerPose}.`,
              "Keep face identity and body proportions consistent with model references.",
              "Keep output commercially clean and catalogue-ready.",
            ].join(" ");

            let finalized = false;
            let retries = 0;

            while (!finalized && retries < 4) {
              const response = await fetch("/api/generations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  "x-mirrorfit-mode": "bulk",
                },
                body: JSON.stringify({
                  modelProfileId: modelId,
                  garmentId: effectiveGarmentId,
                  userMessage,
                }),
              });

              const raw = await response.text();
              let data: {
                status?: string;
                outputUrl?: string;
                shootJobId?: string;
                message?: string;
                error?: string;
              } = {};

              try {
                data = JSON.parse(raw) as typeof data;
              } catch {
                data = { error: raw || "Unexpected response." };
              }

              if (response.status === 429) {
                retries += 1;
                const retryAfterSeconds = Number(response.headers.get("Retry-After") ?? "8");
                const waitMs = Number.isFinite(retryAfterSeconds)
                  ? Math.max(1, retryAfterSeconds) * 1000
                  : 8000;
                setProgressLabel(
                  `Agent paused for rate limit. Retrying in ${Math.round(waitMs / 1000)}s...`,
                );
                await sleep(waitMs);
                continue;
              }

              const ok = response.ok && data.status === "completed" && data.outputUrl;
              const result: BulkResult = {
                key: `${outfit.id}-${poseIndex}-${imageIndex}`,
                outfitText: outfit.outfitText,
                poseIndex,
                imageIndex,
                status: ok ? "completed" : "failed",
                message: ok
                  ? data.message ?? "Completed."
                  : data.error ?? data.message ?? `Failed (${response.status}).`,
                outputUrl: data.outputUrl,
                shootJobId: data.shootJobId,
              };

              setResults((current) => [result, ...current]);
              finalized = true;
            }

            if (!finalized) {
              setResults((current) => [
                {
                  key: `${outfit.id}-${poseIndex}-${imageIndex}`,
                  outfitText: outfit.outfitText,
                  poseIndex,
                  imageIndex,
                  status: "failed",
                  message: "Failed after repeated rate-limit retries.",
                },
                ...current,
              ]);
            }

            setProgressLabel("Agent waiting briefly before next generation to respect model limits...");
            await sleep(BULK_GENERATION_GAP_MS);
          }
        }
      }
      setProgressLabel("Agent completed the bulk generation run.");
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Bulk run failed.");
    } finally {
      setRunning(false);
    }
  };

  const uploadCsvFile = async (file: File) => {
    const content = await file.text();
    setCsvText(content);
  };

  const uploadOutfitImages = async (files: FileList | null) => {
    if (!user || !files || files.length === 0) return;
    setError("");

    const uploaded: UploadedOutfitImage[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const garmentId = crypto.randomUUID();
        const imageId = crypto.randomUUID();
        const now = nowUnixMs();
        const ext = file.name.split(".").pop() || "jpg";
        const storagePath = buildStoragePath([
          "users",
          user.uid,
          "garments",
          garmentId,
          `front_${imageId}.${ext}`,
        ]);

        await setDoc(doc(db, "garments", garmentId), {
          id: garmentId,
          userId: user.uid,
          productName: file.name.replace(/\.[^.]+$/, "") || `Uploaded Outfit ${uploadedOutfitImages.length + uploaded.length + 1}`,
          sku: `BULK-${garmentId.slice(0, 8).toUpperCase()}`,
          category: "other",
          fabric: "",
          color: "",
          notes: "Created from bulk outfit image upload",
          createdAt: now,
          updatedAt: now,
        } satisfies Garment);

        await uploadBytes(ref(storage, storagePath), file, { contentType: file.type });
        const downloadUrl = await getDownloadURL(ref(storage, storagePath));

        await setDoc(doc(db, "garment_images", imageId), {
          id: imageId,
          garmentId,
          userId: user.uid,
          imageType: "front",
          storagePath,
          downloadUrl,
          createdAt: now,
        } satisfies GarmentImage);

        uploaded.push({
          id: imageId,
          garmentId,
          name: file.name,
          downloadUrl,
        });
      }
      setUploadedOutfitImages((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload outfit images.");
    }
  };

  const completedCount = results.filter((item) => item.status === "completed").length;
  const failedCount = results.filter((item) => item.status === "failed").length;

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <p className="section-eyebrow">Bulk Image Generator</p>
        <h2 className="editorial-title mt-1 text-3xl text-text-strong">
          MirrorFit Conversational Agent
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tell me outfits in plain text or CSV. I will generate pose/image batches automatically.
        </p>
        <div className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text">
          <p className="font-medium text-text-strong">Agent prompt sequence</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text">
            <li>Select the model profile</li>
            <li>Provide outfit text and optional row-level garment references</li>
            <li>Set poses per outfit and images per pose</li>
            <li>Paste outfit lines or CSV rows, then run</li>
          </ol>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-text-strong">Input Setup</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
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
            <input
              className="subtle-input"
              type="number"
              min={1}
              max={12}
              value={posesPerOutfit}
              onChange={(event) => setPosesPerOutfit(Math.max(1, Number(event.target.value) || 1))}
              aria-label="Poses per outfit"
            />
            <input
              className="subtle-input"
              type="number"
              min={1}
              max={12}
              value={imagesPerPose}
              onChange={(event) => setImagesPerPose(Math.max(1, Number(event.target.value) || 1))}
              aria-label="Images per pose"
            />
            <div className="subtle-input flex items-center text-xs text-muted md:col-span-2">
              Outfit image references are applied per row only. No hidden default outfit fallback.
            </div>
          </div>

          <textarea
            className="subtle-input mt-3 min-h-[120px]"
            placeholder={"Outfit text list (one per line)\nBlack satin evening gown\nRed ethnic lehenga with gold border"}
            value={outfitTextList}
            onChange={(event) => setOutfitTextList(event.target.value)}
          />

          <textarea
            className="subtle-input mt-3 min-h-[120px]"
            placeholder={"CSV rows: outfitText,garmentId\nBlack deep-V swimsuit,abc123-garment-id"}
            value={csvText}
            onChange={(event) => setCsvText(event.target.value)}
          />
          <div className="mt-2 rounded-md border border-border bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upload CSV File</p>
            <input
              className="subtle-input mt-2"
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCsvFile(file);
              }}
            />
          </div>

          <div className="mt-3 rounded-md border border-border bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Upload Outfit Images (Any Number)
            </p>
            <p className="mt-1 text-xs text-muted">
              Agent will use these images as exact outfit references.
            </p>
            <input
              className="subtle-input mt-2"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                void uploadOutfitImages(event.target.files);
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted">Estimated generations: {estimatedJobs}</p>
            <button
              type="button"
              onClick={runBulkGeneration}
              disabled={running}
              className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {running ? "Agent running..." : "Run Bulk Generation"}
            </button>
          </div>
          {progressLabel ? <p className="mt-2 text-xs text-muted">{progressLabel}</p> : null}
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </div>

        <div className="panel p-5">
          <h3 className="text-base font-semibold text-text-strong">Queue Preview</h3>
          <p className="mt-1 text-sm text-muted">
            Outfits detected: {parsedOutfitRows.length}. Each will fan out into pose/image jobs.
          </p>
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {parsedOutfitRows.length === 0 ? (
              <div className="empty-state text-sm">No outfits queued yet.</div>
            ) : (
              parsedOutfitRows.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
                >
                  <p className="font-medium text-text-strong">{index + 1}. {item.outfitText}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Garment source: {item.garmentId ?? "prompt-only"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-base font-semibold text-text-strong">Uploaded Outfit References</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {uploadedOutfitImages.length === 0 ? (
            <div className="empty-state text-sm md:col-span-2 xl:col-span-4">
              No outfit images uploaded yet.
            </div>
          ) : (
            uploadedOutfitImages.map((item) => (
              <article key={item.id} className="rounded-md border border-border bg-surface p-2.5">
                <p className="truncate text-xs text-muted">{item.name}</p>
                <div className="media-frame mt-2">
                  <Image
                    src={item.downloadUrl}
                    alt={`Uploaded outfit reference image ${item.name}`}
                    width={420}
                    height={560}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel p-5">
        <div className="section-header">
          <h3 className="text-base font-semibold text-text-strong">Generated Results</h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Completed: {completedCount}</span>
            <span>Failed: {failedCount}</span>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {results.length === 0 ? (
            <div className="empty-state text-sm md:col-span-2 xl:col-span-3">
              Results will appear here during the bulk run.
            </div>
          ) : (
            results.map((result) => (
              <article key={result.key} className="rounded-md border border-border bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-strong">{result.outfitText}</p>
                  <span className="status-pill">{result.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Pose {result.poseIndex} • Image {result.imageIndex}
                </p>
                {result.outputUrl ? (
                  <div className="media-frame mt-2">
                    <Image
                      src={result.outputUrl}
                      alt={`Bulk generated fashion render for ${result.outfitText}, pose ${result.poseIndex}, image ${result.imageIndex}`}
                      width={540}
                      height={720}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-xs text-text">{result.message}</p>
                {result.shootJobId ? (
                  <Link
                    href={`/studio?job=${result.shootJobId}`}
                    className="mt-2 inline-flex rounded-md border border-border bg-panel px-3 py-1.5 text-xs text-text hover:bg-hover"
                  >
                    Open thread
                  </Link>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
