"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import KaTeX to ensure it only loads on the client
const KaTeX = dynamic(() => import("katex"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>,
})

// Import the CSS directly in the component
import "katex/dist/katex.min.css"

interface MathProps {
  children: string
}

export function BlockMath({ children }: MathProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state when component mounts
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (containerRef.current && isLoaded && KaTeX) {
      try {
        KaTeX.render(children, containerRef.current, {
          displayMode: true,
          throwOnError: false,
        })
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.textContent = `Error rendering LaTeX: ${children}`
        }
      }
    }
  }, [children, isLoaded])

  return <div ref={containerRef} className="my-4 text-center overflow-x-auto" />
}

export function InlineMath({ children }: MathProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state when component mounts
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (containerRef.current && isLoaded && KaTeX) {
      try {
        KaTeX.render(children, containerRef.current, {
          displayMode: false,
          throwOnError: false,
        })
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.textContent = `Error rendering LaTeX: ${children}`
        }
      }
    }
  }, [children, isLoaded])

  return <span ref={containerRef} className="inline-block" />
}

