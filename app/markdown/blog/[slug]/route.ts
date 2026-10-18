import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { frontmatter, markdownResponse, postMarkdown } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

// A post as markdown; middleware routes `Accept: text/markdown` and /blog/<slug>.md
// here. Built for every post at build time; any other slug is a 404.
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return new Response("Not found", { status: 404 })

  const url = `${SITE_URL}/blog/${post.slug}`
  const body =
    frontmatter({
      title: post.title,
      description: post.excerpt,
      date: new Date(post.date).toISOString().slice(0, 10),
      author: "Rishit Vora",
      tags: post.tags?.map((tag) => tag.trim()),
      url,
      image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
      readingTime: post.readingTime ? `${post.readingTime} min` : undefined,
    }) +
    `# ${post.title}\n\n` +
    postMarkdown(post.content, SITE_URL)
  return markdownResponse(body, url)
}
