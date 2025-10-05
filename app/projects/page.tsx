import type { Metadata } from "next"
import Link from "next/link"
import { getAllProjects } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Projects | sixeleven",
  description: "My projects and work",
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  if (projects.length === 0) {
    return (
      <div>
        <h1 className="text-4xl md:text-5xl font-medium mb-10 font-styrene" style={{ letterSpacing: "-0.045em", lineHeight: "1.15" }}>Projects</h1>
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No projects found. Please add MDX files to the content/projects directory.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-medium mb-10 font-styrene" style={{ letterSpacing: "-0.045em", lineHeight: "1.15" }}>Projects</h1>

      <div className="space-y-10">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className={`${index !== projects.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""} pb-10`}
          >
            <h2 className="text-2xl md:text-3xl font-medium mb-2 font-styrene" style={{ letterSpacing: "-0.04em" }}>{project.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">{project.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies?.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {tech}
                </span>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="text-accent hover:text-accent/80 border-b border-accent/20 hover:border-accent/60 transition-colors"
            >
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

