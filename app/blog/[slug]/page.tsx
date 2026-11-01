import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, parseHeadings } from "@/lib/mdx"
import TableOfContents from "@/components/TableOfContents"
import Rule from "@/components/Rule"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import BlogPostSchema from "@/components/blog-schema"
import PostCover from "@/components/PostCover"
import { fullDate, smartQuotes } from "@/lib/typography"

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
      <article className="relative">
        <Rule headings={headings} readingTime={post.readingTime ? Number.parseInt(post.readingTime, 10) : undefined} />

        <header className="mb-10">
          <p className="meta mb-4">
            <time dateTime={post.date}>{fullDate(post.date)}</time>
            {post.readingTime && <> · {post.readingTime}&nbsp;min read</>}
          </p>

          {/* Title Case, as authored */}
          <h1 className="title text-[clamp(2rem,9vw,2.375rem)] sm:text-[2.75rem] md:text-[3.25rem] [overflow-wrap:break-word] mb-4">{smartQuotes(post.title)}</h1>

          {/* The excerpt as a lede, so the post opens with what it is about */}
          {post.excerpt && (
            <p className="text-[1.1875rem] md:text-[1.3125rem] leading-[1.45] text-[var(--ink-2)]">{smartQuotes(post.excerpt)}</p>
          )}
        </header>

        {/* The cover: the post's first figure, on the same plate as the rest */}
        {post.cover && <PostCover src={post.cover} alt={post.coverAlt} credit={post.coverCredit} />}

        <div className="xl:hidden">
          <TableOfContents headings={headings} />
        </div>

        <div data-post-body className="relative break-words">
          <EnhancedMarkdown content={post.content} />
        </div>
      </article>
    </>
  )
}
