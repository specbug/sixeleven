import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import KaTeXLoader from "@/components/KaTeXLoader"
import { manrope, monoFont, logoFont } from "@/lib/fonts"

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
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
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

export const metadata: Metadata = {
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${monoFont.variable} ${logoFont.variable}`}>
      <head>
        <WebsiteSchema />
      </head>
      <body className="min-h-screen flex flex-col">
        <KaTeXLoader />
        <Navigation />
        <main className="flex-grow pt-16">
          <div className="max-w-[680px] mx-auto px-6 md:px-0 py-12">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
