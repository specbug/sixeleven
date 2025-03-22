import type React from "react"
interface ColoredTextProps {
  children: React.ReactNode
  color?: string
}

export function ColoredText({ children, color = "accent" }: ColoredTextProps) {
  // Use Tailwind classes for predefined colors or custom color
  const colorClass = color.startsWith("#") ? { color } : color === "accent" ? "text-accent/80" : `text-${color}-500`

  return (
    <span
      style={typeof colorClass === "object" ? colorClass : {}}
      className={typeof colorClass === "string" ? colorClass : ""}
    >
      {children}
    </span>
  )
}

