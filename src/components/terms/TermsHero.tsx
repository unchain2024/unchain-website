import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { GradientCorner } from "./art/HeroArt";

/**
 * Hero — `public/termofuse/Frame 2147226133.svg` (1440x660).
 *
 * The same shape as the about and news heroes: an 80px gutter, no eyebrow, a 72px
 * heading, and the export's own gradient art anchored right. Here that art runs past the
 * frame's right edge (to x=1661.37), so the frame — not the section — carries the
 * `overflow-hidden` that crops it exactly where the export does.
 *
 * Being the page's first section this reserves the height of the header: the export is
 * drawn below the 68px navigation rather than under it.
 */
const TermsHero = () => {
  const { lang } = useLang();
  const t = hero[lang];

  return (
    <section
      data-nav-theme="light"
      data-probe="s-hero"
      className="w-full bg-white pt-[68px]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden lg:min-h-[660px]">
        <GradientCorner className="pointer-events-none absolute right-[-221.37px] top-[70.294px] hidden h-[589.084px] w-[589.07px] select-none lg:block" />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 py-16 sm:px-10 lg:px-[clamp(40px,5.5556vw,80px)] lg:py-0 lg:pt-[79px]"
        >
          {/* Tracked in like the other 72px headings: the export's Japanese font sets
              katakana tighter than Noto Sans JP does, so the natural measure runs wide of
              the design's 402.2px first line. */}
          <h1
            data-probe="hero-heading"
            className="text-[44px] font-bold leading-[1.11] tracking-[-0.039em] text-black sm:text-[56px] lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.1111111]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            data-probe="hero-date"
            className="mt-8 text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[38.5px]"
          >
            {t.date}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsHero;
