import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features | MirrorFit AI",
  description:
    "MirrorFit AI feature overview: chat-first shoot room, model identity lock, garment libraries, batch generation, and approval workflows.",
  alternates: { canonical: "/features" },
};

const features = [
  {
    title: "Chat-first shoot room",
    description:
      "Users request outputs in plain language; the platform asks only for missing essentials.",
  },
  {
    title: "Model identity lock",
    description:
      "Face and body consistency scoring with retry loops to reduce identity drift across generations.",
  },
  {
    title: "Garment fidelity pipeline",
    description:
      "Structured garment references improve seam, drape, texture, and color preservation.",
  },
  {
    title: "Brand memory defaults",
    description:
      "Preferred lighting, crop, approved models, and output packs are reused automatically.",
  },
  {
    title: "Batch generation",
    description:
      "Generate large SKU sets with shared presets while keeping output consistency.",
  },
  {
    title: "Share and approval logs",
    description:
      "Review decisions and revision requests stay in the same shoot thread for traceability.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <section className="card p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-muted">Product</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">MirrorFit Features</h1>
        <p className="mt-3 text-text">
          A production assistant for fashion teams: simple for beginners on the surface, strong
          orchestration and consistency controls under the hood.
        </p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="card p-6">
            <h2 className="text-lg font-semibold text-text-strong">{feature.title}</h2>
            <p className="mt-2 text-sm leading-7 text-text">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 card p-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/how-it-works" className="pill-btn px-4 py-2 text-sm">
            How It Works
          </Link>
          <Link href="/ai-virtual-try-on-for-ecommerce" className="pill-btn px-4 py-2 text-sm">
            Virtual Try-On Guide
          </Link>
          <Link href="/pricing" className="pill-btn px-4 py-2 text-sm">
            Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}

