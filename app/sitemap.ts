import type { MetadataRoute } from "next"
import { getAllPosts, getAllProjects } from "@/lib/mdx"
import { SITE_URL } from "@/lib/seo"

// lastModified carries real dates: a post's publish date, and for the indexes the
// newest post. Pages without a meaningful date omit it rather than claiming they
// changed on every build, which teaches crawlers to ignore the field.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const projects = await getAllProjects()
  const newest = posts.length ? new Date(posts[0].date) : undefined

  return [
    { url: SITE_URL, lastModified: newest },
    { url: `${SITE_URL}/blog`, lastModified: newest },
    { url: `${SITE_URL}/archive`, lastModified: newest },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/projects` },
    { url: `${SITE_URL}/pnd` },
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.date) })),
    ...projects.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
  ]
}
