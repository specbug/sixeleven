import Link from "next/link"
import type { ReactNode } from "react"
import { penFor } from "@/lib/pencil"
import { monthYear, smartQuotes } from "@/lib/typography"

interface PostListItemProps {
  post: {
    slug: string
    title: string
    date: string
    excerpt?: string
    readingTime?: string
    tags?: string[]
    link?: string
  }
  // Replaces the plain tag list where tags are controls (the archive's filters)
  tags?: ReactNode
}

// One entry in a list of posts: date and length, title, excerpt, tags. The whole entry is
// the link. A list where every title is a link gains nothing from a stroke under each, so
// the red pencil appears under the title on hover, at the point of intent.
export function PostListItem({ post, tags }: PostListItemProps) {
  const href = post.link || `/blog/${post.slug}`

  return (
    <article>
      <Link href={href} className="pen-block group block" data-pen={penFor(href)}>
        <p className="meta mb-2">
          <time dateTime={post.date}>{monthYear(post.date)}</time>
          {post.readingTime && <> · {post.readingTime}&nbsp;min</>}
        </p>
        <h2 className="font-display text-[1.5rem] md:text-[1.625rem] leading-[1.18] font-[500] tracking-[-0.008em] [font-variation-settings:'opsz'_36] mb-2">
          <span className="pen-title">{smartQuotes(post.title)}</span>
        </h2>
        {post.excerpt && <p className="text-[var(--ink-2)] mb-2">{smartQuotes(post.excerpt)}</p>}
        {!tags && post.tags && post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {post.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
      {tags}
    </article>
  )
}
