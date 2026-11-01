import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import { PostListItem } from "@/components/PostListItem"

export const metadata: Metadata = {
  title: "Blog | sixeleven",
  description: "All blog posts",
  openGraph: {
    title: "Blog | sixeleven",
    description: "All blog posts",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"}/blog`,
    siteName: "sixeleven",
  },
  twitter: {
    card: "summary",
    title: "Blog | sixeleven",
    description: "All blog posts",
    creator: "Rishit Vora",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"}/blog`,
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div>
      <h1 className="title text-[2.5rem] md:text-[3.25rem] mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-[var(--ink-2)]">No posts.</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
