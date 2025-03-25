"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime?: string
  tags?: string[]
}

interface SearchPostsProps {
  posts: Post[]
}

export default function SearchPosts({ posts }: SearchPostsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(query))),
    )

    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className={`h-5 w-5 ${isFocused ? "text-[#FF4D06]/60" : "text-gray-400"} transition-colors`} />
        </div>
        <Input
          type="text" // Changed from "search" to "text" to remove browser's default clear button
          placeholder="Search posts by title, content, or tags..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 py-2 border-gray-200 dark:border-gray-800 focus:border-[#FF4D06]/40 focus:ring focus:ring-[#FF4D06]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-[#FF4D06]/60 hover:text-[#FF4D06] transition-colors" />
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found matching "<span className="text-[#FF4D06]/60 font-medium">{searchQuery}</span>".
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`${index !== filteredPosts.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""} pb-8`}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-2xl md:text-3xl font-bold group-hover:text-accent/80 transition-colors mb-2">
                  {post.title}
                </h2>
                <div className="article-meta mb-2">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.readingTime && <span className="reading-time"> · {post.readingTime} min read</span>}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
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
      )}
    </div>
  )
}

