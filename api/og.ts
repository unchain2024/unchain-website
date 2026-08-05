/**
 * Per-article OGP injection for /news/:slug, and for the /blog/:slug URLs that now
 * redirect into it.
 *
 * The site is a client-rendered Vite SPA, so the <meta> tags react-helmet-async
 * writes only exist after JavaScript runs. Link-preview crawlers (Slack, X,
 * Facebook, LINE, Discord) do not run JavaScript — they would only ever see the
 * static tags in index.html, so every article shared anywhere looked identical.
 *
 * This edge function serves the same index.html shell with the article's real
 * title, description and image already in the <head>. The SPA still boots and
 * takes over normally, so humans see no difference.
 *
 * Wired up by the rewrites in vercel.json.
 */

import {
  SITE_URL,
  buildSlugIndex,
  resolveArticleBySlug,
  type SluggableArticle,
} from "../src/lib/articleLinks";

export const config = { runtime: "edge" };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const DEFAULT_IMAGE = `${SITE_URL}/logo-black.webp`;
const VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?|#|$)/i;

interface ArticleRow extends SluggableArticle {
  description?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  author_first_name?: string | null;
  author_last_name?: string | null;
}

/** Columns we need for meta tags. Slugs are derived in code, not stored. */
const COLUMNS =
  "id,title,title_en,description,description_en,image_url,created_at,author_first_name,author_last_name";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Collapse newlines and clamp, so a description reads well in a preview card. */
const clamp = (value: string, max = 200) => {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

const pick = (primary: string | null | undefined, fallback: string | null | undefined) => {
  const p = primary?.trim();
  if (p) return p;
  return fallback?.trim() || "";
};

/** Fetch published rows. Read-only: this function never writes to Supabase. */
async function fetchArticles(table: string): Promise<ArticleRow[] | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const endpoint =
    `${SUPABASE_URL}/rest/v1/${table}` +
    `?select=${COLUMNS}&is_draft=eq.false&is_hidden=eq.false&order=created_at.desc`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as ArticleRow[];
  } catch {
    return null;
  }
}

/**
 * Both tables as one list, newest first.
 *
 * Blogs were folded into the news section, so a `/news/:slug` can be either kind and both
 * have to be searched. It matters that this is the same corpus `NewsPage` merges, because
 * `buildSlugIndex` disambiguates against whatever set it is given — resolving against one
 * table alone could hand back a different slug than the one the page links to.
 *
 * Two separately sorted lists concatenated are not sorted, hence the re-sort. If only one
 * table answers, serve what there is rather than nothing.
 *
 * Ids are deduplicated, news winning, because `buildSlugIndex` treats a repeated row as a
 * collision and would discriminate both copies — quietly changing a live URL. That cannot
 * happen while the tables are disjoint, but a row copied from one to the other during a
 * content migration is exactly the kind of thing that would otherwise break silently.
 */
async function fetchCorpus(): Promise<ArticleRow[] | null> {
  const [news, blogs] = await Promise.all([fetchArticles("articles"), fetchArticles("blogs")]);
  if (!news && !blogs) return null;
  return dedupeById([...(news ?? []), ...(blogs ?? [])]).sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
}

const dedupeById = <T extends { id: string }>(rows: T[]): T[] => {
  const seen = new Set<string>();
  return rows.filter((row) => !seen.has(row.id) && seen.add(row.id));
};

function buildMetaTags(opts: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedTime?: string;
  author?: string;
  alternates: { ja?: string; en?: string };
}) {
  const { title, description, image, url, publishedTime, author, alternates } = opts;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:site_name" content="UNCHAIN" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ];

  if (publishedTime) {
    tags.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`);
  }
  if (author) {
    tags.push(`<meta property="article:author" content="${escapeHtml(author)}" />`);
  }
  if (alternates.ja) {
    tags.push(`<link rel="alternate" hreflang="ja" href="${escapeHtml(alternates.ja)}" />`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(alternates.ja)}" />`);
  }
  if (alternates.en) {
    tags.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(alternates.en)}" />`);
  }

  return tags.join("\n    ");
}

/** Drop the generic tags baked into index.html so ours are the only ones present. */
function stripDefaultMeta(html: string) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "");
}

export default async function handler(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  // `section` is still passed by the rewrites but no longer changes anything: both
  // sections read one merged corpus and both canonicalise to /news/:slug.
  const slugParam = requestUrl.searchParams.get("slug") || "";
  const lang = requestUrl.searchParams.get("lang") === "en" ? "en" : "ja";

  // The static shell. `rewrites` only fire when no file matches, so requesting
  // /index.html hits the built asset directly rather than looping back here.
  const shellResponse = await fetch(`${requestUrl.protocol}//${requestUrl.host}/index.html`);
  if (!shellResponse.ok) return shellResponse;
  const shell = await shellResponse.text();

  const serveShell = (status: number) =>
    new Response(lang === "en" ? shell.replace('<html lang="ja"', '<html lang="en"') : shell, {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=60",
      },
    });

  const rows = await fetchCorpus();
  // Supabase unreachable or unconfigured: still serve the app, just without
  // enriched tags. Never let a metadata problem take the page down.
  if (!rows) return serveShell(200);

  const article = resolveArticleBySlug(rows, slugParam);
  if (!article) return serveShell(404);

  const title =
    lang === "en"
      ? pick(article.title_en, article.title)
      : pick(article.title, article.title_en);
  const description =
    lang === "en"
      ? pick(article.description_en, article.description)
      : pick(article.description, article.description_en);

  const rawImage = article.image_url?.trim();
  const image =
    rawImage && !VIDEO_RE.test(rawImage)
      ? rawImage.startsWith("http")
        ? rawImage
        : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : DEFAULT_IMAGE;

  // Canonicalise: reaching the article by its id still advertises the readable slug — and
  // now also its section, since /blog/:slug is a redirect into /news/:slug. A crawler that
  // arrives on an old blog URL is told the news one is canonical, which is the point of
  // keeping those URLs alive rather than dropping them.
  const canonicalSlug = buildSlugIndex(rows).get(article.id) ?? slugParam;
  const jaUrl = `${SITE_URL}/news/${encodeURIComponent(canonicalSlug)}`;
  const enUrl = `${SITE_URL}/en/news/${encodeURIComponent(canonicalSlug)}`;

  const author = [article.author_first_name, article.author_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const metaTags = buildMetaTags({
    title: `${title} | UNCHAIN`,
    description: clamp(description),
    image,
    url: lang === "en" ? enUrl : jaUrl,
    publishedTime: article.created_at || undefined,
    author: author || undefined,
    alternates: {
      ja: article.title?.trim() ? jaUrl : undefined,
      en: article.title_en?.trim() ? enUrl : undefined,
    },
  });

  let html = stripDefaultMeta(shell);
  if (lang === "en") html = html.replace('<html lang="ja"', '<html lang="en"');
  html = html.replace("</head>", `  ${metaTags}\n  </head>`);

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Cached at the edge so a burst of preview crawlers costs one origin hit;
      // stale-while-revalidate keeps edits showing up without a redeploy.
      "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
