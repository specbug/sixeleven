import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, parseHeadings } from "@/lib/mdx"
import TableOfContents from "@/components/TableOfContents"
import Rule from "@/components/Rule"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import BlogPostSchema from "@/components/blog-schema"
import PostCover from "@/components/PostCover"

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
    title: `${post.seoTitle || post.title} | sixeleven`,
    description: post.seoDescription || post.excerpt,
    authors: [{ name: "Rishit Vora" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
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
      />
      <article className="max-w-none relative">
        <header className="mb-8">
          <div className="meta mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {post.readingTime && <span> · {post.readingTime}&nbsp;min read</span>}
          </div>

          {/* Title as authored in frontmatter */}
          <h1 className="display text-[2.5rem] sm:text-[2.875rem] md:text-[3.25rem] mb-4">{post.title}</h1>

          {/* Lede: the excerpt, so the post opens with what it is about */}
          {post.excerpt && (
            <p className="text-[1.25rem] md:text-[1.375rem] leading-[1.42] text-[var(--ink-2)] mb-4">{post.excerpt}</p>
          )}

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

        {/* Contents: a toggle in the column; on wide screens, the Rule in the margin */}
        <div className="xl:hidden">
          <TableOfContents headings={headings} />
        </div>

        <div className="relative">
          <Rule headings={headings} readingTime={post.readingTime ? Number.parseInt(post.readingTime, 10) : undefined} />

          {/* Article content: long URLs and identifiers wrap instead of overflowing on phones */}
          <div className="max-w-none break-words">
            <EnhancedMarkdown content={post.content} />
          </div>
        </div>
      </article>
    </>
  )
}
