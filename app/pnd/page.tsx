import type { Metadata } from "next"
import PNDGallery from "@/components/pnd/PNDGallery"

export const metadata: Metadata = {
  title: "post narrative depression — sixeleven",
  description:
    "A hall of fame for the works of art that left a void. The stories, games, and worlds that changed everything.",
  openGraph: {
    title: "post narrative depression",
    description:
      "Some stories don't just end. They leave a space where they used to be.",
    type: "article",
  },
}

export default function PNDPage() {
  return <PNDGallery />
}
