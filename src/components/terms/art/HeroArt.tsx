/* Path data, gradients and opacity transcribed verbatim from
   public/termofuse/Frame 2147226133.svg. Do not re-derive the colours. */

type Props = { className?: string };

/**
 * The hero's gradient corner: two blades meeting at (1159.26, 157.25), one running
 * right off the frame and one running down to its bottom edge. Design box
 * x 1072.3..1661.37, y 70.29..659.38 — wider than the 1440 frame, which is why the
 * export crops it and the hero clips it at the same edge.
 *
 * The viewBox keeps the export's own page coordinates so the paths and the two
 * `userSpaceOnUse` gradients need no transform.
 */
export const GradientCorner = ({ className }: Props) => (
  <svg
    width="589.07"
    height="589.084"
    viewBox="1072.3 70.2946 589.07 589.084"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="paint0_linear_181_10122"
        x1="1639.04"
        y1="131.665"
        x2="1185.47"
        y2="307.758"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0E3067" />
        <stop offset="1" stopColor="#D9E5FA" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_181_10122"
        x1="1131.16"
        y1="638.232"
        x2="1136.33"
        y2="156.035"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9EEFA" />
        <stop offset="1" stopColor="#89B7D1" />
      </linearGradient>
    </defs>
    <path
      opacity="0.8"
      d="M1159.26 157.252C1155.64 192.39 1150.52 231.987 1144.15 274.227C1279.08 262.468 1487.12 226.395 1661.37 181.705L1632.8 70.2946C1474.29 110.946 1287.21 144.079 1159.26 157.252Z"
      fill="url(#paint0_linear_181_10122)"
    />
    <path
      opacity="0.8"
      d="M1159.26 157.259C1194.4 153.642 1233.99 148.519 1276.23 142.148C1264.47 277.083 1228.4 485.123 1183.71 659.378L1072.3 630.806C1112.95 472.295 1146.09 285.213 1159.26 157.259Z"
      fill="url(#paint1_linear_181_10122)"
    />
  </svg>
);
