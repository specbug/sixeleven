"use client"

import { useEffect, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { CodeBlock } from "./code-block"
import { BlockMath, InlineMath } from "./ui/LaTeX-alt"
import React, { Fragment } from "react"
import { CreativeCommons } from "./ui/CreativeCommons"
import { ClaudeDisclaimer } from "./ui/ClaudeDisclaimer"
import { PLATE, PLATE_CAPTION, PLATE_OUTER } from "./plate"
import { penFor, rehypePencil } from "@/lib/pencil"
import { remarkSmartQuotes } from "@/lib/typography"

// Links: the red pencil. Ink text over a hand-drawn cinnabar stroke (see .pen in
// globals.css). The stroke variant arrives as data-pen from rehypePencil; links rendered
// outside a document (a lone caption) hash their own.
export const MarkdownLink = ({ href, children, node, ...props }: any) => {
  if (!href) return <span>{children}</span>

  const isExternal = href.startsWith("http")

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-pen={penFor(href)}
      {...props}
      className="pen"
    >
      {children}
    </a>
  )
}

// Inline markdown (links, emphasis, code) for text that arrives as a raw string:
// captions, callouts, notes. Bare URLs autolink via GFM.
export const Inline = ({ text }: { text: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkSmartQuotes]}
    rehypePlugins={[rehypePencil]}
    components={{ p: ({ children }: any) => <>{children}</>, a: MarkdownLink }}
  >
    {text}
  </ReactMarkdown>
)

// Callouts: a red-pencil edge and label on the bare paper, like an editor's marginal
// mark. The label's word carries the type (Note, Caution, Important, or the author's own).
const Callout = ({ type, label: custom, text }: { type: "info" | "warning" | "error"; label?: string; text: string }) => {
  const label = custom || { info: "Note", warning: "Caution", error: "Important" }[type]

  return (
    <aside className="callout my-8" role="note">
      <span className="callout-label block mb-1.5">{label}</span>
      <p className="m-0">
        <Inline text={text} />
      </p>
    </aside>
  )
}

// Text of a hast node, for reading a footnote marker's number
const hastText = (node: any): string =>
  node?.value ?? (node?.children ?? []).map(hastText).join("")

// Footnote markers cited inside a hast node, in order
const citedNotes = (node: any): string[] => {
  const found: string[] = []
  const walk = (n: any) => {
    if (n?.type === "element" && n.tagName === "sup" && n.children?.[0]?.properties?.dataFootnoteRef !== undefined) {
      found.push(hastText(n).trim())
    }
    n?.children?.forEach(walk)
  }
  walk(node)
  return found
}

// Below 1280px there is no margin, so a paragraph's notes follow it
const NotesAfter = ({ markers, footnotes }: { markers: string[]; footnotes: Record<string, string> }) => {
  const notes = markers.filter((m) => footnotes[m])
  if (notes.length === 0) return null
  return (
    <aside className="xl:hidden note-text -mt-2 mb-6 pl-4 border-l border-[var(--rule)] space-y-2">
      {notes.map((m) => (
        <p key={m} className="m-0">
          <span className="note-num mr-1.5">{m}</span>
          <Inline text={footnotes[m]} />
        </p>
      ))}
    </aside>
  )
}

const PARAGRAPH = "relative mt-0 mb-6"

// The notes margin: 104px off the column (clear of the 80px plate bleed by 24px), 200px
// wide, 216px from 1440px. Shared by sidenotes and figure captions.
export const MARGIN = "hidden xl:block absolute left-full top-0 ml-[104px] w-[200px] min-[1440px]:w-[216px]"

// Heading ids, matching parseHeadings in lib/mdx
const slug = (children: any) =>
  React.Children.toArray(children)
    .map((c: any) => (typeof c === "string" ? c : hastText(c?.props?.node) || ""))
    .join("")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

// Inline `$...$` math in any run of text: list items and table cells get the same
// treatment as paragraphs
const mathify = (children: any): any => {
  const items = Array.isArray(children) ? children : [children]
  return items.map((child, index) => {
    if (typeof child !== "string" || !child.includes("$") || child.includes("$$")) return child
    const parts: any[] = []
    let last = 0
    let inMath = false
    let expr = ""
    for (let i = 0; i < child.length; i++) {
      if (child[i] === "$") {
        if (!inMath) {
          if (i > last) parts.push(child.substring(last, i))
          inMath = true
          expr = ""
        } else {
          parts.push(<InlineMath key={`m-${index}-${i}`}>{expr}</InlineMath>)
          inMath = false
        }
        last = i + 1
      } else if (inMath) {
        expr += child[i]
      }
    }
    if (last < child.length) parts.push(child.substring(last))
    return <Fragment key={`t-${index}`}>{parts}</Fragment>
  })
}

// Custom components for ReactMarkdown - Dieter Rams inspired styling
const createCustomComponents = (
  blockMathExpressions: string[],
  callouts: Array<{ type: "info" | "warning" | "error"; label?: string; text: string }>,
  footnotes: Record<string, string>,
) => ({
  p: ({ children, node, ...props }: any) => {
    if (Array.isArray(children)) {
      const processedChildren = children.map((child, index) => {
        if (typeof child === "string") {
          if (child.includes("{{block-math:")) {
            const match = child.match(/\{\{block-math:(\d+)\}\}/)
            if (match && match[1]) {
              const index = Number.parseInt(match[1], 10)
              if (blockMathExpressions[index]) {
                return <BlockMath key={`math-${index}`}>{blockMathExpressions[index]}</BlockMath>
              }
            }
          }

          if (child.includes("{{color:")) {
            const processed = child.replace(/{{color:([^}]+)}}/g, (_, color) => {
              const [colorValue, content] = color.split("|")
              return `<span style="color:${colorValue}">${content}</span>`
            })
            return <span key={`color-${index}`} dangerouslySetInnerHTML={{ __html: processed }} />
          }

          if (child.includes("{{youtube:")) {
            const match = child.match(/{{youtube:([^}]+)}}/)
            if (match && match[1]) {
              const videoId = match[1]
              return (
                <span key={`youtube-${index}`} className={PLATE_OUTER}>
                  <span className={PLATE}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="block w-full aspect-video"
                    ></iframe>
                  </span>
                </span>
              )
            }
          }

          if (child.includes("$") && !child.includes("$$")) {
            const parts = []
            let lastIndex = 0
            let inMath = false
            let mathContent = ""

            for (let i = 0; i < child.length; i++) {
              if (child[i] === "$") {
                if (!inMath) {
                  if (i > lastIndex) {
                    parts.push(child.substring(lastIndex, i))
                  }
                  inMath = true
                  mathContent = ""
                } else {
                  parts.push(<InlineMath key={`math-${i}`}>{mathContent}</InlineMath>)
                  inMath = false
                }
                lastIndex = i + 1
              } else if (inMath) {
                mathContent += child[i]
              }
            }

            if (lastIndex < child.length) {
              parts.push(child.substring(lastIndex))
            }

            return <React.Fragment key={`latex-${index}`}>{parts}</React.Fragment>
          }
        }

        return child
      })

      return (
        <>
          <p className={PARAGRAPH} {...props}>{processedChildren}</p>
          <NotesAfter markers={citedNotes(node)} footnotes={footnotes} />
        </>
      )
    }

    const text = children ? String(children) : ""

    if (
      text.includes("{{block-math:") ||
      text.includes("{{color:") ||
      text.includes("{{youtube:") ||
      text.includes("{{image-with-caption:") ||
      text.includes("{{side-by-side:") ||
      text.includes("{{callout-ref:") ||
      text.includes("{{creativecommons}}") ||
      text.includes("{{claude-disclaimer}}")
    ) {
      if (text.includes("{{block-math:")) {
        const match = text.match(/\{\{block-math:(\d+)\}\}/)
        if (match && match[1]) {
          const index = Number.parseInt(match[1], 10)
          if (blockMathExpressions[index]) {
            return <BlockMath>{blockMathExpressions[index]}</BlockMath>
          }
        }
      }

      if (text.includes("{{color:")) {
        const processed = text.replace(/{{color:([^}]+)}}/g, (_, color) => {
          const [colorValue, content] = color.split("|")
          return `<span style="color:${colorValue}">${content}</span>`
        })

        return <p {...props} dangerouslySetInnerHTML={{ __html: processed }} />
      }

      // `{{youtube:ID|caption}}` - the caption sits under the plate like an image's
      if (text.includes("{{youtube:")) {
        const match = text.match(/{{youtube:([^}|]+)(?:\|([^}]*))?}}/)
        if (match && match[1]) {
          const videoId = match[1]
          const caption = match[2]?.trim()
          return (
            <div className={PLATE_OUTER}>
              <div className={PLATE}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={caption || "YouTube video player"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="block w-full aspect-video"
                ></iframe>
              </div>
              {caption && (
                <span className={PLATE_CAPTION} data-margin>
                  <Inline text={caption} />
                </span>
              )}
            </div>
          )
        }
      }

      if (text.includes("{{image-with-caption:") || text.includes("{{side-by-side:")) {
        return null
      }

      if (text.includes("{{creativecommons}}")) {
        return <CreativeCommons />
      }

      if (text.includes("{{claude-disclaimer}}")) {
        return <ClaudeDisclaimer />
      }

      // Callouts were lifted out before parsing (see EnhancedMarkdown), so their
      // text can carry links and emphasis without the markdown parser splitting them
      if (text.includes("{{callout-ref:")) {
        const match = text.match(/\{\{callout-ref:(\d+)\}\}/)
        const callout = match && callouts[Number.parseInt(match[1], 10)]
        if (callout) return <Callout type={callout.type} label={callout.label} text={callout.text} />
      }
    }

    if (typeof text === "string" && text.includes("$") && !text.includes("$$")) {
      const parts = []
      let lastIndex = 0
      let inMath = false
      let mathContent = ""

      for (let i = 0; i < text.length; i++) {
        if (text[i] === "$") {
          if (!inMath) {
            if (i > lastIndex) {
              parts.push(text.substring(lastIndex, i))
            }
            inMath = true
            mathContent = ""
          } else {
            parts.push(<InlineMath key={`math-${i}`}>{mathContent}</InlineMath>)
            inMath = false
          }
          lastIndex = i + 1
        } else if (inMath) {
          mathContent += text[i]
        }
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex))
      }

      return (
        <>
          <p className={PARAGRAPH} {...props}>{parts}</p>
          <NotesAfter markers={citedNotes(node)} footnotes={footnotes} />
        </>
      )
    }

    return (
      <>
        <p className={PARAGRAPH} {...props}>{children}</p>
        <NotesAfter markers={citedNotes(node)} footnotes={footnotes} />
      </>
    )
  },

  img: ({ src, alt, ...props }: any) => {
    if (!src) return null

    const parts = alt ? alt.split("::") : [""]
    const imageAlt = parts[0].trim()
    const caption = parts.length > 1 ? parts[1].trim() : null

    let width = 800
    let height = 450
    let maxWidth: number | undefined
    let finalSrc = src

    try {
      if (src.includes("?")) {
        const urlObj = new URL(src, "http://example.com")
        const params = new URLSearchParams(urlObj.search)

        const widthParam = params.get("width")
        const heightParam = params.get("height")
        // `maxwidth=N` caps how wide a figure renders on its plate (in CSS px):
        // tall and square images otherwise fill the whole column and tower over
        // the prose. The image keeps its aspect ratio and sits centred.
        const maxWidthParam = params.get("maxwidth")

        if (widthParam) width = Number.parseInt(widthParam, 10)
        if (heightParam) height = Number.parseInt(heightParam, 10)
        if (maxWidthParam) maxWidth = Number.parseInt(maxWidthParam, 10)

        if (!src.startsWith("http")) {
          finalSrc = urlObj.pathname
        }
      }
    } catch (error) {
      console.error("Error parsing image dimensions:", error)
    }

    const isGif = finalSrc.toLowerCase().endsWith(".gif")

    // `![alt::caption](src)` puts a caption under the plate
    return (
      <span className={PLATE_OUTER}>
        <span className={PLATE}>
          <Image
            src={finalSrc || "/placeholder.svg"}
            alt={imageAlt}
            width={width}
            height={height}
            unoptimized={src.startsWith("http") || isGif}
            className="block mx-auto h-auto max-w-full"
            style={maxWidth ? { maxWidth: `min(100%, ${maxWidth}px)` } : undefined}
          />
        </span>
        {caption && (
          <span className={PLATE_CAPTION} data-margin>
            <Inline text={caption} />
          </span>
        )}
      </span>
    )
  },

  // Headings: Google Sans, as authored. Ids match parseHeadings in lib/mdx. The scale steps
  // down from the post title so sections read as sections; 48px above, 8px below binds
  // each heading to its text.
  h1: ({ children, node, ...props }: any) => (
    <h1 className="text-[1.75rem] md:text-[2rem] leading-[1.15] font-semibold tracking-[-0.012em] mt-12 mb-3" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, node, ...props }: any) => (
    <h2 id={slug(children)} className="text-[1.375rem] md:text-[1.5625rem] leading-[1.2] font-semibold tracking-[-0.01em] mt-12 mb-2 scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, node, ...props }: any) => (
    <h3 id={slug(children)} className="text-[1.1875rem] leading-[1.25] font-semibold tracking-[-0.005em] mt-10 mb-2 scroll-mt-24" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, node, ...props }: any) => (
    <h4 id={slug(children)} className="text-[1.0625rem] leading-[1.35] font-semibold tracking-normal mt-8 mb-2 scroll-mt-24" {...props}>
      {children}
    </h4>
  ),

  a: MarkdownLink,

  // Footnotes (GFM `[^1]`): a red-pencil numeral in the text, not a link. From 1280px the note
  // sits in the right margin, its first baseline on the baseline of the line that cites it
  // (alignMarginNotes, from the two zero-size anchors); narrower, it follows its paragraph.
  sup: ({ children, node, ...props }: any) => {
    const marker = hastText(node).trim()
    const isRef = node?.children?.[0]?.properties?.dataFootnoteRef !== undefined
    if (!isRef) return <sup {...props}>{children}</sup>
    const note = footnotes[marker]
    return (
      <>
        {note && <span data-note-anchor={marker} className="inline-block w-0 h-0" aria-hidden="true" />}
        <sup className="note-num">{marker}</sup>
        {note && (
          <span role="note" data-note={marker} className={`note-text ${MARGIN} [text-wrap:pretty]`}>
            <span data-note-baseline className="inline-block w-0 h-0" aria-hidden="true" />
            <span className="note-num mr-1.5">{marker}</span>
            <Inline text={note} />
          </span>
        )}
      </>
    )
  },

  // Blockquote: upright, in the secondary ink, set off by a red-pencil rule at half
  // strength, quieter than a callout's edge
  blockquote: ({ children, node, ...props }: any) => (
    <blockquote className="border-l-2 border-[color-mix(in_oklch,var(--cinnabar)_50%,transparent)] pl-6 mt-0 mb-6 text-[var(--ink-2)]" {...props}>
      {children}
    </blockquote>
  ),

  // Inline code sits on a faint wash; fenced code (```lang) goes to CodeBlock
  code: ({ node, className, children, ...props }: any) => {
    const content = String(children).trim()
    const match = /language-(\w+)/.exec(className || "")

    if (!match) {
      return (
        <code
          className="bg-[var(--grid)] px-[0.3em] py-[0.08em] text-[0.89em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
          {...props}
        >
          {children}
        </code>
      )
    }

    return <CodeBlock code={content.replace(/\n$/, "")} language={match[1] || "text"} />
  },

  pre: ({ children }: any) => <Fragment>{children}</Fragment>,

  ul: ({ children, node, ...props }: any) => (
    <ul className="list-disc pl-6 mt-0 mb-6 marker:text-[var(--ink-3)]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, node, ...props }: any) => (
    <ol className="list-decimal pl-6 mt-0 mb-6 marker:text-[var(--ink-3)] marker:[font-family:var(--font-flex)] marker:[font-variant-numeric:tabular-nums]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, node, ...props }: any) => (
    <li className="relative my-1.5 pl-1" {...props}>
      {mathify(children)}
      {/* In a loose list the item's paragraphs place their own notes */}
      {!node?.children?.some((c: any) => c.tagName === "p") && <NotesAfter markers={citedNotes(node)} footnotes={footnotes} />}
    </li>
  ),

  // Tables: figures in Google Sans Flex, tabular; hairlines between rows
  table: ({ children, node, ...props }: any) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full font-flex text-[0.875rem] leading-[1.45] border-collapse [font-variant-numeric:tabular-nums]" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, node, ...props }: any) => (
    <thead className="border-b border-[var(--ink-3)]" {...props}>{children}</thead>
  ),
  th: ({ children, node, style, ...props }: any) => (
    <th className="text-left py-2 pr-4 font-[560] whitespace-nowrap" style={style} {...props}>{children}</th>
  ),
  td: ({ children, node, style, ...props }: any) => (
    <td className="py-2 pr-4 whitespace-nowrap border-b border-[var(--rule)]" style={style} {...props}>{mathify(children)}</td>
  ),

  hr: ({ node, ...props }: any) => <hr className="my-12 border-t border-[var(--rule)]" {...props} />,
})

// Puts each sidenote's first baseline on the baseline of the line that cites it. Both
// baselines come from zero-size inline-blocks, whose bottom edge is the baseline of their
// line: one just before the citing numeral, one at the start of the note. A note that
// would overlap the note or caption above it moves down just far enough to clear it.
function alignMarginNotes() {
  document.querySelectorAll<HTMLElement>("[data-note]").forEach((note) => {
    const anchor = document.querySelector<HTMLElement>(`[data-note-anchor="${note.dataset.note}"]`)
    const own = note.querySelector<HTMLElement>("[data-note-baseline]")
    const parent = note.offsetParent as HTMLElement | null
    if (!anchor || !own || !parent || note.offsetWidth === 0) return
    note.style.top = "0px"
    const parentTop = parent.getBoundingClientRect().top
    const noteBox = note.getBoundingClientRect()
    let top = anchor.getBoundingClientRect().bottom - parentTop - (own.getBoundingClientRect().bottom - noteBox.top)
    // The lowest margin item that starts above this note and reaches into it
    let floor = -Infinity
    document.querySelectorAll<HTMLElement>("[data-note], [data-margin]").forEach((other) => {
      if (other === note || other.offsetWidth === 0) return
      const r = other.getBoundingClientRect()
      if (Math.abs(r.left - noteBox.left) < 4 && r.top < parentTop + top) floor = Math.max(floor, r.bottom)
    })
    if (floor + 8 > parentTop + top) top = floor + 8 - parentTop
    note.style.top = `${top}px`
  })
}

interface EnhancedMarkdownProps {
  content: string
}

export function EnhancedMarkdown({ content }: EnhancedMarkdownProps) {
  const { processedContent, captionedImages, sideBySideImages, blockMathExpressions, callouts, footnotes } = useMemo(() => {
    // Footnote definitions, keyed by label, so markers can show them as sidenotes
    const footnoteStore: Record<string, string> = {}
    for (const m of content.matchAll(/^\[\^([^\]]+)\]:[ \t]*(.+)$/gm)) footnoteStore[m[1]] = m[2].trim()

    // Lift callouts out whole, so markdown inside them (links, emphasis) survives parsing.
    // `{{callout:type|text}}` or `{{callout:type|Label|text}}` - a label of a few words
    // replaces the default one (note / caution / important)
    const calloutStore: Array<{ type: "info" | "warning" | "error"; label?: string; text: string }> = []
    let contentWithoutBlockMath = content.replace(/\{\{callout:(info|warning|error)\|(?:([^|{}\n]{1,24})\|)?([\s\S]*?)\}\}/g, (_m, type, label, text) => {
      calloutStore.push({ type, label: label?.trim(), text: text.trim() })
      return `{{callout-ref:${calloutStore.length - 1}}}`
    })
    const mathBlocks: string[] = []

    contentWithoutBlockMath = contentWithoutBlockMath.replace(/\$\$([\s\S]*?)\$\$/g, (_match, expr) => {
      const id = mathBlocks.length
      mathBlocks.push(expr)
      return `{{block-math:${id}}}`
    })

    let processedWithSideBySide = contentWithoutBlockMath
    const sideBySideGroups: Array<{ images: Array<{ src: string; alt: string; width: number; height: number }> }> = []

    processedWithSideBySide = processedWithSideBySide.replace(
      /\{\{side-by-side\}\}([\s\S]*?)\{\{\/side-by-side\}\}/g,
      (match, imagesContent) => {
        const images: Array<{ src: string; alt: string; width: number; height: number }> = []

        const imageMatches = [...imagesContent.matchAll(/!\[(.*?)\]$$(.+?)$$/g)]
        for (const imageMatch of imageMatches) {
          const alt = imageMatch[1] || ""
          let src = imageMatch[2] || ""

          let width = 400
          let height = 300

          try {
            if (src.includes("?")) {
              const urlObj = new URL(src, "http://example.com")
              const params = new URLSearchParams(urlObj.search)

              const widthParam = params.get("width")
              const heightParam = params.get("height")

              if (widthParam) width = Number.parseInt(widthParam, 10)
              if (heightParam) height = Number.parseInt(heightParam, 10)

              if (!src.startsWith("http")) {
                src = urlObj.pathname
              }
            }
          } catch {
            // ignore malformed URLs
          }

          images.push({ src, alt, width, height })
        }

        if (images.length > 0) {
          const id = sideBySideGroups.length
          sideBySideGroups.push({ images })
          return `{{side-by-side:${id}}}`
        }

        return match
      },
    )

    processedWithSideBySide = processedWithSideBySide.replace(
      /!\[(.*?)\]$$(.+?)$$\s*\|\s*!\[(.*?)\]$$(.+?)$$/g,
      (_match, alt1, src1, alt2, src2) => {
        const images: Array<{ src: string; alt: string; width: number; height: number }> = []

        let width1 = 400
        let height1 = 300
        let finalSrc1 = src1

        try {
          if (src1.includes("?")) {
            const urlObj = new URL(src1, "http://example.com")
            const params = new URLSearchParams(urlObj.search)

            const widthParam = params.get("width")
            const heightParam = params.get("height")

            if (widthParam) width1 = Number.parseInt(widthParam, 10)
            if (heightParam) height1 = Number.parseInt(heightParam, 10)

            if (!src1.startsWith("http")) {
              finalSrc1 = urlObj.pathname
            }
          }
        } catch {
          // ignore malformed URLs
        }

        let width2 = 400
        let height2 = 300
        let finalSrc2 = src2

        try {
          if (src2.includes("?")) {
            const urlObj = new URL(src2, "http://example.com")
            const params = new URLSearchParams(urlObj.search)

            const widthParam = params.get("width")
            const heightParam = params.get("height")

            if (widthParam) width2 = Number.parseInt(widthParam, 10)
            if (heightParam) height2 = Number.parseInt(heightParam, 10)

            if (!src2.startsWith("http")) {
              finalSrc2 = urlObj.pathname
            }
          }
        } catch {
          // ignore malformed URLs
        }

        images.push({ src: finalSrc1, alt: alt1, width: width1, height: height1 })
        images.push({ src: finalSrc2, alt: alt2, width: width2, height: height2 })

        const id = sideBySideGroups.length
        sideBySideGroups.push({ images })
        return `{{side-by-side:${id}}}`
      },
    )

    const captionImages: Array<{ src: string; alt: string; caption: string; width: number; height: number }> = []
    const processed = processedWithSideBySide.replace(/!\[(.*?)::(.+?)\]$$(.+?)$$/g, (_match, alt, caption, src) => {
      let width = 800
      let height = 450
    let maxWidth: number | undefined
      let finalSrc = src

      try {
        if (src.includes("?")) {
          const urlObj = new URL(src, "http://example.com")
          const params = new URLSearchParams(urlObj.search)

          const widthParam = params.get("width")
          const heightParam = params.get("height")

          if (widthParam) width = Number.parseInt(widthParam, 10)
          if (heightParam) height = Number.parseInt(heightParam, 10)

          if (!src.startsWith("http")) {
            finalSrc = urlObj.pathname
          }
        }
      } catch {
        // ignore malformed URLs
      }

      const id = captionImages.length
      captionImages.push({ src: finalSrc, alt, caption, width, height })
      return `{{image-with-caption:${id}}}`
    })

    return {
      processedContent: processed,
      captionedImages: captionImages,
      sideBySideImages: sideBySideGroups,
      blockMathExpressions: mathBlocks,
      callouts: calloutStore,
      footnotes: footnoteStore,
    }
  }, [content])

  useEffect(() => {
    alignMarginNotes()
    document.fonts?.ready.then(alignMarginNotes)
    window.addEventListener("resize", alignMarginNotes)
    // Images and math change line positions as they load
    const ro = new ResizeObserver(() => alignMarginNotes())
    ro.observe(document.body)
    return () => {
      window.removeEventListener("resize", alignMarginNotes)
      ro.disconnect()
    }
  }, [content])

  const customComponents = useMemo(
    () => createCustomComponents(blockMathExpressions, callouts, footnotes),
    [blockMathExpressions, callouts, footnotes],
  )

  return (
    <Fragment>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkSmartQuotes]} rehypePlugins={[rehypePencil]} components={customComponents}>
        {processedContent}
      </ReactMarkdown>

      {/* Captioned images */}
      {captionedImages.map((img, index) => (
        <div key={index} className={PLATE_OUTER}>
          <div className={PLATE}>
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              width={img.width}
              height={img.height}
              unoptimized={img.src.startsWith("http") || img.src.toLowerCase().endsWith(".gif")}
            />
          </div>
          <span className={PLATE_CAPTION} data-margin>
            <Inline text={img.caption} />
          </span>
        </div>
      ))}

      {/* Side-by-side images */}
      {sideBySideImages.map((group, groupIndex) => (
        <div key={groupIndex} className={`${PLATE_OUTER} flex flex-col md:flex-row gap-4`}>
          {group.images.map((img, imgIndex) => (
            <div key={imgIndex} className="flex-1 flex items-center justify-center">
              <Image
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                width={img.width}
                height={img.height}
                unoptimized={img.src.startsWith("http") || img.src.toLowerCase().endsWith(".gif")}
              />
            </div>
          ))}
        </div>
      ))}
    </Fragment>
  )
}
