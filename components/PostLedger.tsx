import Link from "next/link"
import type { Post } from "@/lib/mdx"

const href = (post: Post) => post.link || `/blog/${post.slug}`

const monthYear = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

// One row per post: title left, date right, hairline between. The whole list reads
// at a glance; excerpts and tags live in the archive.
export function PostLedger({ posts }: { posts: Post[] }) {
  return (
    <ul className="border-t border-[var(--border)]">
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-[var(--border)]">
          <Link
            href={href(post)}
            className="group flex items-baseline justify-between gap-6 py-4 no-underline hover:no-underline"
          >
            <span className="text-[1.125rem] md:text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.008em] text-[var(--foreground)] group-hover:text-[var(--braun-orange)] transition-colors">
              {post.title}
            </span>
            <time dateTime={post.date} className="uppercase-meta shrink-0 text-[var(--foreground-subtle)]">
              {monthYear(post.date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  )
}

// The newest post, given room: title at display size and its excerpt as a lede
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="mb-12">
      <Link href={href(post)} className="group block no-underline hover:no-underline">
        <div className="uppercase-meta text-[var(--foreground-subtle)] mb-3">
          Latest · <time dateTime={post.date}>{monthYear(post.date)}</time>
          {post.readingTime && <span> · {post.readingTime} min</span>}
        </div>
        <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-bold tracking-[-0.012em] text-[var(--foreground)] group-hover:text-[var(--braun-orange)] transition-colors mb-3">
          {post.title}
        </h2>
        <p className="text-[1.1875rem] md:text-[1.3125rem] leading-[1.45] text-[var(--foreground-muted)]">
          {post.excerpt}
        </p>
      </Link>
    </article>
  )
}
