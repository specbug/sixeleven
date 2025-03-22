"use client"

import { Highlight, themes } from "prism-react-renderer"

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  return (
    <div className="not-prose">
      <Highlight theme={themes.oneDark} code={code} language={language as any}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 rounded-md overflow-auto my-6`} style={style}>
            {tokens.map((line, i) => {
              // Extract the key from line props and pass it separately
              const lineProps = getLineProps({ line, key: i })
              const { key: lineKey, ...restLineProps } = lineProps

              return (
                <div key={lineKey} {...restLineProps} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 select-none opacity-50 text-xs">{i + 1}</span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => {
                      // Extract the key from token props and pass it separately
                      const tokenProps = getTokenProps({ token, key })
                      const { key: tokenKey, ...restTokenProps } = tokenProps
                      return <span key={tokenKey} {...restTokenProps} />
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

