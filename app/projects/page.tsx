import type { Metadata } from "next"
import Link from "next/link"
import { getAllProjects } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Projects | sixeleven",
  description: "Projects and work",
  alternates: { canonical: "/projects" },
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  if (projects.length === 0) {
    return (
      <div>
        <h1 className="display text-[2.5rem] md:text-[3.25rem] mb-12">Projects</h1>
        <p className="text-[var(--ink-2)]">No projects.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="display text-[2.5rem] md:text-[3.25rem] mb-12">Projects</h1>

      <div className="space-y-12">
        {projects.map((project) => (
          <article key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <h2 className="text-[1.3125rem] leading-[1.3] mb-2 decoration-1 underline-offset-[0.22em] decoration-[color-mix(in_oklch,var(--link)_45%,transparent)] group-hover:underline">
                {project.title}
              </h2>
              <p className="text-[var(--ink-2)] mb-2">{project.excerpt}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
