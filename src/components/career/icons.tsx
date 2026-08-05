/**
 * Icons taken verbatim from the career design SVGs in `public/carrers`.
 * Path data and stroke widths are unchanged; only the origin is normalised to 0,0 and the
 * colour switched to currentColor so callers can tint them.
 *
 * The role rows' chevron is the same 6x12 glyph the rest of the site uses, so it comes
 * from `@/components/home/icons` rather than being copied here.
 */

type IconProps = { className?: string };

/* Role row — the location marker, 16x16 on a 1.33333 stroke. */
export const MapPin = ({ className }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.999 8.667C9.104 8.667 9.999 7.771 9.999 6.667C9.999 5.562 9.104 4.667 7.999 4.667C6.895 4.667 5.999 5.562 5.999 6.667C5.999 7.771 6.895 8.667 7.999 8.667Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.999 14.667C10.666 12 13.333 9.612 13.333 6.667C13.333 3.721 10.945 1.333 7.999 1.333C5.054 1.333 2.666 3.721 2.666 6.667C2.666 9.612 5.333 12 7.999 14.667Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
