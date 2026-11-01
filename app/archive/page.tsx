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

  return (
    <div>
      <h1 className="title text-[2.5rem] md:text-[3.25rem] mb-12">Archive</h1>
      {posts.length === 0 ? <p className="text-[var(--ink-2)]">No posts.</p> : <SearchPosts posts={posts} />}
    </div>
  )
}
