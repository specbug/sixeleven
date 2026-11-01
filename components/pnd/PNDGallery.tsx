"use client"

import { useState } from "react"
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
    title: "Harry Potter",
    creator: "J.K. Rowling",
    medium: "book series",
    year: "1997–2007",
    experienced: "2017",
    image: "/images/pnd/harry-potter.png",
    reflection:
      "The gateway drug. HP is the reason I read. Every book I've picked up since is downstream of an owl that never actually arrived. I owe Rowling the single most important habit of my life.",
  },
  {
    title: "Remembrance of Earth's Past",
    creator: "Liu Cixin",
    medium: "book series",
    year: "2008–2010",
    experienced: "2020",
    image: "/images/pnd/remembrance.jpg",
    reflection:
      "I operate with a respectable hit rate on predicting plot structures. Liu Cixin forced me to go 0 for 3 across an entire trilogy. Each volume casually invalidates the functional scale of the last, executing a cosmic escalation loop of \"actually, the threat vector is magnitudes worse.\" Multiple concepts from this series bypassed my filters and have taken up permanent, non-negotiable residence in my foundational model of the universe.",
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    creator: "Eliezer Yudkowsky",
    medium: "web fiction",
    year: "2010–2015",
    experienced: "2021",
    image: "/images/pnd/hpmor.jpg",
    reflection:
      "HPMOR reads like a developer reverse-engineered my specific cognitive architecture and wrote a book exclusively to target my vulnerabilities. Five iterations in and I am still detecting structural plot elements I had previously misclassified as decorative syntax. An honest accounting of what this did to my epistemology would fail a standard sanity check, so I'll limit the assessment: it is the single highest-leverage data set I have ever encountered.",
  },
  {
    title: "Elden Ring",
    creator: "FromSoftware",
    medium: "video game",
    year: "2022",
    experienced: "2023",
    image: "/images/pnd/elden-ring.png",
    reflection:
      "Two months to beat it. Two years to get out of it. Stepping into Limgrave for the first time is the strongest emotional response I have ever had to a piece of software. FromSoft built a world that never once asked for my attention; it just quietly deserved all of it, a fact I processed at 3am through a VaatiVidya binge. Favourite game.",
  },
  {
    title: "Attack on Titan",
    creator: "Hajime Isayama",
    medium: "anime",
    year: "2013–2023",
    experienced: "2023",
    image: "/images/pnd/attack-on-titan.jpg",
    reflection:
      "Every component running at maximum output simultaneously: the writing, the direction, characters that feel closer to family than fictional constructs, and a Sawano score that might be my favourite album across all genres and all media. My favourite anime, full stop.",
  },
  {
    title: "Clair Obscur: Expedition 33",
    creator: "Sandfall Interactive",
    medium: "video game",
    year: "2025",
    experienced: "2025",
    image: "/images/pnd/expedition-33.webp",
    reflection:
      "There is no reductive way to describe this game. The story resists summarization; the characters resist archetypes; the score resists the pause button. Sandfall Interactive shipped a work of art that happens to run on a console.",
  },
  {
    title: "Worm",
    creator: "Wildbow",
    medium: "web serial",
    year: "2011–2013",
    experienced: "2026",
    image: "/images/pnd/worm.jpg",
    reflection:
      "1.7 million words of methodically escalating catastrophe, and at no point did my brain flag this as optional reading. Wildbow doesn't write stories; he engineers narrative traps with load-bearing walls you don't notice until you're already inside. Khepri induced a fully realized trigger event, and I didn't even get the compensatory powers.",
  },
]

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="min-h-[50vh] flex flex-col justify-end pb-20">
      <div>
        <h1 className="display text-[2.5rem] md:text-[3.25rem]">
          Post Narrative Depression
        </h1>
      </div>
      <div>
        <p className="text-[var(--ink-2)] italic mt-4 max-w-[520px]">
          The cognitive overhang of re-entering reality after deep immersion in
          a fictional world.
        </p>
      </div>

      <div className="h-px bg-[var(--rule)] mt-6 mb-6" />
      <div>
        <p className="text-[var(--ink-2)] max-w-[520px]">
          Some stories don&apos;t just end. They leave a space where they used
          to be.
          <span className="block mt-1 text-[var(--ink-3)]">
            This is that space.
          </span>
        </p>
      </div>
      <div>
        <p className="note-text mt-8 max-w-[520px]">
          These are not mere favorites, but an index of temporal watermarks.
          These works carried enough cognitive overhang to make
          context-switching back to reality highly difficult. The resulting
          baseline update acts as a permanent, irreversible partition in my
          timeline.
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Entry card
// ---------------------------------------------------------------------------

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article>
      {/* Index + Experience year */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="meta">{String(index + 1).padStart(2, "0")}</span>
          <span className="meta">{entry.experienced}</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-[1.3125rem] leading-[1.3] mt-2">
          {entry.title}
        </h2>
      </div>

      {/* Creator */}
      <div>
        <p className="text-[var(--ink-2)] mt-1">{entry.creator}</p>
      </div>

      {/* Medium · Year */}
      <div>
        <span className="meta mt-1 block">
          {entry.medium[0].toUpperCase() + entry.medium.slice(1)} · {entry.year}
        </span>
      </div>

      {/* Image / Placeholder */}
      <div className="mt-8">
        <div className="aspect-[3/2] overflow-hidden relative">
          {!imgError ? (
            <Image
              src={entry.image}
              alt={entry.title}
              fill
              className="object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <span className="display text-[2.5rem] md:text-[3.25rem] text-[var(--ink)] opacity-[0.06] select-none">
                {entry.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reflection */}
      <div className="mt-8">
        <p className="text-[var(--ink-2)] border-l border-[var(--rule)] pl-6">
          {entry.reflection}
        </p>
      </div>
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
        {[...entries].reverse().map((entry, i) => (
          <EntryCard key={entry.title} entry={entry} index={entries.length - 1 - i} />
        ))}
      </div>

      {/* Closing */}
      <footer className="mt-32 mb-8 text-center">
        <div className="w-10 h-px bg-[var(--rule)] mx-auto mb-8" />
        <span className="meta block">Last updated March 2026</span>
      </footer>
    </div>
  )
}
