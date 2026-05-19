import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/ai-fashion-photography");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function AIFashionPhotographyPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="ai_fashion_photography" />;
}

