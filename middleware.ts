import { NextResponse, type NextRequest } from "next/server"

// Markdown for agents. `/`, `/about` and posts return markdown when the request's
// Accept header prefers it, and HTML otherwise; `/blog/<slug>.md` and `/about.md`
// return markdown for clients that can't set a header. Every response on these
// paths must carry `Vary: Accept` so shared caches keep the two representations
// apart; that is declared in next.config.mjs, because Next replaces a Vary header
// set here.
const MARKDOWN_PATHS: Record<string, string> = { "/": "/markdown", "/about": "/markdown/about" }

type Range = { type: string; subtype: string; q: number }

const parseAccept = (accept: string): Range[] =>
  accept
    .split(",")
    .map((part) => {
      const [range, ...params] = part.trim().toLowerCase().split(";")
      const [type, subtype] = range.trim().split("/")
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
      const value = q === undefined ? 1 : Number.parseFloat(q.slice(2))
      return { type, subtype, q: Number.isFinite(value) ? value : 0 }
    })
    .filter((r) => r.type && r.subtype)

// The quality a client gives a media type: from the most specific range that
// matches it (exact, then type/*, then */*), per RFC 9110 §12.5.1
const quality = (ranges: Range[], type: string, subtype: string) => {
  const match =
    ranges.find((r) => r.type === type && r.subtype === subtype) ??
    ranges.find((r) => r.type === type && r.subtype === "*") ??
    ranges.find((r) => r.type === "*" && r.subtype === "*")
  return match ? match.q : 0
}

// Markdown only when the client names it and prefers it at least as much as
// HTML. Browsers never name it, and a bare */* still means HTML; a tie goes to
// markdown, since a client that lists it explicitly is asking for it.
export const prefersMarkdown = (accept: string | null) => {
  if (!accept) return false
  const ranges = parseAccept(accept)
  const named = ranges.find((r) => r.type === "text" && r.subtype === "markdown")
  if (!named || named.q <= 0) return false
  return named.q >= quality(ranges, "text", "html")
}

const markdownTarget = (path: string): string | null => {
  if (MARKDOWN_PATHS[path]) return MARKDOWN_PATHS[path]
  const post = path.match(/^\/blog\/([^/]+)$/)
  return post ? `/markdown/blog/${post[1]}` : null
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Explicit `.md` URLs
  const explicit = pathname.match(/^(\/blog\/[^/]+|\/about)\.md$/)
  if (explicit) {
    const target = markdownTarget(explicit[1])
    if (target) return NextResponse.rewrite(new URL(target, req.url))
  }

  const target = markdownTarget(pathname)
  if (target && prefersMarkdown(req.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(target, req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/about", "/about.md", "/blog/:slug"],
}
