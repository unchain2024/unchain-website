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
/**
 * Each glyph carries both placements as one literal class string: the mobile export's
 * (345x379 card, glyphs at 80% of the desktop size, absolutely placed in the card's
 * padding box), and from `lg` the desktop export's own. In between the glyph simply
 * follows the copy at the desktop size, which is what the three-up `sm` grid needs.
 */
const ART = {
  mission: {
    Art: IconMission,
    box:
      "absolute left-[9.7px] top-[181.2px] h-[138.98px] w-[138.98px] " +
      "sm:static sm:mt-8 sm:h-[173.73px] sm:w-[173.731px] " +
      "lg:absolute lg:left-[36.349px] lg:top-[208.349px] lg:mt-0",
  },
  flexible: {
    Art: IconFlexible,
    box:
      "absolute left-[15px] top-[177.7px] h-[145.13px] w-[128.57px] " +
      "sm:static sm:mt-8 sm:h-[181.418px] sm:w-[160.709px] " +
      "lg:absolute lg:left-[42.999px] lg:top-[204px] lg:mt-0",
  },
  equity: {
    Art: IconEquity,
    box:
      "absolute left-[15px] top-[186.5px] h-[127.58px] w-[127.58px] " +
      "sm:static sm:mt-8 sm:h-[159.479px] sm:w-[159.474px] " +
      "lg:absolute lg:left-[43px] lg:top-[215px] lg:mt-0",
  },
} as const;

const WhySection = () => {
  const { lang } = useLang();
  const t = why[lang];

  return (
    <section data-nav-theme="light" data-probe="s-why" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pb-[100px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="why-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="why-heading"
            className="mt-[23.4px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]"
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
                  <div className="relative min-h-[379px] overflow-hidden rounded-2xl border border-hd-card-line bg-white px-6 pb-6 pt-[29.2px] sm:min-h-0 lg:min-h-[420px]">
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

                    {/* Placed at the offset each export draws it at — the mobile card's
                        own on the narrow layout, the desktop card's from `lg`. */}
                    <Art className={`select-none ${box}`} />
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
