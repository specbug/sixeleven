import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjects } from "@/lib/mdx"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"

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
    <article className="max-w-none relative">
      <header className="mb-10">
        <h1 className="display text-[2.5rem] sm:text-[2.875rem] md:text-[3.25rem] mb-4">{project.title}</h1>


        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
            {project.technologies.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="link">
            View project
          </a>
        )}
      </header>

      {/* Project content */}
      <div className="prose dark:prose-invert max-w-none">
        <EnhancedMarkdown content={project.content} />
      </div>
    </article>
  )
}
