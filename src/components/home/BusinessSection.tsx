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
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-4 pt-6 lg:pt-10">
        <div className="rounded-2xl bg-hd-panel px-6 py-16 sm:px-10 lg:px-[clamp(32px,6.9444vw,100px)] lg:pb-[100px] lg:pt-[102px]">
          <ScrollReveal>
            <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
              {t.eyebrow}
            </p>

            <h2 className="mt-[25px] text-[36px] font-bold leading-none text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]">
              {t.heading}
            </h2>
          </ScrollReveal>

          <ul className="mt-10 space-y-6 lg:mt-[58px]">
            {t.items.map((item, i) => {
              const active = i === 0;
              return (
                <li key={item.id}>
                  <ScrollReveal delay={i * 0.08}>
                    <Link
                      to={localePath(item.href)}
                      className={`group flex flex-col gap-5 rounded-2xl p-4 transition-shadow sm:flex-row sm:items-center sm:gap-[25px] lg:pr-9 ${
                        active
                          ? "bg-white shadow-[0_10px_20px_rgba(0,0,0,0.04)]"
                          : "hover:bg-white/60"
                      }`}
                    >
                      <div
                        role="presentation"
                        style={CROPS[item.id]}
                        className="h-[123px] w-full shrink-0 rounded-[10px] bg-[#D9D9D9] bg-no-repeat sm:w-[189px]"
                      />

                      <div className="min-w-0 flex-1">
                        {item.logo ? (
                          <NeuronLogo className="h-[31px] w-[112px] text-black" />
                        ) : (
                          <p className="text-[20px] font-semibold leading-none text-black lg:text-[22px]">
                            {item.title}
                          </p>
                        )}
                        <p className="mt-[20px] text-[16px] leading-none text-hd-eyebrow-ink">
                          {item.body}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full ${
                          active
                            ? "bg-black text-white"
                            : "border border-hd-hairline text-hd-chevron"
                        }`}
                      >
                        <ChevronRight />
                      </span>
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
