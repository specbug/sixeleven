// An explicit Markdown preference is required: normal browsers and */* keep HTML.
// More specific media ranges override wildcards, including an explicit q=0.
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  const ranges = accept.toLowerCase().split(",").map((entry) => {
    const [type, ...params] = entry.trim().split(";")
    const quality = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
    const q = quality === undefined ? 1 : Number(quality.slice(2))
    return { type: type.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 }
  })
  const quality = (type: string) => {
    for (const match of [type, `${type.split("/")[0]}/*`, "*/*"]) {
      const matching = ranges.filter((r) => r.type === match)
      if (matching.length) return Math.max(...matching.map((r) => r.q))
    }
    return 0
  }
  return ranges.some((r) => r.type === "text/markdown") && quality("text/markdown") > 0 &&
    quality("text/markdown") >= quality("text/html")
}

export function markdownTarget(pathname: string): string | null {
  if (pathname === "/") return "/markdown"
  if (["/about", "/blog", "/archive", "/projects"].includes(pathname)) return `/markdown${pathname}`
  const detail = pathname.match(/^\/(blog|projects)\/([^/]+)$/)
  return detail && !detail[2].endsWith(".md") ? `/markdown/${detail[1]}/${detail[2]}` : null
}
