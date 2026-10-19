import { test, expect } from "@playwright/test"
import { readdirSync } from "node:fs"

const slugs = readdirSync("content/posts").filter((p) => p.endsWith(".mdx")).map((p) => p.slice(0, -4))
const paths = ["/", "/about", "/blog", "/archive", "/projects", "/projects/minimalist-blog", "/projects/data-visualization-library", "/pnd", ...slugs.map((s) => `/blog/${s}`)]

test.beforeEach(async ({ page }) => {
  // Check the site's own rendering without waiting on third-party embeds.
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort())
})

test("pages render without hydration errors or page-level horizontal overflow", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|Minified React error/.test(message.text())) errors.push(message.text())
  })
  for (const path of paths) {
    expect((await page.goto(path))?.status(), path).toBe(200)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.locator("main").innerText(), path).not.toBe("")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true)
    const dark = test.info().project.name.endsWith("-dark")
    expect(await page.locator("html").evaluate((el) => el.classList.contains("dark")), path).toBe(dark)
    expect(errors, path).toEqual([])
  }
})

test("navigation, theme toggle and archive search remain usable", async ({ page }) => {
  await page.goto("/")
  const initialDark = await page.locator("html").evaluate((el) => el.classList.contains("dark"))
  await page.getByRole("button", { name: /theme|dark|light/i }).click()
  expect(await page.locator("html").evaluate((el) => el.classList.contains("dark"))).toBe(!initialDark)
  const phone = test.info().project.name.startsWith("phone")
  if (phone) await page.getByRole("button", { name: "Toggle mobile menu" }).click()
  await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.locator("main")).toContainText("Rishit Vora")
  if (phone) await page.getByRole("button", { name: "Toggle mobile menu" }).click()
  await page.getByRole("navigation").getByRole("link", { name: "Archive", exact: true }).click()
  await expect(page).toHaveURL(/\/archive$/)
  const search = page.getByRole("textbox").first()
  await search.fill("Searching for a World")
  await expect(page.locator('main a[href="/blog/tic402710280"]')).toBeVisible()
})

test("all equations are readable with JavaScript disabled", async ({ browser }) => {
  const { viewport, colorScheme } = test.info().project.use
  const context = await browser.newContext({ javaScriptEnabled: false, viewport, colorScheme })
  const page = await context.newPage()
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort())
  const base = test.info().project.use.baseURL || "http://localhost:3001"
  let equations = 0
  for (const slug of ["tic402710280", "bostrom-sim", "n-subarrays", "digit-span-22", "gravity-exp-mock", "py-mutables", "compressionism"]) {
    await page.goto(`${base}/blog/${slug}`)
    equations += await page.locator("math").count()
    await expect(page.locator(".katex-error")).toHaveCount(0)
    expect(await page.locator("math").first().evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(0)
  }
  expect(equations).toBe(125)
  await context.close()
})
