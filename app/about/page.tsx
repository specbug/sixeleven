import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import SocialLinks from "@/components/SocialLinks"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import SpecialCode from "@/components/SpecialCode"

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
      {/* No heading: the page is the text. break-words lets the key fingerprint wrap on phones. */}
      <article className="break-words">
        <EnhancedMarkdown content={content} />
      </article>

      <SpecialCode />

      <div className="mt-8 pt-6 border-t border-[var(--rule)]">
        <SocialLinks />
      </div>
    </div>
  )
}
