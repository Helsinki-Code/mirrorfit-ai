import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app p-6">
      <main className="w-full max-w-3xl rounded-xl border border-border bg-panel p-8 shadow-sm">
        <p className="mb-2 text-sm text-muted">MirrorFit AI</p>
        <h1 className="mb-3 text-4xl font-semibold text-text-strong">
          Multi-Model Virtual Try-On Platform
        </h1>
        <p className="mb-8 text-base text-text">
          Upload model references, upload garments, and generate professional catalogue-ready
          fashion visuals in minutes.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Sign In
          </Link>
          <Link href="/signup" className="pill-btn px-5 py-2.5 text-sm font-medium">
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}
