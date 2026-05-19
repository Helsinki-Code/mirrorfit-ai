import { notFound } from "next/navigation";
import { SeoContentPage, metadataFromSeoPage } from "@/components/marketing/SeoContentPage";
import { pageBySlug } from "@/lib/seo/content-map";

const page = pageBySlug("/model-identity-lock");

export const metadata = page ? metadataFromSeoPage(page) : {};

export default function ModelIdentityLockPage() {
  if (!page) notFound();
  return <SeoContentPage page={page} routeId="model_identity" />;
}

