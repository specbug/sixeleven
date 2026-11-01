// Media sits on a plate: a sheet with a 1px rule, the site's one form of elevation. On
// desktop it extends past the text column equally on both sides (640 → 736 → 800px), so
// the media itself runs a little wider than the text; on phones it runs edge to edge,
// ruled top and bottom, with padding that keeps the media on the text margin. The
// margins (the Rule on the left, notes on the right) stand 24px clear of the widest
// plate. Spans, not figure/div, because markdown places images inside <p>. Square corners.
export const PLATE_OUTER = "block my-8 -mx-6 md:-mx-12 lg:-mx-20"
export const PLATE = "block bg-[var(--sheet)] border-y md:border border-[var(--rule)] p-6 md:p-8 lg:p-10"
export const PLATE_CAPTION = "note-text block mt-2 px-6 md:px-0"
