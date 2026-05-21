import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  keywordsForRoute,
  type SeoPageContent,
  type SeoRouteId,
} from "@/lib/seo/content-map";
import { MarketingShell } from "@/components/marketing/MarketingShell";

const routeImageMap: Record<SeoRouteId, { src: string; alt: string }> = {
  ai_virtual_try_on: {
    src: "/images/generated/seo-fashion-guides.svg",
    alt: "Ecommerce fashion rails and styling setup for AI virtual try-on catalogue operations",
  },
  ai_fashion_photography: {
    src: "/images/generated/hero-fashion-catalog.svg",
    alt: "Fashion photography wardrobe selection for AI-assisted product image production",
  },
  indian_fashion: {
    src: "/images/generated/feature-workflow-grid.svg",
    alt: "Indian fashion garments displayed for catalogue photography and ecommerce listing workflows",
  },
  swimwear: {
    src: "/images/generated/hero-fashion-catalog.svg",
    alt: "Swimwear styling session for professional ecommerce product catalogue imagery",
  },
  cost_roi: {
    src: "/images/generated/pricing-strategy-board.svg",
    alt: "Fashion business budget and ROI planning for catalogue production workflows",
  },
  batch_generation: {
    src: "/images/generated/feature-workflow-grid.svg",
    alt: "Fashion model shoot board representing batch ecommerce image generation process",
  },
  model_identity: {
    src: "/images/generated/hero-fashion-catalog.svg",
    alt: "Close portrait reference for preserving model identity in fashion generation workflows",
  },
  competitor_alternatives: {
    src: "/images/generated/seo-fashion-guides.svg",
    alt: "Product evaluation meeting comparing fashion AI catalogue platforms",
  },
  brand_review: {
    src: "/images/generated/how-it-works-editorial.svg",
    alt: "Fashion ecommerce review workspace analyzing image quality and production outcomes",
  },
};

function faqSchema(page: SeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function howToSchema(page: SeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.h1,
    description: page.description,
    step: page.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };
}

export function metadataFromSeoPage(page: SeoPageContent): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.slug },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: page.slug,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export function SeoContentPage({
  page,
  routeId,
}: {
  page: SeoPageContent;
  routeId: SeoRouteId;
}) {
  const keywords = keywordsForRoute(routeId);
  const routeImage = routeImageMap[routeId];

  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl">
        <section className="panel p-6 md:p-8">
          <p className="section-eyebrow">MirrorFit AI Guide</p>
          <h1 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">{page.h1}</h1>
          <p className="mt-3 text-base text-text">{page.intro}</p>
          <div className="media-frame mt-5">
            <Image
              src={routeImage.src}
              alt={routeImage.alt}
              width={1600}
              height={980}
              className="h-auto w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-4 panel p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-strong">Definition</h2>
          <p className="thread-bubble thread-bubble-assistant mt-3 text-sm leading-7">
            {page.definition}
          </p>
        </section>

        <section className="mt-4 panel p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-strong">How It Works</h2>
          <ol className="mt-3 space-y-2">
            {page.steps.map((step, index) => (
              <li
                key={step}
                className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text"
              >
                <span className="mr-2 font-semibold text-text-strong">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {page.comparison ? (
          <section className="mt-4 panel overflow-hidden p-0">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-text-strong">Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-surface text-text-strong">
                  <tr>
                    {page.comparison.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparison.rows.map((row) => (
                    <tr key={row.join("|")} className="border-t border-border">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3 text-text">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-4 panel p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-strong">FAQ</h2>
          <div className="mt-3 space-y-2">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="rounded-md border border-border bg-surface p-4">
                <summary className="cursor-pointer text-sm font-semibold text-text-strong">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-7 text-text">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-4 panel p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-strong">Route Target Keywords</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.map((entry) => (
              <span key={entry.keyword} className="pill-btn px-3 py-1 text-xs">
                {entry.keyword}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-4 panel p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-strong">Related Pages</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {page.internalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-hover"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(page)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema(page)) }}
        />
      </main>
    </MarketingShell>
  );
}
