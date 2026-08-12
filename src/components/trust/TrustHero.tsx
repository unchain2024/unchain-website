import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero } from "./content";
import { Shield } from "./art/HeroArt";

/**
 * Hero — `public/trust-security/Frame 2147226132.svg` (1440x561).
 *
 * Same shape as the business hero: an 80px gutter, no eyebrow, a 72px heading over a
 * 16px paragraph, and the export's own gradient art anchored right rather than centred.
 * The shield sits at x 948.9..1279.1, y 90..472 in the export, so it is placed 160.9px
 * from the right edge.
 *
 * The navigation is drawn over this section rather than above it — this export has no
 * navigation band of its own, the way the business one does not — so the section reserves
 * no height for it and the copy's own top padding clears it.
 */
const TrustHero = () => {
  const { lang } = useLang();
  const t = hero[lang];

  return (
    <section
      data-nav-theme="light"
      data-probe="s-hero"
      className="w-full overflow-hidden bg-white pt-nav lg:pt-0"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[561px]">
        {/* Centred above the copy at 201x233 on mobile — the export's own box at 61% —
            and anchored right from `lg`. */}
        <div className="pt-12 lg:contents">
          <Shield className="pointer-events-none mx-auto block h-[232.7px] w-[201.2px] max-w-full select-none lg:absolute lg:right-[11.1736%] lg:top-[90px] lg:h-[381.902px] lg:w-[330.176px]" />
        </div>

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-12 pt-[43px] sm:px-10 lg:max-w-none lg:px-[clamp(40px,5.5556vw,80px)] lg:pb-0 lg:pt-[126.3px]"
        >
          {/* The display heading is tracked in -4.5% in the export, the same as the
              business hero's: at 72px that is what holds "機能ではなく" to the design's
              397.5px ink measure instead of a plain 412px. */}
          <h1
            data-probe="hero-heading"
            className="text-[40px] font-bold leading-[44px] tracking-[-0.045em] text-black lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.0958333]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            data-probe="hero-body"
            className="mt-6 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[35.1px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustHero;
