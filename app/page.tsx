import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import { PostListItem } from "@/components/PostListItem"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default async function Home() {
  const posts = await getAllPosts()

  if (posts.length === 0) return <p className="text-[var(--ink-2)]">No posts.</p>

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </div>
  )
}
