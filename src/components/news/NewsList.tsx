import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import NewsCard from "./NewsCard";
import KindTabs from "./KindTabs";
import Pagination from "./Pagination";
import { PER_PAGE, list } from "./content";
import type { Article, ArticleKind } from "./types";

/**
 * The filters, the card grid and the pager — `public/news/Section.svg` (1440x2159).
 *
 * A 120px gutter rather than the 80px the hero and the other pages use, three 384px
 * columns with a 24px gutter, and rows on a 442.07px pitch. The export lays out four rows
 * of three, which is where the twelve-per-page in `content.ts` comes from.
 *
 * `articles` holds news and blog rows together; the tab row above the grid picks which of
 * the two is shown, starting on news.
 */
const NewsList = ({
  articles,
  slugIndex,
  loading,
  error,
}: {
  articles: Article[];
  slugIndex: Map<string, string>;
  loading: boolean;
  error: string | null;
}) => {
  const { lang } = useLang();
  const t = list[lang];

  const [kind, setKind] = useState<ArticleKind>("news");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        // A row only shows on a locale it has been written for.
        const hasJa = Boolean(article.title?.trim());
        const hasEn = Boolean(article.title_en?.trim());
        if (lang === "ja" ? !hasJa : !hasEn) return false;

        return article.kind === kind;
      }),
    [articles, kind, lang]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  // Switching tabs can leave the reader past the end of the new result set.
  useEffect(() => {
    setPage(1);
  }, [kind, lang]);
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section data-nav-theme="light" data-probe="s-list" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-16 sm:px-10 lg:px-[120px] lg:pb-[100.22px] lg:pt-[103px]">
        <KindTabs kind={kind} onKind={setKind} />

        <div data-probe="grid" className="mt-10 lg:mt-[60px]">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-hd-navy" aria-label={t.loading} />
            </div>
          ) : error ? (
            <p className="py-32 text-center text-[16px] text-hd-eyebrow-ink">{t.failed}</p>
          ) : !articles.length ? (
            <p className="py-32 text-center text-[16px] text-hd-eyebrow-ink">{t.empty}</p>
          ) : !filtered.length ? (
            // Nothing to reset now that the tab is the only choice — the other tab is the
            // way out, and it is right above this.
            <p className="py-32 text-center text-[16px] text-hd-eyebrow-ink">{t.noResults}</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-[62.27px]">
              {shown.map((article, i) => (
                <ScrollReveal key={article.id} delay={(i % 3) * 0.08} y={24} amount={0.15}>
                  <NewsCard article={article} slug={slugIndex.get(article.id) ?? article.id} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Gate on the page count, not on having results: `Pagination` renders nothing for
            a single page, and a wrapper around nothing would still add its 58.77px. */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-16 lg:mt-[58.77px]">
            <Pagination page={current} total={totalPages} onPage={goTo} />
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
