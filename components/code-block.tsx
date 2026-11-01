"use client"

import { Highlight, type PrismTheme } from "prism-react-renderer"
import Prism from "@/lib/prism"

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

// Syntax in ink alone. Each pigment means one thing across the site, so code can't
// borrow them: structure is carried by the ink steps, weight and italic instead.
const theme: PrismTheme = {
  plain: { color: "var(--ink)", backgroundColor: "var(--sheet)" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--ink-3)", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "var(--ink-3)" } },
    { types: ["keyword", "atrule", "selector", "important", "builtin"], style: { color: "var(--ink)", fontWeight: "700" } },
    { types: ["string", "char", "attr-value", "regex", "inserted", "url"], style: { color: "var(--ink-2)" } },
    { types: ["number", "boolean", "constant", "symbol", "variable"], style: { color: "var(--ink)" } },
    { types: ["function", "class-name"], style: { color: "var(--ink)" } },
    { types: ["tag", "property", "attr-name", "deleted", "namespace"], style: { color: "var(--ink-2)" } },
  ],
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  return (
    <div className="my-8">
      <Highlight theme={theme} code={code} language={language as any} prism={Prism}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          // A lone "1" carries no information - number only multi-line blocks
          const numbered = showLineNumbers && tokens.length > 1

          // Ligatures off: R Mono joins `--` into a dash, so `--flag` would read as `—flag`
          return (
            <pre
              className={`${className} -mx-6 md:mx-0 px-6 py-5 border-y md:border border-[var(--rule)] overflow-auto text-[0.8125rem] md:text-[0.875rem] leading-[1.7] [font-variant-ligatures:none]`}
              style={style}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i })
                const { key: lineKey, ...restLineProps } = lineProps

                return (
                  <div key={lineKey as React.Key} {...restLineProps} className="table-row">
                    {numbered && (
                      <span className="table-cell text-right pr-5 select-none font-flex text-[0.75rem] [font-variant-numeric:tabular-nums] text-[var(--ink-3)]">
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
