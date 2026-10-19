import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, parseHeadings } from "@/lib/mdx"
import TableOfContents, { TocRail } from "@/components/TableOfContents"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import BlogPostSchema from "@/components/blog-schema"
import PostCover from "@/components/PostCover"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostBySlug(resolvedParams.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  if (!post) {
    return {
      title: "Post not found | sixeleven",
      description: "The requested post could not be found.",
    }
  }

  // A post with a cover shares it with link previews; otherwise the title card
  const ogImageUrl = post.cover
    ? `${baseUrl}${post.cover}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`
  const ogImageSize = post.cover ? { width: 1920, height: 1080 } : { width: 1200, height: 630 }

  return {
    title: `${post.title} | sixeleven`,
    description: post.excerpt,
    authors: [{ name: "Rishit Vora" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      // ISO 8601; frontmatter dates read "October 18, 2026"
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Rishit Vora"],
      tags: post.tags?.map((tag) => tag.trim()),
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          ...ogImageSize,
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
      creator: "@irishvora",
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
      // The post as plain markdown, for agents
      types: { "text/markdown": `${baseUrl}/blog/${post.slug}.md` },
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
  const headings = parseHeadings(post.content)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

  return (
    <>
      <BlogPostSchema
        title={post.title}
        excerpt={post.excerpt}
        date={isoDate}
        slug={post.slug}
        image={post.cover ? `${baseUrl}${post.cover}` : undefined}
        tags={post.tags}
        wordCount={post.content.split(/\s+/).filter(Boolean).length}
      />
      <article className="max-w-none relative">
        <ReadingProgressBar />

        <header className="mb-8">
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

          {/* Title - Title Case, as authored in frontmatter */}
          <h1 className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.015em] mb-4">
            {post.title}
          </h1>

          {/* Lede - the excerpt, so the post opens with what it is about */}
          {post.excerpt && (
            <p className="text-[1.1875rem] md:text-[1.3125rem] leading-[1.45] text-[var(--foreground-muted)] mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Tags - plain text, lowercase like identifiers */}
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

        {/* Cover - sits between the title block and the text, on the same plate as
            the post's figures, with its credit beneath */}
        {post.cover && <PostCover src={post.cover} alt={post.coverAlt} credit={post.coverCredit} />}

        {/* Contents - a toggle in the column; on wide screens, a sticky rail in the margin */}
        <div className="xl:hidden">
          <TableOfContents headings={headings} />
        </div>

        <div className="relative">
          <TocRail headings={headings} />

          {/* Article content - inherits the 17px/1.6 body; long URLs and identifiers
              wrap instead of overflowing on phones */}
          <div className="max-w-none break-words">
            <EnhancedMarkdown content={post.content} />
          </div>
        </div>
      </article>
    </>
  )
}
