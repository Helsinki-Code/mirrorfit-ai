import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { setDocSafe, updateDocSafe } from "@/lib/server/firestore-write";
import { requireServerUser } from "@/lib/server-auth";
import type { ShootApproval, ShootMessage } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

const requestSchema = z.object({
  jobId: z.string().min(1),
  decision: z.enum(["approved", "rejected", "changes_requested"]),
  comment: z.string().max(1200).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireServerUser();
    const adminDb = getAdminDb();
    const parsed = requestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { status: "failed", error: "Invalid approval payload." },
        { status: 400 },
      );
    }

    const { jobId, decision, comment } = parsed.data;
    const jobSnap = await adminDb.collection("shoot_jobs").doc(jobId).get();
    if (!jobSnap.exists || jobSnap.data()?.userId !== user.uid) {
      console.warn("tenant.forbidden_approval_write", {
        userId: user.uid,
        jobId,
      });
      return NextResponse.json(
        { status: "failed", error: "Shoot job not found or unauthorized." },
        { status: 404 },
      );
    }

    const now = nowUnixMs();
    const approvalId = crypto.randomUUID();
    const approval: ShootApproval = {
      id: approvalId,
      jobId,
      userId: user.uid,
      decision,
      comment: comment ?? "",
      createdAt: now,
    };

    await setDocSafe({
      docRef: adminDb.collection("shoot_approvals").doc(approvalId),
      collection: "shoot_approvals",
      docId: approvalId,
      data: approval,
    });

    await updateDocSafe({
      docRef: adminDb.collection("shoot_jobs").doc(jobId),
      collection: "shoot_jobs",
      docId: jobId,
      data: {
        status:
          decision === "approved"
            ? "approved"
            : decision === "rejected"
              ? "rejected"
              : "needs_input",
        updatedAt: now,
      },
    });

    const messageId = crypto.randomUUID();
    const reviewerMessage: ShootMessage = {
      id: messageId,
      jobId,
      userId: user.uid,
      role: "reviewer",
      content:
        decision === "approved"
          ? `Approved. ${comment || "Ready for delivery."}`
          : decision === "changes_requested"
            ? `Revision requested. ${comment || "Please refine and regenerate."}`
            : `Rejected. ${comment || "Not approved."}`,
      createdAt: nowUnixMs(),
    };

    await setDocSafe({
      docRef: adminDb.collection("shoot_messages").doc(messageId),
      collection: "shoot_messages",
      docId: messageId,
      data: reviewerMessage,
    });

    return NextResponse.json({ status: "completed", approvalId });
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        error: error instanceof Error ? error.message : "Failed to save approval.",
      },
      { status: 500 },
    );
  }
}
