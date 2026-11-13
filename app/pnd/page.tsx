import type { Metadata } from "next"
import PNDGallery from "@/components/pnd/PNDGallery"

// Unlisted: reachable by direct link and shareable, but kept out of search results and the
// sitemap. Links on the page are still followed.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Post Narrative Depression — sixeleven",
  description:
    "A hall of fame for the works of art that left a void. The stories, games, and worlds that changed everything.",
  openGraph: {
    title: "Post Narrative Depression",
    description:
      "Some stories don't just end. They leave a space where they used to be.",
    type: "article",
  },
}

export default function PNDPage() {
  return <PNDGallery />
}
