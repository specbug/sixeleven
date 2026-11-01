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

// Titles and headings: Literata (OFL), the variable upright, subset to Latin with its
// small caps (smcp, c2sc) and oldstyle figures kept; opsz 7–72, wght 400–700.
// License: public/fonts/Literata-OFL.txt
export const literata = localFont({
  src: "../public/fonts/Literata-Variable.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-literata",
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

// Code only: R Mono.
export const monoFont = localFont({
  src: [
    { path: "../public/fonts/RMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/RMono-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/RMono-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/RMono-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
  variable: "--font-mono",
})

// The wordmark: Et Book Bold, line figures.
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff",
  display: "block",
  variable: "--font-logo",
  preload: true,
})
