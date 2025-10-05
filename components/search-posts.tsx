"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, X, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

type SortOption = "newest" | "oldest" | "title" | "readingTime"

export default function SearchPosts({ posts }: SearchPostsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [showTagFilter, setShowTagFilter] = useState(false)

  // Extract all unique tags from posts - fixed to properly deduplicate
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        // Normalize tag (lowercase, trim) before adding to ensure proper deduplication
        const normalizedTag = tag.toLowerCase().trim()
        tagsSet.add(normalizedTag)
      })
    })
    return Array.from(tagsSet).sort()
  }, [posts])

  // Filter and sort posts based on search query, selected tags, and sort option
  useEffect(() => {
    let filtered = [...posts]

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query))),
      )
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (post) =>
          post.tags &&
          selectedTags.every((tag) =>
            post.tags.some((postTag) => postTag.toLowerCase().trim() === tag.toLowerCase().trim()),
          ),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "readingTime":
          const aTime = a.readingTime ? Number.parseInt(a.readingTime) : 0
          const bTime = b.readingTime ? Number.parseInt(b.readingTime) : 0
          return aTime - bTime
        default:
          return 0
      }
    })

    setFilteredPosts(filtered)
  }, [searchQuery, selectedTags, sortOption, posts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const toggleTag = (tag: string) => {
    // Normalize tag before toggling
    const normalizedTag = tag.toLowerCase().trim()
    setSelectedTags((prev) =>
      prev.includes(normalizedTag) ? prev.filter((t) => t !== normalizedTag) : [...prev, normalizedTag],
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSortOption("newest")
  }

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "newest":
        return "Newest"
      case "oldest":
        return "Oldest"
      case "title":
        return "Title"
      case "readingTime":
        return "Reading Time"
    }
  }

  // Helper to check if a tag is selected (case-insensitive)
  const isTagSelected = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    return selectedTags.some((t) => t.toLowerCase().trim() === normalizedTag)
  }

  return (
    <div className="space-y-6">
      {/* Search and sort controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 pr-9 py-2 h-10 text-base border-gray-200 dark:border-gray-800 focus:ring-0 focus:border-gray-300 dark:focus:border-gray-700 w-full rounded-md"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-[#FF4D06]/60" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full md:w-auto px-3 py-2 h-10 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <span className="flex items-center">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-gray-500" />
                  <span>{getSortLabel(sortOption)}</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="readingTime">Reading Time</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tag filters */}
      <div>
        <button
          onClick={() => setShowTagFilter(!showTagFilter)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF4D06]/60 mb-2 flex items-center"
        >
          {showTagFilter ? "Hide tags" : "Filter by tags"}
        </button>

        {showTagFilter && (
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  isTagSelected(tag)
                    ? "bg-[#FF4D06]/10 text-[#FF4D06]/80 border border-[#FF4D06]/20"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="flex items-center mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FF4D06]/10 text-[#FF4D06]/80"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="ml-1 text-[#FF4D06]/60 hover:text-[#FF4D06]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-[#FF4D06]/60 hover:text-[#FF4D06] ml-1">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2">
        {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">No posts found matching your criteria.</p>
          {(searchQuery || selectedTags.length > 0) && (
            <button onClick={clearFilters} className="mt-2 text-[#FF4D06]/60 hover:text-[#FF4D06] text-sm">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`${index !== filteredPosts.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""} pb-8`}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-xl md:text-2xl font-medium group-hover:text-accent/80 transition-colors mb-2 font-styrene" style={{ letterSpacing: "-0.04em" }}>
                  {post.title}
                </h2>
                <div className="article-meta mb-2">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.readingTime && <span className="reading-time"> · {post.readingTime} min read</span>}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span
                        key={`${post.slug}-${tag}`}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleTag(tag)
                        }}
                      >
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

