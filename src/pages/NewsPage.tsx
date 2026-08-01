import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import NewsHero from "@/components/news/NewsHero";
import NewsList from "@/components/news/NewsList";
import ArticleView from "@/components/news/ArticleView";
import RelatedNews from "@/components/news/RelatedNews";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";
import { getLocalized, type Article } from "@/components/news/types";
import { article as articleCopy } from "@/components/news/content";
import { useLang } from "@/lib/language";
import { useAnnouncementVisible } from "@/lib/announcement";
import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  articleUrl,
  buildSlugIndex,
  resolveArticleBySlug,
} from "@/lib/articleLinks";

/**
 * News — the list view is built one-to-one from the design exports in `public/news`, in
 * the order they run down the page:
 *   Information banner + Navigation (both drawn by Navigation)
 *   -> Frame 2147226133 (the hero) -> Section (filters, card grid, pager)
 *   -> CTA Banner -> Footer
 *
 * The banner, navigation, CTA banner and footer exports are pixel-identical to the about
 * page's, so those components are reused rather than rebuilt. As on the about page the
 * navigation is its own 68px export sitting above the first section rather than over it,
 * so NewsHero reserves that height itself.
 *
 * The article view under `/news/:slug` is built the same way from the exports in
 * `public/news/pernews`, which run:
 *   Information banner + Navigation -> Frame 2147226133 (pill, title, meta row, cover
 *   and the body copy) -> Section (the related-news row) -> CTA Banner -> Footer
 *
 * Its banner, navigation and CTA banner exports are byte-identical to the list view's,
 * and its footer differs only in path rounding, so all four are the same components
 * again. ArticleView reserves the header height for the same reason NewsHero does.
 */
const heroText = {
  ja: {
    label: "ニュース＆インサイト",
    description:
      "プロダクトアップデート、ソートリーダーシップ、企業ニュースなど、チームからの最新情報をお届けします。",
  },
  en: {
    label: "NEWS & INSIGHTS",
    description:
      "The latest from our team — product updates, thought leadership, and company news.",
  },
};

// Generate a deterministic pastel color based on a string
export const getCategoryColor = (category: string) => {
  if (!category) return "bg-gray-100 text-gray-700 border-gray-200";
  if (category.toLowerCase() === "external") return "bg-amber-50 text-amber-700 border-amber-200";

  const colors = [
    "bg-red-50 text-red-700 border-red-200",
    "bg-orange-50 text-orange-700 border-orange-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-green-50 text-green-700 border-green-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-violet-50 text-violet-700 border-violet-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    "bg-pink-50 text-pink-700 border-pink-200",
    "bg-rose-50 text-rose-700 border-rose-200",
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  const i = Math.abs(hash) % colors.length;
  return colors[i];
};

const NewsPage = () => {
  const { lang, localePath } = useLang();
  const { slug } = useParams<{ slug?: string }>();
  const hero = heroText[lang];

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The detail view is driven entirely by the `:slug` route param, so every
  // article is deep-linkable and shareable.
  const slugIndex = useMemo(() => buildSlugIndex(articles), [articles]);
  const selectedArticle = useMemo(
    () => (slug ? resolveArticleBySlug(articles, slug) : null),
    [articles, slug]
  );
  const selectedSlug = selectedArticle
    ? slugIndex.get(selectedArticle.id) ?? selectedArticle.id
    : "";

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_draft", false)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── list view: the design in `public/news` ───────────────────────────── */
  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title={`${hero.label} | UNCHAIN`}
          description={hero.description}
          canonical={`${SITE_URL}${localePath("/news")}`}
          alternates={{ ja: `${SITE_URL}/news`, en: `${SITE_URL}/en/news` }}
        />
        <Navigation />
        <NewsHero />
        <NewsList articles={articles} slugIndex={slugIndex} loading={loading} error={error} />
        <CtaSection />
        <SiteFooter />
      </div>
    );
  }

  /* ── article view: the design in `public/news/pernews` ────────────── */
  const t = articleCopy[lang];
  const currentTitle = selectedArticle
    ? `${getLocalized(selectedArticle, "title", lang)} | UNCHAIN`
    : `${t.notFoundHeading} | UNCHAIN`;

  return (
    <div className="min-h-screen bg-background">
      {selectedArticle ? (
        <SEO
          title={currentTitle}
          description={getLocalized(selectedArticle, "description", lang)}
          type="article"
          image={selectedArticle.image_url}
          author={{ name: `${selectedArticle.author_first_name} ${selectedArticle.author_last_name}` }}
          datePublished={selectedArticle.created_at}
          canonical={articleUrl("news", selectedSlug, lang)}
          alternates={{
            ja: selectedArticle.title?.trim() ? articleUrl("news", selectedSlug, "ja") : undefined,
            en: selectedArticle.title_en?.trim() ? articleUrl("news", selectedSlug, "en") : undefined,
          }}
        />
      ) : (
        <SEO title={currentTitle} description={t.notFoundBody} />
      )}
      <Navigation />

      <div key={slug} className="animate-in fade-in duration-300">
        {loading || !selectedArticle ? (
          <ArticleFallback loading={loading} error={error} />
        ) : (
          <>
            <ArticleView article={selectedArticle} />
            <RelatedNews articles={articles} current={selectedArticle} slugIndex={slugIndex} />
          </>
        )}
      </div>

      <CtaSection />
      <SiteFooter />
    </div>
  );
};

/**
 * Loading and not-found, on the article section's own frame so the header, the CTA banner
 * and the footer stay where the design puts them while the row is being resolved.
 */
const ArticleFallback = ({ loading, error }: { loading: boolean; error: string | null }) => {
  const { lang, localePath } = useLang();
  const t = articleCopy[lang];
  const bannerVisible = useAnnouncementVisible();

  return (
    <section
      data-nav-theme="light"
      className={`w-full bg-white ${bannerVisible ? "pt-[108px]" : "pt-[68px]"}`}
    >
      <div className="mx-auto w-full max-w-[680px] px-6 py-32 text-center lg:px-0">
        {loading ? (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-hd-navy" aria-label={t.loading} />
        ) : (
          <>
            <p className="text-[24px] font-bold leading-[32px] text-black">
              {error ? t.failed : t.notFoundHeading}
            </p>
            <p className="mt-3 text-[16px] leading-[22px] text-hd-body-ink">
              {error || t.notFoundBody}
            </p>
            <Link
              to={localePath("/news")}
              className="group mt-8 inline-flex items-center gap-2 text-[16px] leading-[22px] text-hd-eyebrow-ink transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t.backToNews}
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsPage;
