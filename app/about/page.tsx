import type { Metadata } from "next"
import { getAboutContent } from "@/lib/mdx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mdxComponents from "@/components/mdx-components"

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
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
        {content}
      </ReactMarkdown>
    </article>
  )
}

