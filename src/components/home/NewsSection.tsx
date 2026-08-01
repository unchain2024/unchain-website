import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { supabase } from "@/lib/supabase";
import { buildSlugIndex, type SluggableArticle } from "@/lib/articleLinks";
import NewsCard from "@/components/news/NewsCard";
import type { Article } from "@/components/news/types";
import { news } from "./content";

/**
 * News — `public/home/Section-1.svg` (1440x736).
 *
 * The three latest published articles, in the same 384x243.07 card the news page
 * uses: the home and news designs draw an identical card, so this renders the
 * shared `NewsCard` rather than a second copy of it. Only the section's own
 * chrome (eyebrow, heading, "all news" button) is hardcoded per language.
 *
 * Slugs are built from *every* published article, not just the three shown here.
 * `buildSlugIndex` disambiguates colliding titles against the whole set, so an
 * index built from a 3-row slice could hand out a different URL than the news
 * page does for the same article.
 */
const NewsSection = () => {
  const { lang, localePath } = useLang();
  const t = news[lang];
  const [items, setItems] = useState<Article[]>([]);
  const [sluggable, setSluggable] = useState<SluggableArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Two small reads rather than one large one: the slug index only needs
        // titles, so the full rows stay limited to the three cards on screen.
        const [latest, all] = await Promise.all([
          supabase
            .from("articles")
            .select("*")
            .eq("is_draft", false)
            .eq("is_hidden", false)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("articles")
            .select("id, title, title_en")
            .eq("is_draft", false)
            .eq("is_hidden", false),
        ]);

        if (latest.error) throw latest.error;
        if (all.error) throw all.error;

        if (mounted) {
          setItems(latest.data || []);
          setSluggable(all.data || []);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const slugIndex = useMemo(() => buildSlugIndex(sluggable), [sluggable]);

  return (
    <section id="s-news" data-nav-theme="light" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-[120px] lg:pb-[106px] lg:pt-[102px]">
        <ScrollReveal>
          <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
            {t.eyebrow}
          </p>

          <div className="mt-[28px] flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-[36px] font-bold leading-none text-black sm:text-[44px] lg:text-[54px]">
              {t.heading}
            </h2>

            <Link
              to={localePath(t.cta.href)}
              className="inline-flex h-[50px] items-center rounded-full border border-hd-hairline px-[16px] text-[16px] leading-none text-black transition-colors hover:bg-black/5"
            >
              {t.cta.label}
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-[55px] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => (
                <div key={i} aria-hidden="true">
                  <div className="aspect-[384/243.07] w-full animate-pulse rounded-2xl bg-hd-panel" />
                  <div className="mt-[16.5px] h-7 w-[90px] animate-pulse rounded-full bg-hd-panel" />
                  <div className="mt-[13.83px] h-[44px] animate-pulse rounded bg-hd-panel" />
                  <div className="mt-[20.4px] h-[14px] w-[80px] animate-pulse rounded bg-hd-panel" />
                </div>
              ))
            : items.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 0.08}>
                  <NewsCard
                    article={article}
                    slug={slugIndex.get(article.id) ?? article.id}
                  />
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
