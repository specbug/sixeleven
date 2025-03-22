import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Callout } from "@/components/ui/Callout"
import { Tabs, Tab } from "@/components/ui/Tabs"

const mdxComponents = {
  // Override default elements
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 leading-tight tracking-tight">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => {
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
  h3: ({ children }: { children: React.ReactNode }) => {
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
  p: ({ children }: { children: React.ReactNode }) => <p className="my-4 text-lg leading-relaxed">{children}</p>,
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => {
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
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null

    return (
      <figure className="my-6">
        <Image src={src || "/placeholder.svg"} alt={alt || ""} width={800} height={500} className="rounded-lg" />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    )
  },
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-6 italic text-lg">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // Check if this is an inline code block
    if (!className) {
      return (
        <code className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded px-1.5 py-0.5 font-mono text-base">
          {children}
        </code>
      )
    }

    // Special handling for PGP blocks
    if (className?.includes("language-pgp")) {
      return (
        <code className="block whitespace-pre overflow-x-auto my-6 font-mono text-white bg-transparent">
          {children}
        </code>
      )
    }

    // This is a regular code block with language
    return (
      <code
        className={`block p-4 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 overflow-x-auto my-6 font-mono ${className}`}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-transparent overflow-x-auto my-6 font-mono text-sm">{children}</pre>
  ),
  ul: ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-6 my-4 text-lg">{children}</ul>,
  ol: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal pl-6 my-4 text-lg">{children}</ol>,
  li: ({ children }: { children: React.ReactNode }) => <li className="my-1">{children}</li>,
  hr: () => <hr className="my-8 border-t border-gray-200 dark:border-gray-800" />,
  sup: ({ children }: { children: React.ReactNode }) => <sup className="text-xs">{children}</sup>,

  // Custom components
  Callout,
  Tabs,
  Tab,
}

export default mdxComponents

