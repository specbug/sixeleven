"use client"

import { useState } from "react"
import type { TOCItem } from "@/lib/mdx"

// Minimal chevron icon - simple geometric line
function ChevronIcon({ size = 14, rotated = false }: { size?: number; rotated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform ${rotated ? "rotate-90" : ""}`}
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
      {/* Toggle button - collapsed by default */}
      <button
        className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors lowercase"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronIcon size={14} rotated={isExpanded} />
        contents
      </button>

      {/* TOC list */}
      {isExpanded && (
        <ul className="mt-4 space-y-2 border-l border-[var(--border)] pl-4">
          {headings.map((item, index) => (
            <li
              key={index}
              style={{
                marginLeft: `${(item.level - 2) * 1}rem`,
              }}
            >
              <a
                href={`#${item.id}`}
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors lowercase"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
