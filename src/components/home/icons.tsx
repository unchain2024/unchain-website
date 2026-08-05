/**
 * Icons taken verbatim from the home-page design SVGs in `public/home`.
 * Path data and stroke widths are unchanged; only the origin is normalised to
 * 0,0 and the colour switched to currentColor so callers can tint them.
 */

type IconProps = { className?: string };

/* Hero / About / Business / Join / CTA button chevron — stroke-width 2, round caps. */
export const ChevronRight = ({ className }: IconProps) => (
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0 12L6 6L0 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Navigation "Neuron" pill — external-link arrow. */
export const ArrowUpRight = ({ className }: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M1.83 10.1667L10.17 1.8333M10.17 10.1667V1.8333H1.83"
      stroke="currentColor"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Navigation language switcher. */
export const Globe = ({ className }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M10 1.66667C12.08 3.94861 13.27 6.91 13.3333 10C13.27 13.09 12.08 16.0514 10 18.3333M10 1.66667C7.92 3.94861 6.73 6.91 6.66667 10C6.73 13.09 7.92 16.0514 10 18.3333M10 1.66667C5.4 1.66667 1.66667 5.39762 1.66667 10C1.66667 14.6024 5.4 18.3333 10 18.3333M10 1.66667C14.6 1.66667 18.3333 5.39762 18.3333 10C18.3333 14.6024 14.6 18.3333 10 18.3333M2.08333 7.5H17.9167M2.08333 12.5H17.9167"
      stroke="currentColor"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Information banner — trailing arrow. */
export const ArrowRight = ({ className }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.333 8H12.667M8 12.6667L12.667 8L8 3.3333"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Information banner — dismiss. */
export const Close = ({ className }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
