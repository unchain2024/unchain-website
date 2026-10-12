/* Path data generated from public/home/Section-2.svg — decorative vector art.
   Do not hand-edit the paths. Each blade is wrapped in its own group so the section can
   drive it on scroll (see JoinSection). */

import { motion, type MotionStyle } from "framer-motion";

/** The two blades, named by the edge each one bleeds in from. */
export type JoinBlade = "left" | "right";

const JoinArt = ({
  className,
  bladeStyle,
}: {
  className?: string;
  bladeStyle?: Partial<Record<JoinBlade, MotionStyle>>;
}) => (
<svg viewBox="0 0 1440 797" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<defs>
<filter id="filter0_f_96_1141" x="-651.891" y="-668.233" width="1311" height="1311" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_96_1141"/>
</filter>
</defs>
<g filter="url(#filter0_f_96_1141)">
<circle cx="3.60938" cy="-12.7334" r="355.5" fill="#CAD4E6" fillOpacity="0.3"/>
</g>
<motion.g style={bladeStyle?.left}>
<path d="M-12.4519 603.913C-38.1394 583.02 -67.7803 560.17 -100 536.396C-2.76957 454.753 159.032 340.771 304.151 254.894L359.057 347.676C227.05 425.794 81.0883 527.834 -12.4519 603.913Z" fill="white" fillOpacity="0.06"/>
</motion.g>
<motion.g style={bladeStyle?.right}>
<path d="M1407.51 -138.233C1433.19 -117.341 1462.83 -94.4912 1495.05 -70.7166C1397.82 10.9258 1236.02 124.908 1090.9 210.786L1036 118.003C1168 39.8849 1313.97 -62.155 1407.51 -138.233Z" fill="white" fillOpacity="0.06"/>
</motion.g>
</svg>
);

export default JoinArt;
