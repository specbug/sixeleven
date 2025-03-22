import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjects } from "@/lib/mdx"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mdxComponents from "@/components/mdx-components"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Project Not Found | sixeleven",
      description: "The requested project could not be found.",
    }
  }

  return {
    title: `${project.title} | sixeleven`,
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
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="max-w-none relative">
      <ReadingProgressBar />

      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-2">
          {project.title}
        </h1>

        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.link && (
          <div className="mt-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
            >
              View Project →
            </a>
          </div>
        )}
      </header>

      {/* Render content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
          {project.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}

