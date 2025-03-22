"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { useState, useEffect } from "react"

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
          <div className="my-8 aspect-video w-full overflow-hidden rounded-lg">
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

    // For regular images without captions
    return (
      <span className="block my-6">
        <Image src={src || "/placeholder.svg"} alt={imageAlt} width={800} height={450} className="rounded-lg" />
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
  code: ({ children, className, ...props }: any) => {
    // Check if this is an inline code block
    if (!className) {
      return (
        <code
          className="bg-gray-100 dark:bg-[#161616] text-gray-900 dark:text-gray-100 rounded px-1.5 py-0.5 font-mono text-base"
          {...props}
        >
          {children}
        </code>
      )
    }

    // Check if this is a PGP code block
    if (className === "language-pgp") {
      return (
        <code
          className="block p-4 rounded-lg bg-[#161616] text-white overflow-x-auto my-4 font-mono text-sm whitespace-pre"
          {...props}
        >
          {children}
        </code>
      )
    }

    // This is a regular code block with language
    return (
      <code
        className={`block p-4 rounded-lg bg-gray-100 dark:bg-[#161616] text-gray-900 dark:text-gray-100 overflow-x-auto my-6 font-mono ${className}`}
        {...props}
      >
        {children}
      </code>
    )
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

    return (
      <pre className="bg-transparent overflow-x-auto my-3 font-mono text-sm" {...props}>
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
  const [captionedImages, setCaptionedImages] = useState<Array<{ src: string; alt: string; caption: string }>>([])

  useEffect(() => {
    // Extract images with captions and replace them with markers
    const images: Array<{ src: string; alt: string; caption: string }> = []
    const processed = content.replace(/!\[(.*?)::(.+?)\]$$(.+?)$$/g, (match, alt, caption, src) => {
      const id = images.length
      images.push({ src, alt, caption })
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
            <Image src={img.src || "/placeholder.svg"} alt={img.alt} width={800} height={450} className="rounded-lg" />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{img.caption}</div>
          </div>
        </div>
      ))}
    </>
  )
}

