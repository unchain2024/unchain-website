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

      {/* The mobile export keeps the section at the desktop's 700px and centres the
          same stack in it, on a 16px gutter rather than 24 — the copy is set to wrap
          across the full measure, so it is the one block on the page that runs wider
          than the 24px page gutter. */}
      <div className="relative z-10 mx-auto flex min-h-[700px] max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center lg:px-6 lg:py-0">
        <ScrollReveal className="flex w-full flex-col items-center">
          <p className="font-mono text-[14px] leading-none text-hd-eyebrow">
            {t.eyebrow}
          </p>

          <h2 className="mt-[21px] max-w-[1100px] text-[18px] font-bold leading-[25px] text-white lg:text-[28px] lg:leading-[38px]">
            {t.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <Link
            to={localePath(t.cta.href)}
            className="mt-11 flex h-[50px] w-full max-w-[345px] items-center justify-center gap-[14px] rounded-full border border-hd-hairline text-[16px] leading-none text-white transition-colors hover:bg-white/10 lg:mt-[41px] lg:w-auto lg:max-w-none lg:pl-[18px] lg:pr-[21px]"
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
