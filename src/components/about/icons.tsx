/**
 * Icons taken verbatim from the about-page design SVGs in `public/about`.
 * Path data and stroke widths are unchanged; only the origin is normalised to 0,0 and
 * the colour switched to currentColor so callers can tint them.
 *
 * The forward chevron on the cards is the same 6x12 mark the rest of the site uses —
 * import `ChevronRight` from `@/components/home/icons` for that one.
 */

type IconProps = { className?: string };

/* Leader drawer — back chevron, the mirror of the shared ChevronRight. */
export const ChevronLeft = ({ className }: IconProps) => (
  <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6 12L0 6L6 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Leader drawer — close. 12x12, heavier than the announcement bar's 20x20 cross. */
export const CloseCross = ({ className }: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 0L0 12M0 0L12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
