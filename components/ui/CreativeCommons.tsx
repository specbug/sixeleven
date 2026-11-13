import type React from "react"

// The licence line closing the About page: plain text, as the colophon above it
export function CreativeCommons() {
  const icon: React.CSSProperties = { width: "1em", height: "1em", marginLeft: ".2em", display: "inline-block", verticalAlign: "-0.15em" }

  return (
    <p className="note-text mt-8 mb-2">
      sixeleven.in by Rishit Vora is marked CC0 1.0
      <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style={icon} alt="" className="dark:invert" />
      <img src="https://mirrors.creativecommons.org/presskit/icons/zero.svg" style={icon} alt="" className="dark:invert" />
    </p>
  )
}
