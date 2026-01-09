import { Manrope } from "next/font/google"
import localFont from "next/font/local"

// Primary font: Manrope - closest free alternative to Akzidenz-Grotesk (what Dieter Rams actually used)
// Geometric, clean, variable font with no italics by design
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
})

// Logo font: Et Book Bold Line Figures - distinctive, classic
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff",
  display: "block",
  variable: "--font-logo",
  preload: true,
})

// Monospace font: R Plex Mono for code blocks
export const monoFont = localFont({
  src: [
    {
      path: "../public/fonts/RPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/RPlexMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono",
})

// Legacy exports for compatibility
export const serifFont = manrope
export const sansFont = manrope
export const helveticaNeue = manrope
export const roboto = manrope
export const tiemposText = manrope
export const plexMono = monoFont
export const blogTitleFont = manrope
