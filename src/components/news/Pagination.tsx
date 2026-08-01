import { useLang } from "@/lib/language";
import { pager } from "./content";
import { pageItems } from "./pageItems";

/**
 * Pager — `public/news/Section.svg`, the six 50x50 hairline circles at y 2008.78 running
 * 530..910, centred on the 1440 canvas with a 16px gap.
 *
 * The export shows page 1 of 25 as `< 1 2 … 25 >`, with the previous arrow greyed to
 * #A4A7AE and every circle drawn identically — the design gives the current page no fill
 * or weight of its own, so neither does this. `aria-current` still marks it, which costs
 * nothing visually and keeps the control readable to a screen reader.
 */

const cell =
  "flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-hd-hairline text-[16px] leading-none text-black";

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={dir === "prev" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pagination = ({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
}) => {
  const { lang } = useLang();
  const t = pager[lang];
  if (total <= 1) return null;

  const step = (delta: number) => () => onPage(Math.min(total, Math.max(1, page + delta)));

  return (
    <nav data-probe="pager" className="flex items-center justify-center gap-4" aria-label={t.page}>
      <button
        type="button"
        onClick={step(-1)}
        disabled={page <= 1}
        aria-label={t.previous}
        className={`${cell} transition-colors enabled:hover:border-hd-chevron ${
          page <= 1 ? "cursor-not-allowed text-hd-eyebrow" : "text-hd-chevron"
        }`}
      >
        <Arrow dir="prev" />
      </button>

      {pageItems(page, total).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className={cell} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`${t.page} ${p}`}
            className={`${cell} transition-colors hover:border-hd-chevron`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={step(1)}
        disabled={page >= total}
        aria-label={t.next}
        className={`${cell} transition-colors enabled:hover:border-hd-chevron ${
          page >= total ? "cursor-not-allowed text-hd-eyebrow" : "text-hd-chevron"
        }`}
      >
        <Arrow dir="next" />
      </button>
    </nav>
  );
};

export default Pagination;
