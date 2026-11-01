"use client"

import { useState } from "react"
import type { TOCItem } from "@/lib/mdx"
import { ChevronIcon } from "./icons"

// Strip inline markdown so the list shows plain words
const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

// Below 1280px, where there is no margin for the Rule: a collapsed Contents toggle
export default function TableOfContents({ headings }: { headings: TOCItem[] }) {
  const [open, setOpen] = useState(false)

  if (headings.length === 0) return null
  const top = Math.min(...headings.map((h) => h.level))

  return (
    <nav aria-label="Contents" className="mb-8">
      <button
        className="nav-link flex items-center gap-1 -ml-1 font-flex text-[0.875rem]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <ChevronIcon open={open} />
        Contents
      </button>

      {open && (
        <ul className="mt-3 ml-[9px] pl-4 border-l border-[var(--rule)] space-y-2 font-flex text-[0.875rem] leading-[1.4]">
          {headings.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - top) * 16}px` }}>
              <a href={`#${item.id}`} className="nav-link">
                {plain(item.text)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
