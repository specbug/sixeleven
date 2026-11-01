// Real characters at render time; the authored text is left as written.

// Straight quotes to curly ones. `before` is the character preceding the string, so a
// quote at the start of a text node opens or closes according to what came before it.
export function smartQuotes(text: string, before = " "): string {
  let out = ""
  let prev = before
  for (const ch of text) {
    if (ch === "'") {
      out += /[\s([{“‘—–-]/.test(prev) || prev === "" ? "‘" : "’"
    } else if (ch === '"') {
      out += /[\s([{‘—–-]/.test(prev) || prev === "" ? "“" : "”"
    } else {
      out += ch
    }
    prev = ch
  }
  return out
}

// A remark plugin applying smartQuotes to prose text: never inside code, and never inside
// inline `$…$` math, where an apostrophe is a prime.
export function remarkSmartQuotes() {
  return (tree: any) => {
    let prev = " "
    const walk = (node: any) => {
      if (node.type === "code" || node.type === "inlineCode" || node.type === "html") {
        prev = "x"
        return
      }
      if (node.type === "text" && typeof node.value === "string") {
        const parts = node.value.split("$")
        node.value = parts
          .map((part: string, i: number) => {
            if (i % 2 === 1) return part // inside $…$
            const done = smartQuotes(part, prev)
            if (part) prev = part[part.length - 1]
            return done
          })
          .join("$")
        return
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}

// "Oct 2026"
export const monthYear = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

// "October 18, 2026"
export const fullDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
