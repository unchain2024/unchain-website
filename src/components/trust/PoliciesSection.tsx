import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { policies } from "./content";
import { ChevronRight } from "@/components/home/icons";
import { GlyphDocument } from "./art/Glyphs";

/**
 * Policies — `public/trust-security/Section-2.svg` (1440x726).
 *
 * White canvas on the 120px page gutter. Three 98px rows fill the 1200px measure, each with
 * a #E9EAEB rule along its bottom edge, a 20px document mark in a 36px #F5F5F5 disc, a 16px
 * label, and the site's own 6x12 chevron in a 50px #D5D7DA-outlined button on the right.
 *
 * The rows are the export's own boxes: 120..1320 across, 332..430, 430..528 and 528..626
 * down, so every row's contents centre on its 98px height rather than carrying offsets.
 */
const PoliciesSection = () => {
  const { lang, localePath } = useLang();
  const t = policies[lang];

  return (
    <section data-nav-theme="light" data-probe="s-policies" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pb-[100px] lg:pt-[102px]">
        <ScrollReveal>
          <p
            data-probe="policies-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="policies-heading"
            className="mt-[22.4px] text-[36px] font-bold leading-[1.11] tracking-[-0.006em] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)] lg:leading-[1.0925926]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </ScrollReveal>

        <ul data-probe="policies-list" className="mt-10 lg:mt-[75.6px]">
          {t.rows.map((row, i) => (
            <li key={row.id}>
              <ScrollReveal delay={i * 0.08}>
                <Link
                  to={localePath(row.href)}
                  data-probe={`policies-row-${row.id}`}
                  className="group flex items-center gap-3 border-b border-hd-card-line py-6 lg:min-h-[98px] lg:py-0"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hd-panel text-hd-chevron"
                  >
                    <GlyphDocument />
                  </span>

                  {/* Nudged 2px down: centred on the row, Noto Sans JP sets 16px ink
                      that much higher in the line box than the export's face does. */}
                  <span
                    data-probe={`policies-label-${row.id}`}
                    className="relative top-[2px] min-w-0 flex-1 text-[16px] leading-none text-black"
                  >
                    {row.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-hd-hairline text-hd-chevron transition-colors group-hover:bg-black/5"
                  >
                    {/* The shared glyph's viewBox is the path's own 6x12, so the outer
                        half of its 2px stroke falls outside the canvas and is clipped.
                        The export draws the full 8x14 ink, so let it overflow. */}
                    <ChevronRight className="overflow-visible" />
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PoliciesSection;
