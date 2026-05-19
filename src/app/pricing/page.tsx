import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | MirrorFit AI",
  description:
    "MirrorFit AI pricing for fashion catalogue generation: Free Trial, Starter, Professional, Business, and Enterprise.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "Free Trial",
    price: "INR 0",
    details: ["Limited generations", "Watermarked outputs", "1 model profile", "Standard quality"],
  },
  {
    name: "Starter",
    price: "INR 1,999 / month",
    details: ["More monthly generations", "Saved model profiles", "No watermark", "Catalogue-ready standard outputs"],
  },
  {
    name: "Professional",
    price: "INR 4,999 / month",
    details: ["High-resolution exports", "Batch generation", "Brand presets", "Priority queue"],
  },
  {
    name: "Business",
    price: "INR 12,999 / month",
    details: ["Team accounts", "API access", "Bulk SKU processing", "Advanced controls"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    details: ["Dedicated infrastructure", "Private storage", "Compliance support", "SLA-backed support"],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <section className="card p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-muted">MirrorFit AI</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">Pricing</h1>
        <p className="mt-3 max-w-3xl text-text">
          Choose a plan based on catalogue volume and team workflow. Pricing is structured for
          fashion ecommerce teams moving from shoot-heavy production to AI-assisted throughput.
        </p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="card p-6">
            <h2 className="text-xl font-semibold text-text-strong">{plan.name}</h2>
            <p className="mt-2 text-sm font-medium text-primary">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-text">
              {plan.details.map((detail) => (
                <li key={detail} className="rounded-md border border-border bg-surface px-3 py-2">
                  {detail}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-4 card p-6">
        <h2 className="text-lg font-semibold text-text-strong">Next Steps</h2>
        <p className="mt-2 text-sm text-text">
          Start with one model profile and a small garment set, validate output quality, then scale
          into batch generation and approval workflows.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/signup" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
            Create Account
          </Link>
          <Link href="/ai-virtual-try-on-for-ecommerce" className="pill-btn px-4 py-2 text-sm">
            Read Virtual Try-On Guide
          </Link>
        </div>
      </section>
    </main>
  );
}

