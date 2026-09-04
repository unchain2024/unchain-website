import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  useReducedMotion,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useSectionEntrance } from "@/hooks/use-section-entrance";
import { useLang } from "@/lib/language";
import { about } from "./content";
import { ChevronRight } from "./icons";
import AboutArt, { type Blade } from "./art/AboutArt";

/**
 * About — `public/home/Section (Original).svg` (1440x700).
 *
 * Background gradient and the four corner blades are taken verbatim from the
 * export: #000 -> #283756 @32.35% -> #768DAF @75% -> #fff.
 *
 * The blades slide in along their own 60-degree axis as the section comes up out of
 * the hero: the top pair leads and the bottom pair overlaps it, so the frame assembles
 * top-down in the direction of the scroll. The whole gesture is mapped onto the
 * section's arrival, so nothing is left to finish once the reader has the section in
 * front of them — on a viewport too short to hold the whole band that is the moment it
 * fills the screen, which is what keeps the timing honest on a phone. It is a live
 * mapping of scroll position rather than a one-shot reveal, so scrolling back up sends
 * them out again.
 */

/**
 * How far out of frame a blade parks, along its axis, in the export's 1440x700 user
 * units. The frame is stretched to the section rather than fitted (`preserveAspectRatio
 * ="none"`), and an SVG transform rides that same stretch, so this travel stays the
 * same fraction of the frame — and stays parallel to the blade it moves — at every
 * width the section is drawn at.
 */
const TRAVEL_X = 380;
const TRAVEL_Y = 265;

const AboutSection = () => {
  const { lang, localePath } = useLang();
  const t = about[lang];
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  // Everything is timed inside the section's own arrival, so the composition is
  // finished by the time the reader has the section in front of them — on a phone,
  // where the 700px band runs taller than the window, that is the moment it fills
  // the screen rather than the moment its bottom edge lands.
  const glide = useSectionEntrance(sectionRef);

  // 1 = parked outside the frame, 0 = seated in the corner. The top pair leads and
  // the bottom pair overlaps it, both landing by the end of the window.
  const top = useTransform(glide, [0, 0.55], [1, 0], { clamp: true });
  const bottom = useTransform(glide, [0.35, 0.92], [1, 0], { clamp: true });

  // Each blade leaves through its own corner, so x is signed by side and y by row.
  // The pair sharing a row shares one driver, which keeps them in lockstep.
  const topX = useTransform(top, (v) => v * TRAVEL_X);
  const topY = useTransform(top, (v) => v * -TRAVEL_Y);
  const bottomX = useTransform(bottom, (v) => v * TRAVEL_X);
  const bottomY = useTransform(bottom, (v) => v * TRAVEL_Y);
  const topXFlip = useTransform(topX, (v) => -v);
  const bottomXFlip = useTransform(bottomX, (v) => -v);
  // Held back a touch, so a blade is already on its way in before it is visible.
  const topOpacity = useTransform(top, [1, 0.4], [0, 1]);
  const bottomOpacity = useTransform(bottom, [1, 0.4], [0, 1]);

  const bladeStyle: Partial<Record<Blade, MotionStyle>> = {
    topLeft: { x: topXFlip, y: topY, opacity: topOpacity },
    topRight: { x: topX, y: topY, opacity: topOpacity },
    bottomLeft: { x: bottomXFlip, y: bottomY, opacity: bottomOpacity },
    bottomRight: { x: bottomX, y: bottomY, opacity: bottomOpacity },
  };

  return (
    <section
      ref={sectionRef}
      id="s-about" data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#283756_32.3488%,#768DAF_75%,#FFFFFF_100%)]"
    >
      <AboutArt
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        bladeStyle={reduce ? undefined : bladeStyle}
      />

      {/* The mobile export keeps the section at the desktop's 700px and centres the
          same stack in it, on a 16px gutter rather than 24 — the copy is set to wrap
          across the full measure, so it is the one block on the page that runs wider
          than the 24px page gutter. */}
      <div className="relative z-10 mx-auto flex min-h-[700px] max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center lg:px-6 lg:py-0">
        <ScrollReveal className="flex w-full flex-col items-center">
          <p className="font-mono text-[14px] leading-none text-hd-eyebrow">
            {t.eyebrow}
          </p>

          <h2 className="mt-[21px] max-w-[1100px] text-[18px] font-bold leading-[25px] text-white lg:text-[28px] lg:leading-[38px]">
            {t.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <Link
            to={localePath(t.cta.href)}
            className="mt-11 flex h-[50px] w-full max-w-[345px] items-center justify-center gap-[14px] rounded-full border border-hd-hairline text-[16px] leading-none text-white transition-colors hover:bg-white/10 lg:mt-[41px] lg:w-auto lg:max-w-none lg:pl-[18px] lg:pr-[21px]"
          >
            {t.cta.label}
            <ChevronRight className="text-white" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
