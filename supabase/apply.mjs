#!/usr/bin/env node
/**
 * Apply every SQL file in supabase/migrations/ to the database, in filename order.
 *
 * Reads the direct (non-pooled) connection string that the Vercel Marketplace
 * Supabase resource injects. Fetch it first with:
 *     vercel env pull .env.local --scope luis-projects-3b3124ae
 *
 * Usage:
 *     node supabase/apply.mjs            # apply all migrations
 *     node supabase/apply.mjs --check    # just list tables/policies/buckets afterwards
 *
 * Needs the `pg` driver (a devDependency):
 *     npm install
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const loadEnv = (file) => {
  try {
    for (const line of readFileSync(join(root, file), "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch {
    /* file optional */
  }
};
loadEnv(".env.local");
loadEnv(".env");

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL_NON_POOLING not set. Run: vercel env pull .env.local");
  process.exit(1);
}

// Supabase's pooler presents a certificate chain Node does not trust out of the box, and
// `sslmode=require` in the URL would make the driver insist on verifying it. Drop the
// parameter and configure TLS explicitly instead.
const target = new URL(url);
target.searchParams.delete("sslmode");
const client = new Client({ connectionString: target.toString(), ssl: { rejectUnauthorized: false } });
await client.connect();
const host = new URL(url).hostname;
console.log(`connected to ${host}`);

try {
  if (!process.argv.includes("--check")) {
    const dir = join(here, "migrations");
    const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
    for (const f of files) {
      process.stdout.write(`applying ${f} ... `);
      await client.query(readFileSync(join(dir, f), "utf8"));
      console.log("ok");
    }
    // PostgREST caches the schema; tell it to reload so new tables show up at once.
    await client.query("notify pgrst, 'reload schema'");
  }

  const tables = await client.query(
    `select c.relname as table, c.relrowsecurity as rls,
            (select count(*) from pg_policy p where p.polrelid = c.oid) as policies
       from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' order by 1`,
  );
  console.table(tables.rows);

  const grants = await client.query(
    `select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type) as privs
       from information_schema.role_table_grants
      where table_schema = 'public' and grantee in ('anon','authenticated')
      group by 1,2 order by 1,2`,
  );
  console.table(grants.rows);

  const buckets = await client.query("select id, public from storage.buckets order by 1");
  console.table(buckets.rows);
  const storagePolicies = await client.query(
    "select polname from pg_policy where polrelid = 'storage.objects'::regclass order by 1",
  );
  console.table(storagePolicies.rows);
} finally {
  await client.end();
}
