import type { Config } from "tailwindcss"

// Tokens live in app/globals.css; this maps them to utilities. No stock palette, no
// radius, no shadows.
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        sheet: "var(--sheet)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        rule: "var(--rule)",
        grid: "var(--grid)",
        cinnabar: "var(--cinnabar)",
        viridian: "var(--viridian)",
        ultramarine: "var(--ultramarine)",
        // Names the shadcn primitives in components/ui still use
        border: "var(--rule)",
        input: "var(--rule)",
        ring: "var(--ultramarine)",
        background: "var(--ground)",
        foreground: "var(--ink)",
        primary: { DEFAULT: "var(--ink)", foreground: "var(--ground)" },
        secondary: { DEFAULT: "var(--sheet)", foreground: "var(--ink)" },
        muted: { DEFAULT: "var(--sheet)", foreground: "var(--ink-2)" },
        accent: { DEFAULT: "var(--sheet)", foreground: "var(--ink)" },
        destructive: { DEFAULT: "var(--cinnabar)", foreground: "var(--ground)" },
        popover: { DEFAULT: "var(--sheet)", foreground: "var(--ink)" },
        card: { DEFAULT: "var(--sheet)", foreground: "var(--ink)" },
      },
      borderRadius: { lg: "0", md: "0", sm: "0", DEFAULT: "0" },
      boxShadow: { sm: "none", DEFAULT: "none", md: "none", lg: "none" },
      fontFamily: {
        sans: ["var(--font-rsans)", "system-ui", "sans-serif"],
        display: ["var(--font-heading)", "var(--font-rsans)", "system-ui", "sans-serif"],
        flex: ["var(--font-flex)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        out: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
