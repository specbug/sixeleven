import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archive | sixeleven",
  description: "All blog posts",
}

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

