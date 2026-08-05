import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { vision } from "./content";

/**
 * Vision — `public/about/Section-1.svg` (1440x352).
 *
 * Same 120px gutter as the hero. The display heading sits on the left; the two paragraphs
 * are a 460px column starting at x=860, so the column is flush to the 1320px content edge
 * rather than aligned with the hero's 520px one.
 */
const VisionSection = () => {
  const { lang } = useLang();
  const t = vision[lang];

  return (
    <section data-nav-theme="light" data-probe="s-vision" className="w-full bg-white">
      {/* Japanese ink starts ~3.6px higher in its line box than Latin, so the heading below
          needs that much more above it; the bottom padding absorbs the difference and the
          section stays the export's 352px tall in both languages. */}
      <div
        className={`mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[120px] lg:pt-[101px] ${
          lang === "ja" ? "lg:pb-[95px]" : "lg:pb-[99px]"
        }`}
      >
        <div className="lg:flex lg:items-start lg:justify-between">
          <ScrollReveal className="lg:shrink-0">
            <p
              data-probe="vision-eyebrow"
              className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
            >
              {t.eyebrow}
            </p>

            {/* This is the one heading whose script differs by language: Japanese here,
                Latin on /en. The Latin display size on this page measures 53px against the
                54px the Japanese headings use, and Japanese ink starts higher in the line
                box, so the size and the margin above it both follow the language. That puts
                the ink on the same 142px the export's other Japanese headings sit on —
                which is why the Japanese margin here matches leadership's 23px, not the
                20px the Latin heading needs. */}
            <h2
              data-probe="vision-heading"
              className={`text-[36px] font-bold leading-[1.11] text-black sm:text-[44px] lg:leading-[59px] ${
                lang === "ja" ? "mt-[24px] lg:text-[54px]" : "mt-[20px] lg:text-[53px]"
              }`}
            >
              {t.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-8 lg:mt-[40px] lg:w-[460px] lg:shrink-0">
            <p data-probe="vision-body" className="text-[16px] leading-[22px] text-hd-eyebrow-ink">
              {t.body[0]}
            </p>
            <p className="mt-[16px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
              {t.body[1]}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
