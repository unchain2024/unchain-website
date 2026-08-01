import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { useAnnouncementVisible } from "@/lib/announcement";
import { hero } from "./content";
import { ChevronRight } from "./icons";
import HeroArt from "./art/HeroArt";

/**
 * Hero — `public/home/Hero.svg` (1440x900).
 *
 * Background is the design's vertical gradient #1F2B42 -> #000000. The logo-shaped
 * photo collage is the untouched vector art from the export (HeroArt), anchored to
 * the right exactly as drawn (x 657.65..1380.93, y 145.48..818.43).
 */
const HeroSection = () => {
  const { lang, localePath } = useLang();
  const t = hero[lang];
  // The banner is drawn by the fixed header but takes 40px at the top of the page
  // in the design, so the hero reserves exactly that much while it is showing.
  const bannerVisible = useAnnouncementVisible();

  return (
    <section
      data-nav-theme="dark"
      className={`relative w-full overflow-hidden bg-[linear-gradient(180deg,#1F2B42_0%,#000000_100%)] ${
        bannerVisible ? "pt-10" : ""
      }`}
    >
      <div
        data-home="hero"
        className="relative mx-auto w-full max-w-[1440px] md:min-h-[640px] lg:h-[900px]"
      >
        {/* Logo-shaped photo collage */}
        <HeroArt className="pointer-events-none absolute right-0 top-[100px] hidden h-[298px] w-[320px] select-none md:block lg:right-[59px] lg:top-[145px] lg:h-[674px] lg:w-[724px]" />

        {/* Copy — revealed on mount rather than on scroll; it is above the fold. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-6 pb-20 pt-[140px] sm:px-10 sm:pt-[160px] md:max-w-[56%] md:pt-[230px] lg:absolute lg:left-20 lg:top-[329px] lg:max-w-none lg:p-0"
        >
          <p className="font-mono text-[16px] leading-none tracking-normal text-hd-eyebrow lg:text-[20px]">
            {t.eyebrow}
          </p>

          <h1
            className={`mt-6 max-w-[640px] font-bold text-white lg:mt-[25px] ${
              lang === "ja"
                ? "text-[44px] leading-[1.13] sm:text-[56px] lg:text-[70px] lg:leading-[79px]"
                : "text-[40px] leading-[1.13] sm:text-[48px] lg:text-[56px] lg:leading-[63px]"
            }`}
          >
            {t.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-[35px]">
            <Link
              to={localePath(t.primary.href)}
              className="inline-flex h-[50px] items-center gap-[15px] rounded-full bg-white pl-[18px] pr-[22px] text-[16px] leading-none text-black transition-opacity hover:opacity-90"
            >
              {t.primary.label}
              <ChevronRight className="text-hd-chevron" />
            </Link>

            <Link
              to={localePath(t.secondary.href)}
              className="inline-flex h-[50px] items-center rounded-full border border-hd-hairline px-[15px] text-[16px] leading-none text-white transition-colors hover:bg-white/10"
            >
              {t.secondary.label}
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue — vertical label above a 2x70 rule, centred on x=96 */}
        <div className="pointer-events-none absolute bottom-[35px] left-20 hidden w-8 flex-col items-center gap-[13px] lg:flex">
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
