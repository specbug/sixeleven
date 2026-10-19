import { defineConfig } from "@playwright/test"
import { existsSync } from "node:fs"

export default defineConfig({
  testDir: "./tests/browser",
  workers: 2,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: process.env.SEO_TEST_BASE_URL || "http://localhost:3001",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.SEO_TEST_BASE_URL ? undefined : {
    command: "node node_modules/next/dist/bin/next start --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
  projects: [
    { name: "http", testMatch: "http.spec.ts" },
    ...([390, 1440] as const).flatMap((width) => (["light", "dark"] as const).map((colorScheme) => ({
      name: `${width === 390 ? "phone" : "desktop"}-${colorScheme}`,
      testMatch: "pages.spec.ts",
      use: { viewport: { width, height: 900 }, colorScheme },
    }))),
  ],
})
