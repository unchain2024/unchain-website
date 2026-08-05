import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { approach } from "./content";
import {
  IconReadOnly,
  IconEncryption,
  IconNoTraining,
  IconHumanCall,
} from "./art/ApproachArt";

/**
 * Our approach — `public/trust-security/Section.svg` (1440x752).
 *
 * White canvas on the 120px page gutter. Four 288x320 cards on a 16px gutter fill the
 * 1200px measure; each is white with the export's #E9EAEB hairline, rounded 16, and holds
 * its glyph over a 20px title and a 14px paragraph.
 *
 * The four glyphs are the export's own art. Each is centred on its card's axis and on
 * y=444, but they are four different sizes, so each carries its own measured offset rather
 * than sharing a box. Offsets are from the card's padding box, so each is the export's own
 * coordinate less the card's outer edge (120.5 / 424.5 / 728.5 / 1032.5 across, 332.5
 * down) and less the 1px border.
 */
const ART = {
  readonly: {
    Art: IconReadOnly,
    box: "left-[81.9px] top-[62.3px] h-[96.37px] w-[121.184px]",
  },
  encryption: {
    Art: IconEncryption,
    box: "left-[92.3px] top-[52.3px] h-[116.41px] w-[100.462px]",
  },
  notraining: {
    Art: IconNoTraining,
    box: "left-[84.4px] top-[52.4px] h-[116.236px] w-[116.236px]",
  },
  human: {
    Art: IconHumanCall,
    box: "left-[89.5px] top-[55.3px] h-[110.494px] w-[106.05px]",
  },
} as const;

const ApproachSection = () => {
  const { lang } = useLang();
  const t = approach[lang];

  return (
    <section data-nav-theme="light" data-probe="s-approach" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[120px] lg:pb-[99.5px] lg:pt-[102px]">
        <ScrollReveal>
          <p
            data-probe="approach-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          {/* 54px headings in this export are set about 0.6% tighter than the business
              page's own 54px heading, which fits at the font's natural tracking — see the
              trust rows in `tools/design/trust_fit.json`. */}
          <h2
            data-probe="approach-heading"
            className="mt-[22.4px] text-[36px] font-bold leading-[1.11] tracking-[-0.006em] text-black sm:text-[44px] lg:text-[54px] lg:leading-[59px]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </ScrollReveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-[76px] lg:grid-cols-4">
          {t.cards.map((card, i) => {
            const { Art, box } = ART[card.id as keyof typeof ART];
            return (
              <li key={card.id}>
                <ScrollReveal delay={i * 0.08}>
                  <div className="relative overflow-hidden rounded-2xl border border-hd-card-line bg-white px-4 pb-6 pt-6 lg:h-[320px] lg:pb-0 lg:pt-[229px]">
                    {/* Top of the card in the export; on the stacked mobile card it leads
                        the copy instead of being pinned. */}
                    <Art className={`mb-6 select-none lg:absolute lg:mb-0 ${box}`} />

                    <h3
                      data-probe={`approach-title-${card.id}`}
                      className="text-[20px] font-bold leading-none text-black"
                    >
                      {card.title}
                    </h3>

                    <p
                      data-probe={`approach-body-${card.id}`}
                      className="mt-[14.3px] text-[14px] leading-[20px] text-hd-eyebrow-ink"
                    >
                      {card.body}
                    </p>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ApproachSection;
