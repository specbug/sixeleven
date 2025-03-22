"use client"

import { useEffect, useRef } from "react"

interface DirectMarkdownProps {
  content: string
}

export function DirectMarkdown({ content }: DirectMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Split content into sections
    const sections = content.split(/^(#{1,3} .+)$/m)

    // Clear container
    containerRef.current.innerHTML = ""

    // Process each section
    let currentSection = null

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim()

      // Skip empty sections
      if (!section) continue

      // Check if this is a heading
      if (/^#{1,3} .+$/.test(section)) {
        // Create heading element
        const level = (section.match(/^(#+)/) || [""])[0].length
        const text = section.replace(/^#+\s+/, "")

        const heading = document.createElement(`h${level}`)
        heading.textContent = text
        heading.className =
          level === 1
            ? "text-4xl font-bold mt-8 mb-4 leading-tight tracking-tight"
            : level === 2
              ? "text-3xl font-bold mt-6 mb-3 leading-tight"
              : "text-2xl font-bold mt-5 mb-2"

        containerRef.current.appendChild(heading)
        currentSection = document.createElement("div")
        containerRef.current.appendChild(currentSection)
      }
      // Process content
      else if (currentSection) {
        // Process YouTube embeds
        const youtubeContent = section.replace(/{{youtube:([^}]+)}}/g, (match, videoId) => {
          const container = document.createElement("div")
          container.className = "mt-4 mb-0 aspect-video w-full overflow-hidden rounded-lg"

          const iframe = document.createElement("iframe")
          iframe.width = "560"
          iframe.height = "315"
          iframe.src = `https://www.youtube.com/embed/${videoId}`
          iframe.title = "YouTube video player"
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          iframe.allowFullscreen = true
          iframe.className = "w-full aspect-video"

          container.appendChild(iframe)
          currentSection.appendChild(container)

          return ""
        })

        // Process colored text
        const coloredContent = youtubeContent.replace(/{{color:([^}]+)}}/g, (match, colorData) => {
          const [color, text] = colorData.split("|")
          return `<span style="color:${color}">${text}</span>`
        })

        // Process images with captions
        const imageContent = coloredContent.replace(/!\[(.*?)::(.+?)\]$$(.+?)$$/g, (match, alt, caption, src) => {
          const container = document.createElement("div")
          container.className = "my-4"

          const img = document.createElement("img")
          img.src = src
          img.alt = alt || ""
          img.className = "rounded-lg w-full"

          container.appendChild(img)

          if (caption) {
            const captionEl = document.createElement("div")
            captionEl.className = "text-center text-sm text-gray-600 dark:text-gray-400 mt-2"
            captionEl.textContent = caption
            container.appendChild(captionEl)
          }

          currentSection.appendChild(container)

          return ""
        })

        // Process regular images
        const finalContent = imageContent.replace(/!\[(.*?)\]$$(.+?)$$/g, (match, alt, src) => {
          const container = document.createElement("div")
          container.className = "my-4"

          const img = document.createElement("img")
          img.src = src
          img.alt = alt || ""
          img.className = "rounded-lg w-full"

          container.appendChild(img)
          currentSection.appendChild(container)

          return ""
        })

        // Add remaining content as paragraphs
        if (finalContent.trim()) {
          const paragraphs = finalContent.split("\n\n")
          paragraphs.forEach((para) => {
            if (!para.trim()) return

            const p = document.createElement("p")
            p.className = "my-4 text-lg leading-relaxed"
            p.innerHTML = para.replace(/\n/g, "<br>")
            currentSection.appendChild(p)
          })
        }
      }
    }
  }, [content])

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div ref={containerRef} className="direct-markdown"></div>
    </div>
  )
}

