"use client"

import { useState } from "react"
import type { TOCItem } from "@/lib/mdx"

// Strip inline markdown so the list shows plain words
const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

// Chevron: 1.5px line, rotates when open
function ChevronIcon({ size = 14, rotated = false }: { size?: number; rotated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`transition-transform duration-200 ${rotated ? "rotate-90" : ""}`}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function TableOfContents({ headings }: { headings: TOCItem[] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (headings.length === 0) return null

  return (
    <div className="mb-8">
      {/* Collapsed by default */}
      <button
        className="meta flex items-center gap-1 text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <ChevronIcon size={14} rotated={isExpanded} />
        Contents
      </button>

      {/* TOC list */}
      {isExpanded && (
        <ul className="mt-4 space-y-2 border-l border-[var(--rule)] pl-4">
          {headings.map((item, index) => (
            <li
              key={index}
              style={{
                marginLeft: `${(item.level - 2) * 1}rem`,
              }}
            >
              <a
                href={`#${item.id}`}
                className="text-[0.9375rem] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
              >
                {plain(item.text)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
