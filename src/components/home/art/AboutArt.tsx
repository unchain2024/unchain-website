/* Path data generated from public/home/Section (Original).svg — decorative vector art.
   Do not hand-edit the paths. The four blades are wrapped in their own groups so the
   section can drive each one independently on scroll (see AboutSection). */

import { motion, type MotionStyle } from "framer-motion";

/** The four corner blades, named by the corner each one points into. */
export type Blade = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

const AboutArt = ({
  className,
  bladeStyle,
}: {
  className?: string;
  bladeStyle?: Partial<Record<Blade, MotionStyle>>;
}) => (
<svg viewBox="0 0 1440 700" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<defs>
<linearGradient id="paint1_linear_96_1041" x1="1203.81" y1="269.653" x2="1630.34" y2="81.6911" gradientUnits="userSpaceOnUse">
<stop stopColor="#455F8A"/>
<stop offset="1" stopColor="#D9E5FA"/>
</linearGradient>
<linearGradient id="paint2_linear_96_1041" x1="1611.33" y1="702.448" x2="1265.28" y2="361.949" gradientUnits="userSpaceOnUse">
<stop stopColor="#89B7D1"/>
<stop offset="1" stopColor="#D9EEFA"/>
</linearGradient>
<linearGradient id="paint3_linear_96_1041" x1="236.193" y1="430.348" x2="-190.34" y2="618.309" gradientUnits="userSpaceOnUse">
<stop stopColor="#455F8A"/>
<stop offset="1" stopColor="#D9E5FA"/>
</linearGradient>
<linearGradient id="paint4_linear_96_1041" x1="-171.327" y1="-2.4477" x2="174.725" y2="338.052" gradientUnits="userSpaceOnUse">
<stop stopColor="#89B7D1"/>
<stop offset="1" stopColor="#D9EEFA"/>
</linearGradient>
</defs>
<motion.g style={bladeStyle?.topRight}>
<path opacity="0.8" d="M1546.15 -38.021C1572.4 -16.669 1602.69 6.68377 1635.62 30.9816C1536.25 114.421 1370.89 230.912 1222.58 318.679L1166.46 223.854C1301.37 144.017 1450.55 39.7317 1546.15 -38.021Z" fill="url(#paint1_linear_96_1041)"/>
</motion.g>
<motion.g style={bladeStyle?.bottomRight}>
<path opacity="0.8" d="M1546.15 738.021C1572.4 716.669 1602.69 693.316 1635.62 669.019C1536.25 585.58 1370.89 469.089 1222.58 381.321L1166.46 476.146C1301.37 555.983 1450.55 660.269 1546.15 738.021Z" fill="url(#paint2_linear_96_1041)"/>
</motion.g>
<motion.g style={bladeStyle?.bottomLeft}>
<path opacity="0.8" d="M-106.146 738.021C-132.399 716.669 -162.692 693.316 -195.621 669.019C-96.2507 585.58 69.1117 469.089 217.424 381.321L273.539 476.146C138.627 555.983 -10.5474 660.269 -106.146 738.021Z" fill="url(#paint3_linear_96_1041)"/>
</motion.g>
<motion.g style={bladeStyle?.topLeft}>
<path opacity="0.8" d="M-106.146 -38.021C-132.399 -16.6689 -162.692 6.68378 -195.621 30.9816C-96.2507 114.421 69.1117 230.912 217.424 318.679L273.539 223.854C138.627 144.017 -10.5474 39.7317 -106.146 -38.021Z" fill="url(#paint4_linear_96_1041)"/>
</motion.g>
</svg>
);

export default AboutArt;
