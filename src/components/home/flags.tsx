/**
 * Country flags for the language picker, drawn as SVG rather than emoji.
 *
 * Windows ships no flag emoji, so 🇺🇸/🇯🇵 render as bare "US"/"JP" letter pairs in
 * Chrome on Windows — which is most of this site's audience. Inline SVG renders
 * identically everywhere.
 *
 * Both are 20x14 with a hairline ring so the white field of the Japanese flag
 * still reads against a light menu background.
 */

type Props = { className?: string };

const RING = "rgba(0,0,0,0.15)";

export const FlagUS = ({ className }: Props) => (
  <svg
    viewBox="0 0 20 14"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect width="20" height="14" fill="#fff" />
    {/* 13 stripes: 7 red, starting and ending red. */}
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect
        key={i}
        y={(i * 14) / 13}
        width="20"
        height={14 / 13}
        fill="#B22234"
      />
    ))}
    {/* Canton: two fifths of the width, seven stripes tall. */}
    <rect width="8" height={(7 * 14) / 13} fill="#3C3B6E" />
    {[1.6, 4, 6.4].map((cx) =>
      [1.5, 3.8, 6.1].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.5" fill="#fff" />
      ))
    )}
    <rect
      x="0.25"
      y="0.25"
      width="19.5"
      height="13.5"
      fill="none"
      stroke={RING}
      strokeWidth="0.5"
    />
  </svg>
);

export const FlagJP = ({ className }: Props) => (
  <svg
    viewBox="0 0 20 14"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect width="20" height="14" fill="#fff" />
    {/* The disc is three fifths of the height, centred. */}
    <circle cx="10" cy="7" r="4.2" fill="#BC002D" />
    <rect
      x="0.25"
      y="0.25"
      width="19.5"
      height="13.5"
      fill="none"
      stroke={RING}
      strokeWidth="0.5"
    />
  </svg>
);
