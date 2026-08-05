import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { why } from "./content";
import { IconMission, IconFlexible, IconEquity } from "./art/WhyArt";

/**
 * Why UNCHAIN — `public/carrers/Section.svg` (1440x852).
 *
 * White canvas on the 120px page gutter. Three 389.333x420 cards on a 16px gutter fill the
 * 1200px measure; each is white with the export's #E9EAEB hairline, rounded 16, and holds a
 * 20px title over a 14px paragraph with its glyph sitting low in the card.
 *
 * The three glyphs are the export's own art. None of them is centred in its card — each is
 * placed by the offset Figma drew it at, which is why they carry explicit left/top values
 * rather than a shared box.
 */
// Offsets are from the card's padding box, so each is the export's own coordinate less the
// card's outer edge (120 / 525.334 / 930.666 across, 332 down) and less the 1px border.
const ART = {
  mission: { Art: IconMission, box: "left-[36.349px] top-[208.349px] h-[173.73px] w-[173.731px]" },
  flexible: { Art: IconFlexible, box: "left-[42.999px] top-[204px] h-[181.418px] w-[160.709px]" },
  equity: { Art: IconEquity, box: "left-[43px] top-[215px] h-[159.479px] w-[159.474px]" },
} as const;

const WhySection = () => {
  const { lang } = useLang();
  const t = why[lang];

  return (
    <section data-nav-theme="light" data-probe="s-why" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[120px] lg:pb-[100px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="why-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="why-heading"
            className="mt-[23.4px] text-[36px] font-bold leading-[1.11] text-black sm:text-[44px] lg:text-[54px] lg:leading-[59px]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </ScrollReveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-[75.6px]">
          {t.cards.map((card, i) => {
            const { Art, box } = ART[card.id as keyof typeof ART];
            return (
              <li key={card.id}>
                <ScrollReveal delay={i * 0.08}>
                  <div className="relative overflow-hidden rounded-2xl border border-hd-card-line bg-white px-6 pb-6 pt-[29.2px] lg:h-[420px]">
                    <h3
                      data-probe={`why-title-${card.id}`}
                      className="text-[20px] font-bold leading-none text-black"
                    >
                      {card.title}
                    </h3>

                    {/* `line-break: strict` is what reproduces the exports' own breaks:
                        Chrome's default rules let a small kana or a long-vowel mark start a
                        line, and the design's do not. With it on, all three cards break
                        where Figma drew them — including card 2 after "リモート". */}
                    <p
                      data-probe={`why-body-${card.id}`}
                      className="mt-[14.5px] text-[14px] leading-[20px] text-hd-eyebrow-ink [line-break:strict]"
                    >
                      {card.body}
                    </p>

                    {/* Bottom of the card in the export; on the stacked mobile card it
                        follows the copy instead of being pinned. */}
                    <Art className={`mt-8 select-none lg:absolute lg:mt-0 ${box}`} />
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

export default WhySection;
