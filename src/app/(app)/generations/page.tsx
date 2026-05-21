"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { Generation } from "@/lib/types";

export default function GenerationsPage() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(
        collection(db, "generations"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      ),
      (snapshot) => setGenerations(snapshot.docs.map((d) => d.data() as Generation)),
    );
  }, [user]);

  return (
    <div className="panel p-5 md:p-6">
      <p className="section-eyebrow">Generations</p>
      <h2 className="mb-3 mt-1 text-xl font-semibold text-text-strong">Render History</h2>
      {generations.length === 0 ? (
        <div className="empty-state text-sm">No generations yet.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {generations.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-muted">{item.id.slice(0, 10)}...</p>
                <span className="status-pill">{item.status}</span>
              </div>
              {item.outputUrl ? (
                <Image
                  src={item.outputUrl}
                  alt={item.style}
                  width={480}
                  height={600}
                  className="h-auto w-full rounded-md border border-border object-cover"
                />
              ) : (
                <div className="empty-state flex h-48 items-center justify-center text-xs">
                  Pending output
                </div>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-text">{item.style}</p>
              <p className="mt-1 text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
