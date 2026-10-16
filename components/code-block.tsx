"use client"

import { Highlight, type PrismTheme } from "prism-react-renderer"
import Prism from "@/lib/prism"

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

// Syntax theme drawn from the site's own tokens (see --code-* in globals.css), so it
// follows light/dark mode: ink tones for structure, the orange family for literals,
// one cool neutral for keywords. Comments recede in italic.
const theme: PrismTheme = {
  plain: {
    color: "var(--code-fg)",
    backgroundColor: "var(--code-bg)",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--code-comment)", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "var(--code-punct)" } },
    { types: ["keyword", "atrule", "selector", "important", "builtin"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "char", "attr-value", "regex", "inserted", "url"], style: { color: "var(--code-string)" } },
    { types: ["number", "boolean", "constant", "symbol", "variable"], style: { color: "var(--code-number)" } },
    { types: ["function", "class-name"], style: { color: "var(--code-function)" } },
    { types: ["tag", "property", "attr-name", "deleted", "namespace"], style: { color: "var(--code-tag)" } },
  ],
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  return (
    <div className="not-prose my-6">
      <Highlight theme={theme} code={code} language={language as any} prism={Prism}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          // A lone "1" carries no information - number only multi-line blocks
          const numbered = showLineNumbers && tokens.length > 1

          // Ligatures off: R Mono joins `--` into a dash, so `--flag` would read as `—flag`
          return (
            <pre
              className={`${className} px-6 py-5 rounded-[4px] overflow-auto text-[0.8125rem] md:text-[0.875rem] leading-[1.7] [font-variant-ligatures:none]`}
              style={style}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i })
                const { key: lineKey, ...restLineProps } = lineProps

                return (
                  <div key={lineKey as React.Key} {...restLineProps} className="table-row">
                    {numbered && (
                      <span className="table-cell text-right pr-5 select-none tabular-nums text-[var(--code-line-number)]">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key })
                        const { key: tokenKey, ...restTokenProps } = tokenProps
                        return <span key={tokenKey as React.Key} {...restTokenProps} />
                      })}
                    </span>
                  </div>
                )
              })}
            </pre>
          )
        }}
      </Highlight>
    </div>
  )
}
