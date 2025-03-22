import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import { ColoredText } from "@/components/ui/ColoredText"
import { YouTube } from "@/components/ui/YouTube"
import { ImageWithCaption } from "@/components/ui/ImageWithCaption"

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4 leading-tight tracking-tight">{children}</h1>,
    h2: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      return (
        <h2 id={id} className="text-3xl font-bold mt-8 mb-4 leading-tight">
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      return (
        <h3 id={id} className="text-2xl font-bold mt-6 mb-3">
          {children}
        </h3>
      )
    },
    p: ({ children }) => <p className="my-4 text-lg leading-relaxed">{children}</p>,
    a: ({ href, children }) => {
      if (!href) return <span>{children}</span>

      const isExternal = href.startsWith("http")

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/80 border-b border-accent/20 hover:border-accent/60 transition-colors"
          >
            {children}
          </a>
        )
      }

      return (
        <Link href={href} className="text-accent/80 border-b border-accent/20 hover:border-accent/60 transition-colors">
          {children}
        </Link>
      )
    },
    img: ({ src, alt }) => {
      if (!src) return null

      return (
        <div className="my-6">
          <Image src={src || "/placeholder.svg"} alt={alt || ""} width={800} height={500} className="rounded-lg" />
        </div>
      )
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-6 italic text-lg">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      // Check if this is an inline code block
      if (!className) {
        return (
          <code className="bg-gray-100 dark:bg-[#161616] text-gray-900 dark:text-gray-100 rounded px-1.5 py-0.5 font-mono text-base">
            {children}
          </code>
        )
      }

      // Check if this is a PGP code block
      if (className === "language-pgp") {
        return (
          <code className="block p-4 rounded-lg bg-[#161616] text-white overflow-x-auto my-4 font-mono text-sm whitespace-pre">
            {children}
          </code>
        )
      }

      // This is a regular code block with language
      return (
        <code
          className={`block p-4 rounded-lg bg-gray-100 dark:bg-[#161616] text-gray-900 dark:text-gray-100 overflow-x-auto my-6 font-mono ${className}`}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, className }) => {
      // Special handling for PGP code blocks
      if (className === "language-pgp") {
        return <pre className="bg-transparent overflow-x-auto my-0 font-mono text-sm">{children}</pre>
      }

      return <pre className="bg-transparent overflow-x-auto my-3 font-mono text-sm">{children}</pre>
    },
    ul: ({ children }) => <ul className="list-disc pl-6 my-4 text-lg">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 my-4 text-lg">{children}</ol>,
    li: ({ children }) => <li className="my-1">{children}</li>,
    hr: () => <hr className="my-8 border-t border-gray-200 dark:border-gray-800" />,
    sup: ({ children }) => <sup className="text-xs">{children}</sup>,

    // Custom components
    ColoredText,
    YouTube,
    ImageWithCaption,
    ...components,
  }
}

