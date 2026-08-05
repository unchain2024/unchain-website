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
const ART = {
  application: { Art: NumberOne, box: "left-[54.5px] top-[26px] h-[102px] w-[43px]" },
  intro: { Art: NumberTwo, box: "left-[41.781px] top-[26.516px] h-[100.968px] w-[68.436px]" },
  founder: { Art: NumberThree, box: "left-[39.906px] top-[24.571px] h-[104.858px] w-[72.184px]" },
} as const;

const ProcessSection = () => {
  const { lang } = useLang();
  const t = process[lang];

  return (
    <section data-nav-theme="light" data-probe="s-process" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[120px] lg:pb-[100px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="process-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="process-heading"
            className="mt-[23.5px] text-[36px] font-bold leading-[1.11] text-black sm:text-[44px] lg:text-[54px] lg:leading-[59px]"
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
                className="relative border-l border-hd-card-line pb-6 pl-6 pt-6 lg:h-[300px] lg:pb-0 lg:pl-[23px] lg:pt-[202.5px]"
              >
                {/* Top of the column in the export; on the stacked mobile column it runs
                    above the copy instead of being pinned. Outside the reveal on purpose —
                    its transform would otherwise become the containing block for this. */}
                <Art className={`mb-6 select-none lg:absolute lg:mb-0 ${box}`} />

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
