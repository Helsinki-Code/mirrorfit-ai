import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/ai-virtual-try-on-for-ecommerce");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function AIVirtualTryOnForEcommercePage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="ai_virtual_try_on" />;
}

