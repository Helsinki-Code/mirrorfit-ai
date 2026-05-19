import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | MirrorFit AI",
  description:
    "MirrorFit AI workflow: upload model references, upload garments, generate catalogue outputs, and approve in-thread.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  "Create a model profile with face, full-body front, and full-body side references.",
  "Save garments with front or flat-lay images and optional detail angles.",
  "Start a chat shoot thread and describe the desired output in plain language.",
  "Let the orchestrator generate, retry, and refine automatically with consistency scoring.",
  "Approve, request revisions, and export final outputs in required aspect ratios.",
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-6">
      <section className="card p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-muted">Workflow</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">How MirrorFit Works</h1>
        <p className="mt-3 text-text">
          MirrorFit is built for non-technical teams. You describe the shoot naturally, and the
          platform handles prompt cleanup, consistency enforcement, retries, and output packaging.
        </p>
      </section>
      <section className="mt-4 card p-6 md:p-8">
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={step} className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text">
              <span className="mr-2 font-semibold text-text-strong">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-4 card p-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/pricing" className="pill-btn px-4 py-2 text-sm">
            View Pricing
          </Link>
          <Link href="/ai-fashion-photography" className="pill-btn px-4 py-2 text-sm">
            Read AI Photography Guide
          </Link>
        </div>
      </section>
    </main>
  );
}

