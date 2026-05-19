import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/indian-fashion-ai-catalogue");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function IndianFashionAICataloguePage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="indian_fashion" />;
}

