import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import KaTeXLoader from "@/components/KaTeXLoader"
import { rSans, headingFont, monoFont, logoFont } from "@/lib/fonts"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

function WebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in"),
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
      </head>
      <body className="min-h-screen flex flex-col">
        <KaTeXLoader />
        <Navigation />
        <main className="flex-grow pt-16">
          <div className="max-w-[640px] mx-auto px-6 md:px-0 py-12">
            {children}
          </div>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
