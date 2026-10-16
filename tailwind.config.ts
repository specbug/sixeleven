import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Dieter Rams / Braun inspired color palette
      colors: {
        // The iconic Braun orange - ONLY for interactive elements
        braun: {
          orange: "#ed8008",
          "orange-hover": "#d67307",
          "orange-muted": "rgba(237, 128, 8, 0.12)",
        },
        // Light mode neutrals
        rams: {
          white: "#ffffff",
          "off-white": "#f8f8f8",
          "near-black": "#1a1a1a",
          "dark-gray": "#666666",
          "light-gray": "#e0e0e0",
          "muted-gray": "#999999",
          // Dark mode
          "dark-bg": "#0a0a0a",
          "dark-surface": "#141414",
          "dark-text": "#f0f0f0",
          "dark-muted": "#888888",
        },
        // Legacy color mappings for compatibility
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#ed8008",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f8f8f8",
          foreground: "#1a1a1a",
        },
        muted: {
          DEFAULT: "#f8f8f8",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#ed8008",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1a1a1a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1a1a1a",
        },
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
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "var(--font-rsans)", "system-ui", "sans-serif"],
      },
      // Type scale based on 1.333 perfect fourth
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        "sm": ["0.875rem", { lineHeight: "1.5" }],
        "base": ["1.0625rem", { lineHeight: "1.6" }],
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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "640px",
            color: "var(--foreground-body)",
            fontFamily: "var(--font-rsans), system-ui, sans-serif",
            fontSize: "1.0625rem",
            fontWeight: "400",
            lineHeight: "1.6",
            letterSpacing: "0",
            "--tw-prose-body": "var(--foreground-body)",
            "--tw-prose-headings": "var(--foreground)",
            "--tw-prose-links": "var(--foreground)",
            "--tw-prose-bold": "var(--foreground)",
            "--tw-prose-quotes": "var(--foreground-muted)",
            "--tw-prose-code": "var(--foreground)",
            "--tw-prose-pre-bg": "var(--code-bg)",
            "--tw-prose-bullets": "var(--foreground-subtle)",
            "--tw-prose-counters": "var(--foreground-subtle)",
            "--tw-prose-hr": "var(--border)",
            p: {
              marginTop: "1em",
              marginBottom: "1em",
            },
            // Blog content headings stay normal case
            h1: {
              fontWeight: "600",
              letterSpacing: "-0.02em",
              marginTop: "0",
              marginBottom: "0.5em",
            },
            h2: {
              fontWeight: "600",
              letterSpacing: "-0.01em",
              marginTop: "2em",
              marginBottom: "0.5em",
            },
            h3: {
              fontWeight: "600",
              letterSpacing: "0",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            h4: {
              fontWeight: "500",
              marginTop: "1.25em",
              marginBottom: "0.5em",
            },
            // Links - orange, underline on hover
            // Links - ink with an orange hairline; color is a guest, not a host
            a: {
              color: "var(--foreground)",
              textDecorationLine: "underline",
              textDecorationColor: "var(--braun-orange)",
              textDecorationThickness: "1px",
              textUnderlineOffset: "0.2em",
              fontWeight: "inherit",
              "&:hover": {
                color: "var(--braun-orange)",
              },
            },
            strong: {
              fontWeight: "600",
            },
            // Blockquote - left border, no italics (Rams preferred clean type)
            blockquote: {
              borderLeftWidth: "2px",
              borderLeftColor: "var(--border)",
              paddingLeft: "1.5rem",
              fontStyle: "normal",
              color: "var(--foreground-muted)",
              quotes: "none",
            },
            // Code - 4px blocks, 2px inline (matches the markdown renderer)
            code: {
              fontFamily: "var(--font-mono)",
              fontWeight: "400",
              fontSize: "0.85em",
              backgroundColor: "var(--surface)",
              padding: "0.1em 0.3em",
              borderRadius: "2px",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
            pre: {
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--code-bg)",
              borderRadius: "4px",
              padding: "1.25rem 1.5rem",
              overflow: "auto",
            },
            // Images - no rounded corners
            img: {
              borderRadius: "0",
            },
            // Lists
            "ul > li": {
              paddingLeft: "0.25em",
            },
            "ol > li": {
              paddingLeft: "0.25em",
            },
          },
        },
        // Dark mode prose - tokens already flip under .dark
        invert: {
          css: {
            "--tw-prose-body": "var(--foreground-body)",
            "--tw-prose-headings": "var(--foreground)",
            "--tw-prose-links": "var(--foreground)",
            "--tw-prose-bold": "var(--foreground)",
            "--tw-prose-quotes": "var(--foreground-muted)",
            "--tw-prose-code": "var(--foreground)",
            "--tw-prose-pre-bg": "var(--code-bg)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
