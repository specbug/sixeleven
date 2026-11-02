"use client"

import { useEffect, useRef } from "react"

// Maths: KaTeX renders each expression to MathML, and the browser lays it out with an
// OpenType maths font (TeX Gyre Pagella Math, see .katex in globals.css), which carries its
// own spacing, stretchy delimiters and italic correction. KaTeX is loaded as its own chunk,
// fetched only on a page that has maths; one load serves every expression on the page.

type Katex = typeof import("katex").default
let katexPromise: Promise<Katex> | null = null
const loadKatex = () => (katexPromise ??= import("katex").then((m) => m.default))

// Chrome honours mathvariant="normal" only, so bold, italic and double-struck runs are
// rewritten as Unicode mathematical alphanumerics (𝐟, 𝟏𝟎, ℝ), which every browser draws.
// Each entry: [A, a, 0] code points, with the letters Unicode places elsewhere.
const ALPHABETS: Record<string, { base: [number, number, number | null]; holes?: Record<string, number> }> = {
  bold: { base: [0x1d400, 0x1d41a, 0x1d7ce] },
  italic: { base: [0x1d434, 0x1d44e, null], holes: { h: 0x210e } },
  "bold-italic": { base: [0x1d468, 0x1d482, 0x1d7ce] },
  "double-struck": {
    base: [0x1d538, 0x1d552, 0x1d7d8],
    holes: { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 },
  },
}

function toAlphabet(variant: string, text: string) {
  const { base, holes } = ALPHABETS[variant]
  // Leave HTML entities (&nbsp;, &amp;) intact
  return text
    .split(/(&[#\w]+;)/)
    .map((part) =>
      part.startsWith("&")
        ? part
        : Array.from(part, (ch) => {
            if (holes?.[ch]) return String.fromCodePoint(holes[ch])
            if (ch >= "A" && ch <= "Z") return String.fromCodePoint(base[0] + ch.charCodeAt(0) - 65)
            if (ch >= "a" && ch <= "z") return String.fromCodePoint(base[1] + ch.charCodeAt(0) - 97)
            if (ch >= "0" && ch <= "9" && base[2] !== null) return String.fromCodePoint(base[2] + ch.charCodeAt(0) - 48)
            return ch
          }).join(""),
    )
    .join("")
}

const VARIANT_RUN = /<(mi|mn|mtext)([^>]*?)\smathvariant="(bold|italic|bold-italic|double-struck)"([^>]*)>([^<]*)<\/\1>/g

export function renderMath(katex: Katex, tex: string, displayMode: boolean) {
  return katex
    .renderToString(tex, { displayMode, output: "mathml", throwOnError: false, errorColor: "var(--cinnabar)", strict: "ignore" })
    .replace(VARIANT_RUN, (_m, tag, before, variant, after, text) => {
      // An <mi> keeps mathvariant="normal" so a single letter isn't italicised again
      const keep = tag === "mi" ? ' mathvariant="normal"' : ""
      return `<${tag}${before}${keep}${after}>${toAlphabet(variant, text)}</${tag}>`
    })
}

// Chrome ignores an <mtable>'s columnalign, columnspacing and rowspacing, so `aligned`
// and `align*` lose their alignment on the = sign. Copy each column's alignment and the
// table's spacing onto its cells, where Chrome does respect them. Columns past the last
// listed value take the last one, as MathML specifies.
function alignTables(root: HTMLElement) {
  root.querySelectorAll("mtable").forEach((table) => {
    const aligns = (table.getAttribute("columnalign") || "").split(/\s+/).filter(Boolean)
    const colGap = table.getAttribute("columnspacing")
    const rowGap = table.getAttribute("rowspacing")
    for (const row of Array.from(table.children)) {
      Array.from(row.children).forEach((cell, i) => {
        const style = (cell as HTMLElement).style
        if (aligns.length) style.textAlign = aligns[Math.min(i, aligns.length - 1)]
        if (colGap && i > 0) style.paddingInlineStart = colGap
        if (rowGap) style.paddingBlock = `calc(${rowGap} / 2)`
      })
    }
  })
}

function useMath<T extends HTMLElement>(tex: string, displayMode: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    let live = true
    loadKatex()
      .then((katex) => {
        if (!live || !ref.current) return
        ref.current.innerHTML = renderMath(katex, tex, displayMode)
        alignTables(ref.current)
      })
      .catch(() => {
        // KaTeX failed to load: show the source rather than nothing
        if (live && ref.current) ref.current.textContent = displayMode ? `$$${tex}$$` : `$${tex}$`
      })
    return () => {
      live = false
    }
  }, [tex, displayMode])
  return ref
}

export function BlockMath({ children }: { children: string }) {
  const ref = useMath<HTMLDivElement>(children, true)
  return <div ref={ref} className="math-block" />
}

export function InlineMath({ children }: { children: string }) {
  const ref = useMath<HTMLSpanElement>(children, false)
  return <span ref={ref} />
}
