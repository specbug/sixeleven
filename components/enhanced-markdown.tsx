"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { CodeBlock } from "./code-block"
import { BlockMath, InlineMath } from "./ui/LaTeX-alt"
import React, { Fragment } from "react"
import { CreativeCommons } from "./ui/CreativeCommons"

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
                <div key={`youtube-${index}`} className="my-8 aspect-video w-full overflow-hidden">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                </div>
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

      return <p {...props}>{processedChildren}</p>
    }

    const text = children ? String(children) : ""

    if (
      text.includes("{{block-math:") ||
      text.includes("{{color:") ||
      text.includes("{{youtube:") ||
      text.includes("{{image-with-caption:") ||
      text.includes("{{side-by-side:") ||
      text.includes("{{callout:") ||
      text.includes("{{creativecommons}}")
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
            <div className="my-8 aspect-video w-full overflow-hidden">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
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

      // Callouts - Rams style: left border only, no icons, subtle background
      // Uses Dieter Rams / Braun color palette
      if (text.includes("{{callout:")) {
        const match = text.match(/{{callout:(info|warning|error)\|(.*?)}}/)
        if (match && match[1] && match[2]) {
          const type = match[1]
          const content = match[2]

          return (
            <div
              className={`my-6 pl-4 py-3 border-l-[3px] ${
                type === "info"
                  ? "border-[var(--braun-orange)] bg-[var(--braun-grey-muted)]"
                  : type === "warning"
                    ? "border-[var(--braun-cream)] bg-[var(--braun-cream-muted)]"
                    : "border-[var(--braun-red)] bg-[var(--braun-red-muted)]"
              }`}
            >
              <p className="text-[var(--foreground)] m-0">{content}</p>
            </div>
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

      return <p {...props}>{parts}</p>
    }

    return <p {...props}>{children}</p>
  },

  img: ({ src, alt, ...props }: any) => {
    if (!src) return null

    const parts = alt ? alt.split("::") : [""]
    const imageAlt = parts[0].trim()
    const caption = parts.length > 1 ? parts[1].trim() : null

    if (caption) {
      return null
    }

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

    return (
      <span className="block my-6">
        <Image
          src={finalSrc || "/placeholder.svg"}
          alt={imageAlt}
          width={width}
          height={height}
          unoptimized={src.startsWith("http") || isGif}
        />
      </span>
    )
  },

  // Headings - lowercase for Rams aesthetic, text blocks stay normal case
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl md:text-4xl font-semibold mt-10 mb-4 tracking-tight lowercase" {...props}>
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
      <h2 id={id} className="text-2xl md:text-3xl font-semibold mt-10 mb-4 tracking-tight lowercase" {...props}>
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
      <h3 id={id} className="text-xl md:text-2xl font-semibold mt-8 mb-3 lowercase" {...props}>
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
      <h4 id={id} className="text-lg md:text-xl font-medium mt-6 mb-2 lowercase" {...props}>
        {children}
      </h4>
    )
  },

  // Links - orange, underline on hover
  a: ({ href, children, ...props }: any) => {
    if (!href) return <span>{children}</span>

    const isExternal = href.startsWith("http")

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[var(--braun-orange)] hover:underline hover:underline-offset-2 transition-colors"
        {...props}
      >
        {children}
      </a>
    )
  },

  // Blockquote - left border, no italics (Rams preferred clean type)
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-[3px] border-[var(--border)] pl-6 my-6 text-[var(--foreground-muted)]"
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
          className="bg-[var(--surface)] text-[var(--foreground)] px-1.5 py-0.5 font-mono text-[0.9em] before:content-none after:content-none"
          {...props}
        >
          {children}
        </code>
      )
    }

    const language = match ? match[1] : ""

    return (
      <div className="my-6">
        <CodeBlock code={content.replace(/\n$/, "")} language={language || "text"} />
      </div>
    )
  },

  pre: ({ children }: any) => {
    return <Fragment>{children}</Fragment>
  },

  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 my-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 my-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="my-1" {...props}>
      {children}
    </li>
  ),

  // Horizontal rule - subtle
  hr: (props: any) => <hr className="my-10 border-t border-[var(--border)]" {...props} />,
})

interface EnhancedMarkdownProps {
  content: string
}

export function EnhancedMarkdown({ content }: EnhancedMarkdownProps) {
  const [processedContent, setProcessedContent] = useState(content)
  const [captionedImages, setCaptionedImages] = useState<
    Array<{ src: string; alt: string; caption: string; width: number; height: number }>
  >([])
  const [sideBySideImages, setSideBySideImages] = useState<
    Array<{ images: Array<{ src: string; alt: string; width: number; height: number }> }>
  >([])
  const [blockMathExpressions, setBlockMathExpressions] = useState<string[]>([])

  useEffect(() => {
    let contentWithoutBlockMath = content
    const mathBlocks: string[] = []

    contentWithoutBlockMath = contentWithoutBlockMath.replace(/\$\$([\s\S]*?)\$\$/g, (match, expr) => {
      const id = mathBlocks.length
      mathBlocks.push(expr)
      return `{{block-math:${id}}}`
    })

    setBlockMathExpressions(mathBlocks)

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
          } catch (error) {
            console.error("Error parsing image dimensions:", error)
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
      (match, alt1, src1, alt2, src2) => {
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
        } catch (error) {
          console.error("Error parsing image dimensions:", error)
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
        } catch (error) {
          console.error("Error parsing image dimensions:", error)
        }

        images.push({ src: finalSrc1, alt: alt1, width: width1, height: height1 })
        images.push({ src: finalSrc2, alt: alt2, width: width2, height: height2 })

        const id = sideBySideGroups.length
        sideBySideGroups.push({ images })
        return `{{side-by-side:${id}}}`
      },
    )

    setSideBySideImages(sideBySideGroups)

    const images: Array<{ src: string; alt: string; caption: string; width: number; height: number }> = []
    const processed = processedWithSideBySide.replace(/!\[(.*?)::(.+?)\]$$(.+?)$$/g, (match, alt, caption, src) => {
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

      const id = images.length
      images.push({ src: finalSrc, alt, caption, width, height })
      return `{{image-with-caption:${id}}}`
    })

    setProcessedContent(processed)
    setCaptionedImages(images)
  }, [content])

  const customComponents = createCustomComponents(blockMathExpressions)

  return (
    <Fragment>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {processedContent}
      </ReactMarkdown>

      {/* Captioned images */}
      {captionedImages.map((img, index) => (
        <div key={index} className="my-8">
          <div className="block">
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              width={img.width}
              height={img.height}
              unoptimized={img.src.startsWith("http") || img.src.toLowerCase().endsWith(".gif")}
            />
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-2">{img.caption}</p>
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
