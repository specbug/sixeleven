import { getAboutContent } from "@/lib/mdx"
import { frontmatter, markdownResponse, postMarkdown } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

// /about as markdown; middleware routes `Accept: text/markdown` and /about.md here
export const dynamic = "force-static"

export async function GET() {
  const about = await getAboutContent()
  const url = `${SITE_URL}/about`
  const body =
    frontmatter({ title: "About Rishit Vora", url, author: "Rishit Vora" }) +
    "# About Rishit Vora\n\n" +
    postMarkdown(about?.content ?? "", SITE_URL)
  return markdownResponse(body, url)
}
