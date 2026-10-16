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
        <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.012em] mb-12">Archive</h1>
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)]">
            No posts found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.012em] mb-12">Archive</h1>
      <SearchPosts posts={posts} />
    </div>
  )
}
