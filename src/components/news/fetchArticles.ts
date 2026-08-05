import { supabase } from "@/lib/supabase";
import type { SluggableArticle } from "@/lib/articleLinks";
import { byNewest, dedupeById, type Article, type ArticleKind } from "./types";

/**
 * Reading the news section's content.
 *
 * Blogs were folded into the news section, so "the news list" is really the union of
 * the `articles` and `blogs` tables. Which table a row came from is not stored in the
 * database — it is attached here as `kind`, and that is what the category filter and
 * the card pill read. Anything that renders a news card has to go through this module,
 * or its rows arrive without a `kind` and the pills come out blank.
 */

const TABLES: readonly ArticleKind[] = ["news", "blog"] as const;
const TABLE_NAME: Record<ArticleKind, string> = { news: "articles", blog: "blogs" };

/** Published, visible rows from one table, newest first. */
const published = (kind: ArticleKind, columns: string, limit?: number) => {
  const q = supabase
    .from(TABLE_NAME[kind])
    .select(columns)
    .eq("is_draft", false)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });
  return limit ? q.limit(limit) : q;
};

const tag = (rows: unknown[] | null, kind: ArticleKind) =>
  ((rows ?? []) as Article[]).map((row) => ({ ...row, kind }));

/** Every published row across both tables, newest first. */
export const fetchPublishedArticles = async (): Promise<Article[]> => {
  const results = await Promise.all(TABLES.map((k) => published(k, "*")));

  const merged: Article[] = [];
  results.forEach((res, i) => {
    if (res.error) throw res.error;
    merged.push(...tag(res.data, TABLES[i]));
  });

  // Two separately sorted lists concatenated are not sorted.
  return dedupeById(merged).sort(byNewest);
};

/**
 * The newest `limit` rows across both tables.
 *
 * Only `limit` rows are read from each table rather than all of them: the newest N
 * overall are necessarily among the newest N of each table, so this is exact while
 * keeping the home page off the full article bodies.
 */
export const fetchLatestArticles = async (limit: number): Promise<Article[]> => {
  const results = await Promise.all(TABLES.map((k) => published(k, "*", limit)));

  const merged: Article[] = [];
  results.forEach((res, i) => {
    if (res.error) throw res.error;
    merged.push(...tag(res.data, TABLES[i]));
  });

  return dedupeById(merged).sort(byNewest).slice(0, limit);
};

/**
 * Just enough of every published row to build the slug index.
 *
 * `buildSlugIndex` disambiguates colliding titles against the whole set, so an index
 * built from a subset can hand out a different URL than the news page uses for the
 * same article. Titles are all it needs, so this stays cheap.
 */
export const fetchSluggableArticles = async (): Promise<SluggableArticle[]> => {
  const results = await Promise.all(
    TABLES.map((k) => published(k, "id, title, title_en"))
  );

  const merged: SluggableArticle[] = [];
  for (const res of results) {
    if (res.error) throw res.error;
    merged.push(...((res.data ?? []) as unknown as SluggableArticle[]));
  }
  return merged;
};
