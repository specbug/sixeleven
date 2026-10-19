# Search and agent access

The site serves the same published content to readers, search crawlers, and AI
agents. HTML includes the equations at first paint, per-page canonical metadata,
structured data, and discoverable RSS and Markdown alternatives. `robots.txt`
allows crawlers to load the site's scripts, styles, and Open Graph images.

## Markdown

Request `Accept: text/markdown` on `/`, `/about`, `/blog`, `/archive`, `/projects`,
or an individual `/blog/<slug>` or `/projects/<slug>` URL. Requests without an
explicit Markdown preference get HTML. A higher HTML quality wins; zero-quality
Markdown is rejected. Next's Flight requests and Server Actions bypass this
negotiation.

Explicit alternatives work without the header: `/index.md`, `/about.md`,
`/blog.md`, `/archive.md`, `/projects.md`, `/blog/<slug>.md`, and
`/projects/<slug>.md`. HTML advertises these with `rel="alternate"`. Markdown
responses carry YAML metadata, a canonical `Link` header, and an approximate
`x-markdown-tokens` count. Source TeX, code, image captions, and authorship/license
disclosures are preserved. `/llms.txt` lists the posts and their Markdown URLs;
it is a discovery aid, not a promise that any crawler will index or rank them.
The interactive `/pnd` gallery continues to serve HTML.

```sh
curl -H 'Accept: text/markdown' https://sixeleven.in/blog/tic402710280
curl https://sixeleven.in/blog/tic402710280.md
```

## Cache behavior

Next 15 overwrites `Vary` on rendered HTML pages, even when middleware or
`next.config` supplied `Vary: Accept`. Negotiating a shared-cacheable HTML URL
would allow an HTML-first cache entry to shadow the Markdown representation.
Both responses therefore use `Cache-Control: private, no-store`. Markdown also
includes `Vary: Accept`; correctness does not depend on Next preserving it on
HTML. This trades shared/browser HTTP caching of these page responses for
correct negotiation. Pages are still statically generated, and asset caching
(JS, CSS, images, fonts), RSS, the sitemap, and `llms.txt` are unaffected.

Do not remove `no-store` unless the deployed stack reliably emits `Vary: Accept`
on **both** representations and caches them separately. Tests exercise both
request orders and verify the final response headers on a production server.

## Validation

Use the existing checkout; no extra Git worktree is needed. With Bun available:

```sh
bun install --frozen-lockfile
bun test tests/portable.test.ts tests/markdown-negotiation.test.ts
bun run build
bun run test:seo
```

The browser suite starts the production server on port 3001. It uses system
Chromium when installed, or Playwright's Chromium (`bunx playwright install
chromium`); `CHROMIUM_PATH` can select an existing browser. `SEO_TEST_BASE_URL`
targets an already running server instead. Tests cover all content pages,
negotiation quality, explicit URLs, 404s, cache headers, Flight, metadata,
RSS/sitemap/robots, all 125 equations without JavaScript, and phone/desktop in
light/dark mode. Third-party embeds are blocked during local browser checks;
their providers' availability is outside this suite.

For RSS, MathML is protected from Markdown parsing. Regression tests compare
every equation's source annotation, not just the number of equations. No post
text or equation source was changed for SEO.

The repository's build skips lint and type checking. Existing TypeScript errors
in unrelated components and the missing ESLint configuration remain separate
work. Do not describe the build as a passing type or lint check.

No AI-training or reuse preference headers are added. Those preferences require
an explicit owner decision. These changes improve crawlability and extraction;
actual indexing and ranking should be monitored after deployment in search
engine webmaster tools.
