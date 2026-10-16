import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"
import { FeaturedPost, PostLedger } from "@/components/PostLedger"

export default async function Home() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--foreground-muted)] mb-6">
          No posts found.
        </p>
        <Link
          href="/about"
          className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
        >
          About
        </Link>
      </div>
    )
  }

  const [latest, ...earlier] = posts

  return (
    <div>
      <FeaturedPost post={latest} />
      {earlier.length > 0 && <PostLedger posts={earlier} />}
    </div>
  )
}
