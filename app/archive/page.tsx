import type { Metadata } from "next"

import { getAllPosts } from "@/lib/mdx"
import SearchPosts from "@/components/search-posts"

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
      <SearchPosts posts={posts} />
    </div>
  )
}

