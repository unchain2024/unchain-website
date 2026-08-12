import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { join } from "./content";
import { ChevronRight } from "./icons";
import JoinArt from "./art/JoinArt";
import join1 from "@/assets/home/join-1.webp";
import join2 from "@/assets/home/join-2.webp";
import join3 from "@/assets/home/join-3.webp";
import join4 from "@/assets/home/join-4.webp";
import join5 from "@/assets/home/join-5.webp";

/**
 * Join us — `public/home/Section-2.svg` (1440x797).
 *
 * Solid #314768 with the export's blurred #CAD4E6 glow and two white 6% blades.
 * The photo strip is 5 x 292x354 cards on a 16px gutter; the row is wider than the
 * canvas so it bleeds off both edges exactly as drawn.
 */
const SHOTS = [join1, join2, join3, join4, join5];

const JoinSection = () => {
  const { lang, localePath } = useLang();
  const t = join[lang];

  return (
    <section
      id="s-join"
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-hd-join"
    >
      <JoinArt className="pointer-events-none absolute inset-0 h-full w-full select-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pt-12 lg:px-[clamp(48px,8.3333vw,120px)] lg:pt-[122px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <ScrollReveal>
            <p className="font-mono text-[14px] leading-none text-hd-eyebrow-light">
              {t.eyebrow}
            </p>

            <h2 className="mt-[18px] text-[32px] font-bold leading-[1.0925926] text-white sm:text-[42px] lg:text-[clamp(38px,3.75vw,54px)]">
              {t.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* The mobile export wraps this to two lines at 16/23; the desktop draws
                it on one, which is why the leading only kicks in below `lg`. */}
            <p className="mt-[17px] text-[16px] leading-[23px] text-hd-eyebrow-light lg:leading-none">
              {t.body}
            </p>
          </ScrollReveal>

          <ScrollReveal
            delay={0.1}
            className="shrink-0 lg:mb-[-2px] lg:self-auto"
          >
            <Link
              to={localePath(t.cta.href)}
              className="flex h-[50px] w-full items-center justify-center gap-[15px] rounded-full bg-white text-[16px] leading-none text-black transition-opacity hover:opacity-90 lg:inline-flex lg:w-auto lg:pl-[14px] lg:pr-[25px]"
            >
              {t.cta.label}
              <ChevronRight className="text-hd-chevron" />
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Full-bleed photo strip, drifting left to right.

          The export draws one still row wider than the canvas; this keeps that row and
          puts it in motion, so the bleed at both edges is now where the strip comes from
          and goes to rather than a fixed crop.

          Two identical copies of SHOTS ride one track and the animation walks it from
          -50% to 0: at -50% the second copy sits exactly where the first one starts, so
          the wrap is invisible. The 16px gutter is a margin on every card rather than a
          flex `gap`, which is what makes half the track's width a whole number of cards —
          with `gap` it would be half a gutter short and the loop would jump. */}
      <ScrollReveal className="relative z-10 mt-20 overflow-hidden pb-4 lg:mt-[123px]">
        <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...SHOTS, ...SHOTS].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className="mr-4 h-[180.6px] w-[149px] shrink-0 rounded-lg bg-[#D9D9D9] object-cover lg:h-[354px] lg:w-[292px] lg:rounded-2xl"
            />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default JoinSection;
