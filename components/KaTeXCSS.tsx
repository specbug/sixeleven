"use client"

import { useEffect } from "react"

export default function KaTeXCSS() {
  useEffect(() => {
    // Dynamically import KaTeX CSS only on the client
    import("katex/dist/katex.min.css").catch((err) => {
      console.error("Failed to load KaTeX CSS:", err)
    })
  }, [])

  return null
}

