import katex from "katex"
import { micromark } from "micromark"
import { gfm, gfmHtml } from "micromark-extension-gfm"

// Posts outside the site's own renderer: as plain markdown for agents (served on
// `Accept: text/markdown`) and as standalone HTML for the RSS feed. The site's
// custom syntax becomes ordinary markdown and site-relative links and images
// become absolute. Math stays TeX in markdown, which language models read
// natively, and becomes MathML in HTML, which feed readers render.

const CALLOUT_LABELS: Record<string, string> = { info: "Note", warning: "Caution", error: "Important" }

// Apply `fn` to prose only, leaving fenced code blocks and inline code untouched,
// so a `$` in a shell snippet is never read as math
const outsideCode = (md: string, fn: (prose: string) => string) =>
  md
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$|`[^`\n]+`)/m)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join("")

const portableProse = (prose: string, siteUrl: string) =>
  prose
    .replace(/\{\{callout:(info|warning|error)\|(?:([^|{}\n]{1,24})\|)?([\s\S]*?)\}\}/g, (_m, type, label, text) =>
      `> **${label || CALLOUT_LABELS[type]}.** ${text.trim()}`,
    )
    .replace(/\{\{youtube:([^}|]+)(?:\|([^}]*))?\}\}/g, (_m, id, caption) =>
      `[Video: ${caption?.trim() || "YouTube"}](https://www.youtube.com/watch?v=${id.trim()})`,
    )
    .replace(/\{\{color:[^|}]+\|([^}]*)\}\}/g, "$1")
    .replace(/\{\{(?:creativecommons|claude-disclaimer)\}\}/g, "")
    // `![alt::caption](src?width=…)` → the image, then its caption in italics
    .replace(/!\[([^\]]*?)\]\(([^)\s]+)\)/g, (_m, alt, src) => {
      const [text, caption] = alt.split("::")
      const image = `![${text.trim()}](${src.split("?")[0]})`
      return caption ? `${image}\n\n*${caption.trim()}*` : image
    })
    .replace(/\]\(\//g, `](${siteUrl}/`)

export function postMarkdown(content: string, siteUrl: string): string {
  return outsideCode(content, (prose) => portableProse(prose, siteUrl)).trim() + "\n"
}

const mathml = (tex: string, displayMode: boolean) =>
  katex.renderToString(tex, { displayMode, output: "mathml", throwOnError: false, strict: "ignore" })

// Math is swapped for inert placeholders before markdown parsing and restored
// after: parsed as markdown, TeX loses its `\\` line breaks to backslash escapes
// and a numbered line inside an equation turns into an ordered list
export function postHtml(content: string, siteUrl: string): string {
  const math: string[] = []
  const hold = (html: string) => `MATHPLACEHOLDER${math.push(html) - 1}X`
  const md = outsideCode(content, (prose) =>
    portableProse(prose, siteUrl)
      .replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => hold(mathml(tex.trim(), true)))
      .replace(/\$([^$\n]+?)\$/g, (_m, tex) => hold(mathml(tex, false))),
  )
  return micromark(md, { allowDangerousHtml: true, extensions: [gfm()], htmlExtensions: [gfmHtml()] }).replace(
    /MATHPLACEHOLDER(\d+)X/g,
    (_m, i) => math[Number(i)],
  )
}

export const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

// YAML frontmatter; values are JSON strings, which YAML reads as quoted scalars
export const frontmatter = (fields: Record<string, string | string[] | undefined>) =>
  "---\n" +
  Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map((x) => JSON.stringify(x)).join(", ")}]` : JSON.stringify(v)}`)
    .join("\n") +
  "\n---\n\n"

// A markdown response for an HTML page's URL. The canonical Link points search
// engines back at the HTML page; the token count is an estimate (about four
// characters per token), for agents budgeting context. `Vary: Accept` is also
// declared in next.config.mjs, since Next can replace this one.
export function markdownResponse(body: string, canonical: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      Link: `<${canonical}>; rel="canonical"`,
      "x-markdown-tokens": String(Math.ceil(body.length / 4)),
    },
  })
}
