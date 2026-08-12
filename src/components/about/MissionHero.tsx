import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { lineGap } from "@/lib/headingLines";
import { mission } from "./content";
import { BladeTopLeft, BladeBottomRight } from "./art/HeroArt";
import briefingShot from "@/assets/about/mission-briefing.webp";
import advisorShot from "@/assets/about/mission-advisor.webp";

/**
 * Mission — `public/about/Section.svg` (1440x992).
 *
 * The first of the numbered sections, sitting directly under the hero. White canvas on a
 * 120px page gutter, unlike the 80px the hero and the home and business pages use. The
 * heading sits on the left, the mission statement in a 520px column at x=800, and two
 * photos fill the 1200px measure below (403 + 16 + 781).
 *
 * The two gradient blades are the export's own vector art and run off the page edges, so
 * each is anchored to its own edge and the canvas clips them exactly as Figma does.
 */
const MissionHero = () => {
  const { lang } = useLang();
  const t = mission[lang];

  return (
    <section data-nav-theme="light" data-probe="s-mission" className="w-full overflow-hidden bg-white">
      <div className="relative mx-auto w-full max-w-[1440px] lg:min-h-[992px]">
        {/* Blades. Clipped to the design canvas, which is what the export's own clip does. */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <BladeTopLeft className="absolute left-[-176.38px] top-[163px] hidden h-[356.7px] w-[469.16px] lg:block" />
          <BladeBottomRight className="absolute right-[-234.6px] top-[702.5px] hidden h-[356.71px] w-[469.16px] lg:block" />
        </div>

        {/* Still in the first viewport under the hero, so this reveals on mount. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative px-6 pt-12 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pt-[101px]"
        >
          <div className="lg:flex lg:items-start lg:justify-between">
            <div className="lg:shrink-0">
              <p
                data-probe="mission-eyebrow"
                className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
              >
                {t.eyebrow}
              </p>

              <h1
                data-probe="mission-heading"
                className="mt-[18px] text-[32px] font-bold leading-[1.11] text-black sm:text-[44px] lg:text-[clamp(38px,3.6806vw,53px)] lg:leading-[1.1132075]"
              >
                {/* One line at 32px on mobile, the export's own two from `lg`. */}
                {t.heading.map((line, i) => (
                  <span key={line} className="lg:block">
                    {lineGap(t.heading[i - 1])}
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* 520 of the 1200px measure, as a share so the heading keeps its room when
                the measure narrows below 1440. */}
            <div className="mt-10 lg:mt-[34px] lg:w-[43.3333%] lg:shrink-0">
              <p
                data-probe="mission-lead"
                className="text-[16px] font-bold leading-[22px] text-black lg:text-[20px] lg:leading-[28px]"
              >
                {t.lead}
              </p>

              <p
                data-probe="mission-body"
                className="mt-[16px] text-[16px] leading-[22px] text-hd-eyebrow-ink"
              >
                {t.body}
              </p>
            </div>
          </div>

          {/* 403 + 16 + 781 across the 1200px measure. As `fr` rather than a share each:
              percentages of the row do not account for the gap between them, which puts the
              pair 16px over the measure once it is narrower than 1200.

              The mobile export keeps the pair side by side at the same ratio, scaled to the
              345px measure — 115.9 + 4.6 + 224.5 — with the gutter and the corner radius
              shrinking to 4.6 along with it. */}
          <div className="mt-10 grid grid-cols-[403fr_781fr] gap-[4.6px] lg:mt-[79px] lg:gap-4">
            <img
              src={briefingShot}
              alt={t.photos[0].alt}
              loading="eager"
              data-probe="mission-photo-1"
              className="aspect-[403/518] w-full rounded-[4.6px] bg-[#D9D9D9] object-cover object-center lg:rounded-2xl"
            />
            <img
              src={advisorShot}
              alt={t.photos[1].alt}
              loading="eager"
              className="aspect-[781/518] w-full rounded-[4.6px] bg-[#D9D9D9] object-cover object-center lg:rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionHero;
