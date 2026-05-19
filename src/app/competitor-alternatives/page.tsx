import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/competitor-alternatives");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function CompetitorAlternativesPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="competitor_alternatives" />;
}

