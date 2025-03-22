"use client"

import { useEffect, useState } from "react"

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Extract headings from content
    // This is a simple regex approach - in a real app you might want to use a markdown parser
    const headingRegex = /^(#{2,4})\s+(.+)$/gm
    const headings: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      headings.push({ id, text, level })
    }

    setToc(headings)
  }, [content])

  if (toc.length === 0) return null

  return (
    <div className="table-of-contents mb-6">
      <div className="flex justify-between items-center md:block">
        <h3>Table of Contents</h3>
        <button
          className="md:hidden text-sm text-gray-500 dark:text-gray-400"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>
      <ul className={`${isExpanded ? "block" : "hidden"} md:block mt-2`}>
        {toc.map((item, index) => (
          <li
            key={index}
            style={{
              marginLeft: `${(item.level - 2) * 0.75}rem`,
              fontSize: item.level === 2 ? "1rem" : "0.9rem",
            }}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

