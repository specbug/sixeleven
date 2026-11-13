import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import SocialLinks from "@/components/SocialLinks"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import SpecialCode from "@/components/SpecialCode"
import AboutPortrait from "@/components/AboutPortrait"

export const metadata: Metadata = {
  title: "About | sixeleven",
  description: "About Rishit Vora and this blog",
  alternates: { canonical: "/about" },
}

export default async function AboutPage() {
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""
  // The first two paragraphs sit beside the portrait from 768px; the rest runs full width
  const blocks = content.split(/\n{2,}/)
  const intro = blocks.slice(0, 2).join("\n\n")
  const rest = blocks.slice(2).join("\n\n")

  return (
    <div>
      {/* No heading: the portrait and the text are the page. */}
      <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-12 md:items-start">
        <AboutPortrait />
        <article className="break-words">
          <EnhancedMarkdown content={intro} />
        </article>
      </div>
      <article className="break-words">
        <EnhancedMarkdown content={rest} />
      </article>

      <SpecialCode />

      <div className="mt-8 pt-6 border-t border-[var(--rule)]">
        <SocialLinks />
      </div>
    </div>
  )
}
