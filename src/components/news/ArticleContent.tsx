import { useLang } from "@/lib/language";
import { parsePressRelease } from "@/components/PressReleaseRenderer";
import { article as copy } from "./content";
import { getLocalized, type Article, type Lang } from "./types";

/**
 * The lead block and the body copy — the lower two thirds of
 * `public/news/pernews/Frame 2147226133.svg` (1440x1897).
 *
 * The export's own article is a press release, so its shape is this component's spec:
 * a lead paragraph behind a 4px gradient rule, then 16/22 body copy in #414651, then a
 * 20px bold heading with the detail lines under it. Every number below is the export's:
 *
 *   lead rule      380..384 x 830.284..874.284, the card pill's gradient run vertically
 *   lead copy      box 396.4, 16/22 bold black — 12px clear of the rule
 *   body           first line box 915.7, 16/22 #414651, paragraphs on a 44px pitch
 *   heading        box 1484.3, 20/28 bold black — 40.5px after the copy above it
 *   details        box 1532.8, 20.5px under the heading, back to 16/22 #414651
 *
 * Because that 44px pitch has to hold across a heading and across the boundary between
 * two press-release sections alike, the body is flattened to one list of blocks and the
 * gap is decided from each block's neighbours rather than from the section it came out
 * of. All three CMS content types land on the same scale, not only the press release the
 * export happens to draw — but `PressReleaseRenderer` itself is left alone, because the
 * blog page and the admin preview share it and neither is being redesigned here.
 */
const LEAD_RULE = "linear-gradient(359.95deg, #0E3067 10.42%, #A2BFEE 100%)";

type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "img"; src: string };

/**
 * Is this line one of the export's 20px bold labels rather than body copy?
 *
 * `standard` articles are stored as plain text, so there is no markup to read: the
 * export's own "出展概要" is the same kind of string as the paragraph above it. What
 * separates the two in every article the CMS holds is shape — a label is short, carries
 * no sentence-ending punctuation, and has no "：" introducing a value, which is what
 * keeps the detail lines under it ("入場料： 無料（事前登録制）") out. Press releases and
 * custom HTML say it properly, through a section heading and an `<h2>`; this only has to
 * cover the plain-text rows. Widen it and short standalone lines start rendering bold.
 */
const isLabel = (line: string) =>
  line.length <= 20 && !/[。．.!?！？：:、，]/.test(line) && !/https?:\/\//.test(line);

/**
 * CMS copy arrives as one string. Every explicit newline is a block break — that is what
 * the export draws, its trailing detail lines sitting on the same 44px pitch as the
 * paragraphs above them, and it is also how this page has always read the field.
 */
const paragraphs = (text: string): Block[] =>
  text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((line) => ({ kind: isLabel(line) ? "h2" : "p", text: line }) as Block);

/** The export's gaps: 40.5 before a heading, 20.5 after one, 22 between paragraphs. */
const gapBefore = (block: Block, previous: Block | undefined) => {
  if (!previous) return "";
  if (block.kind === "h2") return "mt-[40.5px]";
  if (previous.kind === "h2") return "mt-[20.5px]";
  return "mt-[22px]";
};

const blocksOf = (article: Article, lang: Lang): Block[] => {
  if (article.content_type === "press_release") {
    const data = parsePressRelease(localContent(article, lang));
    if (!data) return [];

    const out: Block[] = [];
    if (data.subtitle?.trim()) out.push(...paragraphs(data.subtitle));

    for (const section of data.sections ?? []) {
      if (section.heading?.trim()) out.push({ kind: "h2", text: section.heading });
      const images = section.imageUrls?.length
        ? section.imageUrls
        : section.imageUrl
          ? [section.imageUrl]
          : [];
      for (const src of images) out.push({ kind: "img", src });
      if (section.body?.trim()) out.push(...paragraphs(section.body));
    }

    if (data.overviewText?.trim()) out.push(...paragraphs(data.overviewText));
    return out;
  }

  return paragraphs(getLocalized(article, "content", lang));
};

const localContent = (article: Article, lang: Lang) =>
  (lang === "en" && article.content_en ? article.content_en : article.content) || "";

/**
 * The copy behind the gradient rule. `description` is the lead for every article the CMS
 * writes; a press release keeps its own, so fall back to that when the row has none.
 */
const leadOf = (article: Article, lang: Lang) => {
  const described = getLocalized(article, "description", lang).trim();
  if (described) return described;
  if (article.content_type !== "press_release") return "";
  return parsePressRelease(localContent(article, lang))?.leadParagraph?.trim() ?? "";
};

const ArticleContent = ({ article }: { article: Article }) => {
  const { lang } = useLang();
  const t = copy[lang];

  const lead = leadOf(article, lang);
  const customHtml =
    article.content_type === "custom_html"
      ? ((lang === "en" && article.custom_html_en ? article.custom_html_en : article.custom_html) || "").trim()
      : "";
  const blocks = customHtml ? [] : blocksOf(article, lang);

  return (
    <>
      {lead && (
        <div data-probe="art-lead" className="relative mt-10 pl-4">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundImage: LEAD_RULE }}
          />
          <p className="text-[16px] font-bold leading-[22px] text-black">{lead}</p>
        </div>
      )}

      <div
        data-probe="art-body"
        className={`text-[16px] leading-[22px] text-hd-body-ink ${lead ? "mt-[41.4px]" : "mt-10"}`}
      >
        {customHtml ? (
          <div className="article-prose" dangerouslySetInnerHTML={{ __html: customHtml }} />
        ) : blocks.length ? (
          blocks.map((block, i) => {
            const gap = gapBefore(block, blocks[i - 1]);
            if (block.kind === "h2") {
              return (
                <h2 key={i} className={`text-[20px] font-bold leading-[28px] text-black ${gap}`}>
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "img") {
              return (
                <div key={i} className={`overflow-hidden rounded-2xl bg-hd-panel ${gap}`}>
                  <img src={block.src} alt="" loading="lazy" className="h-auto w-full" />
                </div>
              );
            }
            return (
              <p key={i} className={`whitespace-pre-wrap ${gap}`}>
                {block.text}
              </p>
            );
          })
        ) : (
          <p className="text-hd-eyebrow-ink">{t.empty}</p>
        )}
      </div>
    </>
  );
};

export default ArticleContent;
