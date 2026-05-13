import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminStorage } from "@/lib/firebase/admin";
import { requireServerUser } from "@/lib/server-auth";

const schema = z.object({
  kind: z.enum(["model_reference", "garment_image"]),
  fileName: z.string().min(1),
  mimeType: z.string().min(4),
  modelId: z.string().optional(),
  garmentId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireServerUser();
    const adminStorage = getAdminStorage();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { kind, fileName, mimeType, modelId, garmentId } = parsed.data;
    const fileExt = fileName.split(".").pop() || "jpg";
    const objectId = crypto.randomUUID();
    const basePath =
      kind === "model_reference"
        ? `users/${user.uid}/models/${modelId ?? "unknown"}/references`
        : `users/${user.uid}/garments/${garmentId ?? "unknown"}`;
    const storagePath = `${basePath}/${objectId}.${fileExt}`;
    const file = adminStorage.bucket().file(storagePath);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 10 * 60 * 1000,
      contentType: mimeType,
    });

    return NextResponse.json({
      uploadUrl,
      storagePath,
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create signed upload URL.",
      },
      { status: 500 },
    );
  }
}
