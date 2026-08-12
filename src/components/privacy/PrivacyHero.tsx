import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { GradientCorner } from "@/components/terms/art/HeroArt";

/**
 * Hero — `public/privacy-policy/Frame 2147226133.svg` (1440x660).
 *
 * The plainest hero on the site: an 80px gutter, no eyebrow, a two-line 72px heading on a
 * 79px leading, and the effective date in 16px #535862 below it. The export's ink puts the
 * heading's line box at y=79.5 and the date's at y=277.6, so the date carries the 40.1px
 * that separates them rather than a round margin.
 *
 * The canvas is 660 tall only because the gradient corner runs to y=659 — there is nothing
 * under the date. Being the page's first section this reserves the height of the header,
 * which is drawn over the page rather than in the flow and is 68px tall.
 *
 * That corner is byte-identical to the one in `public/termofuse/Frame 2147226133.svg` once
 * Figma's generated gradient ids are normalised, so the terms page's `GradientCorner` is
 * reused rather than transcribed again. The frame, not the section, carries the
 * `overflow-hidden` that crops it where the export does.
 */
const PrivacyHero = () => {
  const { lang } = useLang();

  return (
    <section
      data-nav-theme="light"
      data-probe="s-hero"
      className="w-full bg-white pt-nav"
    >
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden lg:min-h-[660px]">
        <GradientCorner className="pointer-events-none absolute right-[-221.37px] top-[70.294px] hidden h-[589.084px] w-[589.07px] select-none lg:block" />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 pb-12 pt-12 sm:px-10 sm:py-16 lg:px-[clamp(40px,5.5556vw,80px)] lg:py-0 lg:pt-[79.5px]"
        >
          {/* Tracked in like the other 72px headings: the export's Japanese font sets katakana
              tighter than Noto Sans JP does, and here that is 14px over the first line's six
              cells — -0.039em, the same figure the terms and news heroes need. */}
          <h1
            data-probe="hero-heading"
            className="text-[40px] font-bold leading-[44px] tracking-[-0.039em] text-black lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.0972222]"
          >
            {lang === "ja" ? (
              <>
                <span className="block">プライバシー</span>
                <span className="block">ポリシー</span>
              </>
            ) : (
              <>
                <span className="block">Privacy</span>
                <span className="block">Policy</span>
              </>
            )}
          </h1>

          <p
            data-probe="hero-date"
            className="mt-8 text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[40.1px]"
          >
            {lang === "ja" ? "制定日：2026年3月1日" : "Established: March 1, 2026"}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyHero;
