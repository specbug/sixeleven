"use client"

import { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { CodeBlock } from "./code-block"
import { BlockMath, InlineMath } from "./ui/LaTeX-alt"
import React, { Fragment } from "react"
import { CreativeCommons } from "./ui/CreativeCommons"
import { ClaudeDisclaimer } from "./ui/ClaudeDisclaimer"

// Media sits on a plate: a quiet surface that sets figures apart from prose. On
// desktop it extends past the text column equally on both sides (640 -> 736 -> 800px);
// on phones it runs edge to edge, with padding that keeps the media on the text margin.
// Spans, not figure/div, because markdown places images inside <p>.
const PLATE_OUTER = "block my-8 -mx-6 md:-mx-12 lg:-mx-20"
const PLATE = "block bg-[var(--plate)] p-6 md:p-8 lg:p-10"
const PLATE_CAPTION = "block mt-3 px-6 md:px-0 text-sm leading-snug text-[var(--foreground-muted)]"

// Custom components for ReactMarkdown - Dieter Rams inspired styling
const createCustomComponents = (blockMathExpressions: string[]) => ({
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
                      width="560"
                      height="315"
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

      return <p className="mt-0 mb-4 text-[var(--foreground-body)]" {...props}>{processedChildren}</p>
    }

    const text = children ? String(children) : ""

    if (
      text.includes("{{block-math:") ||
      text.includes("{{color:") ||
      text.includes("{{youtube:") ||
      text.includes("{{image-with-caption:") ||
      text.includes("{{side-by-side:") ||
      text.includes("{{callout:") ||
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

      if (text.includes("{{youtube:")) {
        const match = text.match(/{{youtube:([^}]+)}}/)
        if (match && match[1]) {
          const videoId = match[1]
          return (
            <div className={PLATE_OUTER}>
              <div className={PLATE}>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="block w-full aspect-video"
                ></iframe>
              </div>
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

      // Callouts - set off by hairlines and a mono label, not a tinted box with a
      // colored stripe. Type is carried by the label's word and hue.
      if (text.includes("{{callout:")) {
        const match = text.match(/{{callout:(info|warning|error)\|(.*?)}}/)
        if (match && match[1] && match[2]) {
          const type = match[1] as "info" | "warning" | "error"
          const content = match[2]
          const label = { info: "note", warning: "caution", error: "important" }[type]
          const labelColor = {
            info: "text-[var(--braun-orange)]",
            warning: "text-[var(--braun-cream)]",
            error: "text-[var(--braun-red)]",
          }[type]

          return (
            <aside className="my-8 py-5 border-y border-[var(--border)]" role="note">
              <span className={`uppercase-meta block mb-2 ${labelColor}`}>{label}</span>
              <p className="m-0 text-[var(--foreground)] leading-[1.6]">{content}</p>
            </aside>
          )
        }
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

      return <p className="mt-0 mb-4 text-[var(--foreground-body)]" {...props}>{parts}</p>
    }

    return <p className="mt-0 mb-4 text-[var(--foreground-body)]" {...props}>{children}</p>
  },

  img: ({ src, alt, ...props }: any) => {
    if (!src) return null

    const parts = alt ? alt.split("::") : [""]
    const imageAlt = parts[0].trim()
    const caption = parts.length > 1 ? parts[1].trim() : null

    let width = 800
    let height = 450
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
          />
        </span>
        {caption && <span className={PLATE_CAPTION}>{caption}</span>}
      </span>
    )
  },

  // Headings - rendered as authored (sentence case in posts)
  // Scale steps down from the 52px post title so sections read as sections, not
  // rival titles; 32px above, 8px below binds each heading to its text.
  h1: ({ children, ...props }: any) => (
    <h1 className="text-[1.75rem] md:text-[2rem] leading-[1.15] font-semibold mt-10 mb-2 tracking-[-0.012em]" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h2 id={id} className="text-[1.375rem] md:text-[1.5625rem] leading-[1.2] font-semibold mt-8 mb-2 tracking-[-0.01em] scroll-mt-24" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h3 id={id} className="text-[1.1875rem] leading-[1.25] font-semibold mt-8 mb-2 tracking-[-0.005em] scroll-mt-24" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }: any) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return (
      <h4 id={id} className="text-[1.0625rem] leading-[1.35] font-semibold mt-6 mb-2 scroll-mt-24" {...props}>
        {children}
      </h4>
    )
  },

  // Links - ink with an orange hairline underline. Orange text alone fails contrast on
  // paper (2.6:1); the hairline keeps the accent while the words stay readable.
  a: ({ href, children, ...props }: any) => {
    if (!href) return <span>{children}</span>

    const isExternal = href.startsWith("http")

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[var(--foreground)] underline decoration-[var(--braun-orange)] decoration-1 underline-offset-[0.2em] hover:text-[var(--braun-orange)] transition-colors"
        {...props}
      >
        {children}
      </a>
    )
  },

  // Blockquote - a quiet 2px rule (matching /pnd), no italics (Rams preferred clean type)
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-2 border-[var(--border)] pl-6 mt-0 mb-6 text-[var(--foreground-muted)] [&>p]:text-[var(--foreground-muted)]"
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
          className="bg-[var(--surface)] text-[var(--foreground)] px-[0.3em] py-[0.1em] font-mono text-[0.85em] [font-variant-ligatures:none] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] before:content-none after:content-none"
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

  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 mt-0 mb-4 text-[var(--foreground-body)] marker:text-[var(--foreground-subtle)]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 mt-0 mb-4 text-[var(--foreground-body)] marker:text-[var(--foreground-subtle)] marker:tabular-nums" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="my-1 pl-1" {...props}>
      {children}
    </li>
  ),

  // Tables - mono font for data alignment
  table: ({ children, ...props }: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse tabular-nums" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="border-b border-[var(--foreground-subtle)]" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="text-left py-2 pr-4 font-semibold text-[var(--foreground)]" {...props}>{children}</th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="py-2 pr-4 text-[var(--foreground-body)] border-b border-[var(--border)]" {...props}>{children}</td>
  ),

  // Horizontal rule - subtle
  hr: (props: any) => <hr className="my-8 border-t border-[var(--border)]" {...props} />,
})

interface EnhancedMarkdownProps {
  content: string
}

export function EnhancedMarkdown({ content }: EnhancedMarkdownProps) {
  const { processedContent, captionedImages, sideBySideImages, blockMathExpressions } = useMemo(() => {
    let contentWithoutBlockMath = content
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
    }
  }, [content])

  const customComponents = useMemo(() => createCustomComponents(blockMathExpressions), [blockMathExpressions])

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
            <p className="text-center text-sm leading-snug text-[var(--foreground-muted)] mt-3">{img.caption}</p>
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
