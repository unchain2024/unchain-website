import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { useAnnouncementVisible } from "@/lib/announcement";
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
  // The fixed header draws the announcement bar, but it occupies 40px at the top of
  // the page in the design, so reserve exactly that while it is showing.
  const bannerVisible = useAnnouncementVisible();

  return (
    <section
      data-nav-theme="light"
      className={`w-full overflow-hidden bg-white ${bannerVisible ? "pt-10" : ""}`}
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:h-[515px]">
        <HeroStar className="pointer-events-none absolute right-4 top-6 hidden h-[220px] w-[220px] select-none md:block lg:right-[11.0069%] lg:top-1/2 lg:h-auto lg:w-[27.7083%] lg:-translate-y-1/2" />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-16 pt-[120px] sm:px-10 md:max-w-[58%] lg:max-w-none lg:px-20 lg:pb-0 lg:pt-[130px]"
        >
          {/* The display heading is tracked in -4.5% in the export; at 72px that is
              the difference between the design's 275px measure and a plain 285px. */}
          <h1
            data-probe="hero-heading"
            className="text-[44px] font-bold leading-none tracking-[-0.045em] text-black sm:text-[56px] lg:text-[72px]"
          >
            {t.heading}
          </h1>

          <p className="mt-8 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-9">
            {t.body}
          </p>

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
