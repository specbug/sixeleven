import localFont from "next/font/local"

// Four faces, one job each, plus the wordmark.

// Running text: R Sans, Rishit's own variable face (opsz 9–40, wght 100–1000).
export const rSans = localFont({
  src: [
    { path: "../public/fonts/RSans-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../public/fonts/RSans-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-rsans",
})

// Titles and headings: Google Sans (OFL), the Text design (opsz pinned to 17, grade 0)
// with a variable weight axis 400–700, subset to Latin.
// License: public/fonts/GoogleSans-OFL.txt
export const headingFont = localFont({
  src: "../public/fonts/GoogleSansText-Variable.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-heading",
})

// Small text and every number: Google Sans Flex (OFL), pinned to ROND 0, slnt 0,
// wdth 100, with opsz 8–32 and wght 300–700 left variable; subset to Latin.
// License: public/fonts/GoogleSansFlex-OFL.txt
export const flex = localFont({
  src: "../public/fonts/GoogleSansFlex-Variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-flex",
})

// Code: Menlo where it is installed (macOS; named first in the font stack, never served),
// and otherwise JetBrains Mono (OFL), variable weight 100–800, upright and italic, with its
// coding ligatures (calt). Subset to Latin, punctuation, arrows and box drawing.
// License: public/fonts/JetBrainsMono-OFL.txt
export const monoFont = localFont({
  src: [
    { path: "../public/fonts/JetBrainsMono-Variable.woff2", weight: "100 800", style: "normal" },
    { path: "../public/fonts/JetBrainsMono-Italic-Variable.woff2", weight: "100 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-mono",
  // Not preloaded: a Mac renders Menlo and never needs this file, so it is fetched only
  // where the browser actually falls back to it
  preload: false,
  // No metric-matched Arial stand-in: it would sit between this face and R Mono below
  // and catch the symbols R Mono is there for
  adjustFontFallback: false,
})

// Symbols JetBrains Mono lacks: R Mono, Rishit's own, fills in Misc Symbols and Dingbats
// (the Claude disclaimer's spinner stars, for one) after JetBrains Mono. The unicode-range means browsers fetch it only on a page that uses one
// of those characters, and not at all on a Mac, where Menlo has them. File unchanged.
export const monoSymbols = localFont({
  src: "../public/fonts/RMono-Regular.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-mono-symbols",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2600-27BF" }],
})

// Maths: TeX Gyre Pagella Math (GUST Font License), a Palatino with an OpenType MATH table,
// so browsers lay out KaTeX's MathML with its own spacing and stretchy delimiters. The
// whole font, losslessly compressed; fetched only on a page with maths.
// License: public/fonts/TeXGyrePagellaMath-GUST-FONT-LICENSE.txt
export const mathFont = localFont({
  src: "../public/fonts/TeXGyrePagellaMath.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-math",
  preload: false,
  adjustFontFallback: false,
})

// The wordmark: Et Book Bold, line figures.
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff",
  display: "block",
  variable: "--font-logo",
  preload: true,
})
