import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjects } from "@/lib/mdx"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import { penFor } from "@/lib/pencil"
import { smartQuotes } from "@/lib/typography"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const project = await getProjectBySlug(resolvedParams.slug)

  if (!project) {
    return {
      title: "Project not found | sixeleven",
      description: "The requested project could not be found.",
    }
  }

  return {
    title: `${project.title} | sixeleven`,
    description: project.excerpt,
    alternates: { canonical: `/projects/${project.slug}` },
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const project = await getProjectBySlug(resolvedParams.slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="relative">
      <header className="mb-10">
        <h1 className="title text-[clamp(2rem,9vw,2.375rem)] sm:text-[2.75rem] md:text-[3.25rem] [overflow-wrap:break-word] mb-4">{smartQuotes(project.title)}</h1>

        {project.technologies && project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
            {project.technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="pen" data-pen={penFor(project.link)}>
            View project
          </a>
        )}
      </header>

      <div className="break-words">
        <EnhancedMarkdown content={project.content} />
      </div>
    </article>
  )
}
