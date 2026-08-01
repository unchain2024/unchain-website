/** The `articles` row as the news page reads it. */
export interface Article {
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

/** Every distinct category across the given rows, "external" excluded — it is a badge. */
export const categoriesOf = (articles: Article[]) => {
  const cats = new Set<string>();
  for (const a of articles) {
    if (!a.category) continue;
    for (const c of a.category.split(",")) {
      const t = c.trim();
      if (t && t.toLowerCase() !== "external") cats.add(t);
    }
  }
  return [...cats].sort();
};
