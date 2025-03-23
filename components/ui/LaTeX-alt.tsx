"use client"

import { useEffect, useRef } from "react"

interface MathProps {
  children: string
}

export function BlockMath({ children }: MathProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Only import and use KaTeX on the client side
    import("katex")
      .then((katex) => {
        try {
          if (containerRef.current) {
            katex.default.render(children, containerRef.current, {
              displayMode: true,
              throwOnError: false,
              errorColor: "#f00",
              strict: false,
              trust: true,
            })
          }
        } catch (error) {
          console.error("KaTeX rendering error:", error)
          if (containerRef.current) {
            // Safely set error message
            try {
              containerRef.current.textContent = `Error rendering LaTeX: ${children}`
            } catch (e) {
              console.error("Error setting error message:", e)
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load KaTeX:", err)
        if (containerRef.current) {
          // Safely set fallback content
          try {
            containerRef.current.textContent = children
          } catch (e) {
            console.error("Error setting fallback content:", e)
          }
        }
      })
  }, [children])

  return <div ref={containerRef} className="my-4 text-center overflow-x-auto" />
}

export function InlineMath({ children }: MathProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Only import and use KaTeX on the client side
    import("katex")
      .then((katex) => {
        try {
          if (containerRef.current) {
            katex.default.render(children, containerRef.current, {
              displayMode: false,
              throwOnError: false,
              errorColor: "#f00",
              strict: false,
              trust: true,
            })
          }
        } catch (error) {
          console.error("KaTeX rendering error:", error)
          if (containerRef.current) {
            // Safely set error message
            try {
              containerRef.current.textContent = `Error: ${children}`
            } catch (e) {
              console.error("Error setting error message:", e)
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load KaTeX:", err)
        if (containerRef.current) {
          // Safely set fallback content
          try {
            containerRef.current.textContent = children
          } catch (e) {
            console.error("Error setting fallback content:", e)
          }
        }
      })
  }, [children])

  return <span ref={containerRef} className="inline-block" />
}

