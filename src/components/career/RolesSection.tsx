import { useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { lineGap } from "@/lib/headingLines";
import { ChevronRight } from "@/components/home/icons";
import { roles, type DeptKey } from "./content";
import { MapPin } from "./icons";
import ApplyPanel from "./ApplyPanel";

/**
 * Open positions — `public/carrers/Section-1.svg` (1440x982).
 *
 * A #F5F5F5 panel inset 16px from the page edge, its content on a 100px gutter inside that
 * (so 116 from the page edge, a 1208px measure). Under the heading sit the five department
 * chips — 50px tall, 16px apart, the selected one solid black and the rest on the export's
 * #D5D7DA hairline — and then the roles on a 122px pitch: 98px rows, 24px apart.
 *
 * A row is drawn twice in the export: the first one white on a 16px radius with Figma's
 * `dy 10 / blur 10 / black 4%` shadow and a solid black arrow button, the other three
 * transparent with a hairline button. That is one row in two states, so the white plate is
 * the row's hover and focus state rather than a fixed style on the first row.
 *
 * Chip and department-pill borders are the exports' gradients, kept as CSS rather than
 * generated art because they are borders on live controls:
 *   node tools/design/gradient_css.mjs "public/carrers/Section-1.svg" paint0_linear_135_2383 148.5 437 110 28
 *
 * The rows are the one thing on the page the design does not fix in place — they are the
 * openings — so they come from `content.ts` like the rest of the copy, and clicking one
 * opens the application form (see `ApplyPanel`).
 */

/* The department pill's 1px gradient border: white plate inside, the export's paint on the
   border box itself. */
const PILL_BORDER =
  "border border-transparent [background:linear-gradient(#ffffff,#ffffff)_padding-box,linear-gradient(359.78deg,#0E3067_10.35%,#A2BFEE_118.59%)_border-box]";

const RolesSection = () => {
  const { lang } = useLang();
  const t = roles[lang];

  const [dept, setDept] = useState<DeptKey>("all");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const shown = dept === "all" ? t.items : t.items.filter((r) => r.dept === dept);
  const applyingRole = t.items.find((r) => r.id === applyingTo);

  const openApply = (id: string) => {
    setApplyingTo(id);
    // Let the panel mount before scrolling to it.
    window.setTimeout(
      () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80
    );
  };

  return (
    <section data-nav-theme="light" data-probe="s-roles" className="w-full bg-white">
      {/* The mobile export insets the panel 8px, rounds it 12 and pads it 24. */}
      <div className="mx-auto w-full max-w-[1440px] p-2 sm:p-4">
        <div className="rounded-xl bg-hd-panel px-6 py-12 sm:rounded-2xl sm:px-10 lg:px-[clamp(32px,6.9444vw,100px)] lg:pb-[100px] lg:pt-[101px]">
          <ScrollReveal>
            <p
              data-probe="roles-eyebrow"
              className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
            >
              {t.eyebrow}
            </p>

            <h2
              data-probe="roles-heading"
              className="mt-[22.7px] text-[32px] font-bold leading-[1.0925926] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)]"
            >
              {t.heading.map((line, i) => (
                <span key={line} className="lg:block">
                  {lineGap(t.heading[i - 1])}
                  {line}
                </span>
              ))}
            </h2>
          </ScrollReveal>

          {/* ── Department chips ─────────────────────────────────────────────── */}
          {/* The mobile export draws them 35px tall on a single row that runs past the
              panel's right edge, so below `sm` the row scrolls instead of wrapping. The
              negative margins let it bleed to the panel edge the way the export does. */}
          <ScrollReveal
            delay={0.05}
            className="-mx-6 mt-6 flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-8 sm:flex-wrap sm:gap-4 sm:overflow-visible sm:px-0 lg:mt-[20.3px]"
          >
            {t.filters.map((f) => {
              const on = f.key === dept;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDept(f.key as DeptKey)}
                  data-probe={`roles-chip-${f.key}`}
                  className={`h-[36px] shrink-0 whitespace-nowrap rounded-full border px-[15px] text-[14px] leading-none transition-colors sm:h-[50px] sm:text-[16px] ${
                    on
                      ? "border-black bg-black text-white"
                      : "border-hd-hairline text-black hover:border-hd-chevron"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </ScrollReveal>

          {/* ── The rows ─────────────────────────────────────────────────────── */}
          {/* Rows sit on a 149px pitch on mobile, closed off by the export's #D5D7DA
              hairline rather than the desktop's white hover plate. */}
          <ul data-probe="roles-list" className="mt-12 sm:mt-10 sm:space-y-6 lg:mt-[60px]">
            {shown.map((role, i) => (
              <li
                key={role.id}
                className={
                  i === 0
                    ? ""
                    : "border-t border-hd-hairline pt-[21px] sm:border-0 sm:pt-0"
                }
              >
                <ScrollReveal delay={i * 0.05}>
                  <button
                    type="button"
                    onClick={() => openApply(role.id)}
                    aria-label={`${role.title} — ${t.open}`}
                    data-probe={`roles-row-${role.id}`}
                    className="group flex w-full items-center gap-4 rounded-2xl pb-[21px] text-left outline-none transition-[background-color,box-shadow] sm:px-6 sm:py-6 sm:pb-6 sm:hover:bg-white sm:hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.04)] sm:focus-visible:bg-white sm:focus-visible:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.04)] lg:min-h-[98px] lg:gap-0 lg:py-0 lg:pl-[32.5px] lg:pr-8"
                  >
                    {/* 223.5 + 561 + 309 across the row's 1093.5px measure — the pill's
                        column, the title's, and the location filling what is left. Held as
                        shares of that measure, since the row is narrower than 1093.5 below
                        1440. Stacked below lg, where the export draws nothing. */}
                    <span className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
                      <span className="lg:w-[20.4389%] lg:shrink-0">
                        <span
                          data-probe={`roles-badge-${role.id}`}
                          className={`inline-flex h-7 items-center rounded-full px-4 text-[14px] leading-none text-black ${PILL_BORDER}`}
                        >
                          {role.badge}
                        </span>
                      </span>

                      {/* The 4px top margin is what centres the title's *ink* the way the
                          export does rather than its line box: with `items-center` the extra
                          margin is split, dropping the box the 2px that puts the ink on the
                          export's own 443.8. */}
                      <span
                        data-probe={`roles-title-${role.id}`}
                        className="text-[16px] font-bold leading-[20px] text-black sm:text-[18px] sm:leading-none lg:mt-[4px] lg:w-[51.3037%] lg:shrink-0 lg:text-[20px]"
                      >
                        {role.title}
                      </span>

                      <span
                        data-probe={`roles-location-${role.id}`}
                        className="flex items-center gap-2 text-[14px] leading-none text-hd-body-ink lg:flex-1"
                      >
                        <MapPin className="shrink-0" />
                        {role.location}
                      </span>
                    </span>

                    <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full border border-hd-hairline text-hd-chevron transition-colors sm:h-[50px] sm:w-[50px] sm:group-hover:border-black sm:group-hover:bg-black sm:group-hover:text-white sm:group-focus-visible:border-black sm:group-focus-visible:bg-black sm:group-focus-visible:text-white">
                      <ChevronRight className="h-[10px] w-[5px] sm:h-3 sm:w-1.5" />
                    </span>
                  </button>
                </ScrollReveal>
              </li>
            ))}
          </ul>

          {!shown.length && (
            <p className="mt-[60px] text-[16px] leading-[22px] text-hd-eyebrow-ink">{t.empty}</p>
          )}

          {applyingRole && (
            <div ref={panelRef}>
              <ApplyPanel role={applyingRole.title} onClose={() => setApplyingTo(null)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
