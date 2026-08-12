import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { footer, social } from "./content";
import { UnchainLogo } from "./Logo";
import { XIcon, MediumIcon, LinkedInIcon } from "./social";

/**
 * Footer — `public/home/Footer - Desktop.svg` (1440x430).
 *
 * A rounded panel inset 16px from the page edge, filled with the export's diagonal
 * #0A0A0A -> #273953 gradient (kept as SVG so the angle and stops stay exact),
 * a 1px #252B37 rule, then the legal row.
 *
 * The mobile exports inset the panel 8px and round it 12, keep the 24px padding, and
 * reflow the three columns into one: the logo, then the six links in a single 14px
 * column on a 36px pitch with the three 26px social buttons pinned to the right of the
 * first row. Under the rule the legal links centre and wrap, with the copyright
 * centred beneath them rather than opposite them.
 */
const GLYPHS = {
  x: XIcon,
  medium: MediumIcon,
  linkedin: LinkedInIcon,
} as const;

const SiteFooter = () => {
  const { lang, localePath } = useLang();
  const t = footer[lang];

  return (
    <footer data-nav-theme="light" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-2 py-2 sm:px-4 sm:py-4">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
          {/* Exact panel gradient from the export */}
          <svg
            viewBox="16 16 1408 398"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient
                id="unchain-footer-panel"
                x1="1278"
                y1="-43.8833"
                x2="1403.43"
                y2="419.112"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0A0A0A" />
                <stop offset="1" stopColor="#273953" />
              </linearGradient>
            </defs>
            <rect
              x="16"
              y="16"
              width="1408"
              height="398"
              fill="url(#unchain-footer-panel)"
            />
          </svg>

          <div className="relative px-6 pb-6 pt-6 sm:px-10 sm:pb-10 sm:pt-10 lg:px-10 lg:pb-[42px] lg:pt-10">
            {/* Design columns at 1440w: logo x=56, links x=565, social x=1074 — so 509 and
                509 of the 1328px measure, which is where the two 38.33% tracks come from.
                They are a share rather than a pixel width because the panel is as wide as
                the window below 1440: at 1024 a fixed 509+509 is wider than the measure
                itself and pushes the social icons out of the panel. */}
            <ScrollReveal className="lg:grid lg:grid-cols-[38.33%_38.33%_1fr] lg:gap-0">
              <Link
                to={localePath("/")}
                aria-label="UNCHAIN"
                className="inline-block lg:justify-self-start"
              >
                <UnchainLogo className="h-[31.4px] w-[141px] text-white" />
              </Link>

              {/* One row on mobile so the social buttons sit level with the first
                  link; `contents` hands both back to the grid from `lg`. */}
              <div className="mt-9 flex items-start justify-between gap-6 lg:contents">
                <nav className="grid grid-cols-1 gap-y-[22px] lg:mt-[4px] lg:grid-flow-col lg:grid-rows-3 lg:gap-x-12 lg:gap-y-[23px] lg:justify-self-start">
                  {t.links.map((link) => (
                    <Link
                      key={link.label}
                      to={localePath(link.href)}
                      className="text-[14px] leading-none text-white transition-opacity hover:opacity-70 lg:text-[16px]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <ul className="flex shrink-0 items-start gap-3 lg:gap-4 lg:justify-self-start">
                  {social.map((s) => {
                    const Glyph = GLYPHS[s.id];
                    return (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.label}
                          className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-80 lg:h-8 lg:w-8"
                        >
                          <Glyph />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>

            <div className="mt-8 h-px w-full bg-[#252B37] lg:mt-[43px]" />

            {/* Legal above the copyright, both centred, on mobile — the desktop puts
                them at opposite ends of one row. */}
            <div className="flex flex-col-reverse gap-9 pt-9 text-center text-[14px] leading-none text-white sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-[43px] sm:text-left">
              <p>{t.copyright}</p>
              <ul className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[21px] text-[12px] sm:gap-x-[33px] sm:gap-y-3 sm:text-[14px]">
                {t.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={localePath(link.href)}
                      className="transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
