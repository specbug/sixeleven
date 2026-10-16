import Link from "next/link"
import type { Post } from "@/lib/mdx"

const href = (post: Post) => post.link || `/blog/${post.slug}`

const monthYear = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

// An index, grouped by year: the year sits once in a narrow left column, titles run
// beside it at reading weight, and hairlines fall only between years. Date and title
// stay a glance apart; excerpts and tags live in the archive.
export function PostLedger({ posts }: { posts: Post[] }) {
  const years: [string, Post[]][] = []
  for (const post of posts) {
    const year = String(new Date(post.date).getFullYear())
    const last = years[years.length - 1]
    if (last && last[0] === year) last[1].push(post)
    else years.push([year, [post]])
  }

  return (
    <div className="border-y border-[var(--border)] divide-y divide-[var(--border)]">
      {years.map(([year, items]) => (
        <section key={year} className="grid grid-cols-[4rem_1fr] md:grid-cols-[5.5rem_1fr] items-baseline py-5">
          <h3 className="uppercase-meta font-normal text-[var(--foreground-subtle)]">{year}</h3>
          <ul className="space-y-2.5">
            {items.map((post) => (
              <li key={post.slug}>
                <Link
                  href={href(post)}
                  className="text-[1.0625rem] md:text-[1.125rem] leading-[1.35] font-medium text-[var(--foreground)] hover:text-[var(--braun-orange)] no-underline hover:no-underline transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
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
