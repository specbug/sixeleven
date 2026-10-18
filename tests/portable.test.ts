import { describe, expect, test } from "bun:test"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { postHtml, postMarkdown } from "../lib/portable"

// Every equation in every post must reach the feed intact: the TeX carried in
// each MathML annotation is exactly the source TeX, and no markdown markup
// (lists, emphasis, paragraphs) appears inside an equation. Counting equations
// is not enough; markdown parsing once mangled them while keeping the count.

const POSTS = path.join(import.meta.dir, "../content/posts")
const SITE = "https://sixeleven.in"

const unescape = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&")

// Source TeX in document order, skipping fenced and inline code like the converter does
const sourceTex = (md: string) =>
  md
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$|`[^`\n]+`)/m)
    .filter((_, i) => i % 2 === 0)
    .join("")
    .replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => `\u0000B${tex.trim()}\u0000`)
    .match(/\u0000B[\s\S]*?\u0000|\$[^$\n]+?\$/g)
    ?.map((m) => (m.startsWith("\u0000") ? m.slice(2, -1) : m.slice(1, -1))) ?? []

const posts = fs.readdirSync(POSTS).filter((f) => f.endsWith(".mdx"))

describe("feed HTML", () => {
  for (const file of posts) {
    const { content } = matter(fs.readFileSync(path.join(POSTS, file), "utf8"))
    test(`${file}: every equation's TeX survives`, () => {
      const html = postHtml(content, SITE)
      const annotations = [...html.matchAll(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)].map(
        (m) => unescape(m[1]).trim(),
      )
      expect(annotations).toEqual(sourceTex(content).map((t) => t.trim()))
      for (const eq of html.match(/<math[\s\S]*?<\/math>/g) ?? []) {
        expect(eq).not.toMatch(/<\/?(ol|ul|li|p|em|strong|code|a)\b/)
      }
      expect(html).not.toContain("MATHPLACEHOLDER")
    })
  }

  test("bostrom-sim: aligned equations keep their \\\\ line breaks", () => {
    const { content } = matter(fs.readFileSync(path.join(POSTS, "bostrom-sim.mdx"), "utf8"))
    expect(postHtml(content, SITE)).toContain("\\text{neurons} &amp;= 10^{11} \\\\")
  })
})

describe("agent markdown", () => {
  for (const file of posts) {
    const { content } = matter(fs.readFileSync(path.join(POSTS, file), "utf8"))
    test(`${file}: no site-only syntax, no relative links, TeX untouched`, () => {
      const md = postMarkdown(content, SITE)
      expect(md).not.toMatch(/\{\{(callout|youtube|color|creativecommons|claude-disclaimer)/)
      expect(md).not.toMatch(/\]\(\//)
      expect(sourceTex(md)).toEqual(sourceTex(content))
    })
  }
})
