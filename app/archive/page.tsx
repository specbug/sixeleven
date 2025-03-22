import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Archive | sixeleven",
  description: "All blog posts",
}

export default async function ArchivePage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8">Archive</h1>
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No posts found. Please add MDX files to the content/posts directory.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8">Archive</h1>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`${index !== posts.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""} pb-8`}
          >
            <Link href={`/blog/${post.slug}`} className="block group">
              <h2 className="text-2xl md:text-3xl font-bold group-hover:text-accent/80 transition-colors mb-2">
                {post.title}
              </h2>
              <div className="article-meta mb-2">
                <time dateTime={post.date}>{post.date}</time>
                {post.readingTime && <span className="reading-time"> · {post.readingTime} min read</span>}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
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

