import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { about } from "./content";
import { ChevronRight } from "./icons";
import AboutArt from "./art/AboutArt";

/**
 * About — `public/home/Section (Original).svg` (1440x700).
 *
 * Background gradient and the four corner blades are taken verbatim from the
 * export: #000 -> #283756 @32.35% -> #768DAF @75% -> #fff.
 */
const AboutSection = () => {
  const { lang, localePath } = useLang();
  const t = about[lang];

  return (
    <section
      id="s-about" data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#283756_32.3488%,#768DAF_75%,#FFFFFF_100%)]"
    >
      <AboutArt className="pointer-events-none absolute inset-0 h-full w-full select-none" />

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1440px] flex-col items-center justify-center px-6 py-24 text-center lg:h-[700px] lg:py-0">
        <ScrollReveal className="flex flex-col items-center">
          <p className="font-mono text-[14px] leading-none text-hd-eyebrow">
            {t.eyebrow}
          </p>

          <h2 className="mt-[21px] max-w-[1100px] text-[20px] font-bold leading-[1.36] text-white sm:text-[24px] lg:text-[28px] lg:leading-[38px]">
            {t.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <Link
            to={localePath(t.cta.href)}
            className="mt-[41px] inline-flex h-[50px] items-center gap-[14px] rounded-full border border-hd-hairline pl-[18px] pr-[21px] text-[16px] leading-none text-white transition-colors hover:bg-white/10"
          >
            {t.cta.label}
            <ChevronRight className="text-white" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
