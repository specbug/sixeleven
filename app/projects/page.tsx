import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Link from "next/link"
import { getAllProjects } from "@/lib/mdx"

export const metadata: Metadata = pageMetadata({
  title: "Projects | sixeleven",
  description: "Projects by Rishit Vora.",
  path: "/projects",
})

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  if (projects.length === 0) {
    return (
      <div>
        <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.015em] mb-12">Projects</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            No projects found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.015em] mb-12">Projects</h1>

      <div className="space-y-12">
        {projects.map((project) => (
          <article key={project.slug}>
            {/* Title - orange on hover */}
            <h2 className="text-[1.5rem] md:text-[1.625rem] leading-[1.2] font-semibold tracking-[-0.01em] mb-3">
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
              className="text-sm text-[var(--braun-orange)] hover:underline"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
