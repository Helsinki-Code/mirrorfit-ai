"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { ShootApproval, ShootJob } from "@/lib/types";

export default function SharePage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ShootJob[]>([]);
  const [approvals, setApprovals] = useState<ShootApproval[]>([]);
  const [jobId, setJobId] = useState("");
  const [comment, setComment] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(collection(db, "shoot_jobs"), where("userId", "==", user.uid)),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ShootJob);
        rows.sort((a, b) => b.updatedAt - a.updatedAt);
        setJobs(rows);
        setJobId((prev) => prev || rows[0]?.id || "");
      },
    );
  }, [user]);

  useEffect(() => {
    if (!jobId || !user) return;
    return onSnapshot(
      query(
        collection(db, "shoot_approvals"),
        where("jobId", "==", jobId),
        where("userId", "==", user.uid),
      ),
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => entry.data() as ShootApproval);
        rows.sort((a, b) => b.createdAt - a.createdAt);
        setApprovals(rows);
      },
    );
  }, [jobId, user]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === jobId), [jobId, jobs]);

  const writeDecision = async (decision: ShootApproval["decision"]) => {
    if (!user || !jobId) return;
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/shoot-approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          decision,
          comment: comment.trim() || undefined,
        }),
      });
      const raw = await response.text();
      let payload = {} as { error?: string };
      try {
        payload = JSON.parse(raw) as typeof payload;
      } catch {
        if (!response.ok) {
          throw new Error(`Failed to save decision (${response.status}). ${raw.slice(0, 220)}`);
        }
      }
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save decision.");
      }

      setComment("");
      setInfo("Decision saved to event log.");
      setTimeout(() => setInfo(""), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save decision.");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="card p-4">
        <h2 className="text-lg font-semibold text-text-strong">Share & Approval</h2>
        <p className="mt-1 text-sm text-muted">
          Review the same shoot thread, approve/reject, or request revisions.
        </p>

        <div className="mt-4 grid gap-3">
          <select
            className="subtle-input"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
          >
            <option value="">Select shoot job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <textarea
            className="subtle-input min-h-[120px]"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Optional feedback for the production thread..."
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
            onClick={async () => writeDecision("approved")}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white"
            onClick={async () => writeDecision("changes_requested")}
          >
            Request Changes
          </button>
          <button
            type="button"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            onClick={async () => writeDecision("rejected")}
          >
            Reject
          </button>
        </div>

        {selectedJob ? (
          <p className="mt-3 text-xs text-muted">
            Current status: <span className="capitalize text-text">{selectedJob.status}</span>
          </p>
        ) : null}
        {info ? <p className="mt-2 text-sm text-emerald-600">{info}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      </section>

      <section className="card p-4">
        <h3 className="text-base font-semibold text-text-strong">Immutable Event Log</h3>
        <div className="mt-3 space-y-2">
          {approvals.length === 0 ? (
            <p className="text-sm text-muted">No approval events yet.</p>
          ) : (
            approvals.map((approval) => (
              <div
                key={approval.id}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
              >
                <p className="capitalize text-text-strong">{approval.decision.replace("_", " ")}</p>
                <p className="text-xs text-muted">{new Date(approval.createdAt).toLocaleString()}</p>
                {approval.comment ? <p className="mt-1 text-text">{approval.comment}</p> : null}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
