import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { cta } from "./content";
import { ChevronRight } from "./icons";
import { UnchainMark } from "./Logo";
import CtaArt from "./art/CtaArt";

/**
 * CTA banner — `public/home/CTA Banner - Desktop.svg` (1440x597).
 *
 * White canvas, centred stack, and the two 80% gradient blades from the export
 * bleeding in from the left and right edges.
 */
const CtaSection = () => {
  const { lang, localePath } = useLang();
  const t = cta[lang];

  return (
    <section
      id="s-cta"
      data-nav-theme="light"
      className="relative w-full overflow-hidden bg-white"
    >
      <CtaArt className="pointer-events-none absolute inset-0 h-full w-full select-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 py-24 text-center lg:h-[597px] lg:py-0 lg:pt-[118px]">
        <ScrollReveal className="flex flex-col items-center">
          <UnchainMark className="h-[75px] w-[64px] text-[#0A0A0A]" />

          <h2 className="mt-[41px] text-[34px] font-bold leading-[1.13] text-black sm:text-[44px] lg:text-[54px] lg:leading-[60px]">
            {t.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-[15px] text-[16px] leading-none text-black">
            {t.body}
          </p>

          <div className="mt-[41px] flex flex-wrap items-center justify-center gap-4">
            <Link
              to={localePath(t.primary.href)}
              className="inline-flex h-[50px] items-center gap-[14px] rounded-full bg-black pl-[17px] pr-[23px] text-[16px] leading-none text-white transition-opacity hover:opacity-90"
            >
              {t.primary.label}
              <ChevronRight className="text-white" />
            </Link>

            <Link
              to={localePath(t.secondary.href)}
              className="inline-flex h-[50px] items-center rounded-full border border-hd-hairline px-[17px] text-[16px] leading-none text-black transition-colors hover:bg-black/5"
            >
              {t.secondary.label}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CtaSection;
