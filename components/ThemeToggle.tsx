"use client"

import { useState, type CSSProperties } from "react"
import { MoonIcon, SunIcon } from "./icons"

// Nine pencil flicks, unevenly spaced and of uneven length, so the burst reads as
// marks thrown by hand rather than a stamped star. Angles in degrees, lengths in px.
const FLICKS = [
  { a: 4, len: 6 },
  { a: 44, len: 4.5 },
  { a: 83, len: 6.5 },
  { a: 121, len: 5 },
  { a: 160, len: 6 },
  { a: 203, len: 4.5 },
  { a: 241, len: 6.5 },
  { a: 279, len: 5 },
  { a: 320, len: 5.5 },
]

// The theme switch. Its icon is drawn in the link pigment, since it is something you act
// on; switching throws a small burst of red-pencil flicks from it, in two strengths, which
// travel outward and fade in about half a second. Reduced motion skips the burst.
export default function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const [burst, setBurst] = useState(0)

  return (
    <button
      onClick={() => {
        onToggle()
        setBurst((b) => b + 1)
      }}
      className="theme-toggle relative p-2 -m-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
          {FLICKS.map((f, i) => (
            <span
              key={i}
              className="flick"
              style={
                {
                  "--a": `${f.a}deg`,
                  "--len": `${f.len}px`,
                  "--delay": `${(i % 3) * 18}ms`,
                  color: i % 2 ? "color-mix(in srgb, var(--cinnabar) 55%, transparent)" : "var(--cinnabar)",
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </button>
  )
}
