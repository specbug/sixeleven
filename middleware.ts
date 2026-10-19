import { NextResponse, type NextRequest } from "next/server"
import { markdownTarget, prefersMarkdown } from "@/lib/markdown-negotiation"

export function middleware(req: NextRequest) {
  // Flight/prefetch payloads and Server Actions belong to Next, not negotiation.
  if (!["GET", "HEAD"].includes(req.method) || req.headers.has("rsc") || req.headers.has("next-action")) {
    return NextResponse.next()
  }
  const target = markdownTarget(req.nextUrl.pathname)
  if (!target) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = target
  const response = prefersMarkdown(req.headers.get("accept"))
    ? NextResponse.rewrite(url)
    : NextResponse.next()

  // Next 15 replaces Vary on HTML page responses. Until it can preserve Accept,
  // neither representation may be stored by an HTTP cache. The pages remain
  // statically built; JS, CSS, images and fonts retain their normal caching.
  response.headers.set("Cache-Control", "private, no-store")
  response.headers.set("Vary", "Accept")
  return response
}

export const config = {
  // Next strips Flight headers before exposing a request to middleware. Exclude
  // them at the matcher as well, where the original headers are still present.
  matcher: [
    { source: "/", missing: [{ type: "header", key: "rsc" }, { type: "header", key: "next-action" }] },
    { source: "/:section(about|blog|archive|projects)", missing: [{ type: "header", key: "rsc" }, { type: "header", key: "next-action" }] },
    { source: "/:section(blog|projects)/:slug", missing: [{ type: "header", key: "rsc" }, { type: "header", key: "next-action" }] },
  ],
}
