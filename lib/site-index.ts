import { getAllPosts } from "@/lib/mdx"
import { SITE_URL } from "@/lib/seo"
import { frontmatter } from "@/lib/portable"

export async function postIndex(title: string, path: string): Promise<string> {
  const posts = await getAllPosts()
  return frontmatter({ title: `${title} | sixeleven`, url: `${SITE_URL}${path}` }) + `# ${title}\n\n` + posts.map((post) =>
    `## [${post.title}](${post.link || `${SITE_URL}/blog/${post.slug}`})\n\n${post.date}${post.readingTime ? ` · ${post.readingTime} min` : ""}\n\n${post.excerpt ?? ""}`,
  ).join("\n\n") + "\n"
}

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

The homepage, About, Blog, Archive, Projects and individual posts and projects support \`Accept: text/markdown\`; HTML is the default. Explicit \`.md\` URLs also work (use /index.md for the homepage).

## Posts

${list}

## About

- [About Rishit Vora](${SITE_URL}/about.md): background, interests, and contact details

## Optional

- [Projects](${SITE_URL}/projects): software projects
- [RSS feed](${SITE_URL}/feed.xml): every post in full, as HTML
`
}
