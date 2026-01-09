import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import SocialLinks from "@/components/SocialLinks"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import SpecialCode from "@/components/SpecialCode"

export const metadata: Metadata = {
  title: "about | sixeleven",
  description: "learn more about me and this blog",
}

export default async function AboutPage() {
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""

  return (
    <div>
      {/* No heading - URL provides context (Rams: no unnecessary elements) */}
      <article className="prose dark:prose-invert max-w-none">
        <EnhancedMarkdown content={content} />
      </article>

      <SpecialCode />

      {/* Subtle separator before social links */}
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <SocialLinks />
      </div>
    </div>
  )
}
