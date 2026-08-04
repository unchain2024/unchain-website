import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import ArticleContent from "./ArticleContent";
import { article as copy } from "./content";
import { formatCardDate, getLocalized, type Article } from "./types";

/**
 * The article view — `public/news/pernews/Frame 2147226133.svg` (1440x1897).
 *
 * A 680px column centred in the 1440 frame (x 380..1060), not the 120px gutter the list
 * section uses. Down the page, in the export's own coordinates:
 *
 *   pill       380.5,100.5  87x28 rounded-full, white on the card pill's gradient hairline
 *   title      box 149.2, 54/59.2 bold black, tracked -0.047em
 *   meta row   362..394 — 14px date, a 1px #E9EAEB rule, a 32px avatar, the author
 *   cover      380,434  680x356.284 rounded 16
 *
 * The title's tracking is measured, not guessed: at 54px the export's three lines come
 * out 461.5 / 564.9 / 573.4 wide, which `fitfont.mjs` resolves to -0.047em on all three
 * to within 0.1px. The section heading next door wants -0.012em instead, so the two are
 * set separately rather than sharing one display token.
 *
 * Like the list hero this is the page's first section, so it reserves the height of the
 * header itself — the news navigation is its own 68px export drawn above the content
 * rather than over it, plus 40px for the information banner while that is showing.
 *
 * Everything here is real DOM text: the pill, the title, the date and the author all come
 * from the CMS row, and the surrounding chrome from `content.ts`, so the page stays
 * selectable and swaps language without a second drawing.
 */
const PILL_HAIRLINE = {
  // The same 1px ring the cards use: fill on the padding box, gradient on the border box.
  backgroundImage:
    "linear-gradient(#fff, #fff), linear-gradient(359.72deg, #0E3067 10.34%, #A2BFEE 100%)",
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
} as const;

const ArticleView = ({ article }: { article: Article }) => {
  const { lang } = useLang();
  const t = copy[lang];

  const title = getLocalized(article, "title", lang);
  // "external" is a flag on the row, not a label to show.
  const category = (article.category ?? "")
    .split(",")
    .map((c) => c.trim())
    .find((c) => c && c.toLowerCase() !== "external");

  const author = [article.author_first_name, article.author_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const monogram = article.author_first_name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <section
      data-nav-theme="light"
      data-probe="s-article"
      className="w-full bg-white pt-[68px]"
    >
      <article className="mx-auto w-full max-w-[680px] px-6 pb-24 pt-16 lg:px-0 lg:pb-[98.9px] lg:pt-[100.5px]">
        {/* Above the fold, so this reveals on mount rather than on scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* The slot keeps its 28px whether or not the row carries a category, so an
              uncategorised article still starts its title on the design's line. */}
          <div data-probe="art-pill" className="h-7">
            {category && (
              <span
                className="inline-flex h-7 items-center rounded-full border border-transparent px-4 text-[14px] leading-none text-black"
                style={PILL_HAIRLINE}
              >
                {category}
              </span>
            )}
          </div>

          <h1
            data-probe="art-title"
            className="mt-6 text-[32px] font-bold leading-[1.1] tracking-[-0.047em] text-black sm:text-[40px] lg:mt-[20.7px] lg:text-[54px] lg:leading-[59.2px]"
          >
            {title}
          </h1>

          <div
            data-probe="art-meta"
            className="mt-8 flex h-8 items-center text-[14px] leading-5 text-hd-eyebrow-ink lg:mt-[35.2px]"
          >
            <span>{formatCardDate(article.created_at)}</span>

            {/* 477..899 in the export, so it takes whatever the row has left over. */}
            <span aria-hidden="true" className="mx-6 hidden h-px flex-1 bg-hd-card-line sm:block" />

            <div className="ml-auto flex items-center gap-3 sm:ml-0">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-[13px] font-bold leading-none text-white"
              >
                {monogram}
              </span>
              {author && <span aria-label={`${t.author}: ${author}`}>{author}</span>}
            </div>
          </div>
        </motion.div>

        {article.image_url && (
          <div data-probe="art-cover" className="mt-10 overflow-hidden rounded-2xl bg-hd-panel">
            {article.image_url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={article.image_url} className="h-auto w-full" controls />
            ) : (
              <img src={article.image_url} alt="" className="h-auto w-full" />
            )}
          </div>
        )}

        <ArticleContent article={article} />
      </article>
    </section>
  );
};

export default ArticleView;
