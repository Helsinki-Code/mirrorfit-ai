"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { ShootJob } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ShootJob[]>([]);
  const [newIdea, setNewIdea] = useState("");

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(collection(db, "shoot_jobs"), where("userId", "==", user.uid), orderBy("updatedAt", "desc")),
      (snapshot) => setJobs(snapshot.docs.map((doc) => doc.data() as ShootJob)),
    );
  }, [user]);

  const activeCount = useMemo(
    () => jobs.filter((job) => job.status === "working" || job.status === "needs_input").length,
    [jobs],
  );

  const createJob = async () => {
    if (!user || !newIdea.trim()) return;
    const id = crypto.randomUUID();
    const now = nowUnixMs();
    const job: ShootJob = {
      id,
      userId: user.uid,
      title: newIdea.length > 56 ? `${newIdea.slice(0, 56)}...` : newIdea,
      status: "draft",
      lastMessage: newIdea,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, "shoot_jobs", id), job);
    setNewIdea("");
  };

  return (
    <div className="space-y-4">
      <section className="panel p-5 md:p-6">
        <p className="section-eyebrow">Shoot Inbox</p>
        <h2 className="editorial-title mt-1 text-3xl text-text-strong">
          Start with one sentence
        </h2>
        <p className="mt-1 text-sm text-muted">
          Describe what you want. We will ask only what is missing.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <input
              className="subtle-input"
              value={newIdea}
              onChange={(event) => setNewIdea(event.target.value)}
              placeholder="Use Rishitha model for black swimwear in clean catalogue lighting..."
            />
            <p className="text-xs text-muted">
              Tip: mention model, garment, and output context in one line.
            </p>
          </div>
          <button
            type="button"
            onClick={createJob}
            className="focus-ring h-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm"
          >
            Create Job
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total Jobs" value={jobs.length} />
        <MetricCard label="Active Jobs" value={activeCount} />
        <MetricCard
          label="Completed"
          value={jobs.filter((job) => job.status === "completed").length}
        />
      </section>

      <section className="panel p-5">
        <div className="section-header">
          <h3 className="text-base font-semibold text-text-strong">Recent Jobs</h3>
          <span className="section-eyebrow !text-[0.58rem]">{jobs.length} total</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {jobs.length === 0 ? (
            <div className="empty-state text-sm">No jobs yet.</div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/studio?job=${job.id}`}
                className="focus-ring flex items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-3 transition-colors hover:bg-hover"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{job.title}</p>
                  <p className="text-xs text-muted">
                    {new Date(job.updatedAt).toLocaleString()}
                  </p>
                </div>
                <span className="status-pill">
                  {job.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="panel p-5">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Automation</p>
            <h3 className="text-base font-semibold text-text-strong">Need outfit batches?</h3>
          </div>
          <Link href="/bulk-generator" className="pill-btn px-3 py-1.5 text-sm">
            Open Bulk Generator
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-4">
      <p className="section-eyebrow !text-[0.62rem]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-strong">{value}</p>
    </div>
  );
}
