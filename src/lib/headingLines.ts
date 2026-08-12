/**
 * Display headings are authored as the lines the desktop exports draw, one `<span>` each.
 * Several of the mobile exports break the same sentence differently — the measure is
 * 345px rather than 1200 — so those spans run inline below `lg` and wrap to the narrow
 * measure instead of holding the desktop's breaks.
 *
 * Running them inline means the line break itself has to become a separator: a space
 * between Latin lines, and nothing between Japanese ones, where a space would open a gap
 * in the middle of a sentence. The text stays one copy in the DOM either way, so it is
 * still selectable and translatable as written.
 */
export const lineGap = (previous: string | undefined) =>
  previous && /[A-Za-z0-9.,!?)\]]$/.test(previous.trimEnd()) ? " " : "";
