import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { layers } from "./content";
import { LayerStack, Connector } from "./art/LayersArt";
import {
  GlyphTools,
  GlyphShieldTick,
  GlyphNeuron,
  GlyphPeople,
} from "./art/Glyphs";

/**
 * Security layers — `public/trust-security/Section-1.svg` (1440x961).
 *
 * A #F5F5F5 rounded panel inset 16px from the page edge, 104px of side padding, a centred
 * eyebrow and 54px heading, then the isometric stack with four label cards leadered off it.
 *
 * Everything below the heading is placed by the export's own coordinates inside one
 * 1200x516.977 box that starts at y=328: the stack at x 487.8..952.2, the labels at
 * x 1000 / 120 on a 320x94 card, and each leader line centred on its card. Offsets here are
 * that coordinate less the panel's content origin (120, 328).
 *
 * The plate numerals are live text rather than drawing. They ride in an SVG overlay sharing
 * the stack's viewBox, which is what keeps them on their plate at every width while staying
 * selectable, translatable DOM text. The export sets them in a narrower face than Inter, so
 * at 28px — the size that lands its cap height — the ink still runs 2px wider on a 27px
 * numeral. Height is the measure to trust, the same way it is for the news hero.
 */
const GLYPHS = {
  tools: GlyphTools,
  access: GlyphShieldTick,
  neuron: GlyphNeuron,
  team: GlyphPeople,
} as const;

/**
 * Where each label sits in that 1200x516.977 box, and which side of the stack it is on.
 * `01` and `03` hang off the right of the stack, `02` and `04` off the left, so the leader
 * line is mirrored for the left pair — the dot always sits on the stack's side.
 */
const LABELS = {
  tools: { box: "lg:left-[880px] lg:top-[38.89px]", side: "right" },
  access: { box: "lg:left-0 lg:top-[152px]", side: "left" },
  neuron: { box: "lg:left-[880px] lg:top-[272px]", side: "right" },
  team: { box: "lg:left-0 lg:top-[385.11px]", side: "left" },
} as const;

/* Baselines of the four numerals in the stack's own coordinates — the ink bottom Figma
   drew, which for lining digits is the baseline. */
const NUM_BASELINE = { "01": 428.3, "02": 544.9, "03": 661.4, "04": 777.3 } as const;

const LayersSection = () => {
  const { lang } = useLang();
  const t = layers[lang];

  return (
    <section data-nav-theme="light" data-probe="s-layers" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] p-4">
        <div className="rounded-2xl bg-hd-panel px-6 py-16 sm:px-10 lg:px-[104px] lg:pb-[100px] lg:pt-[101.8px]">
          <ScrollReveal className="lg:text-center">
            <p
              data-probe="layers-eyebrow"
              className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
            >
              {t.eyebrow}
            </p>

            <h2
              data-probe="layers-heading"
              className="mt-[22.5px] text-[36px] font-bold leading-[1.11] tracking-[-0.006em] text-black sm:text-[44px] lg:text-[54px] lg:leading-[59px]"
            >
              {t.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </ScrollReveal>

          <div className="mt-10 lg:relative lg:mt-[55.75px] lg:h-[516.977px]">
            {/* The stack, with its numerals in an overlay on the same viewBox. */}
            <div className="relative mx-auto w-full max-w-[464.484px] lg:absolute lg:left-[367.758px] lg:top-0 lg:mx-0 lg:h-[516.977px] lg:w-[464.484px] lg:max-w-none">
              <LayerStack className="h-auto w-full select-none" />

              <svg
                viewBox="487.758 328 464.484 516.977"
                className="pointer-events-none absolute inset-0 h-full w-full font-sans"
              >
                {t.items.map((item) => (
                  <text
                    key={item.num}
                    x="914.7"
                    y={NUM_BASELINE[item.num]}
                    fontSize="28"
                    fontWeight="300"
                    fill="#ffffff"
                    className="pointer-events-auto"
                  >
                    {item.num}
                  </text>
                ))}
              </svg>
            </div>

            {/* On desktop each card is placed off the stack; stacked below it on mobile. */}
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-0 lg:contents">
              {t.items.map((item, i) => {
                const Glyph = GLYPHS[item.id as keyof typeof GLYPHS];
                const { box, side } = LABELS[item.id as keyof typeof LABELS];
                const right = side === "right";
                return (
                  <li
                    key={item.id}
                    data-probe={`layers-label-${item.id}`}
                    className={`relative lg:absolute lg:h-[94px] lg:w-[320px] ${box}`}
                  >
                    <ScrollReveal delay={i * 0.08}>
                      <div className="flex items-start gap-[18px] rounded-2xl bg-white p-6 lg:h-[94px] lg:p-0 lg:pl-6 lg:pt-[22px]">
                        <span
                          aria-hidden="true"
                          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-black text-white"
                        >
                          <Glyph className="h-6 w-6" />
                        </span>

                        <div className="min-w-0 lg:pt-[4.2px]">
                          <p
                            data-probe={`layers-title-${item.id}`}
                            className="text-[20px] font-bold leading-none text-black"
                          >
                            {item.title}
                          </p>
                          <p
                            data-probe={`layers-body-${item.id}`}
                            className="mt-[11px] text-[14px] leading-none text-hd-eyebrow-ink"
                          >
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>

                    {/* Leader line — hidden while the cards are stacked, since there is
                        nothing to lead to. */}
                    <Connector
                      className={`hidden h-[10.666px] w-[38.333px] select-none lg:absolute lg:top-[41.667px] lg:block ${
                        right ? "lg:left-[-37.333px]" : "lg:right-[-37.333px] lg:-scale-x-100"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayersSection;
