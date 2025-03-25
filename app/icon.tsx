import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 24,
        background: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <img
        src="https://drive.google.com/file/d/1UOpnsHNUbkTAMaOO0zO4K3Qm2TPV1LcZ/view?usp=sharing"
        alt="sixeleven"
        width={32}
        height={32}
      />
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}

