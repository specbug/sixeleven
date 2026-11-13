import Image from "next/image"
import { ledeFont } from "@/lib/lede-font"

const QUOTE = "endless frontier, entangled beliefs, eternal life 🚀"
const ALT = "Rishit Vora, in sunglasses, laughing against a cloudy sky"
// The file name carries a hash of the image, so a new crop gets a new URL and no browser,
// CDN or image-optimizer cache can serve the old one. Crop of the original (1795×1819):
// x 688, y 169, 988px square.
const SRC = "/images/about/rishit-8f4ce758.jpg"

// A seeded generator, so the server and every visit draw the same marks
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

// A cushion: a superellipse (|x|^n + |y|^n = 1) between an ellipse (n = 2) and a square,
// so every edge bows outward. n drifts a little around the outline so the cut looks made
// by hand rather than by a function.
function cushion(n = 2.75, steps = 120) {
  const pts: string[] = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const k = n + 0.18 * Math.sin(2 * t + 0.6) + 0.08 * Math.cos(3 * t)
    const c = Math.cos(t), s = Math.sin(t)
    const x = 0.5 + 0.5 * Math.sign(c) * Math.abs(c) ** (2 / k)
    const y = 0.5 + 0.5 * Math.sign(s) * Math.abs(s) ** (2 / k)
    pts.push(`${x.toFixed(4)},${y.toFixed(4)}`)
  }
  return `M${pts.join("L")}Z`
}
const SHAPE = cushion()

// Pencil marks around the photo: a few separate strokes at random arcs, each landing,
// running and lifting off with a taper, at a slightly different distance from the photo,
// like an editor going round a print in several passes. Drawn as filled outlines in a
// 100-unit square; at the rendered size 1 unit is about 2.8px.
function marks(seed: number, count: number) {
  const r = rng(seed)
  const out: string[] = []
  let a = r() * Math.PI * 2
  for (let m = 0; m < count; m++) {
    const span = 0.35 + r() * 1.05 // radians of arc per stroke
    const gap = 0.18 + r() * 0.8
    const rad = 0.42 + r() * 0.06
    const drift = (r() - 0.5) * 0.045 // the hand drifts in or out along the stroke
    const w = 0.24 + r() * 0.14 // peak half-width in units: 1.3–2.1px across
    const N = 40
    const left: string[] = [], right: string[] = []
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const t = a + span * u
      const k = 2.4
      const c = Math.cos(t), s = Math.sin(t)
      const rr = rad + drift * u + 0.004 * Math.sin(9 * t + m)
      const x = 50 + 100 * rr * Math.sign(c) * Math.abs(c) ** (2 / k)
      const y = 50 + 100 * rr * Math.sign(s) * Math.abs(s) ** (2 / k)
      // heavy where the pencil lands, a long thin lift
      const taper = Math.min(1, u / 0.12) * Math.min(1, (1 - u) / 0.45) ** 0.8
      const hw = 0.05 + w * taper * (0.85 + 0.15 * Math.sin(5 * t + m))
      left.push(`${(x + hw * c).toFixed(2)},${(y + hw * s).toFixed(2)}`)
      right.unshift(`${(x - hw * c).toFixed(2)},${(y - hw * s).toFixed(2)}`)
    }
    out.push(`M${left.join("L")}L${right.join("L")}Z`)
    a += span + gap
    if (a > Math.PI * 2 + 0.4 + (out.length > 2 ? 0 : 9)) break
  }
  return out
}

const MARKS = marks(11, 4)

// The About page's portrait: a tilted cushion, ringed in broken pencil, with Rishit's line
// as its caption. From 768px it floats left and the text wraps it, running full width
// once past the caption; on phones it sits centred above the text.
export default function AboutPortrait() {
  return (
    <figure className="mx-auto mb-10 w-[208px] md:float-left md:mx-0 md:mt-2 md:mr-12 md:mb-6 md:w-[200px]">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id="about-cushion" clipPathUnits="objectBoundingBox">
          <path d={SHAPE} />
        </clipPath>
      </svg>
      <span className="relative block" style={{ transform: "rotate(-3deg)" }}>
        <span className="block" style={{ clipPath: "url(#about-cushion)" }}>
          <Image src={SRC} alt={ALT} width={800} height={800} priority sizes="208px" className="block w-full h-auto" />
        </span>
        <svg aria-hidden viewBox="0 0 100 100" className="absolute -inset-[14%] w-[128%] h-[128%] overflow-visible pointer-events-none">
          {MARKS.map((d, i) => (
            <path key={i} d={d} fill="var(--cinnabar)" opacity="0.75" />
          ))}
        </svg>
      </span>
      <figcaption className={`${ledeFont.className} mt-9 italic text-[0.8125rem] leading-[1.45] text-[var(--ink-2)] text-center [text-wrap:balance]`}>{QUOTE}</figcaption>
    </figure>
  )
}
