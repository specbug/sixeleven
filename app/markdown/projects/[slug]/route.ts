import { getAllProjects, getProjectBySlug } from "@/lib/mdx"
import { frontmatter, markdownResponse, postMarkdown } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getAllProjects()).map((project) => ({ slug: project.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return new Response("Not found", { status: 404 })
  const url = `${SITE_URL}/projects/${project.slug}`
  return markdownResponse(frontmatter({
    title: project.title,
    description: project.excerpt,
    url,
    technologies: project.technologies,
    link: project.link,
  }) + `# ${project.title}\n\n` + postMarkdown(project.content, url), url)
}
