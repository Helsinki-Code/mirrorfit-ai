import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Model Library | MirrorFit AI",
  description:
    "How MirrorFit model profiles work: required references, authorization checks, and identity lock behavior for catalogue consistency.",
  alternates: { canonical: "/model-library" },
};

export default function ModelLibraryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-6">
      <section className="card p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-muted">Model Profiles</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">Model Library</h1>
        <p className="mt-3 text-text">
          MirrorFit stores reusable model identities so brands can keep one consistent face and
          body profile across every garment and campaign variant.
        </p>
      </section>

      <section className="mt-4 card p-6">
        <h2 className="text-lg font-semibold text-text-strong">Required references</h2>
        <ul className="mt-3 space-y-2 text-sm text-text">
          <li className="rounded-md border border-border bg-surface px-3 py-2">Face reference image</li>
          <li className="rounded-md border border-border bg-surface px-3 py-2">Full-body front reference image</li>
          <li className="rounded-md border border-border bg-surface px-3 py-2">Full-body side reference image</li>
        </ul>
        <p className="mt-3 text-sm text-text">
          Optional extras like back view and pose references can improve consistency in edge cases.
        </p>
      </section>

      <section className="mt-4 card p-6">
        <h2 className="text-lg font-semibold text-text-strong">Compliance checks</h2>
        <p className="mt-2 text-sm text-text">
          Uploads must be authorized, consenting, and adult for sensitive fashion categories. This
          keeps outputs production-safe for commercial use.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/model-identity-lock" className="pill-btn px-4 py-2 text-sm">
            Identity Lock Guide
          </Link>
          <Link href="/signup" className="pill-btn px-4 py-2 text-sm">
            Create Account
          </Link>
        </div>
      </section>
    </main>
  );
}

