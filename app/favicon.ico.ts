import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  // Read the favicon file
  const filePath = path.join(process.cwd(), "public", "favicon.png")
  const buffer = fs.readFileSync(filePath)

  // Return the favicon with appropriate headers
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

