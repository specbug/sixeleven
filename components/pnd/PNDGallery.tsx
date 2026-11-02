"use client"

import { useState } from "react"
import Image from "next/image"
import { PLATE, PLATE_OUTER } from "../plate"
import { ledeFont } from "@/lib/lede-font"

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
// Page
// ---------------------------------------------------------------------------

// Everything is on the page from the first paint: no reveals, no drawn-in rules.
function Hero() {
  return (
    <header className="pt-16 md:pt-24 pb-16">
      <h1 className="title text-[2.375rem] md:text-[3.25rem]">Post Narrative Depression</h1>
      <p className={`lede ${ledeFont.className} mt-4`}>
        The cognitive overhang of re-entering reality after deep immersion in a fictional world.
      </p>
      <p className="mt-8">
        Some stories don&apos;t just end. They leave a space where they used to be.
        <span className="block text-[var(--ink-2)]">This is that space.</span>
      </p>
      <p className="mt-6 text-[var(--ink-2)]">
        These are not mere favorites, but an index of temporal watermarks. These works carried enough cognitive overhang
        to make context-switching back to reality highly difficult. The resulting baseline update acts as a permanent,
        irreversible partition in my timeline.
      </p>
    </header>
  )
}

function EntryCard({ entry }: { entry: Entry }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article>
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-display text-[1.625rem] md:text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.01em]">
          {entry.title}
        </h2>
        {/* The year it was experienced */}
        <span className="meta text-[var(--ink-3)] shrink-0">{entry.experienced}</span>
      </div>
      <p className="text-[var(--ink-2)] mt-1">{entry.creator}</p>
      <p className="meta mt-1">
        {entry.medium} · {entry.year}
      </p>

      {!imgError && (
        <div className={PLATE_OUTER}>
          <div className={PLATE}>
            <div className="relative aspect-[3/2]">
              <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-contain" onError={() => setImgError(true)} />
            </div>
          </div>
        </div>
      )}

      <p className={`${imgError ? "mt-8" : ""} border-l border-[var(--rule)] pl-6`}>{entry.reflection}</p>
    </article>
  )
}

export default function PNDGallery() {
  return (
    <div>
      <Hero />

      <div className="space-y-24">
        {[...entries].reverse().map((entry) => (
          <EntryCard key={entry.title} entry={entry} />
        ))}
      </div>

      <p className="meta text-[var(--ink-3)] mt-24">Last updated March 2026</p>
    </div>
  )
}
