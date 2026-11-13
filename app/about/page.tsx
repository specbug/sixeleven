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

  return (
    <div>
      {/* No heading: the portrait and the text are the page. */}
      <article className="break-words">
        <AboutPortrait />
        <EnhancedMarkdown content={content} />
      </article>

      <SpecialCode />

      <div className="mt-8 pt-6 border-t border-[var(--rule)]">
        <SocialLinks />
      </div>
    </div>
  )
}
