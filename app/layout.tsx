import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
// After the site styles, as the CDN stylesheet it replaces was; served from our own
// origin and pinned to the same KaTeX version that renders the markup
import "katex/dist/katex.min.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { rSans, headingFont, monoFont, logoFont } from "@/lib/fonts"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

function WebsiteSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "sixeleven",
    url: baseUrl,
    description: "Personal blog of Rishit Vora.",
    author: {
      "@type": "Person",
      name: "Rishit Vora",
      url: `${baseUrl}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Rishit Vora",
      url: `${baseUrl}/about`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  )
}

// Resolve the theme before first paint so dark-mode readers never see a light flash.
// Mirrors the logic in Navigation.tsx.
const themeScript = `(function(){try{var s=localStorage.getItem("darkMode");if(s==="true"||(s===null&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`

export const metadata: Metadata = {
  // Resolves relative canonical and image URLs in every page's metadata
  metadataBase: new URL(baseUrl),
  title: "sixeleven",
  description: "Personal blog of Rishit Vora.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in",
    title: "sixeleven",
    description: "Personal blog of Rishit Vora.",
    siteName: "sixeleven",
  },
  twitter: {
    card: "summary",
    title: "sixeleven",
    description: "Personal blog of Rishit Vora.",
    creator: "Rishit Vora",
  },
  // No canonical here: it would be inherited by every page that doesn't set its
  // own, telling search engines those pages are copies of the homepage. Each page
  // declares its own instead.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${rSans.variable} ${headingFont.variable} ${monoFont.variable} ${logoFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <WebsiteSchema />
        {/* In the layout rather than metadata.alternates, which each page's own
            canonical would replace */}
        <link rel="alternate" type="application/rss+xml" title="sixeleven" href={`${baseUrl}/feed.xml`} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-16">
          <div className="max-w-[640px] mx-auto px-6 md:px-0 py-12">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
