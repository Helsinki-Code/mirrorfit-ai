import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/mirrorfit-ai-review");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function MirrorFitAIReviewPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="brand_review" />;
}

