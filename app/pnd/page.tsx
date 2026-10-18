import type { Metadata } from "next"
import PNDGallery from "@/components/pnd/PNDGallery"

export const metadata: Metadata = {
  title: "Post Narrative Depression — sixeleven",
  description:
    "A hall of fame for the works of art that left a void. The stories, games, and worlds that changed everything.",
  openGraph: {
    title: "Post Narrative Depression",
    description:
      "Some stories don't just end. They leave a space where they used to be.",
    type: "article",
  },
  alternates: { canonical: "/pnd" },
}

export default function PNDPage() {
  return <PNDGallery />
}
