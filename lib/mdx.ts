import fs from "fs"
import path from "path"
import matter from "gray-matter"

// Types
export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime?: string
  tags?: string[]
  link?: string
}

export interface Project {
  slug: string
  title: string
  excerpt: string
  content: string
  technologies?: string[]
  link?: string
}

// TOC heading type
export interface TOCItem {
  id: string
  text: string
  level: number
}

// Parse headings from markdown content for table of contents
export function parseHeadings(content: string): TOCItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    headings.push({ id, text, level })
  }

  return headings
}

// Get the app directory path
function getAppDirectory(): string {
  return process.cwd()
}

// Helper to read MDX files
function readMDXFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }

    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

// Parse frontmatter and content from MDX
function parseMDX(source: string, slug: string) {
  try {
    const { data, content } = matter(source)

    return {
      slug,
      content,
      ...data,
    }
  } catch {
    return null
  }
}

// Check if directory exists
function directoryExists(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  } catch {
    return false
  }
}

// Get all blog posts
export async function getAllPosts(): Promise<Post[]> {
  const appDir = getAppDirectory()
  const postsDirectory = path.join(appDir, "content/posts")

  try {
    if (!directoryExists(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)

    if (fileNames.length === 0) {
      return []
    }

    const posts = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "")
        const filePath = path.join(postsDirectory, fileName)
        const source = readMDXFile(filePath)

        if (!source) return null

        const post = parseMDX(source, slug)
        return post as Post
      })
      .filter((post): post is Post => post !== null)

    // Sort by date
    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  } catch {
    return []
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/posts", `${slug}.mdx`)

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      return null
    }

    const post = parseMDX(source, slug)
    return post as Post
  } catch {
    return null
  }
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  const appDir = getAppDirectory()
  const projectsDirectory = path.join(appDir, "content/projects")

  try {
    if (!directoryExists(projectsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)

    if (fileNames.length === 0) {
      return []
    }

    const projects = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "")
        const filePath = path.join(projectsDirectory, fileName)
        const source = readMDXFile(filePath)

        if (!source) return null

        const project = parseMDX(source, slug)
        return project as Project
      })
      .filter((project): project is Project => project !== null)

    return projects
  } catch {
    return []
  }
}

// Get a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/projects", `${slug}.mdx`)

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      return null
    }

    const project = parseMDX(source, slug)
    return project as Project
  } catch {
    return null
  }
}

// Get about page content
export async function getAboutContent(): Promise<{ content: string } | null> {
  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/about.mdx")

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      return { content: "" }
    }

    const { content } = matter(source)
    return { content }
  } catch {
    return { content: "" }
  }
}
