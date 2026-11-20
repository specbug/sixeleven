import { MARGIN } from "./enhanced-markdown"

// Margin doodles: a small line drawing in the notes margin beside the paragraph that
// follows it, the way an editor sketches beside a word on a proof. Only where the margin
// exists (1280px and wider); narrower, there is no margin and no doodle. Placed in a post
// with `{{doodle:NAME}}` on its own line, just before the paragraph it belongs to. Drawn
// in the red pencil, the same as the stroke under a link.
const DOODLES: Record<string, { viewBox: string; paths: string[]; dots?: [number, number, number][] }> = {
  // TRICERATOPS, the false-positive vetting tool, in the TIC 402710280 post
  triceratops: {
    viewBox: "0 0 520 300",
    paths: [
      "M38 200C44 180 60 166 80 156L72 118L100 148C110 140 120 134 132 128C114 104 98 76 86 46C116 68 142 94 156 118C160 72 184 24 232 24C284 26 292 86 268 122C298 96 352 82 402 100C448 118 486 164 506 220C484 206 464 200 448 202C452 226 452 246 450 264L402 264C402 246 400 232 398 220C362 238 314 238 284 224C288 240 288 252 286 264L240 264C240 248 238 232 234 218C212 222 190 220 170 210C140 234 96 234 66 220C50 216 34 214 38 200Z",
      "M146 122C134 98 122 76 114 58M174 124C180 84 200 52 232 44M46 204C68 211 94 210 118 202M304 234C305 244 306 252 306 258L330 258C330 250 329 242 328 235M352 236C352 244 352 252 352 258L376 258C376 250 376 240 375 230",
    ],
    dots: [[136, 162, 5]],
  },
}

export function Doodle({ name }: { name: string }) {
  const d = DOODLES[name]
  if (!d) return null
  return (
    <div className="relative h-0" aria-hidden="true">
      <span data-margin className={`${MARGIN} pt-1 text-[var(--cinnabar)] opacity-90`}>
        <svg viewBox={d.viewBox} className="block w-[176px] h-auto -rotate-[4deg]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d={d.paths[0]} strokeWidth="5" />
          {d.paths.slice(1).map((p, i) => (
            <path key={i} d={p} strokeWidth="4" />
          ))}
          {d.dots?.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
          ))}
        </svg>
      </span>
    </div>
  )
}
