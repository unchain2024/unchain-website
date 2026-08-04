# Design pipelines

Four pages are built one-to-one from Figma exports: the **home** page in
`src/components/home/` from `public/home/`, the **business** page in
`src/components/business/` from `public/business/`, the **about** page in
`src/components/about/` from `public/about/`, and the **news** page in
`src/components/news/` from `public/news/`. Those exports outline all text to
paths and inline every photo as base64, so nothing in them is directly usable — these
scripts turn them into real assets and then verify the built page against them.

Scratch output goes to `tools/design/.work/` (git-ignored).

The inspection scripts (`svg_probe`, `svg_layout`, `svg_lines`, `perpath`, `svg_render`,
`crop`, `zoom`, `fitfont`, `gradient_css`) and the verification scripts (`shoot`,
`compare`, `ink`, `sample`) take a path, so they work on any of the sets. `compare.mjs`
reads the build capture from `$PAGE_SHOT`; `ink.mjs` takes `$PAGE_SHOT` and
`$PAGE_MEASURE` and defaults to the home page's.

The business, about and news pages' CTA banner and footer exports are pixel-identical to
the home page's, so `CtaSection` and `SiteFooter` are reused rather than rebuilt. The
about and news pages' information banner matches too, so they reuse `Navigation` — but
note their navigation is a separate 68px export sitting *above* the first section rather
than over it, so the page's first section reserves that height itself. On the about page
that is `JapanSection` (`Frame 2147226133.svg`), which is the hero; the numbered
`Section*.svg` exports run below it. The news page's `Frame 2147226133.svg` is a different
drawing at the same name, and is its hero the same way.

News is also the only set whose page is not fully static: `Section.svg` draws twelve
sample cards standing in for CMS rows, so the built grid is data-driven and only its
chrome — the filters, the card frame, the pager — is fixed by the design. Its three
embedded rasters are therefore *not* extracted; shipping them would freeze the mock data
into the build.

`public/news/pernews/` is the article view under `/news/:slug`, built in
`src/components/news/{ArticleView,ArticleContent,RelatedNews}.tsx`. Its
`Information banner.svg`, `Navigation.svg` and `CTA Banner - Desktop.svg` are byte-
identical to the list view's once Figma's generated ids are normalised, and its
`Footer - Desktop.svg` differs only in the path rounding of one legal line, so all four
reuse the same components again. What is new is `Frame 2147226133.svg` (1440x1897 — the
pill, title, meta row, cover and body copy, on a 680px column centred in the frame rather
than the 120px gutter) and `Section.svg` (1440x702 — the related-news row, which is back
on the 120px gutter and reuses `NewsCard` unchanged). Nothing in either needs extracting:
the only art is the lead rule's gradient and the pill's, both of which the list page
already carries, and the two embedded rasters are CMS rows.

## Regenerating assets after a design update

```bash
node tools/design/build_assets.mjs   # photos -> src/assets/home/*.webp, vector slices -> *.svg
node tools/design/gen_art.mjs        # decorative SVG art -> src/components/home/art/*.tsx
node tools/design/gen_logo.mjs       # logo + social glyphs -> src/components/home/{Logo,social}.tsx
```

`build_assets.mjs` expects the raw rasters it extracts from the SVGs to already sit in
`tools/design/.work/raw/`; run `svg_probe.mjs`-style extraction first if that folder is
empty (see "Inspecting an export" below).

For the business page a single script does both jobs — it pulls the rasters straight out
of the exports, so there is no scratch step:

```bash
node tools/design/gen_business.mjs   # photos -> src/assets/business/*.webp
                                     # vector art -> src/components/business/art/*.tsx
```

The about page has its own one-shot generator. It walks the export as a *tree* rather than
a flat element list, because that page's art is nested inside `<g opacity>` and
`<g filter>` wrappers that carry part of the look, and it composes `matrix`/`rotate`
transforms so the viewBoxes it computes are exact:

```bash
node tools/design/gen_about.mjs       # photos -> src/assets/about/*.webp
                                      # vector art -> src/components/about/art/*.tsx
```

The news page has no photos to extract, so its generator only emits art. It reads the
export as a tree for the same reason `gen_about.mjs` does — the placeholder card is a
`<g filter>` glow and four blades that have to come out intact — but takes that machinery
from the shared `svgtree.mjs` rather than carrying its own copy. `gen_about.mjs` predates
the split and still has its own; leave it be unless you are prepared to diff its
generated art afterwards.

```bash
node tools/design/gen_news.mjs        # vector art -> src/components/news/art/*.tsx
```

Generated files carry a "do not hand-edit" header — change the generator, not the output.

## Inspecting an export

```bash
node tools/design/svg_probe.mjs  "public/home/Hero.svg"   # size, tags, colours, fonts, text
node tools/design/svg_layout.mjs "public/home/Hero.svg"   # gradients, shapes, ink boxes per run
node tools/design/svg_lines.mjs  "public/about/Section.svg"  # per-LINE boxes + leading
node tools/design/perpath.mjs    "public/home/Hero.svg"   # bbox of every individual path
node tools/design/svg_render.mjs public/home tools/design/.work/render 1440
node tools/design/crop.mjs "public/home/Hero.svg" 70 320 380 220 4 out.png "#111827"
node tools/design/zoom.mjs "public/about/Section-5.svg" 110 225 700 150 6 out.png
```

`crop.mjs` rasterises the whole page before cutting, which is unusably slow on the big
exports; `zoom.mjs` rewrites the viewBox instead, so it only renders the region.

Figma outlines every text node to a single `<path>`, so a font size can only be recovered
by measuring. `svg_lines.mjs` gives the ink box per line; `fitfont.mjs` then solves for the
size that reproduces it, using canvas `measureText` (whose `actualBoundingBox*` is the same
ink box) against the real webfonts:

```bash
node tools/design/fitfont.mjs tools/design/about_fit.json   # needs the dev server + Chrome
```

Include a case whose size is already known as a calibration row — the method lands within
~0.3% on width, and `fitH` is the one to trust when the two disagree, since it is
independent of tracking. Gradients need the same treatment: Figma writes them as a line in
page coordinates that usually starts outside the shape, so the CSS equivalent has different
stop positions:

```bash
node tools/design/gradient_css.mjs "public/about/Section-4.svg" paint0_linear_123_1671 16 16 1408 693
```

## Verifying the build against the design

Needs a dev server on :5199 and a headless Chrome exposing CDP on :9333:

```bash
npx vite --port 5199 --strictPort &
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --user-data-dir="$PWD/tools/design/.work/cprof" --remote-debugging-port=9333 about:blank &
```

Then:

```bash
# capture the built page + section offsets
node tools/design/shoot.mjs http://localhost:5199/ tools/design/.work/shots/home tools/design/measure.json

# render the design SVGs in the SAME browser so the baseline has no renderer skew
cp tools/design/design_page.html public/design_page.html
node tools/design/shoot.mjs http://localhost:5199/design_page.html tools/design/.work/shots/design
rm public/design_page.html

node tools/design/compare.mjs tools/design/sections.json  # side-by-side + difference sheets
node tools/design/ink.mjs     tools/design/probes.json    # numeric ink-box deltas per element
node tools/design/sample.mjs  tools/design/points.json    # background colour deltas
```

The business page works the same way, with its own page/section/probe files. Its whole
design is one long capture rather than a png per section, so each entry carries a `dy`
into that capture:

```bash
node tools/design/shoot.mjs http://localhost:5199/solutions \
  tools/design/.work/shots/business-build tools/design/business_measure.json

cp tools/design/business_page.html public/business_page.html
node tools/design/shoot.mjs http://localhost:5199/business_page.html \
  tools/design/.work/shots/business-design
rm public/business_page.html

PAGE_SHOT=tools/design/.work/shots/business-build-full.png \
  node tools/design/compare.mjs tools/design/business_sections.json
```

The about page works the same way and, like the business page, compares against one long
stacked capture:

```bash
node tools/design/shoot.mjs http://localhost:5199/about \
  tools/design/.work/shots/about-build tools/design/about_measure.json

cp tools/design/about_page.html public/about_page.html
node tools/design/shoot.mjs http://localhost:5199/about_page.html \
  tools/design/.work/shots/about-design
rm public/about_page.html

PAGE_SHOT=tools/design/.work/shots/about-build-full.png \
  node tools/design/compare.mjs tools/design/about_sections.json
PAGE_SHOT=tools/design/.work/shots/about-build-full.png \
  PAGE_MEASURE=tools/design/.work/shots/about-build-measure.json \
  node tools/design/ink.mjs tools/design/about_probes.json
```

The news page works the same way again, with `news_page.html`, `news_sections.json`,
`news_measure.json` and `news_probes.json`:

```bash
node tools/design/shoot.mjs http://localhost:5199/news \
  tools/design/.work/shots/news-build tools/design/news_measure.json

cp tools/design/news_page.html public/news_page.html
node tools/design/shoot.mjs http://localhost:5199/news_page.html \
  tools/design/.work/shots/news-design
rm public/news_page.html

PAGE_SHOT=tools/design/.work/shots/news-build-full.png \
  node tools/design/compare.mjs tools/design/news_sections.json
PAGE_SHOT=tools/design/.work/shots/news-build-full.png \
  PAGE_MEASURE=tools/design/.work/shots/news-build-measure.json \
  node tools/design/ink.mjs tools/design/news_probes.json
```

The article view has the same four files under `pernews_*`. It needs a real article id in
the URL, since everything below the header is a CMS row:

```bash
node tools/design/shoot.mjs \
  http://localhost:5199/news/62423990-9701-440f-b22c-286648c357f1 \
  tools/design/.work/shots/pernews-build tools/design/pernews_measure.json

cp tools/design/pernews_page.html public/pernews_page.html
node tools/design/shoot.mjs http://localhost:5199/pernews_page.html \
  tools/design/.work/shots/pernews-design
rm public/pernews_page.html

PAGE_SHOT=tools/design/.work/shots/pernews-build-full.png \
  node tools/design/compare.mjs tools/design/pernews_sections.json
PAGE_SHOT=tools/design/.work/shots/pernews-build-full.png \
  PAGE_MEASURE=tools/design/.work/shots/pernews-build-measure.json \
  node tools/design/ink.mjs tools/design/pernews_probes.json
```

Two caveats on reading those numbers. `compare.mjs` is only meaningful for the news
banner, navigation and hero: the list section holds live CMS rows against the export's
sample cards, so its percentage is content, not drift — and because the live list is
usually shorter than the design's four full rows, the CTA and footer slices fall out of
alignment with the design capture and have to be diffed at their own offsets instead.
`news_probes.json` therefore only probes what the design actually fixes; the card
internals are checked through `news_measure.json`'s DOM boxes, which are exact regardless
of how many rows the CMS returns.

`business_measure.json` reads the `data-probe` attributes on the business components,
which is what keeps the spacing honest: every margin in those files was derived from the
delta between a probe's measured box and the export's own coordinate.
`about_measure.json` does the same, and adds an `s-*` probe on each section root so a
drift can be attributed to the section that caused it rather than to everything below it.

`news_measure.json` follows the about page's convention, with `s-hero` and `s-list` on the
section roots and the first card's pill, title and date under them.

Two about probes need a note. The `japan.*` ones carry an explicit `dy: 108` instead of a
`section`, because the hero's export starts below the 40px banner and 68px navigation
while its section box starts at 0 — every other probe resolves through its `s-*` section
instead. And the leader drawer only exists after a click, so it is captured separately —
scroll the leadership section to +31 (the framing `section1.svg` uses), click a card's
button, then screenshot. Click the **third** card: the drawer opens over the card it was
opened from (left / centred / right), and only the right-hand position is the x=928 the
export draws. Its internal geometry is the same wherever it opens. The news `hero.*` probes carry the same `dy: 108` for the same
reason.

`ink.mjs` and `sample.mjs` resolve a probe's `section` name to the live y offset
recorded by `shoot.mjs`, so probes stay valid as section heights change.

`VIEW_W=390 node tools/design/shoot.mjs ...` captures a mobile viewport.

## What "matching" means

Section heights land on the design exactly (hero 900, about 700, business 743, cta 597,
footer 430; news +3px, join +1px). Residual difference in the `compare.mjs` percentages is
photo resampling (the design embeds full-size PNGs, the build ships resized WebP) and
text antialiasing — the design's type is outlined vector, the build's is live font
rendering, so glyph edges never match pixel-for-pixel.

The business page lands the same way: hero 515, neuron 1943 (panel 1910.2 against the
export's 1910.19), advisor 1226 and cta 597 all sit within 1px of the export, the residue
coming from the exports' fractional panel heights. `compare.mjs` reports 2–3% per section,
all of it photo resampling and glyph edges.

Two things it reports are *expected* divergence rather than drift, because the page reuses
shared components that have since moved on from the exports:

- The design begins with a 40px information banner. That component was removed from the
  site, so the build has no such band — which is why `business_sections.json` carries a
  separate `y` (build) and `dy` (design) per section instead of one shared offset.
- `SiteFooter` was restyled to two link columns and is now 313px against the export's 430,
  so `05-footer` reports ~7%. The business page renders whatever the shared footer is; the
  export is simply older.

The about page lands the same way: every section boundary is within 1px of the export
(mission 992, vision 352, principles 728, leadership 893 against 892, dei 725, cta 597,
footer 430), and every `ink.mjs` probe is within 1px vertically and 2px horizontally.
`compare.mjs` reports 0.8–2.6% per section — the banner's 7.5% and the navigation's 8.7%
are the shared components, and are the same white-on-black-type-over-a-small-area effect
noted above.

Two sections have since been changed on purpose and no longer match their export's height,
so `compare.mjs` will show them shifted. The hero is the header's height plus the export's
482, and the header is 68px alone or 108px with the banner showing. The company table had
its 事業内容 row dropped, which takes 88px off the export's 987 — retake the design
baseline against a matching `about_page.html` before reading a company diff.

Several about residuals are deliberate rather than drift:

- The vision heading is Japanese copy (日本のすべての産業をAIネイティブに) where the export
  sets English on the Japanese page, so `vision.h2` only matches the export on `/en/about`.
  Because Japanese ink starts higher in the line box than Latin, that heading's size and
  the margin above it both follow the language — see the comments in `VisionSection.tsx`.

- `japan.h2` is 12px wider than the export (`dw=+12`). The design's Japanese font gives
  `。` more right bearing than Noto Sans JP does, so the ink runs further into the last
  full-width cell. It is trailing space inside a period, not a size error — the height fit
  says 72px and so does the export's leading.
- `vision.body` and `dei.body1` wrap differently. Several Japanese paragraphs in the
  exports contain a stray mid-sentence space ("本来向 き合う", "組織と産 業",
  "目 指します") left over from a hard wrap in whatever the copy was pasted from.
  `src/components/about/content.ts` drops them, which shifts the line breaks. On the
  centred DEI columns that also shows up as `dx=+7 dw=-13`.

The news page's fixed chrome lands the same way. The hero section is 511 including the
header, against the export's 108 + 403, and `hero.h1` is exact on all four numbers
(`dx=dy=dw=dh=0`) — the rest of the probes are within 1px. The list section's own geometry
is exact too, read off `news_measure.json` rather than a pixel diff: the selects at 134,
the grid at 244, and a card's pill / title / date at 503.57 / 545.4 / 609.8 in the
export's coordinates, on a 442.07px row pitch. With the design's four full rows that puts
the pager at 2008.78 and the section at 2159, both exactly the export's. Diffed at their
real offsets rather than the design capture's, the reused CTA and footer come out at 1.5%
and 1.4%.

Six places needed the export's own tracking rather than the font's natural metrics,
each measured rather than guessed: the 72px business hero heading (-0.045em), the 72px
news hero heading (-0.039em), the ontology chip labels (-0.042em, the group was drawn
tighter before being scaled to 0.863845), the "who it's for" bullets (-0.008em, which
is what keeps them on one line in their column), and the article view's two 54px
headings. Those last two are set separately even though they are the same size: the
article title wants -0.047em, which reproduces all three of the export's lines to within
0.12px, while "関連ニュース" next door wants only -0.012em. 54px itself is confirmed
against the business page's own 54px heading as a calibration row — both read `fitH`
≈52.4-52.9, which is what that method returns for a true 54.

The article view lands the same way, and its numbers are worth recording in full because
almost everything on it is a CMS row rather than a fixed drawing. Read off
`pernews_measure.json`, in the export's own coordinates: the pill at 100.5, the title at
149.2 (three lines of 59.2), the meta row at 362, the cover at 434 x 356.3, the lead at
830.3 x 44, and the body at 915.7 — every one exact. `ink.mjs` puts the lead's gradient
rule and the cover at `dx=dy=dw=dh=0`, the related heading at `dy=0 dw=-3`, and the
"すべてのニュース" button within 1px on all four. `compare.mjs` reports 4.8% for the
article section and 25.1% for the related row; the banner, navigation, CTA and footer come
out at their usual 7.5 / 8.7 / 1.3 / 1.3.

Four residuals there are content, not drift, and none of them is fixable from the design:

- The related row's 25.1% is entirely its cards. The live rows carry no category at all,
  so their pills are empty where the export draws "News" / "Announcement" /
  "Press release", and the three photographs are different. The row's own geometry is
  exact — grid at 219, pill at 478.6, title at 520.4.
- The export breaks the title after "UNCHAIN株式会社、" and again before "SUMMER", and
  breaks the registration URL onto its own line, where all three fit within the 680px
  column. Those are hand breaks in Figma; a title out of the CMS is one string, so the
  build wraps on its own and the section comes out 1981.5 against the export's 2005 — the
  one line the URL break adds. Line count, leading and every other offset match.
- The export's author avatar is a photograph. There is no avatar column on `articles`, so
  the build draws the export's own `#D9D9D9` placeholder circle with a monogram in it.
- `NewsCard` puts the related row's dates at 584.8 where the export has 585.7 on the first
  card and 583.7 on the other two. The export disagrees with itself by 2px there, so the
  shared component's spacing is kept and the section lands at 699.6 against 702.

One news figure is worth recording because it is not obvious from the export. `fitfont.mjs`
reads "ニュース" as fitW 68.5 / fitH 69.5, which looks like a 68px heading; it is 72px, and
the width is short because the export's Japanese font sets katakana tighter than Noto Sans
JP does. `fitH` is the one to trust, as elsewhere — and the built heading's ink box then
matches the export exactly.
