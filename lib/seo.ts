import type { Metadata } from "next"

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

// Metadata for a top-level page. Each page names its own canonical URL; Next
// replaces (not merges) top-level metadata keys, so the Open Graph and Twitter
// blocks are spelled out in full here rather than inherited from the layout.
// `markdown` names the page's plain-markdown twin, advertised for agents.
export function pageMetadata({
  title,
  description,
  path,
  markdown,
}: {
  title: string
  description: string
  path: string
  markdown?: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, ...(markdown ? { types: { "text/markdown": markdown } } : {}) },
    openGraph: { title, description, url: path, type: "website", locale: "en_US", siteName: "sixeleven" },
    twitter: { card: "summary", title, description, creator: "Rishit Vora" },
  }
}
