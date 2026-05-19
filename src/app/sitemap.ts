import type { MetadataRoute } from "next";
import { seoPages } from "@/lib/seo/content-map";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://mirrorfit-ai.vercel.app";
  const now = new Date();

  const staticRoutes = [
    "/",
    "/pricing",
    "/features",
    "/how-it-works",
    "/model-library",
    "/compare",
    "/swimwear",
    "/ethnicwear",
    "/batch",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...seoPages.map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}

