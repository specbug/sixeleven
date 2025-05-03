import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title") || "sixeleven blog"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          color: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 30,
            maxWidth: "80%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            marginTop: 20,
            opacity: 0.8,
          }}
        >
          sixeleven.in
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
