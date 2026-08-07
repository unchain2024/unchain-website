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
      className="w-full overflow-hidden bg-white"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[561px]">
        <Shield className="pointer-events-none absolute right-4 top-24 hidden h-[220px] w-[190px] select-none md:block lg:right-[11.1736%] lg:top-[90px] lg:h-[381.902px] lg:w-[330.176px]" />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-16 pt-[120px] sm:px-10 md:max-w-[58%] lg:max-w-none lg:px-[clamp(40px,5.5556vw,80px)] lg:pb-0 lg:pt-[126.3px]"
        >
          {/* The display heading is tracked in -4.5% in the export, the same as the
              business hero's: at 72px that is what holds "機能ではなく" to the design's
              397.5px ink measure instead of a plain 412px. */}
          <h1
            data-probe="hero-heading"
            className="text-[44px] font-bold leading-[1.11] tracking-[-0.045em] text-black sm:text-[56px] lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.0958333]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            data-probe="hero-body"
            className="mt-8 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[35.1px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustHero;
