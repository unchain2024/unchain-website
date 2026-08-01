/**
 * All news-page chrome copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/news`. The
 * English strings are what the language toggle shows on `/en/news` — the layout is
 * identical in both, only the words change.
 *
 * Nothing here is fetched, templated or baked into an image, so every string stays real,
 * selectable DOM text. The article rows themselves are the exception by nature: they come
 * from the CMS, and the three photographed cards in the export are sample rows standing
 * in for them.
 */

export const hero = {
  ja: {
    heading: "ニュース",
    body: "UNCHAINの最新情報、プロダクトアップデート、イベント・登壇情報をお届けします。",
  },
  en: {
    heading: "News",
    body: "The latest from UNCHAIN — company news, product updates, events and speaking engagements.",
  },
} as const;

export const filters = {
  ja: {
    language: "言語",
    category: "カテゴリ",
    all: "すべて",
    japanese: "日本語",
    english: "English",
  },
  en: {
    language: "Language",
    category: "Category",
    all: "All",
    japanese: "Japanese",
    english: "English",
  },
} as const;

export const list = {
  ja: {
    loading: "読み込み中...",
    empty: "記事がまだありません。",
    noResults: "条件に一致する記事が見つかりませんでした。",
    clear: "条件をリセット",
    failed: "記事を読み込めませんでした。",
    /** Announced to screen readers on each card; the visible chrome has no such label. */
    externalHint: "外部サイトへ移動します",
  },
  en: {
    loading: "Loading...",
    empty: "No articles yet.",
    noResults: "No articles match your filters.",
    clear: "Reset filters",
    failed: "Failed to load articles.",
    externalHint: "Opens an external site",
  },
} as const;

export const pager = {
  ja: { previous: "前のページ", next: "次のページ", page: "ページ" },
  en: { previous: "Previous page", next: "Next page", page: "Page" },
} as const;

/** The article view — `public/news/pernews/Frame 2147226133.svg`. */
export const article = {
  ja: {
    backToNews: "ニュース一覧へ戻る",
    notFoundHeading: "記事が見つかりませんでした",
    notFoundBody: "お探しの記事は削除されたか、URLが変更された可能性があります。",
    failed: "記事を読み込めませんでした。",
    loading: "読み込み中...",
    /** The avatar is a monogram when the CMS holds no portrait, so it needs a label. */
    author: "執筆者",
    empty: "この記事の本文はまだありません。",
  },
  en: {
    backToNews: "Back to News",
    notFoundHeading: "Article not found",
    notFoundBody: "This article may have been removed, or its URL may have changed.",
    failed: "Failed to load this article.",
    loading: "Loading...",
    author: "Author",
    empty: "This article has no content yet.",
  },
} as const;

/** The related-news row — `public/news/pernews/Section.svg`. */
export const related = {
  ja: { heading: "関連ニュース", viewAll: "すべてのニュース" },
  en: { heading: "Related news", viewAll: "View all news" },
} as const;

/** The design lays the related row out as a single row of three. */
export const RELATED_COUNT = 3;

/** The design fits four rows of three. */
export const PER_PAGE = 12;
