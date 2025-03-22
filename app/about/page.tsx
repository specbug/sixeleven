import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mdxComponents from "@/components/mdx-components"
import SocialLinks from "@/components/SocialLinks"

export const metadata: Metadata = {
  title: "About Me | sixeleven",
  description: "Learn more about me and this blog",
}

export default async function AboutPage() {
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""

  return (
    <div>
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
          {content}
        </ReactMarkdown>
      </article>

      <SocialLinks />  
    </div>
  )
}

