"use client"

import Image from "next/image"
import { Inline } from "./enhanced-markdown"
import { PLATE, PLATE_CAPTION, PLATE_OUTER } from "./plate"

// A post's cover image, declared in frontmatter (`cover`, `coverAlt`, `coverCredit`) and
// set on the same plate as the post's figures, so it reads as the first figure, not a
// hero banner. Covers are 16:9; the credit is markdown so a licence keeps its link.
export default function PostCover({ src, alt, credit }: { src: string; alt?: string; credit?: string }) {
  return (
    <figure className={`${PLATE_OUTER} mt-0`}>
      <span className={PLATE}>
        <Image src={src} alt={alt || ""} width={1920} height={1080} priority className="block w-full h-auto" />
      </span>
      {credit && (
        <figcaption className={PLATE_CAPTION} data-margin>
          <Inline text={credit} />
        </figcaption>
      )}
    </figure>
  )
}
