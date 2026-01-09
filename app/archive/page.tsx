import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import SearchPosts from "@/components/search-posts"

export const metadata: Metadata = {
  title: "archive | sixeleven",
  description: "all blog posts",
}

export default async function ArchivePage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">archive</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            no posts found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight lowercase mb-12">archive</h1>
      <SearchPosts posts={posts} />
    </div>
  )
}
