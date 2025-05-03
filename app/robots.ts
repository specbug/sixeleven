import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  // Get your base URL from environment variable or hardcode it for local development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
