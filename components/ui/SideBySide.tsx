import Image from "next/image"
import type { ReactNode } from "react"

interface SideBySideProps {
  children: ReactNode
  className?: string
}

export function SideBySide({ children, className = "" }: SideBySideProps) {
  return <div className={`flex flex-col md:flex-row gap-4 my-8 ${className}`}>{children}</div>
}

interface SideImageProps {
  src: string
  alt: string
  width?: number
  height?: number
}

export function SideImage({ src, alt, width = 400, height = 300 }: SideImageProps) {
  // Parse dimensions from URL query parameters if present
  let finalWidth = width
  let finalHeight = height
  let finalSrc = src

  try {
    // Check if the URL has query parameters for width and height
    if (src.includes("?")) {
      const urlObj = new URL(src, "http://example.com") // Base URL doesn't matter for parsing
      const params = new URLSearchParams(urlObj.search)

      // Get width and height from query params if they exist
      const widthParam = params.get("width")
      const heightParam = params.get("height")

      if (widthParam) finalWidth = Number.parseInt(widthParam, 10)
      if (heightParam) finalHeight = Number.parseInt(heightParam, 10)

      // Remove the query parameters from the src for Next.js Image component
      // Only if it's a local image (not starting with http)
      if (!src.startsWith("http")) {
        finalSrc = urlObj.pathname
      }
    }
  } catch (error) {
    console.error("Error parsing image dimensions:", error)
  }

  // Check if it's a GIF
  const isGif = finalSrc.toLowerCase().endsWith(".gif")

  return (
    <div className="flex-1 flex items-center justify-center">
      <Image
        src={finalSrc || "/placeholder.svg"}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        unoptimized={finalSrc.startsWith("http") || isGif}
      />
    </div>
  )
}

