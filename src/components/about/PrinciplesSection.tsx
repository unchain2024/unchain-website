import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { lineGap } from "@/lib/headingLines";
import { principles } from "./content";
import { PrinciplesCardArt } from "./art/PrinciplesArt";

/**
 * Our principles — `public/about/Section-2.svg` (1440x728).
 *
 * A #F5F5F5 panel inset 100px from the page edge with 16px of padding. Inside, a 533px
 * navy card holds the heading and the four numbered principles run down a 627px column
 * beside it, separated by hairlines at a 124px pitch.
 *
 * The card's glow and blades are the export's own art, clipped by the card exactly as the
 * export clips them.
 */
const PrinciplesSection = () => {
  const { lang } = useLang();
  const t = principles[lang];

  return (
    <section data-nav-theme="light" data-probe="s-principles" className="w-full bg-white">
      {/* The mobile export keeps the panel on the page's own 24px gutter and drops its
          padding to 12, with the four principles indented a further 16 so their hairlines
          run x 52..341. */}
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-6 lg:p-[clamp(32px,6.9444vw,100px)]">
        <div className="rounded-2xl bg-hd-panel p-3 sm:p-4">
          {/* 533 : 627 either side of the 48px gutter is the export's split of the panel's
              1208px measure — as `fr` it holds that ratio below 1440, where the two fixed
              widths together are wider than the panel itself. */}
          <div className="lg:grid lg:grid-cols-[533fr_627fr] lg:items-stretch lg:gap-12">
            {/* ── Heading card ──────────────────────────────────────────────── */}
            <ScrollReveal>
              <div className="relative h-full overflow-hidden rounded-xl bg-hd-join px-6 pb-10 pt-7 sm:px-10 sm:py-10 lg:min-h-[496px] lg:px-10 lg:pb-10 lg:pt-[41.3px]">
                <PrinciplesCardArt className="pointer-events-none absolute inset-0 h-full w-full select-none" />

                <div className="relative">
                  <p
                    data-probe="principles-eyebrow"
                    className="font-mono text-[14px] leading-none text-white"
                  >
                    {t.eyebrow}
                  </p>

                  <h2
                    data-probe="principles-heading"
                    className="mt-[24px] text-[32px] font-bold leading-[1.0925926] text-white sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)] lg:leading-[1.1111111]"
                  >
                    {/* The export's line breaks are for the 533px desktop card; the
                        mobile one is 321 wide and breaks the same sentence in two, so
                        below `lg` the lines run inline and wrap to the measure. The
                        text itself is one copy either way. */}
                    {t.heading.map((line, i) => (
                      <span key={line} className="lg:block">
                        {lineGap(t.heading[i - 1])}
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            {/* ── The four principles ───────────────────────────────────────── */}
            <ul className="mt-8 px-4 pb-4 lg:mt-0 lg:px-0 lg:pb-0 lg:pt-[35.6px]">
              {t.items.map((item, i) => (
                <li
                  key={item.n}
                  className={
                    i === 0
                      ? ""
                      : "mt-[26px] border-t border-hd-hairline pt-[28px] lg:mt-[31.7px] lg:pt-[34.6px]"
                  }
                >
                  <ScrollReveal delay={i * 0.08}>
                    <div className="flex items-baseline" data-probe={`principle-${item.n}`}>
                      {/* Fixed slot, not a gap: the numerals are proportional, and the
                          export keeps every title on the same x regardless of which. */}
                      <span className="w-[38px] shrink-0 text-[20px] font-semibold leading-none text-hd-eyebrow">
                        {item.n}
                      </span>
                      <h3 className="text-[20px] font-bold leading-none text-black">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-[16.7px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
                      {item.body}
                    </p>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
