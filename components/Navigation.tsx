"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

// Minimal, geometric icons inspired by Braun/Rams design
// Simple circles and lines - no unnecessary detail
function SunIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function MenuIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function Navigation() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isBlogPost = pathname.startsWith("/blog/") && pathname !== "/blog"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark =
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches)

      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  useEffect(() => {
    if (!isBlogPost) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isBlogPost])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof window !== "undefined") {
      if (!isDarkMode) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("darkMode", "true")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("darkMode", "false")
      }
    }
  }

  const navLinks = [
    { href: "/archive", label: "archive" },
    { href: "/about", label: "about" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md transition-transform duration-300 ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="h-full max-w-[680px] mx-auto px-6 md:px-0 flex justify-between items-center">
        {/* Logo with image and text */}
        <Link href="/" className="flex items-center gap-2 font-logo hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="sixeleven logo" width={20} height={20} className="w-5 h-5" />
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)] lowercase">
            sixeleven
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors lowercase ${
                pathname === link.href
                  ? "text-[var(--braun-orange)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--braun-orange)]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md py-4">
          <div className="max-w-[680px] mx-auto px-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors lowercase ${
                  pathname === link.href
                    ? "text-[var(--braun-orange)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--braun-orange)]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
