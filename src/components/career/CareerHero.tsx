import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { Briefcase } from "./art/HeroArt";

/**
 * Hero — `public/carrers/Frame 2147226133.svg` (1440x482).
 *
 * Same shape as the about and news heroes: an 80px gutter, no eyebrow, a 72px heading over
 * a 16px paragraph, and the export's own gradient art anchored right rather than centred.
 * The briefcase sits at x 876..1236, y 69..413 in the export, so it is placed 204px from
 * the right edge.
 *
 * Being the page's first section this reserves the height of the header — the navigation is
 * drawn over the page rather than in the flow, and is 68px tall.
 */
const CareerHero = () => {
  const { lang } = useLang();
  const t = hero[lang];

  return (
    <section
      data-nav-theme="light"
      data-probe="s-hero"
      className="w-full overflow-hidden bg-white pt-nav"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[482px]">
        {/* Centred above the copy on mobile at 212x202.5 — the export's own 360:344 box,
            scaled — and back to the right-hand anchor from `lg`. */}
        <div className="pt-12 lg:contents">
          <Briefcase className="pointer-events-none mx-auto block h-[202.5px] w-[212px] max-w-full select-none lg:absolute lg:right-[14.1667%] lg:top-[69px] lg:h-[344px] lg:w-[360px]" />
        </div>

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 pb-12 pt-[43px] sm:px-10 lg:px-[clamp(40px,5.5556vw,80px)] lg:py-0 lg:pt-[119.5px]"
        >
          {/* The display heading is tracked in -3.9% on the Japanese setting: the export's
              Japanese font sets kana tighter than Noto Sans JP does, and at 72px that is
              what holds the two lines to the export's 298.2 / 437.4px ink measures instead
              of 309 / 454. Measured, not guessed — the news hero corrects for the same
              discrepancy by the same amount. The English heading is Latin and needs none. */}
          <h1
            data-probe="hero-heading"
            className={`text-[40px] font-bold leading-[44px] text-black lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.1111111] ${
              lang === "ja" ? "tracking-[-0.039em]" : ""
            }`}
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* 468px reproduces the export's break after "テクノロジー"; taking the following
              "を、" onto the first line needs 476. `line-break: strict` is what keeps the
              second line whole — see the note in `WhySection`. */}
          <p
            data-probe="hero-body"
            className="mt-6 max-w-[468px] text-[16px] leading-[22px] text-hd-eyebrow-ink [line-break:strict] lg:mt-[38.9px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerHero;
