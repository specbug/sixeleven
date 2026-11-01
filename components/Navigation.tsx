"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from "./icons"

export default function Navigation() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
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
    setIsVisible(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hairline appears only once content passes beneath the bar
      setIsScrolled(currentScrollY > 8)

      // On posts, the bar steps aside while reading and returns on scroll-up
      if (isBlogPost) {
        setIsVisible(currentScrollY <= 10 || currentScrollY < lastScrollY.current)
      }

      lastScrollY.current = currentScrollY
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isBlogPost])

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
    { href: "/archive", label: "Archive" },
    { href: "/about", label: "About" },
  ]

  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined)
  const iconButton = "p-2 -m-2 text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"

  return (
    <nav
      aria-label="Site"
      className={`fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--ground)] border-b transition-[transform,border-color] duration-300 ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      } ${isScrolled || mobileMenuOpen ? "border-[var(--rule)]" : "border-transparent"}`}
    >
      <div className="h-full max-w-[640px] mx-auto px-6 md:px-0 flex justify-between items-center">
        {/* The wordmark: Et Book Bold */}
        <Link href="/" className="flex items-center gap-2 font-logo text-[var(--ink)]">
          <Image src="/logo.png" alt="" width={20} height={20} className="w-5 h-5" />
          <span className="text-[2rem] font-bold tracking-tight lowercase leading-none">sixeleven</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={current(link.href)} className="nav-link font-flex text-[0.875rem]">
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className={iconButton}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-6">
          <button
            onClick={toggleDarkMode}
            className={iconButton}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={iconButton}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--ground)] border-b border-[var(--rule)] py-2">
          <div className="max-w-[640px] mx-auto px-6 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current(link.href)}
                className="nav-link font-flex block py-3 text-base"
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
