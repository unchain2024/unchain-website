#!/usr/bin/env node
/**
 * Seed the `articles` table (and the `article-media` bucket) from supabase/seed/articles.json.
 *
 * The original database was deleted in 2026-09 with no backup; the articles were rebuilt
 * from the marketing team's Google Docs. Their ids are fixed in the JSON so this script is
 * idempotent: re-running upserts the same rows and overwrites the same cover objects.
 *
 * Needs .env.local from `vercel env pull` (POSTGRES_URL_NON_POOLING for the rows,
 * SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for the storage upload).
 *
 *     node supabase/seed/import-articles.mjs --author <auth.users uuid>
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(join(root, file), "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch { /* optional */ }
}

const authorId = process.argv[process.argv.indexOf("--author") + 1];
if (!authorId || !/^[0-9a-f-]{36}$/.test(authorId)) {
  console.error("usage: node supabase/seed/import-articles.mjs --author <auth.users uuid>");
  process.exit(1);
}
const { POSTGRES_URL_NON_POOLING, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!POSTGRES_URL_NON_POOLING || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("missing env; run: vercel env pull .env.local");
  process.exit(1);
}

const BUCKET = "article-media";
const articles = JSON.parse(readFileSync(join(here, "articles.json"), "utf8"));

/** Upload a cover into <articleId>/cover.webp and return its public URL. */
const uploadCover = async (articleId, file) => {
  const path = `${articleId}/cover.webp`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "image/webp",
      "x-upsert": "true",
      "cache-control": "public, max-age=31536000, immutable",
    },
    body: readFileSync(join(here, "images", file)),
  });
  if (!res.ok) throw new Error(`upload ${file}: ${res.status} ${await res.text()}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};

const url = new URL(POSTGRES_URL_NON_POOLING);
url.searchParams.delete("sslmode");
const db = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
await db.connect();
try {
  const profile = await db.query("select first_name, last_name from public.profiles where id = $1", [authorId]);
  if (!profile.rows.length) throw new Error(`no profile for author ${authorId}`);
  const { first_name, last_name } = profile.rows[0];
  console.log(`author: ${first_name} ${last_name}`);

  for (const a of articles) {
    const image_url = a.image ? await uploadCover(a.id, a.image) : null;
    await db.query(
      `insert into public.articles
         (id, author_id, author_first_name, author_last_name, category,
          title, description, content, title_en, description_en, content_en,
          image_url, content_type, additional_media, is_external, external_url,
          is_draft, is_hidden, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'standard','[]'::jsonb,false,null,$13,false,$14)
       on conflict (id) do update set
         author_id = excluded.author_id, author_first_name = excluded.author_first_name,
         author_last_name = excluded.author_last_name, category = excluded.category,
         title = excluded.title, description = excluded.description, content = excluded.content,
         title_en = excluded.title_en, description_en = excluded.description_en,
         content_en = excluded.content_en, image_url = excluded.image_url,
         is_draft = excluded.is_draft, created_at = excluded.created_at`,
      [a.id, authorId, first_name, last_name, a.category,
       a.title, a.description, a.content, a.title_en, a.description_en, a.content_en,
       image_url, a.is_draft, a.created_at],
    );
    console.log(`${a.is_draft ? "draft    " : "published"}  ${a.created_at.slice(0, 10)}  ${a.title_en}`);
  }
  await db.query("notify pgrst, 'reload schema'");
  const n = await db.query("select count(*) filter (where not is_draft) published, count(*) total from public.articles");
  console.log("articles:", n.rows[0]);
} finally {
  await db.end();
}
