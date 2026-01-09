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
      // Manrope as primary font
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "var(--font-manrope)", "system-ui", "sans-serif"],
      },
      // Type scale based on 1.333 perfect fourth
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        "sm": ["0.875rem", { lineHeight: "1.5" }],
        "base": ["1.125rem", { lineHeight: "1.7" }],
        "lg": ["1.5rem", { lineHeight: "1.4" }],
        "xl": ["2rem", { lineHeight: "1.2" }],
        "2xl": ["2.5rem", { lineHeight: "1.15" }],
        "3xl": ["3rem", { lineHeight: "1.1" }],
        "4xl": ["4rem", { lineHeight: "1.05" }],
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
            maxWidth: "680px",
            color: "#1a1a1a",
            fontFamily: "var(--font-manrope), system-ui, sans-serif",
            fontSize: "1.125rem",
            fontWeight: "400",
            lineHeight: "1.7",
            letterSpacing: "0",
            "--tw-prose-body": "#1a1a1a",
            "--tw-prose-headings": "#1a1a1a",
            "--tw-prose-links": "#ed8008",
            "--tw-prose-bold": "#1a1a1a",
            "--tw-prose-quotes": "#666666",
            "--tw-prose-code": "#1a1a1a",
            "--tw-prose-pre-bg": "#f8f8f8",
            p: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
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
            a: {
              color: "#ed8008",
              textDecoration: "none",
              fontWeight: "400",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            },
            strong: {
              fontWeight: "600",
            },
            // Blockquote - left border, no italics (Rams preferred clean type)
            blockquote: {
              borderLeftWidth: "3px",
              borderLeftColor: "#e0e0e0",
              paddingLeft: "1.5rem",
              fontStyle: "normal",
              color: "#666666",
              quotes: "none",
            },
            // Code - left border accent, no border-radius
            code: {
              fontFamily: "var(--font-mono)",
              fontWeight: "400",
              backgroundColor: "#f8f8f8",
              padding: "0.15em 0.4em",
              borderRadius: "0",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
            pre: {
              fontFamily: "var(--font-mono)",
              backgroundColor: "#f8f8f8",
              borderRadius: "0",
              borderLeft: "3px solid #ed8008",
              padding: "1.5rem",
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
        // Dark mode prose
        invert: {
          css: {
            "--tw-prose-body": "#f0f0f0",
            "--tw-prose-headings": "#f0f0f0",
            "--tw-prose-links": "#ed8008",
            "--tw-prose-bold": "#f0f0f0",
            "--tw-prose-quotes": "#888888",
            "--tw-prose-code": "#f0f0f0",
            "--tw-prose-pre-bg": "#141414",
            color: "#f0f0f0",
            blockquote: {
              borderLeftColor: "#333333",
              color: "#888888",
            },
            code: {
              backgroundColor: "#141414",
            },
            pre: {
              backgroundColor: "#141414",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
