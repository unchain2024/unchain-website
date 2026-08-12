import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { advisor } from "./content";
import { NumberTwo } from "./art/Marks";
import { IconTarget, IconExperiment, IconSparkle } from "./art/AdvisorIcons";
import advisorShot from "@/assets/business/advisor-shot.webp";

/**
 * AI Native Advisor — `public/business/Section-1.svg` (1440x1226).
 *
 * Same #F5F5F5 panel as the Neuron section: intro beside the photo, a four-column
 * engagement track, a hairline rule, then the "who it's for" block.
 */
const BULLET_ICON = {
  target: IconTarget,
  experiment: IconExperiment,
  sparkle: IconSparkle,
} as const;

const AdvisorSection = () => {
  const { lang } = useLang();
  const t = advisor[lang];

  return (
    <section id="advisor" data-nav-theme="light" className="w-full scroll-mt-24 bg-white">
      {/* Same panel as the Neuron section: 8px inset and 12 radius on mobile. */}
      <div className="mx-auto w-full max-w-[1440px] p-2 sm:p-4">
        <div className="rounded-xl bg-hd-panel px-6 py-12 sm:rounded-2xl sm:px-10 sm:py-16 lg:px-[clamp(32px,6.9444vw,100px)] lg:pb-[112px] lg:pt-[100px]">
          {/* ── Intro ─────────────────────────────────────────────────────── */}
          <div className="lg:flex lg:items-start lg:justify-between">
            <ScrollReveal data-probe="advisor-intro" className="lg:w-[48.0132%] lg:shrink-0">
              <NumberTwo className="ml-[4px] mt-[13.5px] h-[48px] w-[67.41px]" />

              <h2 data-probe="advisor-heading" className="mt-[32px] text-[32px] font-bold leading-none text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
                {t.heading}
              </h2>

              <p data-probe="advisor-body" className="mt-[20px] max-w-[390px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
                {t.body}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} data-probe="advisor-photo" className="mt-10 lg:mt-0 lg:w-[48.0563%] lg:shrink-0">
              <div
                role="img"
                aria-label={t.photoAlt}
                style={{
                  backgroundImage: `url(${advisorShot})`,
                  backgroundSize: "145.844% 128.517%",
                  backgroundPosition: "59.3% 58.14%",
                }}
                className="aspect-[580.52/439.191] w-full rounded-2xl bg-[#D9D9D9] bg-no-repeat"
              />
            </ScrollReveal>
          </div>

          {/* ── Engagement track ──────────────────────────────────────────── */}
          {/* Two-up on mobile, as the export draws it, and four across from `lg`. */}
          <ol data-probe="steps" className="mt-[84px] grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 lg:grid-cols-4">
            {t.steps.map((step, i) => (
              <li key={step.n}>
                <ScrollReveal delay={i * 0.08} data-probe={`step-${step.n}`}>
                  <p className="text-[20px] font-bold leading-none text-hd-eyebrow">
                    {step.n}
                  </p>
                  <p className="mt-[22px] text-[20px] font-bold leading-none text-black">
                    {step.title}
                  </p>
                  <p className="mt-[15px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
                    {step.body}
                  </p>
                </ScrollReveal>
              </li>
            ))}
          </ol>

          <hr data-probe="rule" className="mt-[80px] border-t border-hd-hairline" />

          {/* ── Who it's for ──────────────────────────────────────────────── */}
          <div className="mt-[82px] lg:flex lg:items-start lg:justify-between lg:gap-16">
            <ScrollReveal data-probe="audience-head">
              <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
                {t.audience.eyebrow}
              </p>

              <h2 className="mt-[25px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
                {t.audience.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1} data-probe="audience-list" className="mt-8 lg:mt-[43px] lg:w-[35.5132%] lg:shrink-0">
              <ul className="space-y-[24px]">
                {t.audience.items.map((item) => {
                  const Icon = BULLET_ICON[item.id as keyof typeof BULLET_ICON];
                  return (
                    <li key={item.id} className="flex items-center gap-[12.5px]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                        <Icon className="h-[16.67px] w-[16.67px] text-hd-chevron" />
                      </span>
                      {/* The export sets these on one line in a 380.5px column with
                          ~2px to spare; the browser's CJK measure runs a shade wider,
                          so the tracking is pulled back to the export's own measure.
                          The 22px leading only shows when the English copy wraps. */}
                      <p className="text-[16px] leading-[22px] tracking-[-0.008em] text-black">
                        {item.body}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisorSection;
