import type { Metadata } from "next"
import { pageMetadata, SITE_URL } from "@/lib/seo"
import { getAboutContent } from "@/lib/mdx"
import SocialLinks from "@/components/SocialLinks"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import SpecialCode from "@/components/SpecialCode"

export const metadata: Metadata = pageMetadata({
  title: "About | sixeleven",
  description:
    "Rishit Vora, a software engineer in Bengaluru: background, interests, the name sixeleven, and how to get in touch.",
  path: "/about",
  markdown: "/about.md",
})

// Who the site is by, for search engines and assistants: ties the name to the
// profiles linked at the foot of the page
const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Person",
    name: "Rishit Vora",
    alternateName: "specbug",
    url: `${SITE_URL}/about`,
    jobTitle: "Software Engineer",
    homeLocation: { "@type": "Place", name: "Bengaluru, India" },
    sameAs: [
      "https://github.com/specbug",
      "https://x.com/irishvora",
      "https://www.goodreads.com/user/show/71020611-specbug",
    ],
  },
}

export default async function AboutPage() {
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      {/* No heading - URL provides context (Rams: no unnecessary elements) */}
      {/* break-words: the 40-character key fingerprint would otherwise widen the page on phones */}
      <article className="prose dark:prose-invert max-w-none break-words">
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
