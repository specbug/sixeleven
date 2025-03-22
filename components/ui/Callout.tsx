import type React from "react"

interface CalloutProps {
  children: React.ReactNode
  type?: "info" | "warning" | "error"
}

export function Callout({ children, type = "info" }: CalloutProps) {
  return <div className={`callout ${type} text-sm sm:text-base`}>{children}</div>
}

