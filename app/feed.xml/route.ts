import { getAllPosts } from "@/lib/mdx"
import { escapeXml, postHtml } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

// RSS 2.0 with each post's full text, generated at build time
export const dynamic = "force-static"

export async function GET() {
  const posts = await getAllPosts()

  const items = posts
    .map((post) => {
      const url = post.link || `${SITE_URL}/blog/${post.slug}`
      const html = postHtml(post.content, `${SITE_URL}/blog/${post.slug}`).replace(/]]>/g, "]]]]><![CDATA[>")
      const categories = (post.tags ?? []).map((tag) => `      <category>${escapeXml(tag.trim())}</category>`).join("\n")
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>Rishit Vora</dc:creator>
      <description>${escapeXml(post.excerpt ?? "")}</description>
${categories}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>sixeleven</title>
    <link>${SITE_URL}</link>
    <description>Personal blog of Rishit Vora.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.length ? `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
