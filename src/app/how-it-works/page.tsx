import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketingShell } from "@/components/marketing/MarketingShell";

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
    <MarketingShell>
      <main className="mx-auto w-full max-w-5xl">
      <section className="panel overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 md:p-8">
        <p className="section-eyebrow">Workflow</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">How MirrorFit Works</h1>
        <p className="mt-3 text-text">
          MirrorFit is built for non-technical teams. You describe the shoot naturally, and the
          platform handles prompt cleanup, consistency enforcement, retries, and output packaging.
        </p>
          </div>
          <div className="media-frame m-4">
            <Image
              src="/images/generated/how-it-works-editorial.svg"
              alt="Fashion creative direction board with garments and studio planning notes"
              width={1400}
              height={980}
              className="h-full min-h-[220px] w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mt-4 panel p-6 md:p-8">
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={step} className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text">
              <span className="mr-2 font-semibold text-text-strong">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-4 panel p-6">
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
    </MarketingShell>
  );
}
