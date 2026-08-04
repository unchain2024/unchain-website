import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { japan } from "./content";
import { Torii } from "./art/JapanArt";

/**
 * Hero — `public/about/Frame 2147226133.svg` (1440x482).
 *
 * Set apart from the numbered sections below it: an 80px gutter instead of their 120px,
 * no eyebrow, and a 72px heading against the 54px elsewhere. The torii is the export's
 * own gradient art, anchored right.
 *
 * Being the page's first section, this reserves the height of the header — the about
 * page's navigation is its own 68px export drawn above the content rather than over it,
 * plus 40px for the information banner while that is showing.
 */
const JapanSection = () => {
  const { lang } = useLang();
  const t = japan[lang];
  return (
    <section
      data-nav-theme="light"
      data-probe="s-japan"
      className="w-full overflow-hidden bg-white pt-[68px]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:h-[482px]">
        <Torii
          className="pointer-events-none absolute right-[152px] top-[70.7px] hidden h-[382.56px] w-[479.89px] select-none lg:block"
          aria-hidden="true"
        />

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 py-16 sm:px-10 lg:px-20 lg:py-0 lg:pt-[125px]"
        >
          <h1
            data-probe="japan-heading"
            className="text-[44px] font-bold leading-[1.11] text-black sm:text-[56px] lg:text-[72px] lg:leading-[80px]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            data-probe="japan-body"
            className="mt-8 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[33.5px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JapanSection;
