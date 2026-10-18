import { expect, test } from "bun:test"
import { prefersMarkdown } from "../middleware"

const cases: Array<[string | null, boolean]> = [
  // Browsers and generic clients get HTML
  ["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", false],
  ["*/*", false],
  [null, false],
  ["", false],
  ["text/*", false],
  // Clients that ask for markdown get it
  ["text/markdown", true],
  ["text/markdown, text/html;q=0.9", true],
  ["text/markdown, */*", true],
  ["text/markdown;q=0.9, text/plain;q=0.8", true],
  ["TEXT/Markdown", true],
  // Explicit preference for HTML wins
  ["text/html;q=1, text/markdown;q=0.1", false],
  ["text/html, text/markdown;q=0.5", false],
  ["text/*;q=1, text/markdown;q=0.5", false],
  ["*/*;q=1, text/markdown;q=0.8", false],
  // Ties go to markdown, which the client named explicitly
  ["text/html;q=0.8, text/markdown;q=0.8", true],
  // Refused or malformed
  ["text/markdown;q=0", false],
  ["text/markdown;q=0, text/html", false],
  ["text/markdown;q=abc", false],
]

for (const [accept, expected] of cases) {
  test(`Accept: ${JSON.stringify(accept)} → ${expected ? "markdown" : "HTML"}`, () => {
    expect(prefersMarkdown(accept)).toBe(expected)
  })
}
