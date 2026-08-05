import { Navigate, useParams } from "react-router-dom";
import { useLang } from "@/lib/language";
import { articlePath } from "@/lib/articleLinks";

/**
 * `/blog` and `/blog/:slug` moved into the news section.
 *
 * The old URLs stay alive and redirect rather than 404, so anything already shared or
 * indexed still lands on the article. The slug space is shared — `NewsPage` resolves
 * against news and blog rows together — so a blog slug resolves unchanged under `/news`,
 * and `api/og.ts` advertises the `/news` URL as canonical for both.
 *
 * The locale prefix is preserved: `/en/blog/x` goes to `/en/news/x`.
 */
const BlogRedirect = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { localePath } = useLang();

  return <Navigate to={localePath(slug ? articlePath("news", slug) : "/news")} replace />;
};

export default BlogRedirect;
