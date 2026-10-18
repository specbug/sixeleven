import { getAllPosts } from "@/lib/mdx"
import { SITE_URL } from "@/lib/seo"

// The site as a plain-text index, per llmstxt.org: what it is, then every post
// with its one-line summary. Post links use the `.md` form, which returns the
// post itself as markdown.
export async function siteIndex(): Promise<string> {
  const posts = await getAllPosts()
  const list = posts
    .map((post) => `- [${post.title}](${post.link || `${SITE_URL}/blog/${post.slug}.md`}): ${post.excerpt ?? ""}`.trimEnd())
    .join("\n")

  return `# sixeleven

> Personal blog of Rishit Vora, a software engineer in Bengaluru, India. Essays and experiments on science, AI, philosophy and programming.

Every post is also available as markdown: append \`.md\` to its URL.

## Posts

${list}

## About

- [About Rishit Vora](${SITE_URL}/about.md): background, interests, and contact details

## Optional

- [Projects](${SITE_URL}/projects): software projects
- [RSS feed](${SITE_URL}/feed.xml): every post in full, as HTML
`
}
