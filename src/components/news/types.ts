import type { ArticleSection } from "@/lib/articleLinks";

/**
 * Which table a row came from. Blogs were folded into the news section, so both live in
 * one list and one grid; this is what the category filter and the card pill read, and it
 * is set where the rows are fetched rather than stored in the database.
 */
export type ArticleKind = ArticleSection;

/** An `articles` or `blogs` row as the news page reads it — the two share a shape. */
export interface Article {
  kind: ArticleKind;
  id: string;
  slug?: string | null;
  category?: string;
  title: string;
  description: string;
  content: string;
  title_en?: string;
  description_en?: string;
  content_en?: string;
  image_url: string;
  author_first_name: string;
  author_last_name: string;
  created_at: string;
  is_draft: boolean;
  content_type?: string;
  custom_html?: string;
  custom_html_en?: string;
  additional_media?: { url: string; type: string }[];
  is_external?: boolean;
  external_url?: string;
}

export type Lang = "ja" | "en";

/** A localised field, falling back to the other language when one side is empty. */
export const getLocalized = (
  article: Article | null,
  field: "title" | "description" | "content",
  lang: Lang
) => {
  if (!article) return "";

  const valCurrent = lang === "en" ? article[`${field}_en` as keyof Article] : article[field];
  if (valCurrent && typeof valCurrent === "string" && valCurrent.trim() !== "") {
    return valCurrent;
  }

  // Fallback to the other language
  const valOther = lang === "en" ? article[field] : article[`${field}_en` as keyof Article];
  return (valOther as string) || "";
};

/**
 * The design writes dates as `2026.07.07` — a numeric form that reads the same in both
 * locales, so unlike the rest of the copy it does not change on the language toggle.
 */
export const formatCardDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

/**
 * Newest first, the order both tables are queried in — needed again after merging them,
 * because two separately sorted lists concatenated are not sorted.
 */
export const byNewest = (a: Article, b: Article) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

/**
 * Drop repeated ids, keeping the first — news, in the order the merge concatenates.
 *
 * `buildSlugIndex` reads a repeated row as a slug collision and discriminates every copy,
 * which would change a live article URL. The two tables are disjoint today, so this only
 * matters if a row is ever copied between them during a content migration — but that is
 * precisely the case that would otherwise break quietly. `api/og.ts` does the same, so
 * both sides derive the same slugs.
 */
export const dedupeById = (articles: Article[]) => {
  const seen = new Set<string>();
  return articles.filter((a) => !seen.has(a.id) && seen.add(a.id));
};
