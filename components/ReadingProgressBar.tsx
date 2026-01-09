"use client"

import { useState, useEffect } from "react"

export default function ReadingProgressBar() {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollableHeight = documentHeight - windowHeight

      const percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollPercentage(percentage)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    // Horizontal progress bar at very top - Rams style (thin, unobtrusive)
    <div className="fixed left-0 top-0 right-0 h-0.5 bg-[var(--border)] z-50">
      <div
        className="bg-[var(--braun-orange)] h-full transition-all duration-150 ease-out"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  )
}
