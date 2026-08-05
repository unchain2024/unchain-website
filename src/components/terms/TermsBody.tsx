import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { policy, CONTACT_EMAIL } from "./content";

/**
 * Policy body — `public/termofuse/Section.svg` (1440x1363).
 *
 * One #F5F5F5 panel, inset 16px from the page edge and rounded 16px, exactly as the
 * export's single `<rect x="16" y="16" width="1408" height="1331" rx="16">` draws it. All
 * of the copy sits in a 648px column centred in the frame (x 396..1044), which is the
 * panel's own centre line too.
 *
 * Geometry read off the export, in its coordinates: the intro at 16px/22px from y=116.3,
 * the 48px heading at 294.5, the six items on a 22px leading with 40px between them, the
 * signature at 1097.5, the #D5D7DA rule at 1159, then the contact block at 1199.4. The
 * 40px rhythm is the export's, not a rounding of it — every gap below the heading
 * measures 40 to within 0.1px.
 *
 * The numbered items are a marker column 26px wide, so their wrapped lines hang at
 * x=422.4 the way the export draws them, and the marker keeps the export's black against
 * the body's #414651.
 *
 * Every paragraph is set `line-break: strict` and `text-spacing-trim: space-all`, which is
 * what makes them break where Figma drew them. Chrome's defaults let a small kana start a
 * line and compress the gap between adjacent full-width punctuation ("る。」"), so without
 * those two the intro and items 2 and 3 fit an extra character per line and every break
 * downstream walks. The career page needs the first of the pair for the same reason.
 */
const TermsBody = () => {
  const { lang } = useLang();
  const t = policy[lang];

  return (
    <section data-nav-theme="light" data-probe="s-body" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4">
        <div className="rounded-2xl bg-hd-panel px-6 py-16 sm:px-10 lg:px-0 lg:pb-[99px] lg:pt-[101px]">
          <div className="mx-auto w-full max-w-[648px]">
            <ScrollReveal>
              <p
                data-probe="body-intro"
                className="text-[16px] leading-[22px] text-hd-body-ink [line-break:strict] [text-spacing-trim:space-all]"
              >
                {t.intro}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h2
                data-probe="body-heading"
                className="mt-[46px] text-[36px] font-bold leading-[1.11] text-black sm:text-[42px] lg:mt-[48.2px] lg:text-[48px] lg:leading-[56px]"
              >
                {t.heading}
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <ol data-probe="body-list" className="mt-[43px] space-y-10">
                {t.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex text-[16px] leading-[22px] text-hd-body-ink [line-break:strict] [text-spacing-trim:space-all]"
                  >
                    <span className="w-[26px] shrink-0 text-black">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal>
              <p
                data-probe="body-signature"
                className="mt-10 text-[16px] font-bold leading-[22px] text-black"
              >
                {t.signature}
              </p>

              <div
                data-probe="body-rule"
                className="mt-[38px] h-px w-full bg-hd-hairline"
              />

              <p
                data-probe="body-contact"
                className="mt-[41px] text-[16px] leading-[22px] text-black"
              >
                {t.contactLabel}
              </p>

              <a
                data-probe="body-email"
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-[5.6px] block w-fit text-[14px] leading-[20px] text-hd-body-ink underline decoration-[0.7px] underline-offset-[3px] transition-colors hover:text-black"
              >
                {CONTACT_EMAIL}
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsBody;
