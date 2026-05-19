"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { BrandMemory, ModelProfile } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

export default function BrandMemoryPage() {
  const { user } = useAuth();
  const [memory, setMemory] = useState<BrandMemory | null>(null);
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const memoryId = user.uid;
    return onSnapshot(doc(db, "brand_memories", memoryId), (snapshot) => {
      if (!snapshot.exists()) {
        setMemory({
          id: memoryId,
          userId: user.uid,
          defaultLighting: "softbox studio",
          preferredModelId: "",
          approvedModelIds: [],
          preferredCrop: "4:5",
          preferredOutputPack: "catalog_only",
          favoriteCatalogueStyle: "clean ecommerce",
          avoidedBackgrounds: [],
          updatedAt: nowUnixMs(),
        });
        return;
      }
      setMemory(snapshot.data() as BrandMemory);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(collection(db, "model_profiles"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ModelProfile);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setModels(rows);
      },
    );
  }, [user]);

  if (!memory) return null;

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold text-text-strong">Brand Memory</h2>
      <p className="mt-1 text-sm text-muted">
        Save defaults so chat jobs need fewer inputs each time.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          className="subtle-input"
          value={memory.defaultLighting}
          onChange={(event) =>
            setMemory((prev) => (prev ? { ...prev, defaultLighting: event.target.value } : prev))
          }
          placeholder="Default lighting"
        />
        <select
          className="subtle-input"
          value={memory.preferredModelId ?? ""}
          onChange={(event) =>
            setMemory((prev) => (prev ? { ...prev, preferredModelId: event.target.value } : prev))
          }
        >
          <option value="">No default model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.modelName}
            </option>
          ))}
        </select>

        <select
          className="subtle-input"
          value={memory.preferredCrop}
          onChange={(event) =>
            setMemory((prev) =>
              prev ? { ...prev, preferredCrop: event.target.value as BrandMemory["preferredCrop"] } : prev,
            )
          }
        >
          <option value="1:1">1:1</option>
          <option value="4:5">4:5</option>
          <option value="9:16">9:16</option>
          <option value="16:9">16:9</option>
        </select>

        <select
          className="subtle-input"
          value={memory.preferredOutputPack}
          onChange={(event) =>
            setMemory((prev) =>
              prev
                ? {
                    ...prev,
                    preferredOutputPack: event.target.value as BrandMemory["preferredOutputPack"],
                  }
                : prev,
            )
          }
        >
          <option value="catalog_only">Catalog Only</option>
          <option value="catalog_social">Catalog + Social</option>
          <option value="full_pack">Full Pack</option>
        </select>

        <input
          className="subtle-input md:col-span-2"
          value={memory.favoriteCatalogueStyle}
          onChange={(event) =>
            setMemory((prev) =>
              prev ? { ...prev, favoriteCatalogueStyle: event.target.value } : prev,
            )
          }
          placeholder="Favorite catalogue style"
        />

        <textarea
          className="subtle-input md:col-span-2"
          rows={3}
          value={memory.avoidedBackgrounds.join(", ")}
          onChange={(event) =>
            setMemory((prev) =>
              prev
                ? {
                    ...prev,
                    avoidedBackgrounds: event.target.value
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  }
                : prev,
            )
          }
          placeholder="Avoided backgrounds (comma-separated)"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-text-strong">Approved model set</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {models.length === 0 ? (
            <p className="text-xs text-muted">No models yet.</p>
          ) : (
            models.map((model) => {
              const checked = memory.approvedModelIds.includes(model.id);
              return (
                <label
                  key={model.id}
                  className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      setMemory((prev) => {
                        if (!prev) return prev;
                        const set = new Set(prev.approvedModelIds);
                        if (event.target.checked) set.add(model.id);
                        else set.delete(model.id);
                        return { ...prev, approvedModelIds: [...set] };
                      })
                    }
                  />
                  {model.modelName}
                </label>
              );
            })
          )}
        </div>
      </div>

      <button
        type="button"
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        onClick={async () => {
          if (!user) return;
          const payload: BrandMemory = {
            ...memory,
            id: user.uid,
            userId: user.uid,
            updatedAt: nowUnixMs(),
          };
          await setDoc(doc(db, "brand_memories", user.uid), payload);
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
        }}
      >
        Save Brand Memory
      </button>
      {saved ? <p className="mt-2 text-sm text-emerald-600">Saved.</p> : null}
    </div>
  );
}
