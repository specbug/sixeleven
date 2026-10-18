import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og"],
      // /api/og stays open so link-preview crawlers can fetch post cards. /_next/
      // is not blocked: search engines need its CSS and JS to render pages.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
