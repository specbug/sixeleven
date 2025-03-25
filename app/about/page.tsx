import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import SocialLinks from "@/components/SocialLinks"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import SpecialCode from "@/components/SpecialCode"

export const metadata: Metadata = {
  title: "About | sixeleven",
  description: "Learn more about me and this blog",
}

export default async function AboutPage() {
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""

  return (
    <div>
      <article className="prose dark:prose-invert max-w-none">
        <EnhancedMarkdown content={content} />
      </article>
      <SpecialCode />
      <div className="mt-8">
        <SocialLinks />
      </div>
    </div>
  )
}

