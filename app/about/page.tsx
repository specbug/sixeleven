import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mdxComponents from "@/components/mdx-components"
import SimpleSocialLinks from "@/components/SimpleSocialLinks"

export const metadata: Metadata = {
  title: "About Me | sixeleven",
  description: "Learn more about me and this blog",
}

export default async function AboutPage() {
  console.log("About page rendering")
  const aboutData = await getAboutContent()
  const content = aboutData?.content || ""

  console.log("About content length:", content.length)

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8">About Me</h1>

      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
        {content}
      </ReactMarkdown>
      <SimpleSocialLinks />
    </article>
  )
}

