"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { TOCItem } from "@/lib/mdx"

// Strip inline markdown so section names read as plain words
const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

// Geometry of the scale, in px
const SPINE = 24 // x of the vertical line
const NAME_X = 40 // where section names start
const MIN_GAP = 6 // least space between two section names

// The Rule: a vertical scale in the left margin where height maps to the post. Minute
// ticks run left of the spine, section ticks and their names to the right. An ink line
// marks the distance read and an ultramarine line the current position, the page's one
// moving part, with the minutes left beneath. Hidden until the pointer enters the left
// margin or a section name takes keyboard focus. It stands 104px off the column, 24px
// clear of the widest plate. From 1280px; narrower, the Contents toggle serves.
export default function Rule({ headings, readingTime }: { headings: TOCItem[]; readingTime?: number }) {
  const top = headings.length ? Math.min(...headings.map((h) => h.level)) : 2
  const sections = useMemo(() => {
    const atTop = headings.filter((h) => h.level === top)
    return atTop.length >= 3 ? atTop : headings.filter((h) => h.level <= top + 1)
  }, [headings, top])

  const rootRef = useRef<HTMLElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)
  const nameRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [height, setHeight] = useState(0)
  const [progress, setProgress] = useState(0)
  const [marks, setMarks] = useState<number[]>([]) // section starts, 0–1
  const [nameY, setNameY] = useState<number[]>([]) // laid-out name positions, px
  const [current, setCurrent] = useState(0)

  // Where each section starts within the post, and how far through it the reader is
  useEffect(() => {
    // The scale maps the post's body; its hover zone spans the whole article
    const article = rootRef.current?.parentElement
    const content = article?.querySelector<HTMLElement>("[data-post-body]") ?? article
    if (!content) return
    let frame = 0

    const update = () => {
      frame = 0
      const box = content.getBoundingClientRect()
      // The reading line sits a third of the way down the viewport
      const line = window.innerHeight * 0.33
      setProgress(Math.min(1, Math.max(0, (line - box.top) / Math.max(1, box.height))))
      let idx = 0
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setCurrent(idx)
    }

    const measure = () => {
      const box = content.getBoundingClientRect()
      const start = box.top + window.scrollY
      const span = Math.max(1, box.height)
      setMarks(
        sections.map((s) => {
          const el = document.getElementById(s.id)
          return el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - start) / span)) : 0
        }),
      )
      setHeight(scaleRef.current?.clientHeight ?? 0)
      update()
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(content)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  // Names sit at their true positions, each pushed down only as far as it must go to
  // clear the one above
  useLayoutEffect(() => {
    let floor = -Infinity
    setNameY(
      marks.map((m, i) => {
        const h = nameRefs.current[i]?.offsetHeight ?? 16
        const y = Math.max(m * height - 8, floor) // first line centred on its tick
        floor = y + h + MIN_GAP
        return y
      }),
    )
  }, [marks, height])

  if (sections.length < 2) return null

  const y = progress * height
  const minutes = readingTime ? Math.max(0, readingTime * (1 - progress)) : null
  const readout =
    minutes === null ? null : progress >= 0.995 ? "end" : minutes < 1 ? "under 1 min left" : `${Math.ceil(minutes)} min left`

  return (
    <nav
      ref={rootRef}
      aria-label="Contents"
      className="group hidden xl:block absolute top-0 right-full h-full mr-[104px] w-[calc((100vw-640px)/2-104px)]"
    >
      <div className="sticky top-24 ml-auto w-[168px] opacity-0 transition-opacity [transition-duration:400ms] ease-out group-hover:opacity-100 group-focus-within:opacity-100">
        <div ref={scaleRef} className="relative h-[min(560px,calc(100vh-12rem))]">
          {/* Spine, and the distance read in ink */}
          <div className="absolute top-0 bottom-0 w-px bg-[var(--rule)]" style={{ left: SPINE }} />
          <div
            className="absolute top-0 w-px h-full bg-[var(--ink)] origin-top transition-transform duration-300 ease-out"
            style={{ left: SPINE, transform: `scaleY(${progress})` }}
          />

          {/* Minute ticks: one a minute, longer every five */}
          {readingTime &&
            Array.from({ length: readingTime + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute h-px bg-[var(--rule)]"
                style={{ top: (i / readingTime) * height, left: SPINE - (i % 5 === 0 ? 8 : 4), width: i % 5 === 0 ? 8 : 4 }}
              />
            ))}

          {/* Section ticks and names */}
          {sections.map((s, i) => (
            <div key={s.id}>
              <div className="absolute h-px w-2 bg-[var(--ink-3)]" style={{ top: (marks[i] ?? 0) * height, left: SPINE }} />
              <a
                ref={(el) => {
                  nameRefs.current[i] = el
                }}
                href={`#${s.id}`}
                aria-current={current === i ? "location" : undefined}
                className={`nav-link absolute block font-flex text-[0.75rem] leading-[1.35] [text-wrap:balance] ${s.level > top ? "pl-2" : ""}`}
                style={{ top: nameY[i] ?? 0, left: NAME_X, right: 0 }}
              >
                {plain(s.text)}
              </a>
            </div>
          ))}

          {/* You are here */}
          <div
            className="absolute h-[1.5px] w-5 bg-[var(--ultramarine)] transition-transform duration-300 ease-out"
            style={{ top: 0, left: SPINE - 10, transform: `translateY(${y - 0.75}px)` }}
          />
        </div>
        {readout && (
          <p className="meta mt-3 text-[0.75rem]" style={{ paddingLeft: NAME_X }}>
            {readout}
          </p>
        )}
      </div>
    </nav>
  )
}
