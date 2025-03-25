"use client"

import { useEffect, useState } from "react"

export default function KaTeXLoader() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded && typeof window !== "undefined") {
      // Check if KaTeX CSS is already loaded
      if (!document.querySelector('link[href*="katex.min.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
        link.crossOrigin = "anonymous"

        link.onload = () => {
          console.log("KaTeX CSS loaded successfully")
          setLoaded(true)
        }

        link.onerror = (e) => {
          console.error("Error loading KaTeX CSS:", e)
        }

        document.head.appendChild(link)
      } else {
        setLoaded(true)
      }
    }
  }, [loaded])

  return null
}

