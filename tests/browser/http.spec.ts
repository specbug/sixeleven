import { test, expect } from "@playwright/test"
import { readdirSync, readFileSync } from "node:fs"
import matter from "gray-matter"

const slugs = readdirSync("content/posts").filter((p) => p.endsWith(".mdx")).map((p) => p.slice(0, -4))
const paths = ["/", "/about", "/blog", "/archive", "/projects", "/projects/minimalist-blog", ...slugs.map((s) => `/blog/${s}`)]

test("every content page negotiates Markdown and defaults to HTML, in both request orders", async ({ request }) => {
  for (const path of paths) {
    for (const accept of ["text/html", "text/markdown", "text/html", "text/markdown"]) {
      const res = await request.get(path, { headers: { Accept: accept } })
      expect(res.status(), path).toBe(200)
      expect(res.headers()["content-type"], path).toContain(accept)
      expect(res.headers()["cache-control"], path).toContain("no-store")
      const body = await res.text()
      if (accept === "text/markdown") {
        expect(res.headers().vary.toLowerCase()).toContain("accept")
        expect(res.headers().link).toContain('rel="canonical"')
        expect(Number(res.headers()["x-markdown-tokens"])).toBeGreaterThan(0)
        expect(body).toMatch(/^---\n/)
        expect(body).not.toMatch(/<(?:script|style|nav)\b/)
      } else expect(body).toMatch(/<!doctype html>/i)
    }
  }
})

test("quality preferences, wildcards, explicit URLs, HEAD, and unknown slugs", async ({ request }) => {
  for (const [accept, expected] of [
    ["*/*", "text/html"],
    ["text/markdown;q=0, text/html", "text/html"],
    ["text/html;q=1, text/markdown;q=0.1", "text/html"],
    ["text/markdown, text/html;q=0.9", "text/markdown"],
  ]) {
    const r = await request.get("/about", { headers: { Accept: accept } })
    expect(r.headers()["content-type"]).toContain(expected)
  }
  for (const path of ["/index.md", "/about.md", "/blog.md", "/archive.md", "/projects.md", "/projects/minimalist-blog.md", ...slugs.map((s) => `/blog/${s}.md`)]) {
    const r = await request.get(path, { headers: { Accept: "text/html" } })
    expect(r.status(), path).toBe(200)
    expect(r.headers()["content-type"], path).toContain("text/markdown")
  }
  const head = await request.head("/about", { headers: { Accept: "text/markdown" } })
  expect(head.status()).toBe(200)
  expect(head.headers()["content-type"]).toContain("text/markdown")
  expect(await head.body()).toHaveLength(0)
  for (const path of ["/blog/not-a-post", "/blog/not-a-post.md", "/projects/not-a-project", "/projects/not-a-project.md"]) {
    expect((await request.get(path, { headers: { Accept: "text/markdown" } })).status(), path).toBe(404)
  }
})

test("Flight requests keep their protocol and static assets keep caching", async ({ request }) => {
  const rsc = await request.get("/blog/tic402710280?_rsc=seo-test", { headers: { Accept: "text/markdown", RSC: "1" } })
  expect(rsc.status()).toBe(200)
  expect(rsc.headers()["content-type"]).toContain("text/x-component")
  const asset = await request.get("/images/cc-setup-overview.png", { headers: { Accept: "text/markdown" } })
  expect(asset.headers()["content-type"]).toContain("image/png")
  expect(asset.headers()["cache-control"]).not.toContain("no-store")
  const html = await (await request.get("/")).text()
  const script = html.match(/src="([^\"]*\/_next\/static\/[^\"]+\.js)"/)?.[1]
  expect(script).toBeTruthy()
  const chunk = await request.get(script!)
  expect(chunk.headers()["cache-control"]).toContain("immutable")
})

test("crawler metadata, RSS and sitemap describe the actual content", async ({ request, page }) => {
  const feed = await request.get("/feed.xml")
  expect(feed.headers()["content-type"]).toContain("application/rss+xml")
  const feedInfo = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, "text/xml")
    return { errors: doc.querySelectorAll("parsererror").length, items: doc.querySelectorAll("item").length }
  }, await feed.text())
  expect(feedInfo).toEqual({ errors: 0, items: slugs.length })
  const sitemap = await request.get("/sitemap.xml")
  expect(await sitemap.text()).toContain("https://sixeleven.in/pnd")
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).not.toContain("Disallow: /_next/")
  expect(robots).toContain("Allow: /api/og")
  const index = await (await request.get("/llms.txt")).text()
  for (const slug of slugs) expect(index).toContain(`/blog/${slug}.md`)
  for (const path of paths) {
    const html = await (await request.get(path, { headers: { Accept: "text/html" } })).text()
    expect(html, path).toContain(`rel="canonical" href="https://sixeleven.in${path === "/" ? "" : path}"`)
    expect(html, path).toContain('rel="alternate" type="text/markdown"')
    expect(html, path).toContain(`property="og:url" content="https://sixeleven.in${path === "/" ? "" : path}"`)
  }
  for (const slug of slugs) {
    const { data } = matter(readFileSync(`content/posts/${slug}.mdx`, "utf8"))
    const md = await (await request.get(`/blog/${slug}`, { headers: { Accept: "text/markdown" } })).text()
    expect(md).toContain(data.title)
    expect(md).not.toMatch(/\{\{(?:callout|youtube|color|creativecommons|claude-disclaimer)/)
  }
})
