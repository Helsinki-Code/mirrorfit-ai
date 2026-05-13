"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { Generation } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [modelCount, setModelCount] = useState(0);
  const [garmentCount, setGarmentCount] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribers = [
      onSnapshot(
        query(collection(db, "model_profiles"), where("userId", "==", user.uid)),
        (snapshot) => setModelCount(snapshot.size),
      ),
      onSnapshot(
        query(collection(db, "garments"), where("userId", "==", user.uid)),
        (snapshot) => setGarmentCount(snapshot.size),
      ),
      onSnapshot(
        query(collection(db, "generations"), where("userId", "==", user.uid)),
        (snapshot) => setGenerationCount(snapshot.size),
      ),
      onSnapshot(
        query(
          collection(db, "generations"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(6),
        ),
        (snapshot) =>
          setRecentGenerations(snapshot.docs.map((doc) => doc.data() as Generation)),
      ),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [user]);

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Saved Models" value={modelCount} />
        <MetricCard label="Garments" value={garmentCount} />
        <MetricCard label="Total Generations" value={generationCount} />
      </section>

      <section className="card p-4">
        <h2 className="mb-4 text-lg font-semibold text-text-strong">Recent Renders</h2>
        {recentGenerations.length === 0 ? (
          <p className="text-sm text-muted">No renders yet. Go to Try-On Studio to generate.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2">Generation ID</th>
                  <th className="pb-2">Style</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentGenerations.map((item) => (
                  <tr key={item.id} className="border-b border-border/60 text-text">
                    <td className="py-2">{item.id.slice(0, 10)}...</td>
                    <td className="py-2">{item.style}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                    <td className="py-2">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
