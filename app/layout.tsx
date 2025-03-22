import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

// Load Inter for UI elements only
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "sixeleven",
  description: "A clean, content-focused blog",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-white text-gray-900 dark:bg-black dark:text-gray-100 min-h-screen flex flex-col">
        <div className="w-full max-w-full flex-grow">
          <Navigation />
          <main className="py-4 sm:py-6 px-3 sm:px-4 md:px-8 max-w-5xl mx-auto">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}



import './globals.css'