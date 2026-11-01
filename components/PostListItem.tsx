import Link from "next/link"
import type { ReactNode } from "react"

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
  // Replaces the plain tag list, for lists where tags filter (the archive)
  tags?: ReactNode
}

// One entry in a list of posts: date and reading time, title, excerpt, tags. The
// whole entry is the link; hovering it underlines the title in the link hue.
export function PostListItem({ post, tags }: PostListItemProps) {
  const date = new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

  return (
    <article>
      <Link href={post.link || `/blog/${post.slug}`} className="group block">
        <div className="meta mb-1">
          <time dateTime={post.date}>{date}</time>
          {post.readingTime && <span> · {post.readingTime}&nbsp;min</span>}
        </div>
        <h2 className="text-[1.3125rem] leading-[1.3] mb-2 decoration-1 underline-offset-[0.22em] decoration-[color-mix(in_oklch,var(--link)_45%,transparent)] group-hover:underline">
          {post.title}
        </h2>
        {post.excerpt && <p className="text-[var(--ink-2)] mb-2">{post.excerpt}</p>}
        {!tags && post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
      {tags}
    </article>
  )
}
