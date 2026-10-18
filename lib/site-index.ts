import { getAllPosts } from "@/lib/mdx"
import { SITE_URL } from "@/lib/seo"

// The site as a plain-text index, per llmstxt.org: what it is, then every post
// with its one-line summary. Served as /llms.txt, and as the homepage's markdown.
// Post links use the `.md` form, which returns the post itself as markdown.
export async function siteIndex(): Promise<string> {
  const posts = await getAllPosts()
  const list = posts
    .map((post) => `- [${post.title}](${post.link || `${SITE_URL}/blog/${post.slug}.md`}): ${post.excerpt ?? ""}`.trimEnd())
    .join("\n")

  return `# sixeleven

> Personal blog of Rishit Vora, a software engineer in Bengaluru, India. Essays and experiments on science, AI, philosophy and programming.

Every page is also available as markdown: request it with \`Accept: text/markdown\`, or append \`.md\` to a post's URL.

## Posts

${list}

## About

- [About Rishit Vora](${SITE_URL}/about.md): background, interests, and contact details

## Optional

- [Projects](${SITE_URL}/projects): software projects
- [RSS feed](${SITE_URL}/feed.xml): every post in full, as HTML
`
}
