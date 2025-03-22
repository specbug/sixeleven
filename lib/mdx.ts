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
}

export interface Project {
  slug: string
  title: string
  excerpt: string
  content: string
  technologies?: string[]
  link?: string
}

// Get the app directory path
function getAppDirectory(): string {
  const appDir = process.cwd()
  console.log("Current working directory:", appDir)
  return appDir
}

// Helper to read MDX files
function readMDXFile(filePath: string) {
  try {
    console.log("Attempting to read file:", filePath)

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      return null
    }

    const rawContent = fs.readFileSync(filePath, "utf-8")
    console.log(`Successfully read file: ${filePath}`)
    return rawContent
  } catch (error) {
    console.error(`Error reading MDX file at ${filePath}:`, error)
    return null
  }
}

// Parse frontmatter and content from MDX
function parseMDX(source: string, slug: string) {
  try {
    // Use gray-matter to parse the frontmatter
    const { data, content } = matter(source)

    return {
      slug,
      content,
      ...data,
    }
  } catch (error) {
    console.error(`Error parsing MDX for ${slug}:`, error)
    return null
  }
}

// Check if directory exists
function directoryExists(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  } catch (error) {
    console.error(`Error checking if directory exists at ${dirPath}:`, error)
    return false
  }
}

// Try to check what directories and files exist in the content directory
function logContentDirectoryStructure() {
  try {
    const appDir = getAppDirectory()
    const contentDir = path.join(appDir, "content")

    console.log("Checking content directory structure...")

    if (!fs.existsSync(contentDir)) {
      console.log("Content directory does not exist:", contentDir)
      return
    }

    console.log("Content directory exists:", contentDir)

    const items = fs.readdirSync(contentDir)
    console.log("Items in content directory:", items)

    // Check posts directory
    const postsDir = path.join(contentDir, "posts")
    if (fs.existsSync(postsDir)) {
      console.log("Posts directory exists:", postsDir)
      const posts = fs.readdirSync(postsDir)
      console.log("Posts:", posts)
    } else {
      console.log("Posts directory does not exist:", postsDir)
    }

    // Check projects directory
    const projectsDir = path.join(contentDir, "projects")
    if (fs.existsSync(projectsDir)) {
      console.log("Projects directory exists:", projectsDir)
      const projects = fs.readdirSync(projectsDir)
      console.log("Projects:", projects)
    } else {
      console.log("Projects directory does not exist:", projectsDir)
    }

    // Check about.mdx
    const aboutFile = path.join(contentDir, "about.mdx")
    if (fs.existsSync(aboutFile)) {
      console.log("About file exists:", aboutFile)
    } else {
      console.log("About file does not exist:", aboutFile)
    }
  } catch (error) {
    console.error("Error logging content directory structure:", error)
  }
}

// Get all blog posts
export async function getAllPosts(): Promise<Post[]> {
  console.log("getAllPosts called")
  logContentDirectoryStructure()

  const appDir = getAppDirectory()
  const postsDirectory = path.join(appDir, "content/posts")

  console.log("Posts directory:", postsDirectory)

  try {
    // If the directory doesn't exist, return empty array
    if (!directoryExists(postsDirectory)) {
      console.log("Posts directory doesn't exist, returning empty array")
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)

    if (fileNames.length === 0) {
      console.log("No files found in posts directory, returning empty array")
      return []
    }

    console.log("Files in posts directory:", fileNames)

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
  } catch (error) {
    console.error("Error getting all posts:", error)
    return []
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log(`getPostBySlug called for slug: ${slug}`)

  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/posts", `${slug}.mdx`)

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      console.log(`Post file not found for ${slug}`)
      return null
    }

    const post = parseMDX(source, slug)
    return post as Post
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return null
  }
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  console.log("getAllProjects called")

  const appDir = getAppDirectory()
  const projectsDirectory = path.join(appDir, "content/projects")

  console.log("Projects directory:", projectsDirectory)

  try {
    // If the directory doesn't exist, return empty array
    if (!directoryExists(projectsDirectory)) {
      console.log("Projects directory doesn't exist, returning empty array")
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)

    if (fileNames.length === 0) {
      console.log("No files found in projects directory, returning empty array")
      return []
    }

    console.log("Files in projects directory:", fileNames)

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
  } catch (error) {
    console.error("Error getting all projects:", error)
    return []
  }
}

// Get a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  console.log(`getProjectBySlug called for slug: ${slug}`)

  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/projects", `${slug}.mdx`)

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      console.log(`Project file not found for ${slug}`)
      return null
    }

    const project = parseMDX(source, slug)
    return project as Project
  } catch (error) {
    console.error(`Error getting project by slug ${slug}:`, error)
    return null
  }
}

// Get about page content
export async function getAboutContent(): Promise<{ content: string } | null> {
  console.log("getAboutContent called")

  const appDir = getAppDirectory()
  const filePath = path.join(appDir, "content/about.mdx")

  console.log("About file path:", filePath)

  try {
    const source = readMDXFile(filePath)
    if (!source) {
      console.log("About file not found")
      return { content: "" }
    }

    const { content } = matter(source)
    return { content }
  } catch (error) {
    console.error("Error getting about content:", error)
    return { content: "" }
  }
}

