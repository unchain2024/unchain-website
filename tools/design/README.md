# Design pipelines

Nine pages are built one-to-one from Figma exports: the **home** page in
`src/components/home/` from `public/home/`, the **business** page in
`src/components/business/` from `public/business/`, the **about** page in
`src/components/about/` from `public/about/`, the **news** page in
`src/components/news/` from `public/news/`, the **career** page in
`src/components/career/` from `public/carrers/`, the **terms of use** page in
`src/components/terms/` from `public/termofuse/`, the **privacy policy** page in
`src/components/privacy/` from `public/privacy-policy/`, the **contact** page in
`src/components/contact/` from `public/contact/`, and the **trust & security** page in
`src/components/trust/` from `public/trust-security/`. Those exports outline all text to
paths and inline every photo as base64, so nothing in them is directly usable — these
scripts turn them into real assets and then verify the built page against them.

Scratch output goes to `tools/design/.work/` (git-ignored).

The inspection scripts (`svg_probe`, `svg_layout`, `svg_lines`, `perpath`, `svg_render`,
`crop`, `zoom`, `fitfont`, `gradient_css`) and the verification scripts (`shoot`,
`compare`, `ink`, `sample`) take a path, so they work on any of the sets. `compare.mjs`
reads the build capture from `$PAGE_SHOT`; `ink.mjs` takes `$PAGE_SHOT` and
`$PAGE_MEASURE` and defaults to the home page's.

The business, about, news, career and trust & security pages' CTA banner and footer exports
are pixel-identical to the home page's, so `CtaSection` and `SiteFooter` are reused rather
than rebuilt. (The career set's `CTA Banner - Desktop.svg` is byte-identical to the about and
news sets' once Figma's generated ids are normalised, and its footer to the news set's.) The
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

`public/termofuse/` is the smallest set: two exports, no photos, no CTA banner and no
footer of its own. `Frame 2147226133.svg` (1440x660) is the hero — an 80px gutter, a 72px
heading hand-broken across two lines, the date under it, and a two-blade gradient corner
whose right-hand blade runs *past* the frame to x=1661.37, which is why `TermsHero` puts
the `overflow-hidden` on the 1440 frame rather than the section and crops it exactly where
the export does. `Section.svg` (1440x1363) is the whole policy in one #F5F5F5 panel inset
16px and rounded 16px, on a 648px column centred in the frame. Nothing needs extracting —
the only art is those two blades, transcribed verbatim into
`src/components/terms/art/HeroArt.tsx`. Since the set draws no footer, the page closes with
the shared `SiteFooter`, and draws no CTA banner because the export has none.

`public/privacy-policy/` is the terms set's twin — same two exports, same frame sizes, no
photos, no CTA banner, no footer. Its `Frame 2147226133.svg` (1440x660) draws the *same*
gradient corner, byte-identical once Figma's generated gradient ids are normalised, so
`PrivacyHero` imports `GradientCorner` from the terms page rather than transcribing it
again. Where the two diverge is the panel: `public/termofuse/Section.svg` is one heading
over a numbered list, while `public/privacy-policy/Section.svg` (1440x3422) is eleven
numbered sections of prose and bulleted lists, so `PolicyBody` is built out of four layout
primitives instead of a single pass.

Its geometry, read off the export's ink boxes and then confirmed against the built page —
all eleven headings land on the export's own y, and the section, panel and column boxes are
exact (728 = 68 + 660, 3422, 1408x3390, x=396 w=648):

- 16px/22px body copy in `#414651`; 20px bold black headings on a 28px leading; the contact
  desk name in 16px black.
- 40px above every numbered heading, 12px below it, and 12px between the blocks inside a
  section. The panel's padding is 102 top / 98 bottom, not a symmetric 100.
- 12px between list items over a **26px minimum item height**. That floor is what makes the
  export's two spacings agree — single-line items sit 38px apart, wrapped ones n*22 + 12 —
  and a plain gap alone cannot produce both. Paragraphs must *not* get the same floor:
  giving it to them puts everything below section 3 four pixels low.
- Bullets are 6px `#A4A7AE` dots centred 12.4px into the item's first line, 12px in from the
  column and 12px clear of the text, which starts at x=426.
- The 72px hero heading needs the same -0.039em the terms and news heroes do.

Both this page and the terms page need `line-break: strict` and `text-spacing-trim:
space-all` on every paragraph to break where Figma drew them; without the pair the intro
alone fits an extra character on two of its six lines.

Two residuals are the export's own. It sets the contact address ~11% narrower than Inter
does at 16px (174px against 194), and `11. アクセス履歴の取得` 5px narrower than Noto Sans JP
does — the same katakana-tracking effect noted for the news heading below.

Unlike every other page here, `PolicyBody` writes its copy out literally in both languages
in the JSX rather than mapping it out of a `content.ts`. That is deliberate and requested:
the drawing is identical on `/privacy-policy` and `/en/privacy-policy` and only the copy
changes, and keeping it inline keeps it selectable and translatable where it is read.

`public/trust-security/` is the trust & security page under `/trust-security`, built in
`src/components/trust/`. Six exports, all pure vector, running the page top to bottom:
`Frame 2147226132.svg` (1440x561) is the hero — an 80px gutter, a 72px heading hand-broken
across three lines, a 16px paragraph, and the gradient shield anchored 160.9px from the right
edge. Like the business hero and unlike the about and news ones, it has no navigation band of
its own, so the navigation is drawn *over* the section and the copy's own top padding clears
it. `Section.svg` (1440x752) is four 288x320 cards on the 120px gutter, `Section-1.svg`
(1440x961) the isometric layer stack in a #F5F5F5 panel with four label cards leadered off
it, and `Section-2.svg` (1440x726) three 98px policy rows. The last two,
`CTA Banner - Desktop.svg` and `Footer - Desktop.svg`, are the home page's.

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

The career set is all vector too — no photos, no embedded rasters at all — so its generator
only emits art, off the same shared walker:

```bash
node tools/design/gen_career.mjs      # vector art -> src/components/career/art/*.tsx
```

It takes the briefcase out of the hero, the three card glyphs out of `Section.svg` and the
three numerals out of `Section-2.svg`. What it deliberately leaves behind is
`Section-1.svg`'s four pill strokes (`paint0..3_linear_135_2383`): those are a gradient
*border* on a live filter chip, so they stay CSS — see `RolesSection.tsx`.

The contact set is the smallest of all — its only art is the two gradient blades that run
off the top-right and bottom-left corners, so its generator emits those and nothing else:

```bash
node tools/design/gen_contact.mjs     # vector art -> src/components/contact/art/*.tsx
```

The trust & security set is all vector as well, and its generator emits two kinds of thing:

```bash
node tools/design/gen_trust.mjs       # vector art + stroked glyphs
                                      #   -> src/components/trust/art/*.tsx
```

The gradient drawings (the hero shield, the four card glyphs, the isometric layer stack and
its leader line) come out the usual way. So do five *stroked* glyphs — the four 24x24 icons
in the layer labels' black discs and the policy rows' 20x20 document mark. Those would
normally be hand-copied into an `icons.tsx`, which is what the rest of the site's icons are,
but each is a single 1.5-2.5KB path drawn at its place on the 1440 canvas, so the generator
translates them to a 0,0 origin and switches the colour to `currentColor` instead. The
translation only shifts coordinates — `H`/`V` and `A`'s radii and flags are handled per
command, nothing is scaled — and the generator proves it: every glyph it writes is rendered
against the same region of the export at 8x and the run fails if any subpixel is off by more
than a shade. All five come out at 1/255, which is the 3dp coordinates landing a hair
differently on an antialiased edge; a real shift would move whole pixels.

Two things in that set are deliberately *not* art. The numerals 01..04 on the layer stack
are live text (see below), and every hairline in these exports is a border on a real box —
the card outlines, the policy rules, the arrow buttons — so they are CSS.

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

The career page works the same way again, with `career_page.html`, `career_sections.json`,
`career_measure.json` and `career_probes.json`. Its sections carry both a `y` (build) and a
`dy` (design) because the build's hero reserves the 68px header the design capture has no
band for:

```bash
node tools/design/shoot.mjs http://localhost:5199/career \
  tools/design/.work/shots/career-build tools/design/career_measure.json

cp tools/design/career_page.html public/career_page.html
node tools/design/shoot.mjs http://localhost:5199/career_page.html \
  tools/design/.work/shots/career-design
rm public/career_page.html

PAGE_SHOT=tools/design/.work/shots/career-build-full.png \
  node tools/design/compare.mjs tools/design/career_sections.json
PAGE_SHOT=tools/design/.work/shots/career-build-full.png \
  PAGE_MEASURE=tools/design/.work/shots/career-build-measure.json \
  node tools/design/ink.mjs tools/design/career_probes.json
```

`career_probes.json` also probes the art — the briefcase, the three card glyphs and the
three numerals — because that page places every one of them by an explicit offset rather
than by centring it, so a wrong number would otherwise only show up as a percentage.

The terms-of-use page has the same files under `terms_*`, plus a `terms_fit.json` for the
size solving. Its sections carry a separate `y` (build) and `dy` (design) for the same
reason the career page's do — the design set has no navigation export, so the build's 68px
header has no band in the design capture:

```bash
node tools/design/shoot.mjs http://localhost:5199/terms-of-use \
  tools/design/.work/shots/terms-build tools/design/terms_measure.json

cp tools/design/terms_page.html public/terms_page.html
node tools/design/shoot.mjs http://localhost:5199/terms_page.html \
  tools/design/.work/shots/terms-design
rm public/terms_page.html

PAGE_SHOT=tools/design/.work/shots/terms-build-full.png \
  node tools/design/compare.mjs tools/design/terms_sections.json
PAGE_SHOT=tools/design/.work/shots/terms-build-full.png \
  PAGE_MEASURE=tools/design/.work/shots/terms-build-measure.json \
  node tools/design/ink.mjs tools/design/terms_probes.json
```

The privacy-policy page has `privacy_measure.json` and `privacy_probes.json`. It has no
`compare.mjs` pair: with only two exports and no photos there is nothing a pixel diff would
catch that the ink boxes do not, and the probes cover both frames directly.

```bash
node tools/design/shoot.mjs http://localhost:5199/privacy-policy   tools/design/.work/shots/privacy-build tools/design/privacy_measure.json

PAGE_SHOT=tools/design/.work/shots/privacy-build-full.png   PAGE_MEASURE=tools/design/.work/shots/privacy-build-measure.json   node tools/design/ink.mjs tools/design/privacy_probes.json
```

`terms_probes.json` has no probe for the panel's `#D5D7DA` rule: against the panel's
`#F5F5F5` its contrast is under `ink.mjs`'s 40-level threshold, so neither side resolves.
The rule is checked through `terms_measure.json`'s DOM box instead, which puts it at
1158.2 against the export's stroke centre of 1159.

The contact page has `contact_page.html`, `contact_sections.json`, `contact_measure.json`,
`contact_probes.json` and `contact_fit.json`. Its design set has no navigation export, so
`contact_page.html` borrows the news set's to put the frame at the height the build renders
it, and every section then shares one offset:

```bash
node tools/design/shoot.mjs http://localhost:5199/contact \
  tools/design/.work/shots/contact-build tools/design/contact_measure.json

cp tools/design/contact_page.html public/contact_page.html
node tools/design/shoot.mjs http://localhost:5199/contact_page.html \
  tools/design/.work/shots/contact-design
rm public/contact_page.html

PAGE_SHOT=tools/design/.work/shots/contact-build-full.png \
  node tools/design/compare.mjs tools/design/contact_sections.json
PAGE_SHOT=tools/design/.work/shots/contact-build-full.png PAGE_MEASURE=none \
  node tools/design/ink.mjs tools/design/contact_probes.json
```

It is the only set whose two exports are the same drawing in two *states* rather than two
parts of the page, so it has a second pass for the filled one. `contact_filled.mjs` types
the filled export's own values into the live form — through the native value setter and an
`input` event, since React owns the fields — and captures the frame, which
`contact_filled_sections.json` and `contact_filled_probes.json` then read:

```bash
node tools/design/contact_filled.mjs
PAGE_SHOT=tools/design/.work/shots/contact-filled.png \
  node tools/design/compare.mjs tools/design/contact_filled_sections.json
PAGE_SHOT=tools/design/.work/shots/contact-filled.png PAGE_MEASURE=none \
  node tools/design/ink.mjs tools/design/contact_filled_probes.json
```

Both contact probe runs pass `PAGE_MEASURE=none`: every probe carries the section's fixed
`dy: 68` rather than resolving through a measured offset, because the page has exactly one
section and its height is nailed by the export.

`contact_probes.json` drops two things it cannot read. The fields' `#D5D7DA` bottom rules
and the unchecked consent box's `#D5D7DA` border are both under `ink.mjs`'s 40-level
threshold against white, so neither side resolves; they are checked through
`contact_measure.json`'s DOM boxes instead, which put every rule on the export's own
coordinate exactly. The checked box *is* probed, in `contact_filled_probes.json`, where it
is solid black.

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

The trust & security page has the same four files under `trust_*`:

```bash
SETTLE_MS=2500 node tools/design/shoot.mjs http://localhost:5199/trust-security \
  tools/design/.work/trust/build tools/design/trust_measure.json

cp tools/design/trust_page.html public/trust_page.html
node tools/design/shoot.mjs http://localhost:5199/trust_page.html \
  tools/design/.work/trust/design
rm public/trust_page.html

PAGE_SHOT=tools/design/.work/trust/build-full.png \
  node tools/design/compare.mjs tools/design/trust_sections.json
PAGE_SHOT=tools/design/.work/trust/build-full.png \
  PAGE_MEASURE=tools/design/.work/trust/build-measure.json \
  node tools/design/ink.mjs tools/design/trust_probes.json
```

`VIEW_W=390 node tools/design/shoot.mjs ...` captures a mobile viewport.

`SETTLE_MS=<ms>` waits that much longer before the screenshot, on top of the usual 600ms.
Resizing the viewport to the full page height brings every section into view at once, so any
scroll-reveal that had not fired during the scroll pass starts *then* — and a 1s reveal on a
stagger delay is still moving 600ms later, which lands in the capture as a few pixels of
downward drift on the last cards in a row. The DOM boxes `shoot.mjs` reads afterwards are
unaffected, so this only matters for `ink.mjs` and `compare.mjs`; 2500 is enough for the
longest stagger on the site. The default is 0, so existing captures are unchanged.

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

The career page lands the same way. Every section boundary is exactly the export's — hero
550 (the 68px header plus 482), why 852, roles 982, process 673 — and every `ink.mjs` probe
is within 1px vertically; the widest horizontal residue is 4px on a Japanese paragraph and
1px on everything else. `compare.mjs` reports 0.8–1.3% per section, all of it glyph edges.
The footer's 7.2% is the restyled `SiteFooter` noted above, not drift.

Four career figures are worth recording:

- The roles export draws its first row white on Figma's `dy 10 / blur 10 / black 4%` shadow
  with a solid black arrow, and the other three transparent with a hairline arrow. That is
  one row in two states, so the white plate is the row's hover/focus style. Hovered, the
  section comes out at 2.4% against the export — and all of that is the site navigation
  sitting over the top of the scrolled capture, which the export has no band for.
- Both 72px hero lines need the export's own tracking (-0.039em, the same correction the
  news hero makes) to land on its 298.2 / 437.4px ink measures. It is applied on the
  Japanese setting only: the English hero is Latin and needs none.
- Every 20px Japanese title on the page sits 2px lower in its line box in the export than
  Noto Sans JP puts it, so the why cards' top padding, the process columns' and the role
  rows' title margin all carry that 2px. Measured, not guessed — all three read `dy=-2`
  before it and `dy=0` after.
- The body paragraphs are set `line-break: strict`. Chrome's default rules let a small kana
  or a long-vowel mark start a line and the design's do not, and with strict on, every
  paragraph in the set breaks where Figma drew it — including the why cards' second
  paragraph, which is 24px out without it. It is also what makes one measure (342px) satisfy
  all three process columns at once; the hero's 468px is the width that keeps its break
  after "テクノロジー".

The terms-of-use page lands the same way. The hero section is the 68px header plus the
export's 660, the policy panel is 1362.8 against the export's 1363, and every `ink.mjs`
probe is `dy=0` — the 72px heading and the 48px `基本方針` at `dx=dy=dw=dh=0`, the intro,
item 6 and the contact label the same, item 1 within 1px. `compare.mjs` reports 0.7% for
the hero and 1.8% for the panel, all of it glyph edges. Its 72px heading takes the news
hero's -0.039em tracking, which reproduces the export's 402.2 / 405.1px lines exactly.

Three residuals there are deliberate:

- The heading's two lines are hardcoded. Figma broke it mid-word ("情報セキュリ" /
  "ティ基本方針") and letting the browser wrap it at any width would not reproduce that.
- The signature runs 3px wide and the email 2px, both the export's font being narrower than
  Inter on a Latin run. Neither is worth tracking in: at 16px bold and 14px the correction
  would be under 0.01em, inside the noise the fit method itself carries.
- Item 3's first two lines each hold one more character than the export's, because the
  export has a stray leading space there and the content drops it (see `content.ts`).

The contact page lands the same way, and its numbers are worth recording in full because
almost every one of them is exact. The section is 1120 — the 68px header plus the export's
1052 — and the card is 620x812 at x=700, y=188, which is the export's rect to the pixel.
Read off `contact_measure.json` in the export's own coordinates, so is everything in it:
the four labels' boxes at 160 / 342 / 449 / 556, the pill rows at 194 and 260, the three
field boxes at 372 / 479 / 586, the two-column split at 740+254 / 1026+254, the consent row
at 789 and the button at 842..892. That stack sums to the export's 812 rather than being
told it. `compare.mjs` reports 1.1% for the empty form and 2.3% for the filled one, all of
it glyph edges; the navigation's 8.1% and the footer's 7.2% are the shared components,
which the other pages report the same way.

`ink.mjs` puts the pills, the message placeholder, the consent line, the button, the
checked consent box and the top-right blade at `dx=dy=dw=dh=0`, and the heading, the
standfirst, the labels and the button label within 1px on every number.

Four figures on that page were measured rather than carried over from the other heroes, and
two of them differ from what those pages use:

- The display heading is 72px like the business and news heroes, but **600**, not 700. At
  72px the export's median ink run is 8.13px with a 15.33px upper quartile, and Noto Sans JP
  at 600 gives 8.13 / 15.46 where 700 gives 9.25 / 19.13. Its tracking is -0.044em, which
  is the business hero's -0.045em again, and `fitfont.mjs` reads it as 69.9 for the same
  reason it reads the news hero's 72 as 69.5.
- The pills and the button label are **500**, not 400: the export draws `デ` with a 1.7px
  bar against body copy's 1.3px, and `送信内容を確認` with a 1.54px median run, which is
  exactly what 500 gives. Everything else on the page — copy, labels, consent line, field
  values and placeholders — is 400, at 16px except the 20px field values.
- The card's padding is 39px, not 40. Figma measures its 40px inset from the frame edge and
  draws the 1px stroke inside it; CSS `border-box` adds the border on top of the padding, so
  `p-10` would put the 540px column at 741.
- The pills are 24px of side padding on a 50px pill, which reproduces the export's
  166 / 161 / 146 / 146 widths from the label advances alone.

Four residuals are the export's own or the browser's, and none is fixable from the design:

- The three placeholders that contain Latin run wide — `UNCHAIN株式会社` by 6px, `山田 太郎`
  and `you@company.com` by 2 — and the filled email by 3. That is the export's Latin face
  being narrower than Inter, the same thing the terms page's signature and email show.
- The filled state's three inputs read `dy=+3`. Chrome renders a typed value about 2px
  below the placeholder in the same box — verified against a bare input, and no combination
  of padding, line-height or content height removes it — and the export draws the value 1px
  *above* its placeholder. The empty export is what the card is aligned to and its
  placeholders are exact, so that is where the padding is set.
- `art.bladeBL` reads `dy=2 dw=-4`. That is `ink.mjs` rasterising the design through
  librsvg while the build comes from Chrome: the blade's pale end (`#D9EEFA`) sits near
  enough to white that the two renderers disagree about where its antialiased diagonal
  crosses the threshold. Diffed Chrome-to-Chrome the same region is within 17/255 on 0.01%
  of its pixels. The high-contrast `art.bladeTR` is `dx=dy=dw=dh=0`.
- The message textarea has to be `display: block`. Left inline it sits on its parent's
  baseline, which adds a descender under the box and walks the consent row and the button
  7.6px down the card.

Two probes are absent for the reason the terms page's rule probe is: the fields' `#D5D7DA`
bottom rules and the unchecked consent box's border are both under `ink.mjs`'s threshold
against white. `contact_measure.json` covers them exactly instead.

The page has no CTA banner — the form is the call to action — and its footer export is
pixel-identical to the home page's, so `SiteFooter` is reused. Its two exports stop at the
submit button, so the sent state is not drawn anywhere: it is built from the scale the card
already uses, the 20px value size over the 16px standfirst.

The trust & security page lands the same way. Every section boundary is the export's:
hero 561, approach 751.9 against 752, layers 961, policies 726, cta 597. `ink.mjs` puts
every probe at `dy=0` bar one, `dx` within 1 and `dw` within 2, and the shield is
`dx=dy=dw=dh=0`. `compare.mjs` reports 2 / 2.3 / 1.1 / 0.9 / 1.3% for the five, all of it
glyph edges — the layer plates, the card outlines and the policy rules do not show in the
difference sheets at all.

Four things there are worth recording:

- The 54px headings in this export are set about 0.6% tighter than the business page's own
  54px heading, which fits at the font's natural tracking. `trust_fit.json` reads its six
  heading lines at `fitW` 53.3-53.9 against the calibration row's 54.05, so they carry
  `-0.006em`. That is the mean: it leaves the approach heading 2px wide and the layers and
  policies headings 2px narrow, because the export's per-glyph widths differ from Noto Sans
  JP's in both directions. Nothing more is recoverable from one tracking value.
- The plate numerals 01..04 are live text in an SVG overlay sharing the stack's viewBox,
  which is what keeps them on their plate at every width while staying selectable and
  translatable. The export sets them in a much narrower face than Inter — `fitW` 24.1-24.5
  against `fitH` 28.6-29.4 on the same glyphs — so at 28px, which lands the cap height, the
  ink still runs 2px wide on a 27px numeral. `fitH` is the one to trust, as elsewhere.
- The policy rows' 16px label is nudged 2px down. It is centred on the row the way the
  export centres it, but Noto Sans JP sets 16px ink that much higher in the line box than
  the export's face does.
- The policy rows' arrow needs `overflow-visible` on the shared `ChevronRight`. That glyph's
  viewBox is the path's own 6x12, so the outer half of its 2px stroke falls outside the
  canvas and Chrome clips it; the export draws the full 8x14 ink. Letting it overflow takes
  the button from `dw=-2 dh=-2` to exact. The same clip is on every other page that uses the
  glyph, and is left alone there rather than changed site-wide from this page.

Two divergences are not this page's. The build has no 40px information banner, since that
component was removed from the site — this set draws no banner either, so unlike the
business page's the offsets need no `dy` split. And `SiteFooter` is 313px against this
export's 430 (panel 281 against 398): the shared footer was deliberately restyled to two
link columns, which is why `06-footer` reports 7.2% here exactly as it does elsewhere. The
page renders whatever the shared footer is.

One copy note. The hero paragraph reads `人による コントロール` in the export, with a stray
space left over from a hard wrap in whatever the copy was pasted from — the same artifact
several about-page paragraphs carry. `src/components/trust/content.ts` drops it, so the
built line breaks a character later than the export's. The English card bodies are written
to two lines: the cards are the export's fixed 320px, so a third line would be clipped.
