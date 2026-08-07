import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { dei } from "./content";
import { IconDiversity, IconEquity, IconInclusion } from "./art/DeiArt";

/**
 * Diversity, equity & inclusion — `public/about/Section-4.svg` (1440x725).
 *
 * A dark panel inset 16px from the page edge, everything centred. The three columns are
 * 435.75px on centre (284.5 / 720 / 1155.75) with a 335px text measure, which is a 50px
 * inset inside the panel.
 *
 * The panel's fill is the export's own gradient. Figma writes it as a line from
 * (1278, -88.27) to (1611.9, 619.56) in page coordinates, which crosses the panel at
 * 154.75deg and reaches its first stop 36.18% of the way across it — see
 * `node tools/design/gradient_css.mjs "public/about/Section-4.svg" paint0_linear_123_1671 16 16 1408 693`.
 */
const ICONS = {
  diversity: { Art: IconDiversity, size: "h-[121px] w-[121px]" },
  equity: { Art: IconEquity, size: "h-[120px] w-[119px]" },
  inclusion: { Art: IconInclusion, size: "h-[117.52px] w-[117.52px]" },
} as const;

const DeiSection = () => {
  const { lang } = useLang();
  const t = dei[lang];

  return (
    <section data-nav-theme="dark" data-probe="s-dei" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] p-4">
        <div className="rounded-2xl bg-[linear-gradient(154.75deg,#0A0A0A_36.18%,#273953_99.94%)] px-6 py-16 text-center sm:px-10 lg:px-[clamp(24px,3.4722vw,50px)] lg:pb-[99.8px] lg:pt-[101.3px]">
          <ScrollReveal>
            <p
              data-probe="dei-eyebrow"
              className="font-mono text-[14px] leading-none text-hd-eyebrow-light"
            >
              {t.eyebrow}
            </p>

            <h2
              data-probe="dei-heading"
              className="mx-auto mt-[23px] max-w-[1100px] text-[32px] font-bold leading-[1.11] text-white sm:text-[42px] lg:text-[clamp(38px,3.75vw,54px)] lg:leading-[1.0925926]"
            >
              {t.heading}
            </h2>
          </ScrollReveal>

          <ul className="mt-16 grid gap-12 sm:grid-cols-3 lg:mt-[143.3px] lg:gap-0">
            {t.items.map((item, i) => {
              const { Art, size } = ICONS[item.id as keyof typeof ICONS];
              return (
                <li key={item.id}>
                  <ScrollReveal delay={i * 0.08}>
                    {/* The three glyphs are not a uniform box; they share a top edge. */}
                    <div className="flex h-[121px] items-start justify-center">
                      <Art className={`select-none ${size}`} />
                    </div>

                    <h3
                      data-probe={`dei-title-${item.id}`}
                      className="mt-[58.7px] text-[20px] font-bold leading-none text-white"
                    >
                      {item.title}
                    </h3>

                    <p className="mx-auto mt-[12.5px] max-w-[335px] text-[14px] leading-[20px] text-hd-eyebrow-light">
                      {item.body}
                    </p>
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

export default DeiSection;
