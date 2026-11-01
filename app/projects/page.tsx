import type { Metadata } from "next"
import Link from "next/link"
import { penFor } from "@/lib/pencil"
import { smartQuotes } from "@/lib/typography"
import { getAllProjects } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Projects | sixeleven",
  description: "Projects and work",
  alternates: { canonical: "/projects" },
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div>
      <h1 className="title text-[2.5rem] md:text-[3.25rem] mb-12">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-[var(--ink-2)]">No projects.</p>
      ) : (
        <div className="space-y-12">
          {projects.map((project) => {
            const href = `/projects/${project.slug}`
            return (
              <article key={project.slug}>
                {/* The whole entry is the link, as in the post lists */}
                <Link href={href} className="pen-block block" data-pen={penFor(href)}>
                  <h2 className="font-display text-[1.5rem] md:text-[1.625rem] leading-[1.18] font-[500] tracking-[-0.008em] [font-variation-settings:'opsz'_36] mb-2">
                    <span className="pen-title">{smartQuotes(project.title)}</span>
                  </h2>
                  <p className="text-[var(--ink-2)] mb-2">{smartQuotes(project.excerpt)}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1">
                      {project.technologies.map((tech) => (
                        <li key={tech} className="tag">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
