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
        link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        link.integrity = "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
        link.crossOrigin = "anonymous"

        document.head.appendChild(link)
      }
      setLoaded(true)
    }
  }, [loaded])

  return null
}

