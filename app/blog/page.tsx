import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "blog | sixeleven",
  description: "all blog posts",
  openGraph: {
    title: "blog | sixeleven",
    description: "all blog posts",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"}/blog`,
    siteName: "sixeleven",
  },
  twitter: {
    card: "summary",
    title: "blog | sixeleven",
    description: "all blog posts",
    creator: "Rishit Vora",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"}/blog`,
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">blog</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            no posts found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">blog</h1>

      <div className="space-y-16">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group no-underline hover:no-underline">
              {/* Date and reading time - uppercase meta */}
              <div className="uppercase-meta text-[var(--foreground-subtle)] mb-2">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  }).toLowerCase()}
                </time>
                {post.readingTime && <span> · {post.readingTime} min</span>}
              </div>

              {/* Title - lowercase, orange on hover with underline */}
              <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight lowercase text-[var(--foreground)] group-hover:text-[var(--braun-orange)] group-hover:underline group-hover:underline-offset-4 transition-colors mb-3">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-[var(--foreground-muted)] mb-3">
                {post.excerpt}
              </p>

              {/* Tags - plain text, lowercase */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
