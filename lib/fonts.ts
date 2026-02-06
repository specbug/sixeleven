import localFont from "next/font/local"

// Primary font: R Sans - custom sans-serif variable font
export const rSans = localFont({
  src: [
    {
      path: "../public/fonts/RSans-Variable.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/RSans-Italic-Variable.woff2",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-rsans",
})

// Logo font: Et Book Bold Line Figures - distinctive, classic
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff",
  display: "block",
  variable: "--font-logo",
  preload: true,
})

// Monospace font: R Mono for code blocks
export const monoFont = localFont({
  src: [
    {
      path: "../public/fonts/RMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/RMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/RMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/RMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-mono",
})

// Legacy exports for compatibility
export const manrope = rSans
export const serifFont = rSans
export const sansFont = rSans
export const helveticaNeue = rSans
export const roboto = rSans
export const tiemposText = rSans
export const plexMono = monoFont
export const blogTitleFont = rSans
