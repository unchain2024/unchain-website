import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { business } from "./content";
import { ChevronRight } from "./icons";
import { NeuronLogo } from "./Logo";
import neuronShot from "@/assets/home/business-neuron.webp";
import advisorShot from "@/assets/home/business-advisor.webp";

/**
 * Business — `public/home/Section.svg` (1440x743).
 *
 * A #F5F5F5 rounded panel inset 16px from the page edge, 100px of padding, then a
 * two-row list. The first row sits on a white card with the export's drop shadow
 * (dy 10, stdDeviation 10, black @4%); the second row is the resting state.
 *
 * The thumbnails are cropped exactly as the SVG patterns crop them — the design
 * zooms past `cover`, so the scale/offset is reproduced with background-size and
 * background-position rather than object-fit.
 *
 * `public/mobile/Home Page - Mobile.svg` insets the panel 8px instead of 16 and rounds
 * it 12, drops the padding to 24, and turns each row into a stack: a full-measure
 * 329x225 thumbnail, then the title, then the copy — with the 35px chevron pulled out
 * to the right and centred on the text block. Neither row carries the desktop's white
 * "active" card, so both are drawn in the resting state.
 */
const CROPS: Record<string, React.CSSProperties> = {
  neuron: {
    backgroundImage: `url(${neuronShot})`,
    backgroundSize: "179.451% 144.781%",
    backgroundPosition: "82.69% 34.64%",
  },
  advisor: {
    backgroundImage: `url(${advisorShot})`,
    backgroundSize: "138.941% 134.695%",
    backgroundPosition: "62.25% 63.66%",
  },
};

const BusinessSection = () => {
  const { lang, localePath } = useLang();
  const t = business[lang];

  return (
    <section id="s-business" data-nav-theme="light" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-2 pb-2 pt-10 sm:px-4 sm:pb-4 lg:pt-10">
        <div className="rounded-xl bg-hd-panel px-6 py-12 sm:rounded-2xl sm:px-10 lg:px-[clamp(32px,6.9444vw,100px)] lg:pb-[100px] lg:pt-[102px]">
          <ScrollReveal>
            <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
              {t.eyebrow}
            </p>

            <h2 className="mt-5 text-[32px] font-bold leading-none text-black sm:text-[44px] lg:mt-[25px] lg:text-[clamp(38px,3.75vw,54px)]">
              {t.heading}
            </h2>
          </ScrollReveal>

          <ul className="mt-8 space-y-9 lg:mt-[58px] lg:space-y-6">
            {t.items.map((item, i) => {
              const active = i === 0;
              return (
                <li key={item.id}>
                  <ScrollReveal delay={i * 0.08}>
                    <Link
                      to={localePath(item.href)}
                      className={`group flex flex-col gap-4 rounded-2xl transition-shadow sm:flex-row sm:items-center sm:gap-[25px] sm:p-4 lg:pr-9 ${
                        active
                          ? "sm:bg-white sm:shadow-[0_10px_20px_rgba(0,0,0,0.04)]"
                          : "sm:hover:bg-white/60"
                      }`}
                    >
                      <div
                        role="presentation"
                        style={CROPS[item.id]}
                        className="aspect-[329/225] w-full shrink-0 rounded-xl bg-[#D9D9D9] bg-no-repeat sm:aspect-auto sm:h-[123px] sm:w-[189px] sm:rounded-[10px]"
                      />

                      {/* On mobile the chevron sits beside the text block rather than
                          after it, so title and copy share a row with it. */}
                      <div className="flex items-center gap-4 sm:contents">
                        <div className="min-w-0 flex-1">
                          {item.logo ? (
                            <NeuronLogo className="h-[24px] w-[87px] text-black sm:h-[31px] sm:w-[112px]" />
                          ) : (
                            <p className="text-[16px] font-semibold leading-none text-black sm:text-[20px] lg:text-[22px]">
                              {item.title}
                            </p>
                          )}
                          <p className="mt-[18px] text-[14px] leading-[20px] text-hd-eyebrow-ink sm:mt-[20px] sm:text-[16px] sm:leading-none">
                            {item.body}
                          </p>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full sm:h-[50px] sm:w-[50px] ${
                            active
                              ? "border border-hd-hairline text-hd-chevron sm:border-0 sm:bg-black sm:text-white"
                              : "border border-hd-hairline text-hd-chevron"
                          }`}
                        >
                          <ChevronRight className="h-[10px] w-[5px] sm:h-3 sm:w-1.5" />
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
