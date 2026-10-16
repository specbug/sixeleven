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

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    // A 2px orange line that grows with the read - no track; the empty page is the track
    <div className="fixed left-0 top-0 right-0 h-0.5 z-[60] pointer-events-none" aria-hidden="true">
      <div
        className="bg-[var(--braun-orange)] h-full origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollPercentage / 100})` }}
      />
    </div>
  )
}
