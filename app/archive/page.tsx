import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import SearchPosts from "@/components/search-posts"

export const metadata: Metadata = {
  title: "Archive | sixeleven",
  description: "All blog posts",
  alternates: { canonical: "/archive" },
}

export default async function ArchivePage() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="display text-[2.5rem] md:text-[3.25rem] mb-12">Archive</h1>
        <p className="text-[var(--ink-2)]">No posts.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="display text-[2.5rem] md:text-[3.25rem] mb-12">Archive</h1>
      <SearchPosts posts={posts} />
    </div>
  )
}
