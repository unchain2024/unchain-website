import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { company } from "./content";

/**
 * Company information — `public/about/Section-5.svg` (1440x987).
 *
 * A nine-row table on the same 120px gutter as the other sections: labels at x=120,
 * values at x=420, a 1px #E9EAEB rule under every row, and each row's content centred in
 * it. Rows are 68px with a single-line value and 88px with two, which is 24px of padding
 * either side of a 20px line.
 */
const CompanySection = () => {
  const { lang } = useLang();
  const t = company[lang];

  return (
    <section data-nav-theme="light" data-probe="s-company" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[120px] lg:pb-[102px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="company-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="company-heading"
            className="mt-[26px] text-[36px] font-bold leading-none text-black sm:text-[44px] lg:text-[54px]"
          >
            {t.heading}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-10 lg:mt-[38px]">
          <dl data-probe="company-table">
            {t.rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col border-b border-hd-card-line py-[18px] sm:flex-row sm:pb-[21px] sm:pt-[26px]"
              >
                <dt className="text-[14px] leading-[20px] text-hd-eyebrow-ink sm:w-[300px] sm:shrink-0">
                  {row.label}
                </dt>
                <dd className="mt-1 text-[14px] font-medium leading-[20px] text-black sm:mt-0">
                  {Array.isArray(row.value)
                    ? row.value.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))
                    : row.value}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CompanySection;
