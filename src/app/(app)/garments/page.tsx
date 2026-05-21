"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { CreateGarmentInput, Garment, GarmentCategory, GarmentImage } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";
import { buildStoragePath } from "@/lib/utils/storage";

const defaultForm: CreateGarmentInput = {
  productName: "",
  sku: "",
  category: "everyday_fashion",
  fabric: "",
  color: "",
  notes: "",
};

const categories: Array<{ label: string; value: GarmentCategory }> = [
  { label: "Everyday Fashion", value: "everyday_fashion" },
  { label: "Luxury Editorial", value: "luxury_editorial" },
  { label: "Ethnicwear", value: "ethnicwear" },
  { label: "Swimwear / Resortwear", value: "swimwear" },
  { label: "Sleepwear", value: "sleepwear" },
  { label: "Shapewear / Activewear", value: "shapewear_activewear" },
  { label: "Other", value: "other" },
];

export default function GarmentsPage() {
  const { user } = useAuth();
  const [garments, setGarments] = useState<Garment[]>([]);
  const [form, setForm] = useState<CreateGarmentInput>(defaultForm);
  const [selectedGarmentId, setSelectedGarmentId] = useState("");
  const [imageType, setImageType] = useState<GarmentImage["imageType"]>("front");
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [garmentImages, setGarmentImages] = useState<GarmentImage[]>([]);

  useEffect(() => {
    if (!user) return;
    const garmentQuery = query(collection(db, "garments"), where("userId", "==", user.uid));
    return onSnapshot(garmentQuery, (snapshot) => {
      const items = snapshot.docs.map((entry) => entry.data() as Garment);
      items.sort((a, b) => b.createdAt - a.createdAt);
      setGarments(items);
      setSelectedGarmentId((prev) => prev || items[0]?.id || "");
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(collection(db, "garment_images"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as GarmentImage);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setGarmentImages(rows);
      },
    );
  }, [user]);

  const createGarment = async () => {
    if (!user || !form.productName.trim()) return;
    const id = crypto.randomUUID();
    const now = nowUnixMs();
    await setDoc(doc(db, "garments", id), {
      id,
      userId: user.uid,
      ...form,
      createdAt: now,
      updatedAt: now,
    } satisfies Garment);
    setForm(defaultForm);
    setSelectedGarmentId(id);
    setShowDetails(false);
  };

  const uploadGarmentImage = async (file: File, replaceImage?: GarmentImage) => {
    if (!user || !selectedGarmentId) return;
    setError("");
    setInfo("");
    try {
      const imageId = crypto.randomUUID();
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = buildStoragePath([
        "users",
        user.uid,
        "garments",
        selectedGarmentId,
        `${imageType}_${imageId}.${ext}`,
      ]);

      await uploadBytes(ref(storage, storagePath), file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(ref(storage, storagePath));

      await setDoc(doc(db, "garment_images", imageId), {
        id: imageId,
        garmentId: selectedGarmentId,
        userId: user.uid,
        imageType,
        storagePath,
        downloadUrl,
        createdAt: nowUnixMs(),
      } satisfies GarmentImage);

      if (replaceImage) {
        await deleteDoc(doc(db, "garment_images", replaceImage.id));
        await deleteObject(ref(storage, replaceImage.storagePath));
        setInfo(`${replaceImage.imageType.replace("_", " ")} image replaced.`);
      } else {
        setInfo(`${imageType.replace("_", " ")} image uploaded.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const deleteGarmentImage = async (image: GarmentImage) => {
    try {
      await deleteDoc(doc(db, "garment_images", image.id));
      await deleteObject(ref(storage, image.storagePath));
      setInfo(`${image.imageType.replace("_", " ")} image deleted.`);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const selectedGarmentImages = garmentImages.filter((item) => item.garmentId === selectedGarmentId);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <section className="panel p-5">
        <p className="section-eyebrow">Garment Library</p>
        <h2 className="mt-1 text-lg font-semibold text-text-strong">My Garments</h2>
        <p className="mt-1 text-sm text-muted">
          Keep it simple: save garment basics, then upload front or flat-lay references.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="subtle-input"
            placeholder="Product name"
            value={form.productName}
            onChange={(event) => setForm((prev) => ({ ...prev, productName: event.target.value }))}
          />
          <input
            className="subtle-input"
            placeholder="SKU"
            value={form.sku}
            onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
          />
          <select
            className="subtle-input"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value as GarmentCategory }))
            }
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            className="subtle-input"
            placeholder="Color"
            value={form.color}
            onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
          />
        </div>

        <button
          type="button"
          className="mt-3 text-xs text-primary underline underline-offset-2"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Hide optional details" : "Add optional details"}
        </button>

        {showDetails ? (
          <div className="mt-3 grid gap-3">
            <input
              className="subtle-input"
              placeholder="Fabric type (optional)"
              value={form.fabric}
              onChange={(event) => setForm((prev) => ({ ...prev, fabric: event.target.value }))}
            />
            <textarea
              className="subtle-input"
              rows={3}
              placeholder="Notes: straps, embroidery, cut, drape..."
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>
        ) : null}

        <button
          type="button"
          className="focus-ring mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          onClick={createGarment}
        >
          Save Garment
        </button>
      </section>

      <section className="space-y-4">
        <div className="panel p-5">
          <p className="section-eyebrow">References</p>
          <h3 className="mt-1 text-base font-semibold text-text-strong">Upload Garment Images</h3>
          <div className="mt-3 space-y-3">
            <select
              className="subtle-input"
              value={selectedGarmentId}
              onChange={(event) => setSelectedGarmentId(event.target.value)}
            >
              <option value="">Select garment</option>
              {garments.map((garment) => (
                <option key={garment.id} value={garment.id}>
                  {garment.productName}
                </option>
              ))}
            </select>
            <select
              className="subtle-input"
              value={imageType}
              onChange={(event) => setImageType(event.target.value as GarmentImage["imageType"])}
            >
              <option value="front">Front view</option>
              <option value="flat_lay">Flat lay</option>
              <option value="back">Back view</option>
              <option value="detail">Detail shot</option>
              <option value="transparent_png">Transparent PNG</option>
            </select>
            <input
              className="subtle-input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadGarmentImage(file);
              }}
            />
            {info ? <p className="text-sm text-success">{info}</p> : null}
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="mb-2 text-base font-semibold text-text-strong">Uploaded Garment Images</h3>
          {selectedGarmentId ? (
            <div className="space-y-2">
              {selectedGarmentImages.length === 0 ? (
                <div className="empty-state text-sm">No images uploaded for this garment yet.</div>
              ) : (
                selectedGarmentImages.map((item) => (
                  <div key={item.id} className="rounded-md border border-border bg-surface p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {item.imageType.replace("_", " ")}
                      </p>
                      <div className="flex gap-1.5">
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="pill-btn px-2 py-1 text-xs"
                        >
                          View
                        </a>
                        <label className="pill-btn cursor-pointer px-2 py-1 text-xs">
                          Replace
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadGarmentImage(file, item);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="pill-btn px-2 py-1 text-xs text-red-500"
                          onClick={async () => deleteGarmentImage(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <Image
                      src={item.downloadUrl}
                      alt={`Garment reference ${item.imageType.replace("_", " ")}`}
                      width={480}
                      height={620}
                      className="h-auto w-full rounded-md border border-border object-cover"
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="empty-state text-sm">Select a garment to view its uploaded images.</div>
          )}
        </div>

        <div className="panel p-5">
          <h3 className="mb-2 text-base font-semibold text-text-strong">Saved Garments</h3>
          <div className="space-y-2">
            {garments.length === 0 ? (
              <div className="empty-state text-sm">No garments yet.</div>
            ) : (
              garments.map((garment) => (
                <div
                  key={garment.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{garment.productName}</p>
                    <p className="text-xs text-muted">
                      {garment.category} - {garment.color || "no color"}
                    </p>
                  </div>
                  <button
                    className="focus-ring rounded-sm text-xs text-red-500"
                    type="button"
                    onClick={async () => deleteDoc(doc(db, "garments", garment.id))}
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
