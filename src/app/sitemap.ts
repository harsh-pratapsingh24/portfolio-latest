import type { MetadataRoute } from "next";

// TODO: replace with the deployed canonical site URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return [{ url: baseUrl, lastModified: new Date() }];
}
