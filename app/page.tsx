import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export default async function Home() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--foreground-muted)] mb-6">
          no posts found.
        </p>
        <Link
          href="/about"
          className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors lowercase"
        >
          about
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="block group">
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

            {/* Title - lowercase, orange on hover */}
            <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight lowercase text-[var(--foreground)] group-hover:text-[var(--braun-orange)] transition-colors mb-3">
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
  )
}
