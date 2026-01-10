"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"

// Minimal, geometric icons inspired by Braun/Rams design
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SortIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

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
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        const normalizedTag = tag.toLowerCase().trim()
        tagsSet.add(normalizedTag)
      })
    })
    return Array.from(tagsSet).sort()
  }, [posts])

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts]

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query))),
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (post) =>
          post.tags &&
          selectedTags.every((tag) =>
            post.tags.some((postTag) => postTag.toLowerCase().trim() === tag.toLowerCase().trim()),
          ),
      )
    }

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
        return "newest"
      case "oldest":
        return "oldest"
      case "title":
        return "title"
      case "readingTime":
        return "reading time"
    }
  }

  const isTagSelected = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    return selectedTags.some((t) => t.toLowerCase().trim() === normalizedTag)
  }

  return (
    <div className="space-y-8">
      {/* Search and sort controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input - underline style */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-6 pr-8 py-2 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--braun-orange)] transition-colors lowercase"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center"
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-0 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors lowercase"
          >
            <SortIcon size={14} />
            <span>{getSortLabel(sortOption)}</span>
          </button>
          {showSortMenu && (
            <div className="absolute top-full right-0 mt-2 bg-[var(--background)] border border-[var(--border)] py-2 z-10 min-w-[140px]">
              {(["newest", "oldest", "title", "readingTime"] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOption(option)
                    setShowSortMenu(false)
                  }}
                  className={`block w-full text-left px-4 py-1.5 text-sm lowercase transition-colors ${
                    sortOption === option
                      ? "text-[var(--braun-orange)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--braun-orange)]"
                  }`}
                >
                  {getSortLabel(option)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tag filters */}
      <div>
        <button
          onClick={() => setShowTagFilter(!showTagFilter)}
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors lowercase"
        >
          {showTagFilter ? "hide tags" : "filter by tags"}
        </button>

        {showTagFilter && (
          <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag-interactive ${isTagSelected(tag) ? "active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="flex items-center mt-4 gap-2">
            <span className="text-sm text-[var(--foreground-subtle)]">active:</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {selectedTags.map((tag) => (
                <span key={tag} className="tag text-[var(--braun-orange)] flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <CloseIcon size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--braun-orange)] transition-colors lowercase"
              >
                clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-[var(--foreground-subtle)] border-b border-[var(--border)] pb-2 lowercase">
        {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[var(--foreground-muted)] lowercase">no posts found.</p>
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-[var(--braun-orange)] hover:underline text-sm lowercase"
            >
              clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-16">
          {filteredPosts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block group no-underline hover:no-underline">
                {/* Date and reading time */}
                <div className="uppercase-meta text-[var(--foreground-subtle)] mb-2">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    }).toLowerCase()}
                  </time>
                  {post.readingTime && <span> · {post.readingTime} min</span>}
                </div>

                {/* Title - only this gets underline on hover */}
                <h2 className="text-2xl md:text-[2rem] font-semibold tracking-tight lowercase text-[var(--foreground)] group-hover:text-[var(--braun-orange)] group-hover:underline group-hover:underline-offset-4 transition-colors mb-3">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-[var(--foreground-muted)] mb-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {post.tags.map((tag: string) => (
                      <span
                        key={`${post.slug}-${tag}`}
                        className="tag-interactive"
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
