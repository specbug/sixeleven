import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export const metadata: Metadata = pageMetadata({
  title: "Blog | sixeleven",
  description: "Every post on sixeleven, newest first.",
  path: "/blog",
})

export default async function BlogPage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.015em] mb-12">Blog</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            No posts found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.015em] mb-12">Blog</h1>

      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={post.link || `/blog/${post.slug}`} className="block group no-underline hover:no-underline">
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

              {/* Title - orange on hover with underline */}
              <h2 className="text-[1.5rem] md:text-[1.625rem] leading-[1.2] font-semibold tracking-[-0.01em] text-[var(--foreground)] group-hover:text-[var(--braun-orange)] group-hover:underline group-hover:underline-offset-4 transition-colors mb-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-[var(--foreground-muted)] mb-2">
                {post.excerpt}
              </p>

              {/* Tags - plain text, lowercase like identifiers */}
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
