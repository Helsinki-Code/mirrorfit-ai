import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/fashion-photoshoot-cost-india");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function FashionPhotoshootCostIndiaPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="cost_roi" />;
}

