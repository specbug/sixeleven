import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import KaTeXLoader from "@/components/KaTeXLoader"
import { serifFont, sansFont, monoFont, logoFont, blogTitleFont } from "@/lib/fonts"

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
  generator: "v0.dev",
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
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable} ${logoFont.variable} ${blogTitleFont.variable}`}
    >
      <head>
        <WebsiteSchema />
      </head>
      <body className="bg-white text-gray-900 dark:bg-black dark:text-gray-100 min-h-screen flex flex-col">
        <KaTeXLoader />
        <div className="w-full max-w-full flex-grow">
          <Navigation />
          <main className="py-4 sm:py-6 px-3 sm:px-4 md:px-8 max-w-5xl mx-auto">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}

import "./globals.css"
