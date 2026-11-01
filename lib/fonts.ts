import localFont from "next/font/local"

// Running text: R Sans, Rishit's own face (variable: opsz 9–40, wght 100–1000)
export const rSans = localFont({
  src: [
    {
      path: "../public/fonts/RSans-Variable.woff2",
      weight: "100 1000",
      style: "normal",
    },
    {
      path: "../public/fonts/RSans-Italic-Variable.woff2",
      weight: "100 1000",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-rsans",
})

// Small text and every number: Google Sans Flex (OFL, Google 2025). The file is the
// variable font pinned to ROND 0, slnt 0, wdth 100, keeping opsz (8–32, left on auto)
// and wght (300–700), subset to Latin. License: public/fonts/GoogleSansFlex-OFL.txt
export const flexFont = localFont({
  src: "../public/fonts/GoogleSansFlex-Variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-flex",
})

// Logo font: Et Book Bold Line Figures - distinctive, classic
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff",
  display: "block",
  variable: "--font-logo",
  preload: true,
})

// Code only: R Mono
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
