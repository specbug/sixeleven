import { NextResponse, type NextRequest } from "next/server"

// Markdown for agents. A request whose Accept header asks for text/markdown (with
// a non-zero q) gets the page's markdown; browsers never send that type, so they
// keep getting HTML. `/blog/<slug>.md` and `/about.md` return markdown regardless
// of the header, for clients that can't set one. The markdown carries
// `Vary: Accept`, so no shared cache can serve it to a browser; the rewrite runs
// before Vercel's cache, which keys the two representations separately.
const MARKDOWN_PATHS: Record<string, string> = { "/": "/markdown", "/about": "/markdown/about" }

const wantsMarkdown = (accept: string | null) =>
  !!accept &&
  accept.split(",").some((part) => {
    const [type, ...params] = part.trim().toLowerCase().split(";")
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
    return type.trim() === "text/markdown" && (q === undefined || Number.parseFloat(q.slice(2)) > 0)
  })

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
  if (target && wantsMarkdown(req.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(target, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/about", "/about.md", "/blog/:slug"],
}
