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
import { cta } from "./content";
import { ChevronRight } from "./icons";
import { UnchainMark } from "./Logo";
import CtaArt, { type CtaBlade } from "./art/CtaArt";

/**
 * CTA banner — `public/home/CTA Banner - Desktop.svg` (1440x597).
 *
 * White canvas, centred stack, and the two 80% gradient blades from the export
 * bleeding in from the left and right edges.
 *
 * The blades draw themselves in as the banner arrives: both slide along the export's
 * shared axis, out of their own edge and into place, and the pair moves together
 * rather than in sequence. The gesture is mapped onto the banner's arrival, so it is
 * complete once the reader has the banner in front of them — on a viewport too short to
 * hold it whole, the moment it fills the screen instead. It is a live mapping of scroll
 * position rather than a one-shot reveal, so scrolling back up sends them out again.
 */

/**
 * How far out of frame a blade parks, along the axis both of them share, in the export's
 * 1440x597 user units. The frame is stretched to the banner rather than fitted, and an
 * SVG transform rides that same stretch, so this travel stays the same fraction of the
 * frame — and stays parallel to the blades — at every width the banner is drawn at.
 */
const TRAVEL_X = 380;
const TRAVEL_Y = 420;

const CtaSection = () => {
  const { lang, localePath } = useLang();
  const t = cta[lang];
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  // Timed inside the banner's own arrival. On a phone the banner is the taller of the
  // two, so that is the moment it fills the window rather than the moment its bottom
  // edge lands — see the hook.
  const glide = useSectionEntrance(sectionRef);

  // 1 = parked outside the frame, 0 = seated. Landing at 0.85 leaves the spring room
  // to settle inside the window instead of trailing past the end of it.
  const out = useTransform(glide, [0, 0.85], [1, 0], { clamp: true });
  const x = useTransform(out, (v) => v * TRAVEL_X);
  const y = useTransform(out, (v) => v * TRAVEL_Y);
  // The left blade leaves through the top-left, the right one through the bottom-right,
  // so they mirror each other about the centre of the banner.
  const xFlip = useTransform(x, (v) => -v);
  const yFlip = useTransform(y, (v) => -v);
  const opacity = useTransform(out, [1, 0.4], [0, 1]);

  const bladeStyle: Partial<Record<CtaBlade, MotionStyle>> = {
    left: { x: xFlip, y: yFlip, opacity },
    right: { x, y, opacity },
  };

  return (
    <section
      ref={sectionRef}
      id="s-cta"
      data-nav-theme="light"
      className="relative w-full overflow-hidden bg-white"
    >
      <CtaArt
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        bladeStyle={reduce ? undefined : bladeStyle}
      />

      {/* The mobile export keeps the banner at 700px tall and centres the same stack
          in it: a 49x59 mark, the heading at 32px, the two-line body, and the pair of
          links as full-measure 50px pills on a 16px gutter. */}
      {/* The 16px gutter is what lets the Japanese heading keep the export's two-line
          break: at 32px the first line measures 352px, which a 24px gutter is 7px short
          of. The links keep their own 345px measure inside it. */}
      <div className="relative z-10 mx-auto flex min-h-[700px] w-full max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:min-h-[597px] lg:justify-start lg:py-0 lg:pt-[118px]">
        <ScrollReveal className="flex w-full flex-col items-center">
          <UnchainMark className="h-[59px] w-[49px] text-[#0A0A0A] lg:h-[75px] lg:w-[64px]" />

          <h2 className="mt-[41px] text-[32px] font-bold leading-[1.1111111] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
            {t.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* 250px is the measure the export sets this on, which is what breaks the
              line after the first clause rather than mid-phrase. */}
          <p className="mt-[15px] max-w-[250px] text-[16px] leading-[22px] text-black lg:max-w-none lg:leading-none">
            {t.body}
          </p>

          <div className="mt-[41px] flex w-full max-w-[345px] flex-col gap-4 lg:max-w-none lg:flex-row lg:flex-wrap lg:items-center lg:justify-center">
            <Link
              to={localePath(t.primary.href)}
              className="flex h-[50px] items-center justify-center gap-[14px] rounded-full bg-black text-[16px] leading-none text-white transition-opacity hover:opacity-90 lg:inline-flex lg:pl-[17px] lg:pr-[23px]"
            >
              {t.primary.label}
              <ChevronRight className="text-white" />
            </Link>

            <Link
              to={localePath(t.secondary.href)}
              className="flex h-[50px] items-center justify-center rounded-full border border-hd-hairline text-[16px] leading-none text-black transition-colors hover:bg-black/5 lg:inline-flex lg:px-[17px]"
            >
              {t.secondary.label}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CtaSection;
