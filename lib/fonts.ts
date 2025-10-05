import localFont from "next/font/local"

// Load your custom serif font (assuming you have a font like Warnock Pro)
export const serifFont = localFont({
  src: [
    {
      path: "../public/fonts/Source Serif 4 Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Source Serif 4 Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../public/fonts/Source Serif 4 Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Source Serif 4 Bold It.woff2",
      weight: "700",
      style: "italic",
    }
  ],
  display: "swap",
  variable: "--font-serif",
})

// Optional: Add a sans-serif font for UI elements if needed
export const sansFont = localFont({
  src: [
    {
      path: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-sans",
})

// Optional: Add a monospace font for code blocks
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

// Add a special display font for the logo/title
export const logoFont = localFont({
  src: "../public/fonts/Et Book Bold Line Figures.woff", // Replace with your actual logo font file
  display: "block", // Use 'block' for logos to ensure it only shows when loaded
  variable: "--font-logo",
  preload: true,
})


// Add a special display font for the header/footer
export const tipFont = localFont({
  src: "../public/fonts/Et Book Roman Line Figures.woff", // Replace with your actual logo font file
  display: "block", // Use 'block' for logos to ensure it only shows when loaded
  variable: "--font-tip",
  preload: true,
})


// Add a special display font for the blog title
export const blogTitleFont = localFont({
  src: "../public/fonts/Adobe Garamond Pro Regular.otf", // Replace with your actual logo font file
  display: "block", // Use 'block' for logos to ensure it only shows when loaded
  variable: "--font-blogTitle",
  preload: true,
})

// Tiempos Text font for body text
export const tiemposText = localFont({
  src: [
    {
      path: "../public/fonts/test-tiempos-text-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/test-tiempos-text-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/test-tiempos-text-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/test-tiempos-text-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-tiempos",
  preload: true,
})

// Styrene B font for headings (more condensed than Styrene A)
export const styreneB = localFont({
  src: [
    {
      path: "../public/fonts/StyreneB-Regular-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/StyreneB-Medium-Trial.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/StyreneB-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-styrene",
  preload: true,
})


