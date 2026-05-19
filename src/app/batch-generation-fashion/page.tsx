import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/batch-generation-fashion");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function BatchGenerationFashionPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="batch_generation" />;
}

