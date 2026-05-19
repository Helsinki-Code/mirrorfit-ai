import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <section className="card p-6 md:p-10">
        <p className="text-xs uppercase tracking-wide text-muted">MirrorFit AI</p>
        <h1 className="mt-2 text-4xl font-semibold text-text-strong md:text-5xl">
          Upload a model.
          <br />
          Upload an outfit.
          <br />
          Generate catalogue images.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-text">
          MirrorFit is a chat-first production assistant for fashion ecommerce teams. It keeps
          model face/body consistency and garment fidelity while handling commercial categories
          across swimwear, ethnicwear, bridalwear, and everyday fashion.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white">
            Start Free Trial
          </Link>
          <Link href="/login" className="pill-btn px-5 py-2.5 text-sm font-medium">
            Sign In
          </Link>
          <Link href="/how-it-works" className="pill-btn px-5 py-2.5 text-sm font-medium">
            How It Works
          </Link>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Identity lock",
            text: "Preserves face structure, skin tone, and body proportions across generations.",
          },
          {
            title: "Garment accuracy",
            text: "Targets seams, neckline, fit, drape, and texture for catalogue-ready outputs.",
          },
          {
            title: "Beginner-first workflow",
            text: "Users chat naturally; the system asks only for missing essentials.",
          },
        ].map((item) => (
          <article key={item.title} className="card p-5">
            <h2 className="text-lg font-semibold text-text-strong">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-text">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 card p-6">
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
  );
}
