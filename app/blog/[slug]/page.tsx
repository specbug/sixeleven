import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/mdx"
import TableOfContents from "@/components/TableOfContents"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import BlogPostSchema from "@/components/blog-schema"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // Await params before accessing its properties
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostBySlug(resolvedParams.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  if (!post) {
    return {
      title: "Post Not Found | sixeleven",
      description: "The requested post could not be found.",
    }
  }

  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`

  return {
    title: `${post.title} | sixeleven`,
    description: post.excerpt,
    authors: [{ name: "Rishit Vora" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: "sixeleven",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
      creator: "Rishit Vora",
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await params before accessing its properties
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // Make sure the date is in ISO format for schema
  const isoDate = new Date(post.date).toISOString()

  return (
    <>
      {/* Place the schema at the top level */}
      <BlogPostSchema title={post.title} excerpt={post.excerpt} date={isoDate} slug={post.slug} />
      <article className="max-w-none relative">
        <ReadingProgressBar />

        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-2 font-sans">
            {post.title}
          </h1>
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

        {/* Render content with EnhancedMarkdown */}
        <div className="prose dark:prose-invert max-w-none">
          <EnhancedMarkdown content={post.content} />
        </div>
      </article>
    </>
  )
}
