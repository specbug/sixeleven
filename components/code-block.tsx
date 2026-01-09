"use client"

import { Highlight, themes } from "prism-react-renderer"
import Prism from "@/lib/prism"

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  return (
    <div className="not-prose my-6">
      <Highlight theme={themes.oneDark} code={code} language={language as any} prism={Prism}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-6 overflow-auto border-l-[3px] border-[var(--braun-orange)]`}
            style={{
              ...style,
              // Keep the oneDark dark background for better contrast
              borderRadius: 0,
            }}
          >
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })
              const { key: lineKey, ...restLineProps } = lineProps

              return (
                <div key={lineKey as React.Key} {...restLineProps} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 select-none opacity-50 text-xs">
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
        )}
      </Highlight>
    </div>
  )
}
