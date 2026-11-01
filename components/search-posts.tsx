"use client"

import { useMemo, useState } from "react"
import { PostListItem } from "./PostListItem"
import { ChevronIcon, CloseIcon, SearchIcon } from "./icons"

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime?: string
  tags?: string[]
  link?: string
}

type SortOption = "newest" | "oldest" | "title" | "length"

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
  { value: "length", label: "Length" },
]

const norm = (tag: string) => tag.toLowerCase().trim()

// A selected control is the reader's own state: ink, with an ultramarine mark beneath
const selected = "text-[var(--ink)] underline decoration-[var(--ultramarine)] decoration-[1.5px] underline-offset-[5px]"

export default function SearchPosts({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>("newest")
  const [tagsOpen, setTagsOpen] = useState(false)

  const allTags = useMemo(() => Array.from(new Set(posts.flatMap((p) => (p.tags ?? []).map(norm)))).sort(), [posts])

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    const list = posts.filter(
      (post) =>
        (!q ||
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          (post.tags ?? []).some((t) => t.toLowerCase().includes(q))) &&
        tags.every((t) => (post.tags ?? []).some((pt) => norm(pt) === t)),
    )
    const time = (p: Post) => new Date(p.date).getTime()
    const length = (p: Post) => Number.parseInt(p.readingTime ?? "0", 10)
    return list.sort((a, b) =>
      sort === "newest" ? time(b) - time(a) : sort === "oldest" ? time(a) - time(b) : sort === "title" ? a.title.localeCompare(b.title) : length(a) - length(b),
    )
  }, [posts, query, tags, sort])

  // In date order the list falls into years
  const groups = useMemo(() => {
    if (sort !== "newest" && sort !== "oldest") return [{ year: null as number | null, posts: results }]
    const out: { year: number | null; posts: Post[] }[] = []
    for (const post of results) {
      const year = new Date(post.date).getFullYear()
      if (out.at(-1)?.year !== year) out.push({ year, posts: [] })
      out.at(-1)!.posts.push(post)
    }
    return out
  }, [results, sort])

  const toggleTag = (tag: string) => setTags((prev) => (prev.includes(norm(tag)) ? prev.filter((t) => t !== norm(tag)) : [...prev, norm(tag)]))
  const clear = () => {
    setQuery("")
    setTags([])
  }
  const filtered = query.trim() !== "" || tags.length > 0
  const showTags = tagsOpen || tags.length > 0

  return (
    <div>
      {/* Search */}
      <label className="relative flex items-center border-b border-[var(--rule)] focus-within:border-[var(--ultramarine)] transition-colors">
        <span className="text-[var(--ink-3)]">
          <SearchIcon />
        </span>
        <span className="sr-only">Search posts</span>
        <input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-3 pr-8 py-2 bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-0 nav-link" aria-label="Clear search">
            <CloseIcon />
          </button>
        )}
      </label>

      {/* Filter and sort */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-flex text-[0.875rem]">
        <button onClick={() => setTagsOpen(!showTags)} className="nav-link flex items-center gap-1 -ml-1" aria-expanded={showTags}>
          <ChevronIcon open={showTags} />
          Tags
        </button>
        <div className="flex gap-4" role="group" aria-label="Sort">
          {SORTS.map((s) => (
            <button key={s.value} onClick={() => setSort(s.value)} aria-pressed={sort === s.value} className={sort === s.value ? selected : "nav-link"}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {showTags && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-flex text-[0.8125rem]">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)} className={tags.includes(tag) ? selected : "nav-link"}>
              {tag}
            </button>
          ))}
          {tags.length > 0 && (
            <button onClick={() => setTags([])} className="nav-link text-[var(--ink-3)]">
              Clear
            </button>
          )}
        </div>
      )}

      {/* Count */}
      <p className="meta mt-8 pb-3 border-b border-[var(--rule)]" aria-live="polite">
        {filtered ? `${results.length} of ${posts.length} posts` : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      </p>

      {results.length === 0 ? (
        <div className="mt-8">
          <p className="text-[var(--ink-2)]">No matching posts.</p>
          <button onClick={clear} className="nav-link font-flex text-[0.875rem] mt-2">
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.year ?? "all"} className="mt-10">
            {group.year !== null && (
              <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.01em] [font-variant-numeric:tabular-nums] mb-6">{group.year}</h2>
            )}
            <div className="space-y-12">
              {group.posts.map((post) => (
                <PostListItem
                  key={post.slug}
                  post={post}
                  tags={
                    post.tags && post.tags.length > 0 ? (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 -mt-0">
                        {post.tags.map((tag) => (
                          <li key={tag}>
                            <button onClick={() => toggleTag(tag)} aria-pressed={tags.includes(norm(tag))} className={`tag ${tags.includes(norm(tag)) ? selected : "hover:text-[var(--ink)] transition-colors"}`}>
                              {tag}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : undefined
                  }
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
