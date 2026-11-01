import type { Metadata } from "next"
import Link from "next/link"
import { penFor } from "@/lib/pencil"

export const metadata: Metadata = {
  title: "No such page | sixeleven",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div>
      <h1 className="title text-[2.5rem] md:text-[3.25rem] mb-6">No such page.</h1>
      <p>
        <Link href="/archive" className="pen" data-pen={penFor("/archive")}>
          Archive
        </Link>
      </p>
    </div>
  )
}
