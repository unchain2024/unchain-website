import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
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
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:p-[100px]">
        <div className="rounded-2xl bg-hd-panel p-4">
          <div className="lg:flex lg:items-stretch lg:gap-12">
            {/* ── Heading card ──────────────────────────────────────────────── */}
            <ScrollReveal className="lg:w-[533px] lg:shrink-0">
              <div className="relative h-full overflow-hidden rounded-xl bg-hd-join px-6 py-10 sm:px-10 lg:h-[496px] lg:px-10 lg:pb-10 lg:pt-[41.3px]">
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
                    className="mt-[24px] text-[36px] font-bold leading-[1.11] text-white sm:text-[44px] lg:text-[54px] lg:leading-[60px]"
                  >
                    {t.heading.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            {/* ── The four principles ───────────────────────────────────────── */}
            <ul className="mt-8 lg:mt-0 lg:w-[627px] lg:shrink-0 lg:pt-[35.6px]">
              {t.items.map((item, i) => (
                <li
                  key={item.n}
                  className={
                    i === 0
                      ? ""
                      : "mt-[24px] border-t border-hd-hairline pt-[24px] lg:mt-[31.7px] lg:pt-[34.6px]"
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
