import { siteIndex } from "@/lib/site-index"
import { markdownResponse } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

// The homepage as markdown; middleware routes `Accept: text/markdown` here
export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(await siteIndex(), SITE_URL)
}
