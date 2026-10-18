"use client"

import { useMemo } from "react"
import katex from "katex"

interface MathProps {
  children: string
}

// Math renders to HTML during server rendering, so equations are in the page
// before any script runs: readers see them at first paint, and crawlers that
// don't execute JavaScript read them too. KaTeX output is deterministic, so the
// client's hydration pass produces identical markup.
const render = (tex: string, displayMode: boolean) =>
  katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    errorColor: "#f00",
    // Same output as the default "warn", without logging on every build
    strict: "ignore",
  })

export function BlockMath({ children }: MathProps) {
  const html = useMemo(() => render(children, true), [children])
  return <div className="my-4 text-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
}

export function InlineMath({ children }: MathProps) {
  const html = useMemo(() => render(children, false), [children])
  return <span className="inline-block" dangerouslySetInnerHTML={{ __html: html }} />
}
