import { useLang } from "@/lib/language";
import { kinds } from "./content";
import type { ArticleKind } from "./types";

/**
 * The news / blog switch, in place of the export's pair of 570x50 dropdowns.
 *
 * The design filters on language and category through two selects, but the list only ever
 * holds the two kinds and a row already only shows on a locale it was written for — so the
 * language select filtered nothing a reader could see, and the category one is a choice
 * between two. Both collapse into two chips, one of which is always on: the section shows
 * news or blogs, never a mix, so the chip row doubles as the heading for what is below.
 *
 * The chips are the career page's department chips — same 50px pill, same black-on-selected
 * — because they do the same job and the news export draws no control of this kind.
 */
const TABS: ArticleKind[] = ["news", "blog"];

const KindTabs = ({
  kind,
  onKind,
}: {
  kind: ArticleKind;
  onKind: (k: ArticleKind) => void;
}) => {
  const { lang } = useLang();
  const k = kinds[lang];

  return (
    <div role="tablist" className="flex flex-wrap gap-4">
      {TABS.map((tab) => {
        const on = tab === kind;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onKind(tab)}
            data-probe={`kind-tab-${tab}`}
            className={`h-[50px] rounded-full border px-[25px] text-[16px] leading-none transition-colors ${
              on
                ? "border-black bg-black text-white"
                : "border-hd-hairline text-black hover:border-hd-chevron"
            }`}
          >
            {k[tab]}
          </button>
        );
      })}
    </div>
  );
};

export default KindTabs;
