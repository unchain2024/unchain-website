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
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl">
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

          <div className="relative px-6 pb-10 pt-10 sm:px-10 lg:px-10 lg:pb-[42px] lg:pt-10">
            {/* Design columns at 1440w: logo x=56, links x=565, social x=1074. */}
            <ScrollReveal className="grid gap-10 lg:grid-cols-[509px_509px_1fr] lg:gap-0">
              <Link
                to={localePath("/")}
                aria-label="UNCHAIN"
                className="justify-self-start"
              >
                <UnchainLogo className="h-[31.4px] w-[141px] text-white" />
              </Link>

              <nav className="flex flex-col gap-[23px] lg:mt-[4px] lg:justify-self-start">
                {t.links.map((link) => (
                  <Link
                    key={link.label}
                    to={localePath(link.href)}
                    className="text-[16px] leading-none text-white transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <ul className="flex items-start gap-4 lg:justify-self-start">
                {social.map((s) => {
                  const Glyph = GLYPHS[s.id];
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-80"
                      >
                        <Glyph />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>

            <div className="mt-10 h-px w-full bg-[#252B37] lg:mt-[43px]" />

            <div className="flex flex-col gap-4 pt-[43px] text-[14px] leading-none text-white sm:flex-row sm:items-center sm:justify-between">
              <p>{t.copyright}</p>
              <ul className="flex flex-wrap items-center gap-x-[33px] gap-y-3">
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
