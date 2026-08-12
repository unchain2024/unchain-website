import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { process } from "./content";
import { NumberOne, NumberTwo, NumberThree } from "./art/ProcessArt";

/**
 * Selection process — `public/carrers/Section-2.svg` (1440x673).
 *
 * White canvas on the 120px page gutter. Three 384x300 columns on a 24px gutter fill the
 * 1200px measure, each opened by a 1px #E9EAEB rule on its left edge, with the numeral at
 * the top and the copy pinned to the bottom of the column.
 *
 * The numerals are drawn shapes rather than type — each is a stack of gradient shards — and
 * none shares a box with the others, so each carries the offset Figma drew it at.
 */
/**
 * The mobile export stacks the three columns into 345x260 blocks, each still opened by the
 * left-hand rule, with the numeral at 79% of the desktop size sitting 24px in from it.
 */
const ART = {
  application: {
    Art: NumberOne,
    box:
      "ml-[24px] h-[80.2px] w-[33.8px] " +
      "sm:ml-0 sm:h-[102px] sm:w-[43px] lg:absolute lg:left-[54.5px] lg:top-[26px] lg:mb-0",
  },
  intro: {
    Art: NumberTwo,
    box:
      "ml-[24px] h-[79.4px] w-[53.8px] " +
      "sm:ml-0 sm:h-[100.968px] sm:w-[68.436px] lg:absolute lg:left-[41.781px] lg:top-[26.516px] lg:mb-0",
  },
  founder: {
    Art: NumberThree,
    box:
      "ml-[24px] h-[82.4px] w-[56.7px] " +
      "sm:ml-0 sm:h-[104.858px] sm:w-[72.184px] lg:absolute lg:left-[39.906px] lg:top-[24.571px] lg:mb-0",
  },
} as const;

const ProcessSection = () => {
  const { lang } = useLang();
  const t = process[lang];

  return (
    <section data-nav-theme="light" data-probe="s-process" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pb-[100px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="process-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="process-heading"
            className="mt-[23.5px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </ScrollReveal>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-[75.5px]">
          {t.steps.map((step, i) => {
            const { Art, box } = ART[step.id as keyof typeof ART];
            return (
              <li
                key={step.id}
                className="relative min-h-[260px] border-l border-hd-card-line pb-6 pl-6 pt-6 sm:min-h-0 lg:min-h-[300px] lg:pb-0 lg:pl-[23px] lg:pt-[202.5px]"
              >
                {/* Top of the column in the export; on the stacked mobile column it runs
                    above the copy instead of being pinned. Outside the reveal on purpose —
                    its transform would otherwise become the containing block for this. */}
                <Art className={`mb-[56px] select-none sm:mb-6 ${box}`} />

                <ScrollReveal delay={i * 0.08}>
                  <h3
                    data-probe={`process-title-${step.id}`}
                    className="text-[20px] font-bold leading-none text-black"
                  >
                    {step.title}
                  </h3>

                  {/* 342px on `line-break: strict` is the one measure that reproduces all
                      three of the exports' breaks at once — step 3 needs at least 340 to
                      keep "48時" on its first line, step 1 breaks a character later above
                      344, and strict is what holds step 2's "しょう。" together. */}
                  <p
                    data-probe={`process-body-${step.id}`}
                    className="mt-[14.2px] max-w-[342px] text-[14px] leading-[20px] text-hd-eyebrow-ink [line-break:strict]"
                  >
                    {step.body}
                  </p>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
