"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { useState, useEffect } from "react"
import { CodeBlock } from "./code-block"

// Custom components for ReactMarkdown
const customComponents = {
  // Handle paragraphs that might contain our custom components
  p: ({ children, node, ...props }: any) => {
    // Check if children contains our custom component markers
    const text = String(children)

    if (text.includes("{{color:")) {
      // Process colored text
      const processed = text.replace(/{{color:([^}]+)}}/g, (_, color) => {
        const [colorValue, content] = color.split("|")
        return `<span style="color:${colorValue}">${content}</span>`
      })

      return <p {...props} dangerouslySetInnerHTML={{ __html: processed }} />
    }

    if (text.includes("{{youtube:")) {
      // Extract YouTube ID
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

    // Check if this paragraph contains only an image with caption marker
    if (text.includes("{{image-with-caption:")) {
      return null // Skip rendering this paragraph, it will be handled separately
    }

    // Check if this paragraph contains side-by-side images
    if (text.includes("{{side-by-side:")) {
      return null // Skip rendering this paragraph, it will be handled separately
    }

    if (text.includes("{{callout:")) {
      // Extract callout type and content
      const match = text.match(/{{callout:(info|warning|error)\|(.*?)}}/)
      if (match && match[1] && match[2]) {
        const type = match[1]
        const content = match[2]

        // Define icon based on type
        let icon = "ℹ️" // Default info icon
        if (type === "warning") icon = "⚠️"
        if (type === "error") icon = "❌"

        return (
          <div
            className={`callout ${type} flex items-start p-4 my-6 rounded-md ${
              type === "info"
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                : type === "warning"
                  ? "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500"
                  : "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
            }`}
          >
            <div className="mr-3 text-xl">{icon}</div>
            <div className="text-sm sm:text-base">{content}</div>
          </div>
        )
      }
    }

    return <p {...props}>{children}</p>
  },

  // Regular images without captions
  img: ({ src, alt, ...props }: any) => {
    if (!src) return null

    // Check if there's a caption in the alt text (using :: as separator)
    const parts = alt ? alt.split("::") : [""]
    const imageAlt = parts[0].trim()
    const caption = parts.length > 1 ? parts[1].trim() : null

    // For images with captions, we'll handle them in our pre-processing step
    if (caption) {
      return null
    }

    // Parse dimensions from URL query parameters if present
    let width = 800
    let height = 450
    let finalSrc = src

    try {
      // Check if the URL has query parameters for width and height
      if (src.includes("?")) {
        const urlObj = new URL(src, "http://example.com") // Base URL doesn't matter for parsing
        const params = new URLSearchParams(urlObj.search)

        // Get width and height from query params if they exist
        const widthParam = params.get("width")
        const heightParam = params.get("height")

        if (widthParam) width = Number.parseInt(widthParam, 10)
        if (heightParam) height = Number.parseInt(heightParam, 10)

        // Remove the query parameters from the src for Next.js Image component
        // Only if it's a local image (not starting with http)
        if (!src.startsWith("http")) {
          finalSrc = urlObj.pathname
        }
      }
    } catch (error) {
      console.error("Error parsing image dimensions:", error)
    }

    // Check if it's a GIF (ensure unoptimized is true for GIFs)
    const isGif = finalSrc.toLowerCase().endsWith(".gif")

    // For regular images without captions
    return (
      <span className="block my-6">
        <Image
          src={finalSrc || "/placeholder.svg"}
          alt={imageAlt}
          width={width}
          height={height}
          unoptimized={src.startsWith("http") || isGif} // Skip optimization for external images and GIFs
        />
      </span>
    )
  },

  // Other components remain the same as before
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 leading-tight tracking-tight" {...props}>
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
      <h2 id={id} className="text-3xl font-bold mt-8 mb-4 leading-tight" {...props}>
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
      <h3 id={id} className="text-2xl font-bold mt-6 mb-3" {...props}>
        {children}
      </h3>
    )
  },
  a: ({ href, children, ...props }: any) => {
    if (!href) return <span>{children}</span>

    const isExternal = href.startsWith("http")

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent/80 border-b border-accent/20 hover:border-accent/60 transition-colors"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <a
        href={href}
        className="text-accent/80 border-b border-accent/20 hover:border-accent/60 transition-colors"
        {...props}
      >
        {children}
      </a>
    )
  },
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-6 italic text-lg" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "")
    const language = match ? match[1] : ""

    // For inline code blocks
    if (inline) {
      return (
        <code
          className="bg-gray-100 dark:bg-[#282c34] text-gray-900 dark:text-gray-100 px-1.5 py-0.5 font-mono text-base"
          {...props}
        >
          {children}
        </code>
      )
    }

    // Check if this is a PGP code block
    if (language === "pgp") {
      return (
        <code
          className="block p-4 bg-[#282c34] text-white overflow-x-auto my-4 font-mono text-sm whitespace-pre"
          {...props}
        >
          {children}
        </code>
      )
    }

    // For Python and other code blocks, use our CodeBlock component
    return <CodeBlock code={String(children).replace(/\n$/, "")} language={language || "text"} />
  },
  pre: ({ children, className, ...props }: any) => {
    // Special handling for PGP code blocks
    if (className === "language-pgp") {
      return (
        <pre className="bg-transparent overflow-x-auto my-0 font-mono text-sm" {...props}>
          {children}
        </pre>
      )
    }

    // For Python and other code blocks, let the code component handle it
    if (className && className.startsWith("language-")) {
      return children
    }

    return (
      <pre className="bg-transparent overflow-x-auto my-0 font-mono text-sm" {...props}>
        {children}
      </pre>
    )
  },
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 my-4 text-lg" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 my-4 text-lg" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="my-1" {...props}>
      {children}
    </li>
  ),
  hr: (props: any) => <hr className="my-8 border-t border-gray-200 dark:border-gray-800" {...props} />,
}

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

  useEffect(() => {
    // Process side-by-side images first
    let processedWithSideBySide = content
    const sideBySideGroups: Array<{ images: Array<{ src: string; alt: string; width: number; height: number }> }> = []

    // Match {{side-by-side}} blocks
    processedWithSideBySide = processedWithSideBySide.replace(
      /\{\{side-by-side\}\}([\s\S]*?)\{\{\/side-by-side\}\}/g,
      (match, imagesContent) => {
        const images: Array<{ src: string; alt: string; width: number; height: number }> = []

        // Extract images from the content
        const imageMatches = [...imagesContent.matchAll(/!\[(.*?)\]$$(.+?)$$/g)]
        for (const imageMatch of imageMatches) {
          const alt = imageMatch[1] || ""
          let src = imageMatch[2] || ""

          // Parse dimensions
          let width = 400 // Default width for side-by-side images
          let height = 300 // Default height for side-by-side images

          try {
            if (src.includes("?")) {
              const urlObj = new URL(src, "http://example.com")
              const params = new URLSearchParams(urlObj.search)

              const widthParam = params.get("width")
              const heightParam = params.get("height")

              if (widthParam) width = Number.parseInt(widthParam, 10)
              if (heightParam) height = Number.parseInt(heightParam, 10)

              // Remove query params for local images
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

        return match // Return original if no images found
      },
    )

    // Also support the pipe syntax for side-by-side images
    processedWithSideBySide = processedWithSideBySide.replace(
      /!\[(.*?)\]$$(.+?)$$\s*\|\s*!\[(.*?)\]$$(.+?)$$/g,
      (match, alt1, src1, alt2, src2) => {
        const images: Array<{ src: string; alt: string; width: number; height: number }> = []

        // Process first image
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

        // Process second image
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

    // Extract images with captions and replace them with markers
    const images: Array<{ src: string; alt: string; caption: string; width: number; height: number }> = []
    const processed = processedWithSideBySide.replace(/!\[(.*?)::(.+?)\]$$(.+?)$$/g, (match, alt, caption, src) => {
      // Default dimensions
      let width = 800
      let height = 450
      let finalSrc = src

      // Parse dimensions from URL query parameters if present
      try {
        if (src.includes("?")) {
          const urlObj = new URL(src, "http://example.com")
          const params = new URLSearchParams(urlObj.search)

          const widthParam = params.get("width")
          const heightParam = params.get("height")

          if (widthParam) width = Number.parseInt(widthParam, 10)
          if (heightParam) height = Number.parseInt(heightParam, 10)

          // Remove the query parameters from the src for Next.js Image component
          // Only if it's a local image (not starting with http)
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

  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {processedContent}
      </ReactMarkdown>

      {/* Render captioned images outside of ReactMarkdown */}
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
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{img.caption}</div>
          </div>
        </div>
      ))}

      {/* Render side-by-side images */}
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
    </>
  )
}

