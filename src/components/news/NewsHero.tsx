import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { Megaphone } from "./art/HeroArt";

/**
 * News hero — `public/news/Frame 2147226133.svg` (1440x403).
 *
 * Same shape as the about page's hero: an 80px gutter, no eyebrow, a 72px heading, and
 * the export's own gradient art anchored right rather than centred. The megaphone sits at
 * x 829..1244.1, y 37.4..361.9 in the export, so it is placed 195.9px from the right edge.
 *
 * Being the page's first section this reserves the height of the header — the news
 * navigation is its own 68px export drawn above the content rather than over it, plus
 * 40px for the information banner while that is showing.
 */
const NewsHero = () => {
  const { lang } = useLang();
  const t = hero[lang];
  return (
    <section
      data-nav-theme="light"
      data-probe="s-hero"
      className="w-full overflow-hidden bg-white pt-[68px]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[403px]">
        <Megaphone className="pointer-events-none absolute right-[195.9px] top-[37.4px] hidden h-[324.479px] w-[415.039px] select-none lg:block" />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 py-16 sm:px-10 lg:px-[clamp(40px,5.5556vw,80px)] lg:py-0 lg:pt-[125.4px]"
        >
          {/* The display heading is tracked in -3.9% in the export; at 72px that is what
              holds "ニュース" to the design's 263.3px ink measure instead of a plain 269px.
              Measured, not guessed — the export's Japanese font sets katakana tighter than
              Noto Sans JP does, the same discrepancy the other heroes correct for. */}
          <h1
            data-probe="hero-heading"
            className="text-[44px] font-bold leading-[1.11] tracking-[-0.039em] text-black sm:text-[56px] lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.1111111]"
          >
            {t.heading}
          </h1>

          <p
            data-probe="hero-body"
            className="mt-8 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[35px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsHero;
