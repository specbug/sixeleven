import localFont from "next/font/local"

// The subheading under a page title (a post's lede, the PND subtitle): Literata italic
// (OFL), pinned to its regular weight with optical sizes 12–36 kept, subset to Latin.
// Its own module, imported only by the pages that show a subheading, so Next.js preloads
// it there and nowhere else. License: public/fonts/Literata-OFL.txt
export const ledeFont = localFont({
  src: "../public/fonts/Literata-Italic.woff2",
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-lede",
})
