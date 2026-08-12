import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { neuron } from "./content";
import { ChevronRight } from "@/components/home/icons";
import { NumberOne, NeuronWordmark, ExternalArrow } from "./art/Marks";
import { RiskRadarArt, DecisionMemoryArt, ContextArt, AskAnythingArt } from "./art/CardArt";
import OntologyDiagram from "./OntologyDiagram";
import neuronShot from "@/assets/business/neuron-shot.webp";

/**
 * Neuron — `public/business/Section.svg` (1440x1943).
 *
 * A #F5F5F5 panel inset 16px from the page edge with 100px of padding, holding three
 * stacked blocks: the product intro next to the product shot, the four capability
 * cards, and the ontology figure.
 *
 * The photo is cropped exactly as the export's pattern crops it — the design zooms
 * well past `cover`, so the scale and offset are reproduced with background-size and
 * background-position rather than object-fit.
 */
const CARD_ART = {
  risk: RiskRadarArt,
  memory: DecisionMemoryArt,
  context: ContextArt,
  ask: AskAnythingArt,
} as const;

/* Each illustration keeps its own aspect from the export; they are not a uniform box. */
const CARD_ART_SIZE: Record<string, string> = {
  risk: "h-[116.23px] w-[116.23px]",
  memory: "h-[122.93px] w-[122.92px]",
  context: "h-[120.22px] w-[102.88px]",
  ask: "h-[122.88px] w-[124.19px]",
};

const NeuronSection = () => {
  const { lang } = useLang();
  const t = neuron[lang];

  return (
    <section id="neuron" data-nav-theme="light" className="w-full scroll-mt-24 bg-white">
      {/* The mobile export insets the panel 8px, rounds it 12 and pads it 24. */}
      <div className="mx-auto w-full max-w-[1440px] p-2 sm:p-4">
        <div className="rounded-xl bg-hd-panel px-6 py-12 sm:rounded-2xl sm:px-10 sm:py-16 lg:p-[clamp(32px,6.9444vw,100px)]">
          {/* ── Product intro ─────────────────────────────────────────────── */}
          <div className="lg:flex lg:items-start lg:justify-between">
            <ScrollReveal data-probe="neuron-intro" className="lg:w-[48.0132%] lg:shrink-0">
              {/* Both marks carry the export's own left bearing, so they are nudged
                  out to sit where Figma drew them rather than flush to the gutter. */}
              <NumberOne className="ml-[9px] mt-[13.5px] h-[48px] w-[57.21px]" />

              <NeuronWordmark className="ml-[7px] mt-[36px] h-[43.61px] w-[178.22px] text-black" />

              <p data-probe="neuron-lead" className="mt-[24px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.lead}
              </p>

              <p className="mt-[22px] max-w-[450px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.body}
              </p>

              <a
                href={t.cta.href}
                target="_blank"
                rel="noreferrer"
                data-probe="neuron-cta"
                className="mt-[14px] flex h-[50px] items-center justify-center gap-[13px] rounded-full border border-hd-hairline text-[16px] leading-none text-black transition-colors hover:bg-white/60 sm:inline-flex sm:justify-start sm:pl-[16px] sm:pr-[24px]"
              >
                {t.cta.label}
                <ExternalArrow className="h-[10px] w-[10px] text-hd-chevron" />
              </a>
            </ScrollReveal>

            <ScrollReveal
              delay={0.1}
              data-probe="neuron-photo"
              className="mt-10 lg:mt-0 lg:w-[48.0563%] lg:shrink-0"
            >
              <div
                role="img"
                aria-label={t.photoAlt}
                style={{
                  backgroundImage: `url(${neuronShot})`,
                  backgroundSize: "213.924% 148.467%",
                  backgroundPosition: "77.91% 32.83%",
                }}
                className="aspect-[580.52/439.191] w-full rounded-2xl bg-[#D9D9D9] bg-no-repeat"
              />
            </ScrollReveal>
          </div>

          {/* ── What Neuron does ──────────────────────────────────────────── */}
          <div className="mt-[83px] lg:flex lg:items-start lg:justify-between lg:gap-16">
            <ScrollReveal data-probe="features-head">
              <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
                {t.features.eyebrow}
              </p>

              <h2 className="mt-[22px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
                {t.features.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1} data-probe="features-body" className="mt-6 lg:mt-[84px] lg:w-[30.7119%] lg:shrink-0">
              <p className="text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.features.body}
              </p>
            </ScrollReveal>
          </div>

          <ul data-probe="cards" className="mt-[55px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.cards.map((card, i) => {
              const Art = CARD_ART[card.id as keyof typeof CARD_ART];
              return (
                <li key={card.id}>
                  <ScrollReveal delay={i * 0.08} data-probe={`card-${card.id}`}>
                    <div className="flex h-full flex-col rounded-2xl border border-hd-card-line bg-white p-4 lg:min-h-[320px]">
                      <div className="flex h-[190px] items-center justify-center">
                        <Art className={CARD_ART_SIZE[card.id]} />
                      </div>

                      <p data-probe={`card-title-${card.id}`} className="mt-[23px] text-[20px] font-bold leading-none text-black">
                        {card.title}
                      </p>
                      <p className="mt-[15px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
                        {card.body}
                      </p>
                    </div>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>

          {/* ── AI-driven ontology ────────────────────────────────────────── */}
          <div className="mt-[80px] min-[1440px]:flex min-[1440px]:items-start min-[1440px]:justify-between">
            <ScrollReveal data-probe="ontology-copy" className="min-[1440px]:pt-[3px]">
              <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
                {t.ontology.eyebrow}
              </p>

              <h2 className="mt-[22px] max-w-[500px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
                {t.ontology.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="mt-[11px] max-w-[470px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.ontology.body}
              </p>

              {/* Goes to Neuron's own ontology page, per locale, so it leaves the
                  site — an anchor rather than a router Link. */}
              <a
                href={t.ontology.cta.href}
                target="_blank"
                rel="noreferrer"
                data-probe="ontology-cta"
                className="mt-[40px] flex h-[50px] items-center justify-center gap-[15px] rounded-full border border-hd-hairline text-[16px] leading-none text-black transition-colors hover:bg-white/60 sm:inline-flex sm:justify-start sm:pl-[16px] sm:pr-[25px]"
              >
                {t.ontology.cta.label}
                <ChevronRight className="text-hd-chevron" />
              </a>
            </ScrollReveal>

            {/* The figure is a scale drawing, so it shrinks as a whole rather than
                reflowing. `--ont` is the largest scale that still fits the panel's
                content width at the narrowest viewport in each range — the side inset
                is 64px below sm (the mobile export's 8px panel inset plus its 24px
                padding) and 112px from sm up, and from md the figure fits at the 642px
                it was drawn at. That puts it at 0.51 on a 393px page, which is the
                345px the mobile export draws it at. The wrapper tracks the same factor
                so no dead vertical space is left behind. (A fluid factor is not
                expressible here: dividing a length by a length is not valid CSS.) */}
            <ScrollReveal
              delay={0.1}
              data-probe="ontology-figure"
              className="mt-12 [--ont:0.51] min-[420px]:[--ont:0.55] min-[560px]:[--ont:0.77] sm:[--ont:0.79] min-[788px]:[--ont:1] min-[1440px]:mt-0 min-[1440px]:shrink-0"
            >
              <div
                style={{ height: "calc(579px * var(--ont, 1))" }}
                className="w-full overflow-hidden min-[1440px]:w-[642px]"
              >
                <OntologyDiagram
                  style={{ transform: "scale(var(--ont, 1))" }}
                  className="origin-top-left"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuronSection;
