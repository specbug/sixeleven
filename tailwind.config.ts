import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Colour comes from the tokens in globals.css: neutrals plus the four signals.
      // The legacy names map onto them for the shadcn primitives in components/ui.
      colors: {
        ground: "var(--ground)",
        sheet: "var(--sheet)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        rule: "var(--rule)",
        grid: "var(--grid)",
        link: "var(--link)",
        note: "var(--note)",
        data: "var(--data)",
        you: "var(--you)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
      },
      // No rounded corners - Rams aesthetic
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        DEFAULT: "0",
      },
      // R Sans as primary font
      fontFamily: {
        sans: ["var(--font-rsans)", "system-ui", "sans-serif"],
        flex: ["var(--font-flex)", "var(--font-rsans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "var(--font-rsans)", "system-ui", "sans-serif"],
      },
      // Type scale based on 1.333 perfect fourth
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1.5" }],
        "sm": ["0.875rem", { lineHeight: "1.5" }],
        "base": ["1.15625rem", { lineHeight: "1.62" }],
        "lg": ["1.5rem", { lineHeight: "1.4" }],
        "xl": ["2rem", { lineHeight: "1.2" }],
        "2xl": ["2.5rem", { lineHeight: "1.15" }],
        "3xl": ["3rem", { lineHeight: "1.1" }],
        "4xl": ["4rem", { lineHeight: "1.05" }],
      },
      // Stolid kinetics - confident, weighty easing; never the browser default
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        out: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
      // 8px base spacing system
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      // Prose / Typography plugin configuration
      // Prose (the About page): the same reading measure, weights and signals as posts
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "640px",
            color: "var(--ink)",
            fontFamily: "var(--font-rsans), system-ui, sans-serif",
            fontSize: "1.15625rem",
            fontWeight: "inherit",
            lineHeight: "1.62",
            letterSpacing: "0",
            "--tw-prose-body": "var(--ink)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--link)",
            "--tw-prose-bold": "var(--ink)",
            "--tw-prose-quotes": "var(--ink-2)",
            "--tw-prose-code": "var(--ink)",
            "--tw-prose-pre-bg": "var(--code-bg)",
            "--tw-prose-bullets": "var(--ink-3)",
            "--tw-prose-counters": "var(--ink-3)",
            "--tw-prose-hr": "var(--rule)",
            p: { marginTop: "0", marginBottom: "1rem" },
            h2: { fontSize: "1.3125rem", fontWeight: "620", letterSpacing: "-0.012em", lineHeight: "1.3", marginTop: "3rem", marginBottom: "0.5rem" },
            h3: { fontSize: "1.3125rem", fontWeight: "620", letterSpacing: "-0.012em", lineHeight: "1.3", marginTop: "3rem", marginBottom: "0.5rem" },
            a: {
              color: "var(--link)",
              textDecorationLine: "underline",
              textDecorationThickness: "1px",
              textUnderlineOffset: "0.22em",
              textDecorationColor: "color-mix(in oklch, var(--link) 45%, transparent)",
              fontWeight: "inherit",
              "&:hover": { textDecorationColor: "var(--link)" },
            },
            strong: { fontWeight: "620" },
            blockquote: {
              borderLeftWidth: "1px",
              borderLeftColor: "var(--rule)",
              paddingLeft: "1.5rem",
              fontStyle: "normal",
              color: "var(--ink-2)",
              quotes: "none",
            },
            code: {
              fontFamily: "var(--font-mono)",
              fontWeight: "400",
              // R Mono x-height 0.520 vs R Sans 0.525: 0.89em keeps code's x-height in step
              fontSize: "0.89em",
              backgroundColor: "var(--sheet)",
              padding: "0.1em 0.3em",
              borderRadius: "0",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
            pre: {
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--code-bg)",
              border: "1px solid var(--rule)",
              borderRadius: "0",
              padding: "1.5rem",
              overflow: "auto",
            },
            img: { borderRadius: "0" },
            "ul > li": { paddingLeft: "0.25em" },
            "ol > li": { paddingLeft: "0.25em" },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "var(--ink)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--link)",
            "--tw-prose-bold": "var(--ink)",
            "--tw-prose-quotes": "var(--ink-2)",
            "--tw-prose-code": "var(--ink)",
            "--tw-prose-pre-bg": "var(--code-bg)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
