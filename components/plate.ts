// Media sits on a plate: a quiet surface that sets figures apart from prose. On
// desktop it extends past the text column equally on both sides (640 -> 736 -> 800px);
// on phones it runs edge to edge, with padding that keeps the media on the text margin.
// Spans, not figure/div, because markdown places images inside <p>. A 4px corner echoes
// R Sans's softened terminals; phones keep square corners, where the plate meets the
// screen edge, and media inside stays square against the generous padding.
export const PLATE_OUTER = "block my-8 -mx-6 md:-mx-12 lg:-mx-20"
export const PLATE = "block bg-[var(--plate)] p-6 md:p-8 lg:p-10 md:rounded-[4px]"
export const PLATE_CAPTION = "block mt-3 px-6 md:px-0 text-sm leading-snug text-[var(--foreground-muted)]"
