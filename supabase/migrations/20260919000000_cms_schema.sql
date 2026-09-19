-- UNCHAIN website CMS schema.
--
-- Recreated 2026-09-19 after the original Supabase project was deleted with no
-- backup. The database now lives in the Vercel Marketplace resource
-- `unchain-website-db` (Vercel → Lui's projects → Storage). This file is the
-- source of truth for the schema; keep it in step with what the admin pages in
-- src/pages/Publish*.tsx / Edit*.tsx write and what src/components/news/
-- fetchArticles.ts and api/og.ts read.
--
-- Safe to re-run: tables use IF NOT EXISTS and every policy is dropped before
-- it is created.
--
-- Apply with:  node supabase/apply.mjs   (reads POSTGRES_URL_NON_POOLING from .env.local)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — one row per admin user, keyed by auth.users.id
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles: users can read own profile" on public.profiles;
create policy "Profiles: users can read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Profiles: users can upsert own profile" on public.profiles;
create policy "Profiles: users can upsert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Profiles: users can update own profile" on public.profiles;
create policy "Profiles: users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- shared trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- articles (news) — written by src/pages/PublishNewsPage.tsx / EditNewsPage.tsx
-- ---------------------------------------------------------------------------

create table if not exists public.articles (
  id                 uuid primary key default gen_random_uuid(),
  author_id          uuid references auth.users(id) on delete set null,
  author_first_name  text,
  author_last_name   text,

  category           text,

  title              text,
  description        text,
  content            text,

  title_en           text,
  description_en     text,
  content_en         text,

  image_url          text,
  content_type       text default 'standard',
  custom_html        text,
  custom_html_en     text,
  additional_media   jsonb default '[]'::jsonb,

  is_external        boolean default false,
  external_url       text,

  is_draft           boolean not null default true,
  is_hidden          boolean not null default false,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists articles_created_at_idx on public.articles (created_at desc);
create index if not exists articles_author_id_idx  on public.articles (author_id);
create index if not exists articles_visibility_idx on public.articles (is_draft, is_hidden);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "Articles: public can read published" on public.articles;
create policy "Articles: public can read published"
  on public.articles for select
  using (is_draft = false and is_hidden = false);

drop policy if exists "Articles: authors can read own" on public.articles;
create policy "Articles: authors can read own"
  on public.articles for select
  to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "Articles: authenticated can insert own" on public.articles;
create policy "Articles: authenticated can insert own"
  on public.articles for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "Articles: authors can update own" on public.articles;
create policy "Articles: authors can update own"
  on public.articles for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

drop policy if exists "Articles: authors can delete own" on public.articles;
create policy "Articles: authors can delete own"
  on public.articles for delete
  to authenticated
  using ((select auth.uid()) = author_id);

-- ---------------------------------------------------------------------------
-- article_versions — history snapshots written by EditNewsPage.saveVersion()
-- ---------------------------------------------------------------------------

create table if not exists public.article_versions (
  id         uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  saved_by   uuid references auth.users(id) on delete set null,
  snapshot   jsonb not null,
  saved_at   timestamptz not null default now()
);

create index if not exists article_versions_article_id_idx
  on public.article_versions (article_id, saved_at desc);

alter table public.article_versions enable row level security;

drop policy if exists "Versions: authors can read own article history" on public.article_versions;
create policy "Versions: authors can read own article history"
  on public.article_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.articles a
      where a.id = article_versions.article_id
        and a.author_id = (select auth.uid())
    )
  );

drop policy if exists "Versions: authors can insert own article history" on public.article_versions;
create policy "Versions: authors can insert own article history"
  on public.article_versions for insert
  to authenticated
  with check (
    (select auth.uid()) = saved_by
    and exists (
      select 1 from public.articles a
      where a.id = article_versions.article_id
        and a.author_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- blogs — same shape as articles. Written by src/pages/PublishBlogPage.tsx /
-- EditBlogPage.tsx; read together with articles by fetchArticles.ts and api/og.ts.
-- (Not in the original schema dump; reconstructed from the code, which sends the
-- identical column set to both tables.)
-- ---------------------------------------------------------------------------

create table if not exists public.blogs (
  id                 uuid primary key default gen_random_uuid(),
  author_id          uuid references auth.users(id) on delete set null,
  author_first_name  text,
  author_last_name   text,

  category           text,

  title              text,
  description        text,
  content            text,

  title_en           text,
  description_en     text,
  content_en         text,

  image_url          text,
  content_type       text default 'standard',
  custom_html        text,
  custom_html_en     text,
  additional_media   jsonb default '[]'::jsonb,

  is_external        boolean default false,
  external_url       text,

  is_draft           boolean not null default true,
  is_hidden          boolean not null default false,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_author_id_idx  on public.blogs (author_id);
create index if not exists blogs_visibility_idx on public.blogs (is_draft, is_hidden);

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

alter table public.blogs enable row level security;

drop policy if exists "Blogs: public can read published" on public.blogs;
create policy "Blogs: public can read published"
  on public.blogs for select
  using (is_draft = false and is_hidden = false);

drop policy if exists "Blogs: authors can read own" on public.blogs;
create policy "Blogs: authors can read own"
  on public.blogs for select
  to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "Blogs: authenticated can insert own" on public.blogs;
create policy "Blogs: authenticated can insert own"
  on public.blogs for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "Blogs: authors can update own" on public.blogs;
create policy "Blogs: authors can update own"
  on public.blogs for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

drop policy if exists "Blogs: authors can delete own" on public.blogs;
create policy "Blogs: authors can delete own"
  on public.blogs for delete
  to authenticated
  using ((select auth.uid()) = author_id);

-- ---------------------------------------------------------------------------
-- blog_versions — EditBlogPage.saveVersion() inserts { article_id, saved_by,
-- snapshot }; the column is named article_id there too, so keep it.
-- ---------------------------------------------------------------------------

create table if not exists public.blog_versions (
  id         uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.blogs(id) on delete cascade,
  saved_by   uuid references auth.users(id) on delete set null,
  snapshot   jsonb not null,
  saved_at   timestamptz not null default now()
);

create index if not exists blog_versions_article_id_idx
  on public.blog_versions (article_id, saved_at desc);

alter table public.blog_versions enable row level security;

drop policy if exists "Blog versions: authors can read own history" on public.blog_versions;
create policy "Blog versions: authors can read own history"
  on public.blog_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.blogs b
      where b.id = blog_versions.article_id
        and b.author_id = (select auth.uid())
    )
  );

drop policy if exists "Blog versions: authors can insert own history" on public.blog_versions;
create policy "Blog versions: authors can insert own history"
  on public.blog_versions for insert
  to authenticated
  with check (
    (select auth.uid()) = saved_by
    and exists (
      select 1 from public.blogs b
      where b.id = blog_versions.article_id
        and b.author_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- storage: public bucket for article images / media
-- Object paths are <article-uuid>/<timestamp>-<random>.<ext>; the admin pages
-- upload, list (select), replace (update) and remove (delete) objects.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('article-media', 'article-media', true)
on conflict (id) do nothing;

drop policy if exists "article-media: public read" on storage.objects;
create policy "article-media: public read"
  on storage.objects for select
  using (bucket_id = 'article-media');

drop policy if exists "article-media: authenticated upload" on storage.objects;
create policy "article-media: authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-media');

drop policy if exists "article-media: authenticated update" on storage.objects;
create policy "article-media: authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-media')
  with check (bucket_id = 'article-media');

drop policy if exists "article-media: authenticated delete" on storage.objects;
create policy "article-media: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-media');

-- ---------------------------------------------------------------------------
-- Data API exposure. Since 2026-04 new tables are NOT reachable through the
-- REST API until the API roles are granted access; RLS above still decides
-- which rows each role can see. anon = public site visitors, authenticated =
-- signed-in admins.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on table public.articles, public.blogs to anon;
grant select, insert, update, delete on table public.articles, public.blogs to authenticated;

grant select, insert on table public.article_versions, public.blog_versions to authenticated;

grant select, insert, update on table public.profiles to authenticated;

notify pgrst, 'reload schema';

-- Least privilege: Supabase's default privileges hand every table right to the API
-- roles. RLS is what actually protects rows, but visitors have no business writing
-- at all, so take those rights away from anon outright.
revoke insert, update, delete, truncate, references, trigger
  on table public.articles, public.blogs, public.article_versions, public.blog_versions, public.profiles
  from anon;
revoke select on table public.article_versions, public.blog_versions, public.profiles from anon;
revoke truncate, references, trigger
  on table public.articles, public.blogs, public.article_versions, public.blog_versions, public.profiles
  from authenticated;
revoke update, delete on table public.article_versions, public.blog_versions from authenticated;
revoke delete on table public.profiles from authenticated;
