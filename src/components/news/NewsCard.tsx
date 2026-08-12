import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/language";
import { articlePath } from "@/lib/articleLinks";
import { kinds, list } from "./content";
import { formatCardDate, getLocalized, type Article } from "./types";
import { PlaceholderCard } from "./art/PlaceholderArt";

/**
 * One card in the news grid — `public/news/Section.svg`, the 384x243.07 block at
 * (120,244) and the two below it.
 *
 * The export's measurements, top to bottom: a 384x243.07 photo rounded 16, the category
 * pill 16.5px under it (28 tall, rounded full, white on a vertical gradient hairline),
 * the 16/22 bold title, then the date in 14px #535862. Titles are clamped to the two
 * lines every card in the design uses, which is also what keeps the grid's rows on the
 * export's 442.07px pitch when the CMS hands over a shorter or longer headline.
 *
 * A row with no image falls back to the design's own placeholder art rather than a gap.
 *
 * The mobile exports draw the same card at the full 345px measure: the photo keeps its
 * aspect but rounds 12 instead of 16, and the title steps up to 18/22 — every other
 * measurement, including the 16.5px gap under the photo, is unchanged.
 */
const NewsCard = ({ article, slug }: { article: Article; slug: string }) => {
  const { lang, localePath } = useLang();
  const t = list[lang];

  const title = getLocalized(article, "title", lang);
  const isExternal = Boolean(article.is_external && article.external_url);
  // Some older rows point at storage objects that have since been deleted. The design has
  // a placeholder for a row with no image, so use it for one whose image will not load
  // either, rather than leaving an empty frame.
  const [imageFailed, setImageFailed] = useState(false);
  // The pill names which of the section's two categories the row is, so it matches what
  // the category dropdown filters on and every card has one.
  const category = kinds[lang][article.kind];

  const body = (
    <>
      <div className="relative w-full overflow-hidden rounded-xl bg-hd-panel sm:rounded-2xl">
        {/* 384 x 243.07 in the export. */}
        <div className="aspect-[384/243.07] w-full">
          {article.image_url && !imageFailed ? (
            <img
              src={article.image_url}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <PlaceholderCard className="h-full w-full" />
          )}
        </div>
      </div>

      <div data-probe="card-pill" className="mt-[16.5px] h-7">
        <span
          className="inline-flex h-7 items-center rounded-full border border-transparent px-4 text-[14px] leading-none text-black"
          style={{
            // A 1px hairline that runs #A2BFEE at the top to #0E3067 at the bottom,
            // over white — paint the fill on the padding box and the gradient on the
            // border box so the ring stays exactly 1px on a fully rounded pill.
            backgroundImage:
              "linear-gradient(#fff, #fff), linear-gradient(359.65deg, #0E3067 10.35%, #A2BFEE 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          {category}
        </span>
      </div>

      <h3
        data-probe="card-title"
        className="mt-[13.83px] line-clamp-2 min-h-[44px] text-[18px] font-bold leading-[22px] text-black transition-colors group-hover:text-hd-navy sm:text-[16px]"
      >
        {title}
      </h3>

      <p data-probe="card-date" className="mt-[20.4px] text-[14px] leading-none text-hd-eyebrow-ink">
        {formatCardDate(article.created_at)}
      </p>
    </>
  );

  const className = "group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-hd-navy focus-visible:ring-offset-4 rounded-2xl";

  return isExternal ? (
    <a
      href={article.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={t.externalHint}
    >
      {body}
    </a>
  ) : (
    <Link to={localePath(articlePath("news", slug))} className={className}>
      {body}
    </Link>
  );
};

export default NewsCard;
