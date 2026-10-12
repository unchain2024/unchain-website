import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { pulse } from "./content";
import { ExternalArrow } from "./art/Marks";
import {
  NumberThree,
  PulseMark,
  IconBrief,
  IconNotes,
  IconFollowUp,
  IconChat,
} from "./art/PulseMarks";
import pulseShot from "@/assets/business/pulse-shot.webp";

/**
 * Pulse, the third business. It has no export of its own.
 *
 * It is laid out on the same #F5F5F5 panel as the Neuron and Advisor sections and
 * borrows a block from each: the product intro beside the product shot and the
 * four-up capability cards from Neuron, then the hairline rule and the numbered
 * track from the Advisor, here as the three moments of a meeting.
 *
 * The cards carry a line icon in place of Neuron's illustrations, in the same circle
 * the Advisor's audience list draws its icons in.
 */
const CARD_ICON = {
  brief: IconBrief,
  notes: IconNotes,
  followup: IconFollowUp,
  chat: IconChat,
} as const;

const PulseSection = () => {
  const { lang } = useLang();
  const t = pulse[lang];

  return (
    <section id="pulse" data-nav-theme="light" className="w-full scroll-mt-24 bg-white">
      {/* Same panel as the Neuron section: 8px inset and 12 radius on mobile. */}
      <div className="mx-auto w-full max-w-[1440px] p-2 sm:p-4">
        <div className="rounded-xl bg-hd-panel px-6 py-12 sm:rounded-2xl sm:px-10 sm:py-16 lg:px-[clamp(32px,6.9444vw,100px)] lg:pb-[112px] lg:pt-[100px]">
          {/* ── Product intro ─────────────────────────────────────────────── */}
          <div className="lg:flex lg:items-start lg:justify-between">
            <ScrollReveal data-probe="pulse-intro" className="lg:w-[48.0132%] lg:shrink-0">
              <NumberThree className="ml-[4px] mt-[13.5px] h-[48px] w-[63.23px]" />

              {/* Mark and name together stand in for a wordmark, at the Neuron
                  wordmark's 43.6px height. */}
              <div className="mt-[36px] flex items-center gap-[12px]">
                <PulseMark className="h-[43.6px] w-[39px] text-black" />
                <span
                  data-probe="pulse-name"
                  className="text-[40px] font-bold leading-none tracking-[-0.02em] text-black"
                >
                  {t.name}
                </span>
              </div>

              <p data-probe="pulse-lead" className="mt-[24px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.lead}
              </p>

              <p className="mt-[22px] max-w-[450px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.body}
              </p>

              <a
                href={t.cta.href}
                target="_blank"
                rel="noreferrer"
                data-probe="pulse-cta"
                className="mt-[14px] flex h-[50px] items-center justify-center gap-[13px] rounded-full border border-hd-hairline text-[16px] leading-none text-black transition-colors hover:bg-white/60 sm:inline-flex sm:justify-start sm:pl-[16px] sm:pr-[24px]"
              >
                {t.cta.label}
                <ExternalArrow className="h-[10px] w-[10px] text-hd-chevron" />
              </a>
            </ScrollReveal>

            <ScrollReveal
              delay={0.1}
              data-probe="pulse-photo"
              className="mt-10 lg:mt-0 lg:w-[48.0563%] lg:shrink-0"
            >
              <div
                role="img"
                aria-label={t.photoAlt}
                style={{ backgroundImage: `url(${pulseShot})` }}
                className="aspect-[580.52/439.191] w-full rounded-2xl bg-[#D9D9D9] bg-cover bg-center bg-no-repeat"
              />
            </ScrollReveal>
          </div>

          {/* ── What Pulse does ───────────────────────────────────────────── */}
          <div className="mt-[83px] lg:flex lg:items-start lg:justify-between lg:gap-16">
            <ScrollReveal data-probe="pulse-features-head">
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

            <ScrollReveal delay={0.1} data-probe="pulse-features-body" className="mt-6 lg:mt-[84px] lg:w-[30.7119%] lg:shrink-0">
              <p className="text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.features.body}
              </p>
            </ScrollReveal>
          </div>

          <ul data-probe="pulse-cards" className="mt-[55px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.cards.map((card, i) => {
              const Icon = CARD_ICON[card.id as keyof typeof CARD_ICON];
              return (
                <li key={card.id}>
                  <ScrollReveal delay={i * 0.08} data-probe={`pulse-card-${card.id}`} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-hd-card-line bg-white p-4 lg:min-h-[220px]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hd-panel">
                        <Icon className="h-[16.67px] w-[16.67px] text-hd-chevron" />
                      </span>

                      <p data-probe={`pulse-card-title-${card.id}`} className="mt-[23px] text-[20px] font-bold leading-[1.1] text-black">
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

          <hr data-probe="pulse-rule" className="mt-[80px] border-t border-hd-hairline" />

          {/* ── Before, during, after ─────────────────────────────────────── */}
          <div className="mt-[82px]">
            <ScrollReveal data-probe="pulse-steps-head">
              <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
                {t.steps.eyebrow}
              </p>
            </ScrollReveal>

            <ol data-probe="pulse-steps" className="mt-[40px] grid gap-y-8 sm:grid-cols-3 sm:gap-8">
              {t.steps.items.map((step, i) => (
                <li key={step.n}>
                  <ScrollReveal delay={i * 0.08} data-probe={`pulse-step-${step.n}`}>
                    <p className="text-[20px] font-bold leading-none text-hd-eyebrow">
                      {step.n}
                    </p>
                    <p className="mt-[22px] text-[20px] font-bold leading-none text-black">
                      {step.title}
                    </p>
                    <p className="mt-[15px] max-w-[320px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
                      {step.body}
                    </p>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PulseSection;
