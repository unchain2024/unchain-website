/**
 * Slug + URL helpers for blog and news articles.
 *
 * Slugs are derived entirely in code — there is no `slug` column in Supabase and
 * nothing here writes to the database. An article's URL comes from its title,
 * or from an explicit entry in articleSlugOverrides.ts.
 *
 * This module is deliberately dependency-free (no React, no `@/` alias) because
 * it is imported both by the SPA and by the Vercel edge function in `api/og.ts`,
 * which injects per-article OGP tags. Both sides must agree on how a slug is
 * derived, or a link that renders in the browser would 404 for a crawler.
 */

// `.js`, not extensionless: this module is pulled into the `api/og.ts` edge function,
// which Vercel type-checks under `moduleResolution: node16` where the bare path is an
// error. The bundlers resolve it to the `.ts` file either way.
import { ARTICLE_SLUG_OVERRIDES } from "./articleSlugOverrides.js";

export const SITE_URL = "https://the-unchain.com";

export type ArticleSection = "blog" | "news";

/** The subset of an article row needed to build or resolve its URL. */
export interface SluggableArticle {
  id: string;
  title?: string | null;
  title_en?: string | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_RE.test(value);

/**
 * Turn a title into a URL-safe slug.
 *
 * Returns "" for input with no latin alphanumerics (e.g. a Japanese-only title);
 * callers are expected to fall back — see `getBaseSlug`.
 */
export const slugify = (input: string | null | undefined): string => {
  if (!input) return "";
  const cleaned = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/['‘’`"“”]/g, "") // drop quotes rather than turning them into separators
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return truncate(cleaned);
};

const MAX_SLUG_LENGTH = 80;

/** Clamp a slug, preferring to cut at a word boundary rather than mid-word. */
const truncate = (slug: string) => {
  if (slug.length <= MAX_SLUG_LENGTH) return slug;
  const cut = slug.slice(0, MAX_SLUG_LENGTH);
  const lastDash = cut.lastIndexOf("-");
  // Only back up to the boundary if that still leaves most of the slug intact,
  // so one very long word cannot shrink the result to nothing.
  const kept = lastDash > MAX_SLUG_LENGTH * 0.6 ? cut.slice(0, lastDash) : cut;
  return kept.replace(/-+$/g, "");
};

const normalize = (value: string) => {
  let out = value.trim();
  try {
    out = decodeURIComponent(out);
  } catch {
    /* malformed percent-encoding — match against the raw value */
  }
  return out.toLowerCase();
};

/** A hand-picked slug for this article, if one is pinned in articleSlugOverrides.ts. */
export const getSlugOverride = (article: SluggableArticle): string =>
  ARTICLE_SLUG_OVERRIDES[article.id]?.trim() ?? "";

/**
 * The slug an article derives from its own fields, ignoring every other article:
 *   1. a hand-picked override
 *   2. a slug from the English title (latin, so it slugifies cleanly)
 *   3. a slug from the Japanese title (catches romaji and latin product names)
 *   4. the raw id
 *
 * Japanese titles routinely reduce to a short latin fragment, so two of them can
 * easily collide. Use `buildSlugIndex` for anything user-facing; it disambiguates.
 */
export const getBaseSlug = (article: SluggableArticle): string =>
  getSlugOverride(article) ||
  slugify(article.title_en) ||
  slugify(article.title) ||
  article.id;

/**
 * Map every article id to a slug that is unique across the given set.
 *
 * Overrides are honoured exactly. Among the rest, when two articles derive the
 * same base slug *both* get an id discriminator appended rather than just the
 * later one — that keeps the result independent of array order, so a slug does
 * not silently change when the list is re-sorted. A derived slug that would
 * clash with an override also steps aside, so pinning a URL always wins.
 *
 * Publishing a new colliding article does change the existing one's derived URL,
 * which is why `resolveArticleBySlug` keeps the bare id and the undecorated base
 * slug resolvable forever — and why pinning anything you actively share is worth
 * the one-line entry in articleSlugOverrides.ts.
 */
export const buildSlugIndex = <T extends SluggableArticle>(
  articles: T[]
): Map<string, string> => {
  const index = new Map<string, string>();
  const taken = new Set<string>();

  // Pass 1: overrides win outright.
  for (const article of articles) {
    const override = getSlugOverride(article);
    if (!override) continue;
    index.set(article.id, override);
    taken.add(override.toLowerCase());
  }

  // Pass 2: count derived slugs so colliding pairs can both be discriminated.
  const counts = new Map<string, number>();
  for (const article of articles) {
    if (index.has(article.id)) continue;
    const base = getBaseSlug(article);
    counts.set(base, (counts.get(base) ?? 0) + 1);
  }

  for (const article of articles) {
    if (index.has(article.id)) continue;
    const base = getBaseSlug(article);
    const collides = (counts.get(base) ?? 0) > 1 || taken.has(base.toLowerCase());
    index.set(article.id, collides ? `${base}-${article.id.slice(0, 8)}` : base);
  }

  return index;
};

/** The canonical slug for one article within its set. */
export const getArticleSlug = <T extends SluggableArticle>(
  articles: T[],
  article: T
): string => buildSlugIndex(articles).get(article.id) ?? getBaseSlug(article);

/**
 * Find the article a `:slug` route param refers to.
 *
 * Tries, in order: the pinned override, the bare id, the disambiguated slug,
 * then the undecorated base slug. The last two fallbacks are what keep older
 * links working after a title edit or a newly published collision.
 */
export const resolveArticleBySlug = <T extends SluggableArticle>(
  articles: T[],
  param: string | undefined
): T | null => {
  if (!param) return null;
  const needle = normalize(param);
  if (!needle) return null;

  const byOverride = articles.find((a) => getSlugOverride(a).toLowerCase() === needle);
  if (byOverride) return byOverride;

  const byId = articles.find((a) => a.id?.toLowerCase() === needle);
  if (byId) return byId;

  const index = buildSlugIndex(articles);
  const byIndexed = articles.find((a) => index.get(a.id)?.toLowerCase() === needle);
  if (byIndexed) return byIndexed;

  return articles.find((a) => getBaseSlug(a).toLowerCase() === needle) ?? null;
};

/** Site-relative path to an article, e.g. `/en/blog/recap-ai-world-2026-summer-tokyo`. */
export const articlePath = (
  section: ArticleSection,
  slug: string,
  lang: "ja" | "en" = "ja"
): string => {
  const path = `/${section}/${encodeURIComponent(slug)}`;
  return lang === "en" ? `/en${path}` : path;
};

/** Absolute URL to an article — used for canonical, og:url and hreflang tags. */
export const articleUrl = (
  section: ArticleSection,
  slug: string,
  lang: "ja" | "en" = "ja"
): string => `${SITE_URL}${articlePath(section, slug, lang)}`;
