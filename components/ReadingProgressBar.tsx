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
    // Make the reading progress bar more visible on mobile
    <div className="fixed left-0 top-0 bottom-0 w-1.5 bg-gray-200 dark:bg-gray-800 z-40">
      <div
        className="bg-accent/60 dark:bg-accent/60 h-full transition-all duration-150 ease-out"
        style={{ height: `${scrollPercentage}%` }}
      />
    </div>
  )
}

