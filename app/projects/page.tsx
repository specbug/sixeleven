import type { Metadata } from "next"
import Link from "next/link"
import { getAllProjects } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "projects | sixeleven",
  description: "my projects and work",
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  if (projects.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">projects</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            no projects found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">projects</h1>

      <div className="space-y-16">
        {projects.map((project) => (
          <article key={project.slug}>
            {/* Title - lowercase, orange on hover */}
            <h2 className="text-2xl font-semibold tracking-tight lowercase mb-3">
              <Link
                href={`/projects/${project.slug}`}
                className="text-[var(--foreground)] hover:text-[var(--braun-orange)] transition-colors"
              >
                {project.title}
              </Link>
            </h2>

            {/* Description */}
            <p className="text-[var(--foreground-muted)] mb-4">
              {project.excerpt}
            </p>

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

            {/* Read more link - orange */}
            <Link
              href={`/projects/${project.slug}`}
              className="text-sm text-[var(--braun-orange)] hover:underline lowercase"
            >
              read more
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
