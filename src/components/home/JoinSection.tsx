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
import { join } from "./content";
import { ChevronRight } from "./icons";
import JoinArt, { type JoinBlade } from "./art/JoinArt";

/**
 * Join us — `public/home/Section-2.svg` (1440x797), minus the photo strip.
 *
 * Solid #314768 with the export's blurred #CAD4E6 glow and two white 6% blades.
 *
 * The blades draw themselves in as the section arrives, the same gesture as the CTA
 * banner below it: both slide along the axis they share, out of their own corner and
 * into place, and the pair moves together. It is mapped onto the section's arrival, so
 * it is complete once the reader has the section in front of them, and it is a live
 * mapping of scroll position rather than a one-shot reveal — scrolling back up sends
 * them out again.
 */

/**
 * How far out of frame a blade parks, along the axis both of them share, in the export's
 * 1440x797 user units. The frame is stretched to the section rather than fitted, and an
 * SVG transform rides that same stretch, so this travel stays the same fraction of the
 * frame — and stays parallel to the blades — at every width the section is drawn at.
 * The blades run at roughly 404:281, which is what the two numbers keep to.
 */
const TRAVEL_X = 380;
const TRAVEL_Y = 265;

const JoinSection = () => {
  const { lang, localePath } = useLang();
  const t = join[lang];
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const glide = useSectionEntrance(sectionRef);

  // 1 = parked outside the frame, 0 = seated. Landing at 0.85 leaves the spring room
  // to settle inside the window instead of trailing past the end of it.
  const out = useTransform(glide, [0, 0.85], [1, 0], { clamp: true });
  const x = useTransform(out, (v) => v * TRAVEL_X);
  const y = useTransform(out, (v) => v * TRAVEL_Y);
  const xFlip = useTransform(x, (v) => -v);
  const yFlip = useTransform(y, (v) => -v);
  const opacity = useTransform(out, [1, 0.4], [0, 1]);

  // The left blade sits in the bottom-left corner and leaves through it; the right one
  // sits in the top-right and leaves through that, so they mirror about the centre.
  const bladeStyle: Partial<Record<JoinBlade, MotionStyle>> = {
    left: { x: xFlip, y, opacity },
    right: { x, y: yFlip, opacity },
  };

  return (
    <section
      ref={sectionRef}
      id="s-join"
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-hd-join"
    >
      <JoinArt
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        bladeStyle={reduce ? undefined : bladeStyle}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-[clamp(48px,8.3333vw,120px)] lg:py-[122px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <ScrollReveal>
            <p className="font-mono text-[14px] leading-none text-hd-eyebrow-light">
              {t.eyebrow}
            </p>

            <h2 className="mt-[18px] text-[32px] font-bold leading-[1.0925926] text-white sm:text-[42px] lg:text-[clamp(38px,3.75vw,54px)]">
              {t.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* The mobile export wraps this to two lines at 16/23; the desktop draws
                it on one, which is why the leading only kicks in below `lg`. */}
            <p className="mt-[17px] text-[16px] leading-[23px] text-hd-eyebrow-light lg:leading-none">
              {t.body}
            </p>
          </ScrollReveal>

          <ScrollReveal
            delay={0.1}
            className="shrink-0 lg:mb-[-2px] lg:self-auto"
          >
            <Link
              to={localePath(t.cta.href)}
              className="flex h-[50px] w-full items-center justify-center gap-[15px] rounded-full bg-white text-[16px] leading-none text-black transition-opacity hover:opacity-90 lg:inline-flex lg:w-auto lg:pl-[14px] lg:pr-[25px]"
            >
              {t.cta.label}
              <ChevronRight className="text-hd-chevron" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
