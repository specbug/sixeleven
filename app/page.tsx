import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

export default async function Home() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-medium mb-4 font-styrene">Welcome to sixeleven</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No posts found. Please add MDX files to the content/posts directory.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/about"
            className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
          >
            About
          </Link>
          {/* <Link
            href="/projects"
            className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
          >
            Projects
          </Link> */}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`${index !== posts.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""} pb-8`}
          >
            <Link href={`/blog/${post.slug}`} className="block group">
              <h2 className="text-xl md:text-2xl font-medium group-hover:text-accent/80 transition-colors mb-2 font-styrene" style={{ letterSpacing: "-0.04em" }}>
                {post.title}
              </h2>
              <div className="article-meta mb-2">
                <time dateTime={post.date}>{post.date}</time>
                {post.readingTime && <span className="reading-time"> · {post.readingTime} min read</span>}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
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

