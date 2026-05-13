import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireServerUser } from "@/lib/server-auth";
import type { Generation } from "@/lib/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireServerUser();
    const adminDb = getAdminDb();
    const { id } = await context.params;

    const snapshot = await adminDb.collection("generations").doc(id).get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Generation not found." }, { status: 404 });
    }

    const generation = snapshot.data() as Generation;
    if (generation.userId !== user.uid) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({ generation });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch generation." },
      { status: 500 },
    );
  }
}
