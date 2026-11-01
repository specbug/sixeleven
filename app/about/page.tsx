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
      {/* No heading: the URL and the first sentence say what this is. break-words lets
          the 40-character key fingerprint wrap instead of widening the page on phones */}
      <article className="prose dark:prose-invert max-w-none break-words">
        <EnhancedMarkdown content={content} />
      </article>

      <SpecialCode />

      <div className="mt-6 pt-6 border-t border-[var(--rule)]">
        <SocialLinks />
      </div>
    </div>
  )
}
