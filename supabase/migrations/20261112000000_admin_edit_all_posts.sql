-- Let every UNCHAIN admin edit every news/blog post, and move posts between the
-- two sections.
--
-- Until now each admin could only read, edit or delete rows whose author_id was
-- their own, so posts written by a colleague (or imported by
-- supabase/seed/import-articles.mjs under one account) could not be touched by
-- anyone else. The admin pages now edit any post, including its author name,
-- published date (created_at) and cover image, and can move a post from news to
-- blog or back via public.move_post().
--
-- "Admin" is decided here, in the database, not by the login page: the
-- @the-unchain.com check in src/pages/Login.tsx runs in the browser and anyone
-- holding the public anon key can call the sign-up API directly. An admin is a
-- signed-in user whose confirmed email is on the company domain.
--
-- The existing "own row" policies stay; Postgres ORs permissive policies, so
-- these only widen access for admins.
--
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- is_admin()
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from auth.users u
     where u.id = (select auth.uid())
       and u.email_confirmed_at is not null
       and lower(u.email) like '%@the-unchain.com'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- articles / blogs: admins can read, insert, update and delete any row
-- ---------------------------------------------------------------------------

drop policy if exists "Articles: admins can read all" on public.articles;
create policy "Articles: admins can read all"
  on public.articles for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Articles: admins can insert" on public.articles;
create policy "Articles: admins can insert"
  on public.articles for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Articles: admins can update all" on public.articles;
create policy "Articles: admins can update all"
  on public.articles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Articles: admins can delete all" on public.articles;
create policy "Articles: admins can delete all"
  on public.articles for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Blogs: admins can read all" on public.blogs;
create policy "Blogs: admins can read all"
  on public.blogs for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Blogs: admins can insert" on public.blogs;
create policy "Blogs: admins can insert"
  on public.blogs for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Blogs: admins can update all" on public.blogs;
create policy "Blogs: admins can update all"
  on public.blogs for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Blogs: admins can delete all" on public.blogs;
create policy "Blogs: admins can delete all"
  on public.blogs for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- version history: admins can read any post's history and add to it
-- ---------------------------------------------------------------------------

drop policy if exists "Versions: admins can read all" on public.article_versions;
create policy "Versions: admins can read all"
  on public.article_versions for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Versions: admins can insert" on public.article_versions;
create policy "Versions: admins can insert"
  on public.article_versions for insert
  to authenticated
  with check ((select auth.uid()) = saved_by and (select public.is_admin()));

drop policy if exists "Blog versions: admins can read all" on public.blog_versions;
create policy "Blog versions: admins can read all"
  on public.blog_versions for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Blog versions: admins can insert" on public.blog_versions;
create policy "Blog versions: admins can insert"
  on public.blog_versions for insert
  to authenticated
  with check ((select auth.uid()) = saved_by and (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- move_post(post_id, target) — move a post between news (articles) and blog
-- (blogs) in one transaction, together with its version history.
--
-- The row keeps its id. Slugs are built over the union of both tables
-- (src/components/news/fetchArticles.ts, api/og.ts), so keeping the id and title
-- keeps the post's URL, and any ARTICLE_SLUG_OVERRIDES entry still applies.
-- Media in the article-media bucket is keyed by the id too, so it stays valid.
-- ---------------------------------------------------------------------------

create or replace function public.move_post(post_id uuid, target text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'only UNCHAIN admins can move posts' using errcode = '42501';
  end if;

  if target = 'blog' then
    insert into public.blogs (
      id, author_id, author_first_name, author_last_name, category,
      title, description, content, title_en, description_en, content_en,
      image_url, content_type, custom_html, custom_html_en, additional_media,
      is_external, external_url, is_draft, is_hidden, created_at, updated_at)
    select
      id, author_id, author_first_name, author_last_name, category,
      title, description, content, title_en, description_en, content_en,
      image_url, content_type, custom_html, custom_html_en, additional_media,
      is_external, external_url, is_draft, is_hidden, created_at, updated_at
    from public.articles where id = post_id;

    if not found then
      raise exception 'news post % not found', post_id using errcode = 'P0002';
    end if;

    insert into public.blog_versions (id, article_id, saved_by, snapshot, saved_at)
    select id, article_id, saved_by, snapshot, saved_at
      from public.article_versions where article_id = post_id;

    -- cascades to article_versions
    delete from public.articles where id = post_id;

  elsif target = 'news' then
    insert into public.articles (
      id, author_id, author_first_name, author_last_name, category,
      title, description, content, title_en, description_en, content_en,
      image_url, content_type, custom_html, custom_html_en, additional_media,
      is_external, external_url, is_draft, is_hidden, created_at, updated_at)
    select
      id, author_id, author_first_name, author_last_name, category,
      title, description, content, title_en, description_en, content_en,
      image_url, content_type, custom_html, custom_html_en, additional_media,
      is_external, external_url, is_draft, is_hidden, created_at, updated_at
    from public.blogs where id = post_id;

    if not found then
      raise exception 'blog post % not found', post_id using errcode = 'P0002';
    end if;

    insert into public.article_versions (id, article_id, saved_by, snapshot, saved_at)
    select id, article_id, saved_by, snapshot, saved_at
      from public.blog_versions where article_id = post_id;

    -- cascades to blog_versions
    delete from public.blogs where id = post_id;

  else
    raise exception 'target must be ''news'' or ''blog'', got %', target using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.move_post(uuid, text) from public, anon;
grant execute on function public.move_post(uuid, text) to authenticated;

notify pgrst, 'reload schema';
