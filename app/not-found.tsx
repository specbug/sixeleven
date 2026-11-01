import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "No such page | sixeleven",
}

// The navigation above already offers every way back
export default function NotFound() {
  return <h1 className="display text-[2.5rem] md:text-[3.25rem]">No such page.</h1>
}
