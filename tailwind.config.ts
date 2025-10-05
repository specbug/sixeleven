import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "rgba(255, 77, 6, 0.6)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgba(255, 77, 6, 0.6)",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        code: {
          light: {
            background: "#f3f4f6",
            text: "#111827",
          },
          dark: {
            background: "rgba(33,33,33,0.9);",
            text: "#e5e7eb",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        logo: ["var(--font-logo)"], // Add the logo font
        blogTitle: ["var(--font-blogTitle)"], // Add the blog title font
        tip: ["var(--font-tip)"],
        tiempos: ["var(--font-tiempos)"], // Tiempos Text font
        styrene: ["var(--font-styrene)"], // Styrene A font for headings
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            fontFamily: "var(--font-tiempos)",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "1.6",
            letterSpacing: "-0.01em",
            "--tw-prose-body": "#191919",
            "--tw-prose-invert-body": "#e5e7eb",
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
              fontWeight: "400",
              color: "inherit",
            },
            h1: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.05em",
              lineHeight: "1.15",
            },
            h2: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.04em",
              lineHeight: "1.2",
            },
            h3: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.03em",
              lineHeight: "1.25",
            },
            h4: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.025em",
              lineHeight: "1.3",
            },
            h5: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.02em",
              lineHeight: "1.3",
            },
            h6: {
              fontFamily: "var(--font-styrene)",
              fontWeight: "500",
              letterSpacing: "-0.015em",
              lineHeight: "1.3",
            },
            a: {
              color: "rgba(255, 77, 6, 0.6)",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            blockquote: {
              borderLeftColor: "#e5e7eb",
              fontStyle: "italic",
            },
            code: {
              fontFamily: "var(--font-mono)",
              color: "#111827",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.25rem",
              padding: "0.2em 0.4em",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              fontFamily: "var(--font-mono)",
              backgroundColor: "#1e293b",
              color: "#e2e8f0",
              overflow: "auto",
              padding: "1rem",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "#e5e7eb",
            "--tw-prose-headings": "#fff",
            "--tw-prose-links": "rgba(255, 77, 6, 0.8)",
            "--tw-prose-bold": "#fff",
            "--tw-prose-code": "#e5e7eb",
            "--tw-prose-quotes": "#e5e7eb",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config

