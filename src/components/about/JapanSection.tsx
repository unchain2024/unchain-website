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
      className="w-full overflow-hidden bg-white pt-nav"
    >
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[482px]">
        {/* The mobile export centres the torii above the copy at 273x218 — the export's
            own 479.89:382.56 aspect — sitting 48px under the header. */}
        <div className="pt-12 lg:contents">
          <Torii
            className="pointer-events-none mx-auto block h-[218.1px] w-[273.4px] max-w-full select-none lg:absolute lg:right-[10.5556%] lg:top-[70.7px] lg:h-[382.56px] lg:w-[479.89px]"
            aria-hidden="true"
          />
        </div>

        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 pb-12 pt-[43px] sm:px-10 lg:px-[clamp(40px,5.5556vw,80px)] lg:py-0 lg:pt-[125px]"
        >
          <h1
            data-probe="japan-heading"
            className="text-[40px] font-bold leading-[44px] text-black lg:text-[clamp(48px,5vw,72px)] lg:leading-[1.1111111]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            data-probe="japan-body"
            className="mt-5 max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-[33.5px]"
          >
            {t.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JapanSection;
