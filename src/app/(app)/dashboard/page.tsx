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
      <section className="card p-4">
        <p className="text-xs uppercase tracking-wide text-muted">Shoot Inbox</p>
        <h2 className="mt-1 text-2xl font-semibold text-text-strong">
          Start with one sentence
        </h2>
        <p className="mt-1 text-sm text-muted">
          Example: Use Meera model for my navy satin dress in catalogue style.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="subtle-input"
            value={newIdea}
            onChange={(event) => setNewIdea(event.target.value)}
            placeholder="Describe the shoot you want..."
          />
          <button
            type="button"
            onClick={createJob}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
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

      <section className="card p-4">
        <h3 className="text-base font-semibold text-text-strong">Recent Jobs</h3>
        <div className="mt-3 space-y-2">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted">No jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/studio?job=${job.id}`}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-3 transition-colors hover:bg-hover"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{job.title}</p>
                  <p className="text-xs text-muted">
                    {new Date(job.updatedAt).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-md border border-border px-2 py-1 text-xs capitalize text-text">
                  {job.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-strong">{value}</p>
    </div>
  );
}
