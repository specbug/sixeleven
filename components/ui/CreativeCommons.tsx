import type React from "react"
import { penFor } from "@/lib/pencil"

const Pen = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="pen" data-pen={penFor(href)}>
    {children}
  </a>
)

// The licence line closing the About page
export function CreativeCommons() {
  const icon: React.CSSProperties = { width: "1em", height: "1em", marginLeft: ".2em", display: "inline-block", verticalAlign: "-0.15em" }

  return (
    <p className="note-text mt-8 mb-2">
      <Pen href="https://sixeleven.in">sixeleven.in</Pen> by <Pen href="https://github.com/specbug">Rishit Vora</Pen> is marked{" "}
      <Pen href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</Pen>
      <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style={icon} alt="" className="dark:invert" />
      <img src="https://mirrors.creativecommons.org/presskit/icons/zero.svg" style={icon} alt="" className="dark:invert" />
    </p>
  )
}
