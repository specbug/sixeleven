import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import { PostLedger } from "@/components/PostLedger"

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

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.012em] mb-12">Blog</h1>
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
      <h1 className="text-[2.25rem] md:text-[3.25rem] leading-[1.08] font-bold tracking-[-0.012em] mb-12">Blog</h1>

      <PostLedger posts={posts} />
    </div>
  )
}
