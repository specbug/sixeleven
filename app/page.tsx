import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export default async function Home() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--foreground-muted)] mb-6">
          No posts found.
        </p>
        <Link
          href="/about"
          className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
        >
          About
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12">
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
            <h2 className="text-[1.5rem] md:text-[1.625rem] leading-[1.2] font-semibold tracking-[-0.01em] text-[var(--foreground)] group-hover:text-[var(--braun-orange)] group-hover:underline group-hover:underline-offset-4 transition-colors mb-3">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-[var(--foreground-muted)] mb-3">
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
  )
}
