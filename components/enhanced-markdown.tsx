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


// Links: the link signal, with a 1px underline at 45% that strengthens on hover
const MarkdownLink = ({ href, children, node, ...props }: any) => {
  if (!href) return <span>{children}</span>

  const isExternal = href.startsWith("http")

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="link"
      {...props}
    >
      {children}
    </a>
  )
}

// Inline markdown (links, emphasis, code) for text that arrives as a raw string:
// captions, callouts, video captions. Bare URLs autolink via GFM.
export const Inline = ({ text }: { text: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }: any) => <>{children}</>, a: MarkdownLink }}>
    {text}
  </ReactMarkdown>
)

// Callouts: set off by hairlines with a small label above. The label's word carries
// the type; colour is reserved for the signal code.
const Callout = ({ type, label: custom, text }: { type: "info" | "warning" | "error"; label?: string; text: string }) => {
  const label = custom || { info: "Note", warning: "Caution", error: "Important" }[type]

  return (
    <aside className="my-8 py-6 border-y border-[var(--rule)]" role="note">
      <span className="meta block mb-2 text-[var(--ink-2)]">{label}</span>
      <p className="m-0 text-[var(--ink)]">
        <Inline text={text} />
      </p>
    </aside>
  )
}

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

// Text of a hast node, for reading a footnote marker's number
const hastText = (node: any): string =>
  node?.value ?? (node?.children ?? []).map(hastText).join("")

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

      return <p className="relative mt-0 mb-4 text-[var(--ink)]" {...props}>{processedChildren}</p>
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
                <span className={PLATE_CAPTION}>
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

      return <p className="relative mt-0 mb-4 text-[var(--ink)]" {...props}>{parts}</p>
    }

    return <p className="relative mt-0 mb-4 text-[var(--ink)]" {...props}>{children}</p>
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
          <span className={PLATE_CAPTION}>
            <Inline text={caption} />
          </span>
        )}
      </span>
    )
  },

  // Headings - rendered as authored (sentence case in posts)
  // Scale steps down from the 52px post title so sections read as sections, not
  // rival titles; 32px above, 8px below binds each heading to its text.
  h1: ({ children, node, ...props }: any) => (
    <h1 className="text-[1.625rem] leading-[1.2] mt-12 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, node, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h2 id={id} className="text-[1.3125rem] leading-[1.3] mt-12 mb-2 scroll-mt-24" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, node, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h3 id={id} className="text-[1.15625rem] leading-[1.4] mt-8 mb-1 scroll-mt-24" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, node, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h4 id={id} className="text-[1.15625rem] leading-[1.4] mt-6 mb-1 text-[var(--ink-2)] scroll-mt-24" {...props}>
        {children}
      </h4>
    )
  },

  a: MarkdownLink,

  // Footnotes (GFM `[^1]`): a superscript numeral in the note hue. On wide screens the
  // note itself sits in the right margin, its first baseline on the baseline of the line
  // that cites it (aligned by alignSidenotes below, from the two zero-size anchors);
  // narrower screens get the notes under a hairline at the end of the post.
  sup: ({ children, node, ...props }: any) => {
    const marker = hastText(node).trim()
    const isRef = node?.children?.[0]?.properties?.dataFootnoteRef !== undefined
    const note = isRef ? footnotes[marker] : undefined
    return (
      <>
        {note && <span data-sidenote-anchor={marker} className="inline-block w-0 h-0" aria-hidden="true" />}
        <sup className="[&>a]:no-underline [&>a]:text-[var(--note)]" {...props}>
          {children}
        </sup>
        {note && (
          <span
            role="note"
            data-sidenote={marker}
            className="note-text hidden xl:block absolute left-full top-0 ml-[104px] w-[200px] [text-wrap:pretty]"
          >
            <span data-sidenote-baseline className="inline-block w-0 h-0" aria-hidden="true" />
            <span className="font-flex tabular-nums text-[var(--note)] mr-1.5">{marker}</span>
            <Inline text={note} />
          </span>
        )}
      </>
    )
  },
  // (The end-of-post footnote section itself is styled in globals.css via
  // `section[data-footnotes]`, and hidden where the sidenotes take over.)

  // Blockquote: a 1px rule, no italics
  blockquote: ({ children, node, ...props }: any) => (
    <blockquote
      className="border-l border-[var(--rule)] pl-6 mt-0 mb-6 text-[var(--ink-2)] [&>p]:text-[var(--ink-2)]"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Inline code - no rounded corners
  // Note: In react-markdown v9+, `inline` prop is removed. Code blocks have language-* class.
  code: ({ node, className, children, ...props }: any) => {
    const content = String(children).trim()
    const match = /language-(\w+)/.exec(className || "")

    // If it has a language class, it's a code block (from ```lang ... ```)
    // Otherwise it's inline code (from `...`)
    const isCodeBlock = match !== null

    if (!isCodeBlock) {
      return (
        <code
          className="bg-[var(--sheet)] text-[var(--ink)] px-[0.3em] py-[0.1em] font-mono text-[0.89em] [font-variant-ligatures:none] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] before:content-none after:content-none"
          {...props}
        >
          {children}
        </code>
      )
    }

    const language = match ? match[1] : ""

    return <CodeBlock code={content.replace(/\n$/, "")} language={language || "text"} />
  },

  pre: ({ children }: any) => {
    return <Fragment>{children}</Fragment>
  },

  ul: ({ children, node, ...props }: any) => (
    <ul className="list-disc pl-6 mt-0 mb-4 text-[var(--ink)] marker:text-[var(--ink-3)]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, node, ...props }: any) => (
    <ol className="list-decimal pl-6 mt-0 mb-4 text-[var(--ink)] marker:text-[var(--ink-3)] marker:tabular-nums" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, node, ...props }: any) => (
    <li className="my-1 pl-1" {...props}>
      {mathify(children)}
    </li>
  ),

  // Tables - mono font for data alignment
  table: ({ children, node, ...props }: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full font-flex text-[0.875rem] leading-[1.45] border-collapse tabular-nums" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, node, ...props }: any) => (
    <thead className="border-b border-[var(--ink-3)]" {...props}>{children}</thead>
  ),
  th: ({ children, node, ...props }: any) => (
    <th className="text-left py-2 pr-6 font-[560] whitespace-nowrap text-[var(--ink-2)]" {...props}>{children}</th>
  ),
  td: ({ children, node, ...props }: any) => (
    <td className="py-2 pr-6 whitespace-nowrap text-[var(--ink)] border-b border-[var(--rule)]" {...props}>{mathify(children)}</td>
  ),

  // Horizontal rule - subtle
  hr: ({ node, ...props }: any) => <hr className="my-8 border-t border-[var(--rule)]" {...props} />,
})

interface EnhancedMarkdownProps {
  content: string
}

// Sit each margin note so its first baseline lies on the baseline of the line that
// cites it. Both baselines come from zero-size inline-blocks, whose bottom edge is the
// baseline of their line: one just before the citing superscript, one at the start of
// the note.
function alignSidenotes() {
  document.querySelectorAll<HTMLElement>("[data-sidenote]").forEach((note) => {
    const anchor = document.querySelector<HTMLElement>(`[data-sidenote-anchor="${note.dataset.sidenote}"]`)
    const own = note.querySelector<HTMLElement>("[data-sidenote-baseline]")
    const parent = note.offsetParent as HTMLElement | null
    if (!anchor || !own || !parent || note.offsetWidth === 0) return
    const lineBaseline = anchor.getBoundingClientRect().bottom - parent.getBoundingClientRect().top
    const noteBaseline = own.getBoundingClientRect().bottom - note.getBoundingClientRect().top
    note.style.top = `${lineBaseline - noteBaseline}px`
  })
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
    alignSidenotes()
    document.fonts?.ready.then(alignSidenotes)
    window.addEventListener("resize", alignSidenotes)
    return () => window.removeEventListener("resize", alignSidenotes)
  }, [content])

  const customComponents = useMemo(
    () => createCustomComponents(blockMathExpressions, callouts, footnotes),
    [blockMathExpressions, callouts, footnotes],
  )

  return (
    <Fragment>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
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
            <p className="note-text mt-2">{img.caption}</p>
          </div>
        </div>
      ))}

      {/* Side-by-side images */}
      {sideBySideImages.map((group, groupIndex) => (
        <div key={groupIndex} className="my-8 flex flex-col md:flex-row gap-4">
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
