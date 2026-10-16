"use client"

import { useState, useEffect, useMemo } from "react"
import type { TOCItem } from "@/lib/mdx"

// Strip inline markdown so the rail shows plain words
const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

// Minimal chevron icon - simple geometric line
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
    <div className="mb-6">
      {/* Toggle button - collapsed by default */}
      <button
        className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronIcon size={14} rotated={isExpanded} />
        Contents
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
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
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

// Sticky rail in the left margin on wide screens. Shows the shallowest heading level,
// plus the next one when the top level alone is too sparse to navigate by; the section
// being read is set in ink, so the rail doubles as a sense of place. Sits 112px off the
// column so it clears the 80px plate breakout with room to spare.
export function TocRail({ headings }: { headings: TOCItem[] }) {
  const top = Math.min(...headings.map((h) => h.level))
  const items = useMemo(() => {
    const atTop = headings.filter((h) => h.level === top)
    return atTop.length >= 3 ? atTop : headings.filter((h) => h.level <= top + 1)
  }, [headings, top])
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    if (items.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      // The last heading to have crossed the upper third of the viewport is the one being read
      const line = window.innerHeight * 0.3
      let current = items[0].id
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  if (items.length < 2) return null

  return (
    <nav aria-label="Contents" className="hidden xl:block absolute right-full top-0 h-full w-[180px] mr-[112px]">
      <ul className="sticky top-24 divide-y divide-[var(--border)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`block py-2.5 text-[0.8125rem] leading-[1.35] [text-wrap:balance] no-underline hover:no-underline transition-colors ${
                item.level > top ? "pl-3" : ""
              } ${
                active === item.id
                  ? "text-[var(--foreground)]"
                  : "text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
              }`}
            >
              {plain(item.text)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
