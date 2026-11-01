// Which of the four pencil strokes (app/pencil.css) a link carries: a hash of its URL, so
// a given link always looks the same. In running text, a link that would repeat the stroke
// of the link before it takes the next one, so neighbours never look stamped from one die.
export const PEN_VARIANTS = 4

export const LOOP_VARIANTS = 3

// Which of the three hand-drawn loops (app/pencil.css) circles a selected control
export const loopFor = (key: string) => penFor(key) % LOOP_VARIANTS

export function penFor(href: string): number {
  // FNV-1a
  let h = 0x811c9dc5
  for (let i = 0; i < href.length; i++) {
    h ^= href.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) % PEN_VARIANTS
}

// A rehype plugin: stamps data-pen on every link in document order, stepping past the
// previous link's stroke. Footnote references are numerals, not links, and get none.
export function rehypePencil() {
  return (tree: any) => {
    let previous = -1
    const walk = (node: any) => {
      if (node.type === "element" && node.tagName === "a") {
        const props = node.properties || {}
        const href = typeof props.href === "string" ? props.href : ""
        if (href && props.dataFootnoteRef === undefined && props.dataFootnoteBackref === undefined) {
          let pen = penFor(href)
          if (pen === previous) pen = (pen + 1) % PEN_VARIANTS
          props.dataPen = String(pen)
          node.properties = props
          previous = pen
        }
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}
