import { supabase } from "@/lib/supabase";

/**
 * Helpers shared by the admin pages that edit news and blog posts.
 *
 * News posts live in the `articles` table and blog posts in `blogs`; the two share a
 * shape. Every UNCHAIN admin can edit every post (see
 * supabase/migrations/20261112000000_admin_edit_all_posts.sql).
 */

export type PostKind = "news" | "blog";

export const POST_TABLE: Record<PostKind, "articles" | "blogs"> = {
  news: "articles",
  blog: "blogs",
};

export const VERSION_TABLE: Record<PostKind, "article_versions" | "blog_versions"> = {
  news: "article_versions",
  blog: "blog_versions",
};

/** The admin editor route for a post. */
export const editPath = (kind: PostKind, id: string) =>
  kind === "news" ? `/edit/${id}` : `/edit-blog/${id}`;

export const otherKind = (kind: PostKind): PostKind => (kind === "news" ? "blog" : "news");

/**
 * Move a post between news and blog. Runs as one database transaction that carries the
 * version history along and keeps the post's id, so its public URL does not change.
 */
export const movePost = async (id: string, to: PostKind) => {
  const { error } = await supabase.rpc("move_post", { post_id: id, target: to });
  if (error) throw error;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** An ISO timestamp as the value of an `<input type="datetime-local">`, in local time. */
export const toDateTimeInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** A `datetime-local` value (local time) back to an ISO timestamp, or null if incomplete. */
export const fromDateTimeInput = (value: string) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/** "First Last" for a post row, or "" when the post has no author name. */
export const authorName = (row: { author_first_name?: string | null; author_last_name?: string | null }) =>
  [row.author_first_name, row.author_last_name].filter(Boolean).join(" ").trim();
