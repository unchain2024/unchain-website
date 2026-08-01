// Code-generate React components for the decorative vector art of each section.
// Path data, gradients and opacities are copied byte-for-byte out of the design
// SVGs so the rendered result is identical to Figma's export.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'src/components/home/art';
fs.mkdirSync(OUT, { recursive: true });

const load = (f) =>
  fs.readFileSync(path.join('public/home', f), 'utf8').replace(/(xlink:href|href)="data:image\/[a-z+]+;base64,[^"]*"/g, '$1="__IMG__"');

/** Pull the <defs> entries whose id is referenced by the kept markup. */
function defsFor(src, markup, extra = []) {
  const defs = (src.match(/<defs>([\s\S]*?)<\/defs>/) || [, ''])[1];
  const wanted = new Set([...markup.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]).concat(extra));
  const out = [];
  for (const m of defs.matchAll(/<(linearGradient|radialGradient|pattern|filter|clipPath)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const id = (m[2].match(/id="([^"]*)"/) || [, ''])[1];
    if (wanted.has(id)) out.push(m[0]);
  }
  return out.join('\n');
}

const numRe = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
/** Bbox of a path's `d`, used to tell decorative art from outlined glyphs.
 *  Walks commands properly — naive number-pairing breaks on H/V/A. */
function bbox(d) {
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  let cx = 0, cy = 0, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of cmds) {
    const op = c[0];
    const v = (c.slice(1).match(numRe) || []).map(Number);
    const rel = op === op.toLowerCase();
    const step = { M: 2, L: 2, C: 6, S: 4, Q: 4, T: 2, A: 7, H: 1, V: 1, Z: 0 }[op.toUpperCase()] ?? 2;
    if (!step) continue;
    for (let i = 0; i + step <= v.length; i += step) {
      const s = v.slice(i, i + step);
      let pts = [];
      if (op.toUpperCase() === 'H') pts = [[rel ? cx + s[0] : s[0], cy]];
      else if (op.toUpperCase() === 'V') pts = [[cx, rel ? cy + s[0] : s[0]]];
      else if (op.toUpperCase() === 'A') pts = [[rel ? cx + s[5] : s[5], rel ? cy + s[6] : s[6]]];
      else for (let k = 0; k + 1 < s.length; k += 2) pts.push([rel ? cx + s[k] : s[k], rel ? cy + s[k + 1] : s[k + 1]]);
      for (const [x, y] of pts) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      if (pts.length) { cx = pts[pts.length - 1][0]; cy = pts[pts.length - 1][1]; }
    }
  }
  return isFinite(minX) ? { w: maxX - minX, h: maxY - minY } : { w: 0, h: 0 };
}

/** <path> elements matching a predicate, in document order. Predicate gets (markup, bbox). */
function paths(src, pred) {
  const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  const out = [];
  for (const m of body.matchAll(/<path\b[^>]*?\/>/g)) {
    const d = (m[0].match(/\sd="([^"]*)"/) || [, ''])[1];
    if (pred(m[0], bbox(d))) out.push(m[0]);
  }
  return out;
}

/** SVG attribute names -> JSX. Only rewrites whole attribute names (never path data). */
const ATTRS = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'flood-opacity': 'floodOpacity',
  'flood-color': 'floodColor',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'stdDeviation': 'stdDeviation',
  'preserveAspectRatio': 'preserveAspectRatio',
  'patternContentUnits': 'patternContentUnits',
  'gradientUnits': 'gradientUnits',
  'filterUnits': 'filterUnits',
  'xlink:href': 'xlinkHref',
  'class': 'className',
};
function toJsx(svg) {
  return svg.replace(/([a-zA-Z-]+:?[a-zA-Z-]*)=/g, (m, name) => (ATTRS[name] ? ATTRS[name] + '=' : m));
}

const files = {
  hero: 'Hero.svg',
  about: 'Section (Original).svg',
  cta: 'CTA Banner - Desktop.svg',
  join: 'Section-2.svg',
};

/* ── HERO: logo-shaped photo collage ─────────────────────────────────────── */
{
  const src = load(files.hero);
  // The collage is the only art in the hero: the logo silhouette (black base +
  // photo pattern + two navy 20% shades) and the four 80% gradient blades.
  // Outlined button/nav glyphs share the same fills, so gate on size too.
  const art = paths(
    src,
    (p, b) =>
      b.w > 200 &&
      b.h > 100 &&
      (/fill="url\(#(pattern0|paint[1-4])/.test(p) || /fill="black"/.test(p) || /fill="#0E3067"/.test(p))
  );
  const markup = art.join('\n');
  // Re-point the pattern at an imported asset instead of the inlined base64 blob.
  // The export indirects through <use href="#image0…">; inline that <image> into the
  // pattern (carrying the <use>'s transform) so nothing depends on a stray def.
  let defs = defsFor(src, markup);
  const imgDef = (src.match(/<image id="image0_96_989"[^>]*\/>/) || [''])[0];
  const imgAttrs = imgDef.replace(/<image id="[^"]*"\s*/, '').replace(/\s*(xlink:href|href)="__IMG__"/, '').replace(/\/>$/, '');
  defs = defs.replace(
    /<use xlink:href="#image0_96_989" transform="([^"]*)"\/>/,
    `<image ${imgAttrs} transform="$1" href={heroPhoto}/>`
  );
  const body = `<svg viewBox="657 145 724 674" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">\n<defs>\n${defs}\n</defs>\n${markup}\n</svg>`;
  fs.writeFileSync(
    path.join(OUT, 'HeroArt.tsx'),
    `/* Generated from public/home/Hero.svg — the logo-shaped photo collage. Do not hand-edit. */\nimport heroPhoto from "@/assets/home/hero-collage.webp";\n\nconst HeroArt = ({ className }: { className?: string }) => (\n${toJsx(body)}\n);\n\nexport default HeroArt;\n`
  );
  console.log('HeroArt.tsx', art.length, 'paths');
}

/* ── ABOUT / CTA / JOIN: corner parallelograms ───────────────────────────── */
const simple = [
  ['AboutArt', files.about, '0 0 1440 700', (p) => /fill="url\(#paint[1-4]_linear/.test(p)],
  ['CtaArt', files.cta, '0 0 1440 597', (p) => /fill="url\(#paint[0-1]_linear/.test(p)],
  ['JoinArt', files.join, '0 0 1440 797', (p) => /fill-opacity="0\.06"/.test(p)],
];
for (const [name, file, viewBox, pred] of simple) {
  const src = load(file);
  const art = paths(src, pred);
  // Section-2 also carries a heavily-blurred glow circle behind the copy.
  if (name === 'JoinArt') {
    const glow = src.match(/<g filter="url\(#filter0_f_96_1141\)">[\s\S]*?<\/g>/);
    if (glow) art.unshift(glow[0]);
  }
  const markup = art.join('\n');
  const defs = defsFor(src, markup, name === 'JoinArt' ? ['filter0_f_96_1141'] : []);
  const body = `<svg viewBox="${viewBox}" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">\n${defs ? `<defs>\n${defs}\n</defs>\n` : ''}${markup}\n</svg>`;
  fs.writeFileSync(
    path.join(OUT, `${name}.tsx`),
    `/* Generated from public/home/${file} — decorative vector art. Do not hand-edit. */\n\nconst ${name} = ({ className }: { className?: string }) => (\n${toJsx(body)}\n);\n\nexport default ${name};\n`
  );
  console.log(`${name}.tsx`, art.length, 'paths');
}
