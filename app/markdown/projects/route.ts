import { getAllProjects } from "@/lib/mdx"
import { frontmatter, markdownResponse } from "@/lib/portable"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

export async function GET() {
  const projects = await getAllProjects()
  const url = `${SITE_URL}/projects`
  const body = frontmatter({ title: "Projects | sixeleven", url }) + "# Projects\n\n" + projects.map((project) =>
    `## [${project.title}](${SITE_URL}/projects/${project.slug})\n\n${project.excerpt}\n\n${project.technologies?.join(", ") ?? ""}`,
  ).join("\n\n") + "\n"
  return markdownResponse(body, url)
}
