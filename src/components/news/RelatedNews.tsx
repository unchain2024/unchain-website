import { useMemo } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import NewsCard from "./NewsCard";
import { RELATED_COUNT, related } from "./content";
import type { Article } from "./types";

/**
 * The related-news row — `public/news/pernews/Section.svg` (1440x702).
 *
 * Back to the list section's 120px gutter: three 384px columns 24px apart at x 120 / 528
 * / 936, so the cards are the list page's `NewsCard` unchanged rather than a second copy
 * of the same drawing. The row's own chrome, in the export's coordinates:
 *
 *   heading   box 120.8,104.2 — 54/59.2 bold black, tracked -0.012em
 *   button    1162..1320 x 109..159, 158x50 rounded-full, 1px #D5D7DA, 16px label
 *   grid      images at y 219, 55.6px under the heading row
 *
 * Heading and button share a centre line (133.8 against 134), so the two sit in one
 * `items-center` row and the button keeps its right edge on the 120px gutter.
 *
 * One deliberate residual: the export puts the card dates at 585.7 on the first card and
 * 583.7 on the other two, where `NewsCard`'s pitch puts them at 584.8. The design's own
 * three cards disagree with each other by 2px there, so the shared component's spacing is
 * kept rather than forked to chase it.
 */
const RelatedNews = ({
  articles,
  current,
  slugIndex,
}: {
  articles: Article[];
  current: Article;
  slugIndex: Map<string, string>;
}) => {
  const { lang, localePath } = useLang();
  const t = related[lang];

  const items = useMemo(() => {
    const cats = new Set(
      (current.category ?? "")
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter((c) => c && c !== "external")
    );
    const shares = (a: Article) =>
      (a.category ?? "")
        .split(",")
        .some((c) => cats.has(c.trim().toLowerCase()));

    const pool = articles.filter((a) => {
      if (a.id === current.id) return false;
      // A row only shows on a locale it has been written for, as on the list page.
      return Boolean(lang === "ja" ? a.title?.trim() : a.title_en?.trim());
    });

    // Same category first, then the most recent of the rest; `articles` is already newest
    // first, so a stable partition is all the ordering this needs.
    return [...pool.filter(shares), ...pool.filter((a) => !shares(a))].slice(0, RELATED_COUNT);
  }, [articles, current, lang]);

  if (!items.length) return null;

  return (
    <section data-nav-theme="light" data-probe="s-related" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-16 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pb-[100.8px] lg:pt-[104.2px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.012em] text-black sm:text-[40px] lg:text-[clamp(38px,3.75vw,54px)] lg:leading-[1.0962963]">
            {t.heading}
          </h2>

          <Link
            to={localePath("/news")}
            data-probe="rel-button"
            className="inline-flex h-[50px] shrink-0 items-center justify-center self-start rounded-full border border-hd-hairline px-[15px] text-[16px] leading-none text-black transition-colors hover:border-hd-navy hover:text-hd-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-hd-navy focus-visible:ring-offset-2 sm:self-auto"
          >
            {t.viewAll}
          </Link>
        </div>

        <div
          data-probe="rel-grid"
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-[55.6px] lg:grid-cols-3"
        >
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={(i % 3) * 0.08} y={24} amount={0.15}>
              <NewsCard article={item} slug={slugIndex.get(item.id) ?? item.id} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedNews;
