"use client"

import { useEffect, useMemo, useState } from "react"
import type { TOCItem } from "@/lib/mdx"

// Strip inline markdown so section names read as plain words
const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

// The running head: below 1280px, where there is no margin for the Rule, a slim strip at
// the top of the screen once the reader is past the title, as a printed book carries its
// chapter at the head of each page. The current section (the post's title before the
// first one) on the left, the minutes left on the right, the same readout as the Rule's.
// A hairline beneath fills in ink with the distance read; an ultramarine tick marks the
// position. The site header, when it slides back in, covers it.
export default function RunningHead({ headings, readingTime }: { headings: TOCItem[]; readingTime?: number }) {
  const top = headings.length ? Math.min(...headings.map((h) => h.level)) : 2
  const sections = useMemo(() => {
    const atTop = headings.filter((h) => h.level === top)
    return atTop.length >= 3 ? atTop : headings.filter((h) => h.level <= top + 1)
  }, [headings, top])

  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(-1)
  const [shown, setShown] = useState(false)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const content = document.querySelector<HTMLElement>("[data-post-body]")
    if (!content) return
    setTitle(document.querySelector("h1")?.textContent?.trim() ?? "")
    let frame = 0

    // The same reading line as the Rule: a third of the way down the viewport, sliding to
    // its bottom as the page nears its end, so the last lines still count as read
    const update = () => {
      frame = 0
      const box = content.getBoundingClientRect()
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const through = Math.min(1, window.scrollY / maxScroll)
      const line = window.innerHeight * (0.33 + 0.67 * through)
      setProgress(Math.min(1, Math.max(0, (line - box.top) / Math.max(1, box.height))))
      setShown(box.top < 64) // the body has reached the top: the title is behind
      let idx = -1
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setCurrent(idx)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    document.fonts?.ready.then(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  const minutes = readingTime ? Math.max(0, readingTime * (1 - progress)) : null
  const readout = minutes === null ? null : progress >= 0.995 ? "fin" : minutes < 1 ? "under 1 min left" : `${Math.ceil(minutes)} min left`
  const at = `${(progress * 100).toFixed(2)}%`

  // Decorative for screen readers: the Contents toggle carries the sections
  return (
    <div
      aria-hidden="true"
      className={`xl:hidden fixed inset-x-0 top-0 z-40 bg-[var(--ground)] transition-[transform,opacity] duration-300 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[640px] mx-auto px-6 md:px-0 h-9 flex items-center justify-between gap-4 font-flex text-[0.75rem] [font-feature-settings:'tnum'_1]">
        <span className="truncate text-[var(--ink-2)]">{current >= 0 ? plain(sections[current].text) : title}</span>
        {readout && <span className="shrink-0 text-[var(--ink-3)]">{readout}</span>}
      </div>
      <div className="relative h-px bg-[var(--rule)]">
        <div className="absolute left-0 top-0 h-px bg-[var(--ink)]" style={{ width: at }} />
        <div className="absolute -top-[3px] w-[2px] h-[7px] -ml-px bg-[var(--ultramarine)]" style={{ left: at }} />
      </div>
    </div>
  )
}
