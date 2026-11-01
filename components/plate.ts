// Media sits on a plate: a sheet-coloured frame with a 1px hairline, square-cornered,
// extending past the text column equally on both sides (24px on phones, 48px from md,
// 80px from lg), so the media runs wider than the 640px text. On phones the plate meets
// the screen edge, so only its top and bottom rules show.
// Spans, not figure/div, because markdown places images inside <p>.
export const PLATE_OUTER = "relative block my-10 -mx-6 md:-mx-12 lg:-mx-20"
export const PLATE = "block bg-[var(--sheet)] border-y md:border border-[var(--rule)] p-6 md:p-8 lg:p-10"

// The caption: under the plate, on the text column, until 1280px; from there it sits in
// the notes margin (24px past the plate, so 104px past the column), its cap height level
// with the top of the media. 35.7px = the plate's 1px rule and 40px padding, less the 5.3px from the
// top of a 13.5/1.48 R Sans line to its cap height.
export const PLATE_CAPTION =
  "note-text block mt-3 px-6 md:px-12 lg:px-20 xl:absolute xl:mt-0 xl:px-0 xl:left-[calc(100%+24px)] xl:top-[35.7px] xl:w-[200px] min-[1440px]:w-[216px] [text-wrap:pretty]"
