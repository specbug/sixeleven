"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Entry {
  title: string
  creator: string
  medium: string
  year: string
  experienced: string
  image: string
  reflection: string
}

const entries: Entry[] = [
  {
    title: "Worm",
    creator: "Wildbow",
    medium: "web serial",
    year: "2011–2013",
    experienced: "2026",
    image: "/images/pnd/worm.jpg",
    reflection:
      "Worm broke superhero stories for me. Nothing in the genre has come close since, and I've tried. 1.7 million words of relentlessly bleak, ever-escalating exercise in masochism, and you can't stop turning the page. Taylor Hebert altered something in me, and I don't think it reverts. I finished it and the real world felt thinner.",
  },
  {
    title: "Clair Obscur: Expedition 33",
    creator: "Sandfall Interactive",
    medium: "video game",
    year: "2025",
    experienced: "2025",
    image: "/images/pnd/expedition-33.webp",
    reflection:
      "The story. The characters. The score (oh god, the score). There's nothing reductive left to say. It's a work of art that happens to come in a game-shaped box.",
  },
  {
    title: "Elden Ring",
    creator: "FromSoftware",
    medium: "video game",
    year: "2022",
    experienced: "2023",
    image: "/images/pnd/elden-ring.png",
    reflection:
      "Two months to beat it. Two years to get out of it. I have never had a stronger emotional response to a game than stepping into Limgrave for the first time. FromSoft built a world that never asked for my attention, it just quietly deserved all of it, and I realized this at 3am binging VaatiVidya videos. Favorite game of all time. Nothing else is close.",
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    creator: "Eliezer Yudkowsky",
    medium: "web fiction",
    year: "2010–2015",
    experienced: "2021",
    image: "/images/pnd/hpmor.jpg",
    reflection:
      "HPMOR feels like it was reverse-engineered from my specific brain. I've read it five times. So far. Each reread surfaces things I missed that were load-bearing the entire time. I genuinely cannot articulate what this book did to my thinking without sounding unhinged. It's an inflection point in my life, and I rue imagining a universe where I never came across it.",
  },
  {
    title: "Remembrance of Earth's Past",
    creator: "Liu Cixin",
    medium: "book series",
    year: "2008–2010",
    experienced: "2020",
    image: "/images/pnd/remembrance.jpg",
    reflection:
      "I can usually see a twist coming, but Liu Cixin had me on the back foot for three straight books. This was the first time I rode the scope escalation train and it just kept going, each volume blowing open the ceiling of the last. Some of the ideas in this trilogy live rent-free in my head, and I don't think they're leaving.",
  },
  {
    title: "Harry Potter",
    creator: "J.K. Rowling",
    medium: "book series",
    year: "1997–2007",
    experienced: "2017",
    image: "/images/pnd/harry-potter.png",
    reflection:
      "The first fictional world I ever truly lived in. HP gave me the gift of falling in love with reading. It has a permanently reserved space in who I am.",
  },
]

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) {
      setMounted(true)
      return
    }
    const id = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(id)
  }, [])
  return mounted
}

// ---------------------------------------------------------------------------
// Shared reveal primitive
// ---------------------------------------------------------------------------

function Reveal({
  children,
  visible,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  visible: boolean
  delay?: number
  className?: string
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  const mounted = useMounted()

  return (
    <section className="min-h-[50vh] flex flex-col justify-end pb-20">
      <Reveal visible={mounted} delay={200}>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]">
          post narrative depression
        </h1>
      </Reveal>

      <Reveal visible={mounted} delay={350}>
        <p className="text-[var(--foreground-subtle)] text-sm italic mt-3 max-w-[520px]">
          the cognitive hangover of re-entering reality after deep immersion in
          a high-fidelity fictional world.
        </p>
      </Reveal>

      {/* Orange divider line — draws left-to-right */}
      <div
        className={`h-px bg-[var(--braun-orange)] mt-6 mb-6 origin-left transition-transform duration-700 ease-out ${
          mounted ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ transitionDelay: "500ms" } as CSSProperties}
      />

      <Reveal visible={mounted} delay={600}>
        <p className="text-[var(--foreground-muted)] leading-relaxed max-w-[520px]">
          some stories don&apos;t just end. they leave a space where they used
          to be.
          <span className="block mt-1 text-[var(--foreground-subtle)]">
            this is that space.
          </span>
        </p>
      </Reveal>

      <Reveal visible={mounted} delay={800}>
        <p className="text-[var(--foreground-subtle)] text-sm leading-relaxed mt-8 max-w-[520px]">
          this is not a list of favourites. it is a record of temporal
          watermarks — works that didn&apos;t just pass through me but altered
          the coordinate system by which I locate myself in time. each one
          partitions my life into before and after.
        </p>
      </Reveal>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Entry card
// ---------------------------------------------------------------------------

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const { ref, visible } = useReveal(0.08)
  const [imgError, setImgError] = useState(false)

  return (
    <article ref={ref}>
      {/* Index + Experience year */}
      <Reveal visible={visible} delay={0}>
        <div className="flex items-baseline justify-between">
          <span
            className="text-sm tracking-wide tabular-nums"
            style={{
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              color: "var(--braun-orange)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="text-sm tracking-wide tabular-nums"
            style={{
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              color: "var(--foreground-subtle)",
            }}
          >
            {entry.experienced}
          </span>
        </div>
      </Reveal>

      {/* Title */}
      <Reveal visible={visible} delay={80}>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3 leading-tight">
          {entry.title}
        </h2>
      </Reveal>

      {/* Creator */}
      <Reveal visible={visible} delay={140}>
        <p className="text-[var(--foreground-muted)] mt-1">{entry.creator}</p>
      </Reveal>

      {/* Medium · Year */}
      <Reveal visible={visible} delay={180}>
        <span className="uppercase-meta text-[var(--foreground-subtle)] mt-2 block">
          {entry.medium} &middot; {entry.year}
        </span>
      </Reveal>

      {/* Image / Placeholder */}
      <Reveal visible={visible} delay={260} className="mt-8">
        <div className="aspect-[3/2] overflow-hidden relative group">
          {!imgError ? (
            <Image
              src={entry.image}
              alt={entry.title}
              fill
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <span className="text-4xl md:text-5xl font-semibold text-[var(--foreground)] opacity-[0.04] tracking-tight leading-none select-none">
                {entry.title}
              </span>
            </div>
          )}
        </div>
      </Reveal>

      {/* Reflection */}
      <Reveal visible={visible} delay={360} className="mt-8">
        <p className="text-[var(--foreground-muted)] leading-relaxed border-l-[2px] border-[var(--border)] pl-5">
          {entry.reflection}
        </p>
      </Reveal>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export default function PNDGallery() {
  return (
    <div>
      <Hero />

      <div className="space-y-24 md:space-y-32">
        {entries.map((entry, i) => (
          <EntryCard key={entry.title} entry={entry} index={i} />
        ))}
      </div>

      {/* Closing */}
      <footer className="mt-32 mb-8 text-center">
        <div className="w-10 h-px bg-[var(--border)] mx-auto mb-8" />
        <span
          className="uppercase-meta text-[var(--foreground-subtle)] block opacity-50"
          style={{ fontSize: "0.65rem" }}
        >
          last updated march 2026
        </span>
      </footer>
    </div>
  )
}
