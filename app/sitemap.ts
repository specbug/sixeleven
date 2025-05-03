import type { MetadataRoute } from "next"
import { getAllPosts, getAllProjects } from "@/lib/mdx"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get your base URL from environment variable or hardcode it for local development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  // Get all blog posts
  const posts = await getAllPosts()
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Get all projects
  const projects = await getAllProjects()
  const projectEntries = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Define static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  // Combine all entries
  return [...staticPages, ...postEntries, ...projectEntries]
}