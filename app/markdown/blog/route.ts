import { postIndex } from "@/lib/site-index"
import { markdownResponse } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(await postIndex("Blog", "/blog"), `${SITE_URL}/blog`)
}
