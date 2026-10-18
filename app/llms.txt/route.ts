import { siteIndex } from "@/lib/site-index"

export const dynamic = "force-static"

export async function GET() {
  return new Response(await siteIndex(), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
