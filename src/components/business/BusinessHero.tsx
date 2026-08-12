import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { ChevronRight } from "@/components/home/icons";
import { HeroStar } from "./art/HeroArt";

/**
 * Business hero — `public/business/Frame 2147226132.svg` (1440x515).
 *
 * White canvas. Copy sits on the 80px page gutter; the four-blade gradient star is
 * the export's own vector art, drawn at 882.5..1281.5 x 58..457 and so anchored to
 * the right rather than centred.
 */
const BusinessHero = () => {
  const { lang } = useLang();
  const t = hero[lang];
  return (
    <section
      data-nav-theme="light"
      className="w-full overflow-hidden bg-white pt-nav lg:pt-0"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[515px]">
        {/* Centred above the copy at 237x237 on mobile, anchored right from `lg`. */}
        <div className="pt-12 lg:contents">
          <HeroStar className="pointer-events-none mx-auto block h-[237.2px] w-[237.2px] max-w-full select-none lg:absolute lg:right-[11.0069%] lg:top-1/2 lg:h-auto lg:w-[27.7083%] lg:-translate-y-1/2" />
        </div>

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-12 pt-[45px] sm:px-10 lg:max-w-none lg:px-[clamp(40px,5.5556vw,80px)] lg:pb-0 lg:pt-[130px]"
        >
          {/* The display heading is tracked in -4.5% in the export; at 72px that is
              the difference between the design's 275px measure and a plain 285px. */}
          <h1
            data-probe="hero-heading"
            className="text-[40px] font-bold leading-none tracking-[-0.045em] text-black lg:text-[clamp(48px,5vw,72px)]"
          >
            {t.heading}
          </h1>

          <p className="mt-6 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-9">
            {t.body}
          </p>

          {/* The export draws these two as content-width pills that wrap together on
              one row — 131 and 196 across the 345px measure. */}
          <div className="mt-9 flex flex-wrap items-center gap-4 lg:mt-10">
            {t.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex h-[50px] items-center gap-[13px] rounded-full border border-hd-hairline pl-[15px] pr-[24px] text-[16px] leading-none text-black transition-colors hover:bg-black/5"
              >
                {link.label}
                <ChevronRight className="text-hd-chevron" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessHero;
