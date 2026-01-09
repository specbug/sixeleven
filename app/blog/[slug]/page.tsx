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
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostBySlug(resolvedParams.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  if (!post) {
    return {
      title: "post not found | sixeleven",
      description: "the requested post could not be found.",
    }
  }

  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`

  return {
    title: `${post.title.toLowerCase()} | sixeleven`,
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
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const isoDate = new Date(post.date).toISOString()

  return (
    <>
      <BlogPostSchema title={post.title} excerpt={post.excerpt} date={isoDate} slug={post.slug} />
      <article className="max-w-none relative">
        <ReadingProgressBar />

        <header className="mb-10">
          {/* Date and reading time - uppercase meta */}
          <div className="uppercase-meta text-[var(--foreground-subtle)] mb-3">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).toLowerCase()}
            </time>
            {post.readingTime && <span> · {post.readingTime} min read</span>}
          </div>

          {/* Title - lowercase for Rams aesthetic */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 lowercase">
            {post.title}
          </h1>

          {/* Tags - plain text, lowercase */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {post.tags.map((tag: string) => (
                <span key={tag} className="tag">
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

        {/* Article content */}
        <div className="prose dark:prose-invert max-w-none">
          <EnhancedMarkdown content={post.content} />
        </div>
      </article>
    </>
  )
}
