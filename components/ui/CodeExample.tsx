"use client"

import type React from "react"
import { useState } from "react"

interface CodeExampleProps {
  children: React.ReactNode
  language?: string
}

export function CodeExample({ children, language = "jsx" }: CodeExampleProps) {
  const [output, setOutput] = useState<React.ReactNode | null>(null)

  // This is a simplified example - in a real app, you'd use a proper code execution sandbox
  const executeCode = () => {
    try {
      // For demo purposes only - this would be replaced with a proper sandbox in a real app
      setOutput(<div>Code execution simulated! This would run the code in a real implementation.</div>)
    } catch (error) {
      setOutput(<div className="text-red-500">Error executing code: {String(error)}</div>)
    }
  }

  return (
    <div className="interactive-code">
      <pre className={`language-${language}`}>
        <code>{children}</code>
      </pre>

      <div className="mt-4">
        <button
          onClick={executeCode}
          className="px-4 py-2 bg-accent/60 text-white rounded hover:bg-accent/80 transition-colors"
        >
          Run Example
        </button>
      </div>

      {output && <div className="interactive-code-output mt-4">{output}</div>}
    </div>
  )
}

