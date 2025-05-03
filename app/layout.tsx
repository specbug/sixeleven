import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import KaTeXLoader from "@/components/KaTeXLoader"
import { serifFont, sansFont, monoFont, logoFont, blogTitleFont } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "sixeleven",
  description: "Personal blog of Rishit Vora.",
  generator: "v0.dev",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable} ${logoFont.variable} ${blogTitleFont.variable}`}>
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

