/**
 * The two glyphs the contact export draws as strokes rather than as text.
 *
 * Both keep the export's own coordinates in their viewBox, so the stroke lands where
 * Figma put it inside the box the layout gives them.
 */

type Props = { className?: string };

/**
 * Submit-button chevron — `M1065 873 L1071 867 L1065 861`, 2px round stroke. The export
 * centres it on (1068, 867), so a 24x24 box at 1056,855 puts the stroke dead centre.
 */
export const Chevron = ({ className }: Props) => (
  <svg
    width="24"
    height="24"
    viewBox="1056 855 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M1065 873L1071 867L1065 861"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Consent tick — `M755 795.75 L748.125 802.625 L745 799.5`, 1.5px round stroke, on the
 * checkbox's own 20x20 box at 740,789.
 */
export const Tick = ({ className }: Props) => (
  <svg
    width="20"
    height="20"
    viewBox="740 789 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M755 795.75L748.125 802.625L745 799.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Download glyph for the sent state's two one-pager buttons. Drawn on the same 20x20
 * box and 1.67px round stroke the header icons in `home/icons.tsx` use, so it sits at
 * the same weight as the rest of the site's line art.
 */
export const Download = ({ className }: Props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M17.5 12.5V15.8333C17.5 16.7538 16.7538 17.5 15.8333 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V12.5M5.83333 8.33333L10 12.5L14.1667 8.33333M10 12.5V2.5"
      stroke="currentColor"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
