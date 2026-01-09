import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjects } from "@/lib/mdx"
import ReadingProgressBar from "@/components/ReadingProgressBar"
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
      title: "project not found | sixeleven",
      description: "the requested project could not be found.",
    }
  }

  return {
    title: `${project.title.toLowerCase()} | sixeleven`,
    description: project.excerpt,
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
      <ReadingProgressBar />

      <header className="mb-10">
        {/* Title - project content uses normal case for readability */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          {project.title}
        </h1>

        {/* Technologies - plain text tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
            {project.technologies.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* External link - orange */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--braun-orange)] hover:underline lowercase"
          >
            view project
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
