// Build the asset set for the business page from the Figma exports in `public/business`.
//   1. photos  -> src/assets/business/*.webp
//   2. vectors -> React components in src/components/business/art/
//
// Every path, gradient and opacity is copied byte-for-byte out of the export, so what
// renders is what Figma drew. Only two things are rewritten: base64 rasters become
// imported assets, and a few monochrome glyphs become `currentColor` so callers can
// tint them. Change this generator, never the generated files.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/business';
const IMG_OUT = 'src/assets/business';
const ART_OUT = 'src/components/business/art';
fs.mkdirSync(IMG_OUT, { recursive: true });
fs.mkdirSync(ART_OUT, { recursive: true });

const HERO = 'Frame 2147226132.svg';
const NEURON = 'Section.svg';
const ADVISOR = 'Section-1.svg';

/* ── raster extraction ──────────────────────────────────────────────────── */
/** Every embedded raster of a design file, in document order. */
function rasters(file) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  return [...raw.matchAll(/<image\b[^>]*?(?:xlink:href|href)="data:image\/([a-z+]+);base64,([^"]*)"/g)].map((m) => ({
    fmt: m[1],
    buf: Buffer.from(m[2], 'base64'),
  }));
}

// Both photo slots stack several opaque layers; only the topmost one is ever visible,
// so that is the only one shipped.
const photos = [
  ['neuron-shot.webp', NEURON, 1, 2.13924],
  ['advisor-shot.webp', ADVISOR, 2, 1.45844],
];

/** The photo slot in both sections, in CSS px at the design width. */
const PHOTO_BOX_W = 580.52;
/** Ship enough pixels for a 2x display. */
const DPR = 2;

for (const [out, file, index, bgScale] of photos) {
  const { buf } = rasters(file)[index];
  const dest = path.join(IMG_OUT, out);
  // The design crops well past `cover`: `background-size` blows the image up to
  // `bgScale` of the slot, so only ~1/bgScale of it is ever on screen. Size for the
  // scaled-up width, not the slot width, or the visible crop lands under 1 device
  // pixel per image pixel and goes soft the moment anything zooms.
  const width = Math.ceil(PHOTO_BOX_W * bgScale * DPR);
  const src = sharp(buf);
  const srcMeta = await src.metadata();
  await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
  const meta = await sharp(dest).metadata();
  const short = meta.width < width ? `  (source only ${srcMeta.width}px, wanted ${width})` : '';
  console.log(
    `img  ${out.padEnd(22)} ${meta.width}x${meta.height} ${Math.round(fs.statSync(dest).size / 1024)}KB${short}`
  );
}

/* ── vector slicing ─────────────────────────────────────────────────────── */
const load = (f) =>
  fs
    .readFileSync(path.join(SRC, f), 'utf8')
    .replace(/(xlink:href|href)="data:image\/[a-z+]+;base64,[^"]*"/g, '$1="__IMG__"');

const numRe = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
/** Bbox of a path's `d`. Walks commands properly — naive number-pairing breaks on H/V/A. */
function pathBox(d) {
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  let cx = 0, cy = 0, a = Infinity, b = Infinity, c = -Infinity, e = -Infinity;
  for (const cm of cmds) {
    const op = cm[0];
    const v = (cm.slice(1).match(numRe) || []).map(Number);
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
      for (const [x, y] of pts) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > e) e = y; }
      if (pts.length) { cx = pts[pts.length - 1][0]; cy = pts[pts.length - 1][1]; }
    }
  }
  return isFinite(a) ? [a, b, c, e] : null;
}

/** Every drawable element of a file as `{ tag, markup, box }`, in document order. */
function elements(src) {
  const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  const out = [];
  for (const m of body.matchAll(/<(path|rect|circle|ellipse)\b([^>]*?)\/?>/g)) {
    const tag = m[1];
    const at = m[2];
    const g = (k) => { const v = at.match(new RegExp(`\\b${k}="([^"]*)"`)); return v ? v[1] : ''; };
    const nu = (k) => Number(g(k) || 0);
    const tr = (g('transform').match(/translate\(([^)]*)\)/) || [, ''])[1].split(/[\s,]+/).map(Number);
    const ox = tr[0] || 0, oy = tr[1] || 0;
    let box;
    if (tag === 'path') box = pathBox(g('d'));
    else if (tag === 'rect') box = [nu('x'), nu('y'), nu('x') + nu('width'), nu('y') + nu('height')];
    else if (tag === 'circle') box = [nu('cx') - nu('r'), nu('cy') - nu('r'), nu('cx') + nu('r'), nu('cy') + nu('r')];
    else box = [nu('cx') - nu('rx'), nu('cy') - nu('ry'), nu('cx') + nu('rx'), nu('cy') + nu('ry')];
    if (!box) continue;
    out.push({
      tag,
      markup: m[0].endsWith('/>') ? m[0] : m[0].replace(/>$/, '/>'),
      box: [box[0] + ox, box[1] + oy, box[2] + ox, box[3] + oy],
    });
  }
  return out;
}

/** Elements fully contained in `[x0,y0,x1,y1]`, with a little slack for stroke overshoot. */
function inside(src, [x0, y0, x1, y1], extra = () => true) {
  return elements(src)
    .filter((e) => e.box[0] >= x0 - 0.7 && e.box[1] >= y0 - 0.7 && e.box[2] <= x1 + 0.7 && e.box[3] <= y1 + 0.7)
    .filter((e) => extra(e))
    .map((e) => e.markup);
}

/** The <defs> entries whose id the kept markup actually references. */
function defsFor(src, markup) {
  const defs = (src.match(/<defs>([\s\S]*?)<\/defs>/) || [, ''])[1];
  const wanted = new Set([...markup.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]));
  const out = [];
  for (const m of defs.matchAll(/<(linearGradient|radialGradient|pattern|filter|clipPath)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    if (wanted.has((m[2].match(/id="([^"]*)"/) || [, ''])[1])) out.push(m[0]);
  }
  return out.join('\n');
}

/** SVG attribute names -> JSX. Only rewrites whole attribute names, never path data. */
const ATTRS = {
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray', 'stroke-miterlimit': 'strokeMiterlimit', 'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'clip-path': 'clipPath',
  'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity', 'gradientUnits': 'gradientUnits',
  'shape-rendering': 'shapeRendering', 'class': 'className',
};
const toJsx = (svg) =>
  svg
    .replace(/\sdata-figma-[a-z-]+="[^"]*"/g, '')
    .replace(/([a-zA-Z-]+:?[a-zA-Z-]*)=/g, (m, name) => (ATTRS[name] ? ATTRS[name] + '=' : m));

const r3 = (n) => Math.round(n * 1000) / 1000;

/**
 * Emit one React component. `box` becomes the viewBox, so the component's intrinsic
 * aspect ratio is the artwork's and callers only ever set width/height.
 */
function component(name, src, box, { recolor = null, only = () => true, note = '' } = {}) {
  let markup = inside(src, box, only).join('\n');
  if (recolor) for (const c of recolor) markup = markup.replaceAll(`"${c}"`, '"currentColor"');
  const defs = defsFor(src, markup);
  const [x0, y0, x1, y1] = box;
  const vb = `${r3(x0)} ${r3(y0)} ${r3(x1 - x0)} ${r3(y1 - y0)}`;
  // Intrinsic size = the artwork's own size, so an icon dropped in without a
  // className renders at exactly the dimensions Figma drew it at. A className
  // with width/height utilities still wins over the attributes.
  const body =
    `<svg width="${r3(x1 - x0)}" height="${r3(y1 - y0)}" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">\n` +
    (defs ? `<defs>\n${defs}\n</defs>\n` : '') +
    `${markup}\n</svg>`;
  return { name, note, jsx: toJsx(body), count: markup ? markup.split('\n').length : 0 };
}

/** Write several components into one module. */
function writeModule(file, header, comps) {
  const parts = comps.map(
    (c) => `${c.note ? `/* ${c.note} */\n` : ''}export const ${c.name} = ({ className }: Props) => (\n${c.jsx}\n);`
  );
  fs.writeFileSync(
    path.join(ART_OUT, file),
    `${header}\n\ntype Props = { className?: string };\n\n${parts.join('\n\n')}\n`
  );
  console.log(`art  ${file.padEnd(22)} ${comps.map((c) => `${c.name}(${c.count})`).join(' ')}`);
}

const hero = load(HERO);
const neuron = load(NEURON);
const advisor = load(ADVISOR);

const H = (f) => `/* Generated by tools/design/gen_business.mjs from public/business/${f}. Do not hand-edit. */`;

/* Hero — the four-blade gradient star. */
writeModule('HeroArt.tsx', H(HERO), [
  component('HeroStar', hero, [882.5, 58, 1281.5, 457], { note: 'Four 80%-opacity gradient blades forming the star.' }),
]);

/* Section numerals and the Neuron wordmark. */
writeModule('Marks.tsx', `${H(NEURON)}\n${H(ADVISOR)}`, [
  component('NumberOne', neuron, [124.87, 129.48, 182.08, 177.47], { note: 'Display "01".' }),
  component('NumberTwo', advisor, [119.77, 129.48, 187.18, 177.47], { note: 'Display "02".' }),
  component('NeuronWordmark', neuron, [123.13, 213.65, 301.35, 257.25], {
    recolor: ['black'],
    note: 'Neuron mark + wordmark, tintable.',
  }),
  component('NeuronMarkSmall', neuron, [1255.7, 1766.46, 1272.06, 1784.61], {
    recolor: ['#535862'],
    note: 'Neuron mark in the ontology platform bar.',
  }),
  component('ExternalArrow', neuron, [255, 425.95, 265, 435.95], {
    recolor: ['#414651'],
    note: 'Arrow on the "service site" button — 10x10, unlike the 12x12 one on the home page.',
  }),
]);

/* The four "what Neuron does" card illustrations. */
writeModule('CardArt.tsx', H(NEURON), [
  component('RiskRadarArt', neuron, [202.9, 901.09, 319.13, 1017.32]),
  component('DecisionMemoryArt', neuron, [506, 898, 628.92, 1020.93]),
  component('ContextArt', neuron, [822, 899, 924.88, 1019.22]),
  component('AskAnythingArt', neuron, [1117, 898, 1241.19, 1020.88], {
    // The 124x124 white backing rect would punch a hole in the card; drop it.
    only: (e) => e.tag !== 'rect',
  }),
]);

/* Ontology diagram — connectors and the platform slab, drawn behind live DOM chips. */
const ONTOLOGY = [682, 1247.19, 1324, 1826.19];
writeModule('OntologyArt.tsx', H(NEURON), [
  component('OntologyLines', neuron, ONTOLOGY, {
    // Everything vector except the panel itself and the chips (those are real DOM).
    only: (e) => e.tag === 'path' && /stroke="#A4A7AE"|stroke="#D5D7DA"|paint3[567]_linear/.test(e.markup),
    note: 'Dashed source connectors, the graph edges and the platform slab.',
  }),
]);

/* Chip glyphs. Each is a 20x20-ish stroke icon sitting inside a pill. */
const CHIP_ICONS = [
  ['IconProjectTools', [791.29, 1342.15, 805.11, 1359.42]],
  ['IconWorkforce', [1054.76, 1343.01, 1072.04, 1358.56]],
  ['IconDocStorage', [768.83, 1405.21, 786.1, 1420.76]],
  ['IconErp', [987.38, 1405.21, 1004.66, 1420.76]],
  ['IconWarehouse', [1120.41, 1405.21, 1137.69, 1420.76]],
  ['IconChat', [730.88, 1467.4, 746.43, 1482.95]],
  ['IconEmail', [898.47, 1468.27, 915.74, 1482.09]],
  ['IconCrm', [1038.58, 1467.4, 1055.86, 1482.95]],
  ['IconSpreadsheet', [1177.66, 1467.4, 1193.21, 1482.95]],
  ['IconRisk', [922.37, 1645.62, 935.71, 1657.3]],
  ['IconOpenItem', [1017.58, 1609.04, 1030.54, 1621.99]],
  ['IconPerson', [1040.47, 1695.2, 1050.84, 1706.87]],
  ['IconTask', [1158.82, 1637.54, 1169.19, 1650.5]],
  ['IconDecision', [807.67, 1618.54, 820.63, 1631.5]],
  ['IconOutcome', [903.99, 1714.42, 914.35, 1727.38]],
  ['IconProject', [1168.75, 1712.48, 1181.71, 1724.14]],
  ['IconLesson', [781.75, 1702.98, 794.71, 1714.64]],
];
writeModule(
  'OntologyIcons.tsx',
  H(NEURON),
  CHIP_ICONS.map(([name, box]) => component(name, neuron, box))
);

/* "Who it's for" bullets. */
writeModule('AdvisorIcons.tsx', H(ADVISOR), [
  component('IconTarget', advisor, [904.67, 950.86, 921.33, 967.52], { recolor: ['#414651'] }),
  component('IconExperiment', advisor, [905.5, 1011.69, 920.5, 1026.69], { recolor: ['#414651'] }),
  component('IconSparkle', advisor, [904.67, 1070.86, 921.33, 1087.52], { recolor: ['#414651'] }),
]);
