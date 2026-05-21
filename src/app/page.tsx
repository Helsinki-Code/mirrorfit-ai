import Link from "next/link";
import Image from "next/image";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function Home() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl">
        <section className="panel overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-10">
              <p className="section-eyebrow">MirrorFit AI</p>
              <h1 className="editorial-title mt-2 text-4xl text-text-strong md:text-5xl">
                Professional Catalogue Imagery.
                <br />
                A Simple Conversation.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-text">
                MirrorFit is a conversational production assistant for fashion teams. Add model
                references, add garments, describe the shoot naturally, and get polished output
                threads with strict face/body and garment consistency.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white"
                >
                  Start Free Trial
                </Link>
                <Link href="/login" className="pill-btn px-5 py-2.5 text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/how-it-works" className="pill-btn px-5 py-2.5 text-sm font-medium">
                  How It Works
                </Link>
              </div>
              <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
                <article className="rounded-md border border-border bg-surface px-3 py-3">
                  <p className="section-eyebrow !text-[0.58rem]">Identity</p>
                  <p className="mt-1 text-sm text-text-strong">Face + body lock</p>
                </article>
                <article className="rounded-md border border-border bg-surface px-3 py-3">
                  <p className="section-eyebrow !text-[0.58rem]">Garments</p>
                  <p className="mt-1 text-sm text-text-strong">Fidelity-focused render</p>
                </article>
                <article className="rounded-md border border-border bg-surface px-3 py-3">
                  <p className="section-eyebrow !text-[0.58rem]">Workflow</p>
                  <p className="mt-1 text-sm text-text-strong">Beginner-first chat flow</p>
                </article>
              </div>
            </div>

            <div className="media-frame m-4">
              <Image
                src="/images/generated/hero-fashion-catalog.svg"
                alt="Professional fashion model in studio lighting for ecommerce catalogue production"
                width={1400}
                height={1600}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="panel p-6">
            <p className="section-eyebrow">MirrorFit AI</p>
            <h2 className="editorial-title mt-1 text-2xl text-text-strong">
              Built for SKU throughput, not design complexity
            </h2>
            <p className="mt-3 text-sm leading-7 text-text">
              Teams stay in one conversational thread from brief to review. The system asks only
              for missing essentials, auto-retries in the background, and preserves production
              context per shoot.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/features" className="pill-btn px-4 py-2 text-sm">
                Explore Features
              </Link>
              <Link href="/pricing" className="pill-btn px-4 py-2 text-sm">
                View Pricing
              </Link>
            </div>
          </article>

          <article className="media-frame">
            <Image
              src="/images/generated/feature-workflow-grid.svg"
              alt="Structured fashion production workspace with garments and references for catalogue generation"
              width={1400}
              height={930}
              className="h-full min-h-[220px] w-full object-cover"
            />
          </article>
        </section>

        <section className="mt-4 panel p-6">
          <h2 className="text-xl font-semibold text-text-strong">Explore Guides</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["/ai-virtual-try-on-for-ecommerce", "AI Virtual Try-On for Ecommerce"],
              ["/ai-fashion-photography", "AI Fashion Photography"],
              ["/indian-fashion-ai-catalogue", "Indian Fashion AI Catalogue"],
              ["/swimwear-ai-catalogue", "AI Swimwear Catalogue"],
              ["/fashion-photoshoot-cost-india", "Cost and ROI (India)"],
              ["/batch-generation-fashion", "Batch Generation for Fashion"],
              ["/model-identity-lock", "Model Identity Lock"],
              ["/competitor-alternatives", "Competitor Alternatives"],
              ["/mirrorfit-ai-review", "MirrorFit AI Review"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-hover"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
