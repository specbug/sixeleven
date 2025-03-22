import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/mdx"
import TableOfContents from "@/components/TableOfContents"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mdxComponents from "@/components/mdx-components"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | sixeleven",
      description: "The requested post could not be found.",
    }
  }

  return {
    title: `${post.title} | sixeleven`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-none relative">
      <ReadingProgressBar />

      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-2">{post.title}</h1>
        <div className="article-meta">
          <time dateTime={post.date}>{post.date}</time>
          {post.readingTime && <span className="reading-time"> · {post.readingTime} min read</span>}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Table of Contents */}
      <div className="md:block">
        <TableOfContents content={post.content} />
      </div>

      {/* Render content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}

