import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { ChevronRight } from "./icons";
import HeroArt from "./art/HeroArt";

/**
 * Hero — `public/home/Hero.svg` (1440x900).
 *
 * Background is the design's vertical gradient #1F2B42 -> #000000. The logo-shaped
 * photo collage is the untouched vector art from the export (HeroArt).
 *
 * The hero fills the viewport rather than sitting at a fixed 900px, so every
 * position inside it is a percentage of the export's 1440x900 frame instead of a
 * pixel offset. At a 900px-tall viewport that reproduces the design exactly, and
 * on a taller or shorter screen the composition keeps its proportions instead of
 * being clipped:
 *
 *   copy      top 329      -> 36.5556%
 *   collage   145.48/59.07 -> top 16.1644%, right 4.1021%, 50.2278% x 74.7722%
 *   scroll    bottom 35    -> 3.8889%
 *
 * `public/mobile/Home Page - Mobile.svg` rebuilds the same hero as a single column:
 * the collage moves above the copy and runs 381px wide (x 6..387) at the export's own
 * 724:674 aspect, the eyebrow drops to 16px, the heading to 40/44, and the two links
 * become full-measure 50px pills stacked on a 16px gutter. There is no scroll cue.
 */
const HeroSection = () => {
  const { lang, localePath } = useLang();
  const t = hero[lang];

  return (
    <section
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#1F2B42_0%,#000000_100%)]"
    >
      <div
        data-home="hero"
        className="relative mx-auto w-full max-w-[1440px] md:min-h-[640px] lg:h-[100svh] lg:min-h-[720px]"
      >
        {/* Logo-shaped photo collage. Below `lg` it leads the column, sized by the
            mobile export's 381px measure and its own aspect; from `lg` it returns to
            the absolutely-placed right-hand position the desktop export draws. */}
        <div className="pt-nav lg:contents">
          <HeroArt className="pointer-events-none mx-auto mt-[21px] block aspect-[724/674] w-[381px] max-w-full select-none lg:absolute lg:right-[4.1021%] lg:top-[16.1644%] lg:mt-0 lg:aspect-auto lg:h-[74.7722%] lg:w-[50.2278%]" />
        </div>

        {/* Copy — revealed on mount rather than on scroll; it is above the fold. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-16 pt-9 sm:px-10 lg:absolute lg:left-[clamp(40px,5.5556vw,80px)] lg:top-[36.5556%] lg:max-w-none lg:p-0"
        >
          <p className="font-mono text-[16px] leading-none tracking-normal text-hd-eyebrow lg:text-[20px]">
            {t.eyebrow}
          </p>

          <h1
            className={`mt-5 max-w-[640px] font-bold text-white lg:mt-[25px] ${
              lang === "ja"
                ? "text-[40px] leading-[44px] lg:text-[clamp(48px,4.8611vw,70px)] lg:leading-[1.1285714]"
                : "text-[32px] leading-[38px] lg:text-[clamp(40px,3.8889vw,56px)] lg:leading-[1.125]"
            }`}
          >
            {t.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Stacked full-measure pills on mobile, an inline pair from `lg`. */}
          <div className="mt-8 flex flex-col gap-4 lg:mt-[35px] lg:flex-row lg:flex-wrap lg:items-center">
            <Link
              to={localePath(t.primary.href)}
              className="inline-flex h-[50px] items-center justify-center gap-[15px] rounded-full bg-white text-[16px] leading-none text-black transition-opacity hover:opacity-90 lg:justify-start lg:pl-[18px] lg:pr-[22px]"
            >
              {t.primary.label}
              <ChevronRight className="text-hd-chevron" />
            </Link>

            <Link
              to={localePath(t.secondary.href)}
              className="inline-flex h-[50px] items-center justify-center rounded-full border border-hd-hairline text-[16px] leading-none text-white transition-colors hover:bg-white/10 lg:px-[15px]"
            >
              {t.secondary.label}
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue — vertical label above a 2x70 rule, centred on x=96 */}
        <div className="pointer-events-none absolute bottom-[3.8889%] left-20 hidden w-8 flex-col items-center gap-[13px] lg:flex">
          <span className="rotate-180 font-mono text-[14px] leading-none text-white [writing-mode:vertical-rl]">
            {t.scroll}
          </span>
          <span className="h-[70px] w-[2px] rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
