import { describe, expect, test } from "bun:test"
import { markdownTarget, prefersMarkdown } from "../lib/markdown-negotiation"

describe("representation preference", () => {
  const cases: [string | null, boolean][] = [
    [null, false], ["", false], ["*/*", false], ["text/html,application/xhtml+xml,*/*;q=0.8", false],
    ["text/markdown", true], ["Text/Markdown; Charset=UTF-8", true],
    ["text/markdown, text/html;q=0.9", true], ["text/html;q=0.9, text/markdown", true],
    ["text/html;q=1, text/markdown;q=0.1", false], ["text/markdown;q=0, text/html", false],
    ["text/markdown;q=0, text/*;q=1", false], ["text/markdown;q=0.5, text/*;q=1", false],
    ["text/html;q=0, text/markdown;q=0.1, */*;q=1", true],
    ["text/markdown;q=bad", false], ["text/markdown;q=1.1", false], ["text/markdown;q=-1", false],
  ]
  for (const [accept, expected] of cases) {
    test(`${accept ?? "no Accept"} → ${expected ? "Markdown" : "HTML"}`, () => {
      expect(prefersMarkdown(accept)).toBe(expected)
    })
  }
})

test("only content pages negotiate; assets, APIs and explicit .md routes do not", () => {
  expect(markdownTarget("/")).toBe("/markdown")
  expect(markdownTarget("/projects/minimalist-blog")).toBe("/markdown/projects/minimalist-blog")
  expect(markdownTarget("/blog/tic402710280")).toBe("/markdown/blog/tic402710280")
  for (const path of ["/api/og", "/_next/static/chunk.js", "/blog/post.md", "/projects/project.md", "/pnd"]) {
    expect(markdownTarget(path)).toBeNull()
  }
})
