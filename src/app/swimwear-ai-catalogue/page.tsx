import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/swimwear-ai-catalogue");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function SwimwearAICataloguePage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="swimwear" />;
}

