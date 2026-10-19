import { frontmatter, markdownResponse } from "@/lib/portable"
import { siteIndex } from "@/lib/site-index"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(frontmatter({ title: "sixeleven", url: SITE_URL }) + await siteIndex(), SITE_URL)
}
