"use client"

import { useEffect, useRef } from "react"

interface MathProps {
  children: string
}

export function BlockMath({ children }: MathProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Function to render math
    const renderMath = async () => {
      try {
        // Check if KaTeX is already available globally (might be loaded by another component)
        if (typeof window !== "undefined" && (window as any).katex) {
          ;(window as any).katex.render(children, containerRef.current, {
            displayMode: true,
            throwOnError: false,
            errorColor: "#f00",
          })
          return
        }

        // If not available globally, load it via script tag
        if (!document.querySelector('script[src*="katex.min.js"]')) {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"
          script.crossOrigin = "anonymous"
          script.async = false

          script.onload = () => {
            if (containerRef.current && (window as any).katex) {
              ;(window as any).katex.render(children, containerRef.current, {
                displayMode: true,
                throwOnError: false,
                errorColor: "#f00",
              })
            }
          }

          document.head.appendChild(script)
        }
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color: #f00;">Error rendering math: ${children}</div>`
        }
      }
    }

    // Try to render immediately, then retry after a short delay if needed
    renderMath()

    // Retry after a short delay to ensure KaTeX is loaded
    const timer = setTimeout(() => {
      if (containerRef.current && containerRef.current.innerHTML === "") {
        renderMath()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [children])

  return <div ref={containerRef} className="my-4 text-center overflow-x-auto" />
}

export function InlineMath({ children }: MathProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Function to render math
    const renderMath = async () => {
      try {
        // Check if KaTeX is already available globally
        if (typeof window !== "undefined" && (window as any).katex) {
          ;(window as any).katex.render(children, containerRef.current, {
            displayMode: false,
            throwOnError: false,
            errorColor: "#f00",
          })
          return
        }

        // If not available globally, load it via script tag
        if (!document.querySelector('script[src*="katex.min.js"]')) {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"
          script.crossOrigin = "anonymous"
          script.async = false

          script.onload = () => {
            if (containerRef.current && (window as any).katex) {
              ;(window as any).katex.render(children, containerRef.current, {
                displayMode: false,
                throwOnError: false,
                errorColor: "#f00",
              })
            }
          }

          document.head.appendChild(script)
        }
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span style="color: #f00;">${children}</span>`
        }
      }
    }

    // Try to render immediately, then retry after a short delay if needed
    renderMath()

    // Retry after a short delay to ensure KaTeX is loaded
    const timer = setTimeout(() => {
      if (containerRef.current && containerRef.current.innerHTML === "") {
        renderMath()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [children])

  return <span ref={containerRef} className="inline-block" />
}

