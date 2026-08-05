// Build the asset set for the about page from the Figma exports in `public/about`.
//   1. photos  -> src/assets/about/*.webp
//   2. vectors -> React components in src/components/about/art/
//
// Every path, gradient, opacity and transform is copied verbatim out of the export, so
// what renders is what Figma drew. Two things are rewritten: base64 rasters become
// imported assets, and `clip-path` groups are dropped because the components are clipped
// by the DOM element they sit in (a card's `overflow-hidden`) rather than in the SVG.
// Change this generator, never the generated files.
//
// Unlike gen_business.mjs this walks the export as a tree instead of a flat element list:
// the about art is nested inside `<g opacity>` and `<g filter>` wrappers that carry part
// of the look, so a subtree has to come out intact. Transforms (matrix/rotate/scale) are
// composed properly too, which is what makes the computed viewBoxes exact.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/about';
const IMG_OUT = 'src/assets/about';
const ART_OUT = 'src/components/about/art';
fs.mkdirSync(IMG_OUT, { recursive: true });
fs.mkdirSync(ART_OUT, { recursive: true });

const HERO = 'Section.svg';
const VISION = 'Section-1.svg';
const PRINCIPLES = 'Section-2.svg';
const LEADERSHIP = 'Section-3.svg';
const DEI = 'Section-4.svg';
const JAPAN = 'Frame 2147226133.svg';
// The leadership section with a leader's detail drawer open. Same section as
// Section-3.svg, shifted 31px down by the header, plus the drawer on top.
const DRAWER = 'section1.svg';

/* ── raster extraction ──────────────────────────────────────────────────── */
/** Every embedded raster of an export, keyed by its `<image>` id. */
function rasters(file) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const out = new Map();
  for (const m of raw.matchAll(
    /<image id="([^"]+)"[^>]*?(?:xlink:href|href)="data:image\/([a-z+]+);base64,([^"]*)"/g
  )) {
    out.set(m[1], { fmt: m[2], buf: Buffer.from(m[3], 'base64') });
  }
  return out;
}

/** Ship enough pixels for a 2x display. */
const DPR = 2;

// [outfile, export, image id, rendered width in CSS px at the design's 1440]
//
// The two hero slots crop their photo: the design scales it to the slot's width and
// centres it, so the rendered width is the slot width and the overflow is vertical.
// The three portraits fill their rect exactly (the pattern transform is a plain scale),
// so their rendered width is the rect's.
const photos = [
  ['mission-briefing.webp', HERO, 'image0_123_1615', 403],
  ['mission-advisor.webp', HERO, 'image1_123_1615', 781],
  ['leader-park.webp', LEADERSHIP, 'image0_123_2364', 418],
  ['leader-ebina.webp', LEADERSHIP, 'image1_123_2364', 418.313],
  ['leader-harada.webp', LEADERSHIP, 'image2_123_2364', 428.84],
];

for (const [out, file, imgId, cssW] of photos) {
  const found = rasters(file).get(imgId);
  if (!found) throw new Error(`${file}: no image #${imgId}`);
  const dest = path.join(IMG_OUT, out);
  const want = Math.ceil(cssW * DPR);
  const srcMeta = await sharp(found.buf).metadata();
  // The portraits are cut-outs sitting on the mosaic, so alpha has to survive.
  await sharp(found.buf)
    .resize({ width: want, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  const short = meta.width < want ? `  (source only ${srcMeta.width}px, wanted ${want})` : '';
  console.log(
    `img  ${out.padEnd(24)} ${meta.width}x${meta.height} ${
      srcMeta.hasAlpha ? 'rgba' : 'rgb '
    } ${Math.round(fs.statSync(dest).size / 1024)}KB${short}`
  );
}

/* ── the export as a tree ───────────────────────────────────────────────── */
const load = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

const SELF_CLOSING = /\/>$/;
/** Parse an SVG body into a shallow tree of `{ tag, attrs, open, children }`. */
function parse(src) {
  const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '').replace(/<\?xml[^>]*\?>/g, '');
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  // The attribute run must not swallow the self-closing slash, or every element would be
  // treated as a container and adopt its following siblings as children.
  const tagRe = /<(\/)?([a-zA-Z][\w:-]*)((?:"[^"]*"|\/(?!>)|[^>"/])*)(\/)?>/g;
  let m;
  while ((m = tagRe.exec(body))) {
    const [raw, closing, tag, attrText, selfClose] = m;
    if (tag === 'svg' && !closing) continue;
    if (tag === 'svg' && closing) continue;
    if (closing) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const attrs = {};
    for (const a of attrText.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    const node = { tag, attrs, open: raw, children: [], selfClosed: Boolean(selfClose) };
    stack[stack.length - 1].children.push(node);
    if (!selfClose) stack.push(node);
  }
  return root;
}

/** Depth-first list of every node. */
function flatten(node, out = []) {
  for (const c of node.children) {
    out.push(c);
    flatten(c, out);
  }
  return out;
}

/* ── transforms ─────────────────────────────────────────────────────────── */
const I = [1, 0, 0, 1, 0, 0];
const mul = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/** Parse an SVG `transform` attribute into a matrix. */
function parseTransform(text) {
  let m = I;
  if (!text) return m;
  for (const t of text.matchAll(/([a-zA-Z]+)\(([^)]*)\)/g)) {
    const v = (t[2].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
    const op = t[1];
    if (op === 'translate') m = mul(m, [1, 0, 0, 1, v[0] || 0, v[1] || 0]);
    else if (op === 'scale') m = mul(m, [v[0] ?? 1, 0, 0, v[1] ?? v[0] ?? 1, 0, 0]);
    else if (op === 'matrix') m = mul(m, v.slice(0, 6));
    else if (op === 'rotate') {
      const a = ((v[0] || 0) * Math.PI) / 180;
      const [c, s] = [Math.cos(a), Math.sin(a)];
      const [cx, cy] = [v[1] || 0, v[2] || 0];
      m = mul(m, [1, 0, 0, 1, cx, cy]);
      m = mul(m, [c, s, -s, c, 0, 0]);
      m = mul(m, [1, 0, 0, 1, -cx, -cy]);
    }
  }
  return m;
}

const numRe = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
/** Corner points of a path's `d`, walking commands so H/V/A stay correct. */
function pathPoints(d) {
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  const pts = [];
  let cx = 0, cy = 0;
  for (const cm of cmds) {
    const op = cm[0];
    const up = op.toUpperCase();
    const rel = op === op.toLowerCase();
    const v = (cm.slice(1).match(numRe) || []).map(Number);
    const step = { M: 2, L: 2, C: 6, S: 4, Q: 4, T: 2, A: 7, H: 1, V: 1, Z: 0 }[up] ?? 2;
    if (!step) continue;
    for (let i = 0; i + step <= v.length; i += step) {
      const s = v.slice(i, i + step);
      let p;
      if (up === 'H') p = [[rel ? cx + s[0] : s[0], cy]];
      else if (up === 'V') p = [[cx, rel ? cy + s[0] : s[0]]];
      else if (up === 'A') p = [[rel ? cx + s[5] : s[5], rel ? cy + s[6] : s[6]]];
      else {
        p = [];
        for (let k = 0; k + 1 < s.length; k += 2)
          p.push([rel ? cx + s[k] : s[k], rel ? cy + s[k + 1] : s[k + 1]]);
      }
      for (const q of p) pts.push(q);
      if (p.length) [cx, cy] = p[p.length - 1];
    }
  }
  return pts;
}

/** Local-space corner points of one drawable node. */
function localPoints(node) {
  const n = (k) => Number(node.attrs[k] || 0);
  if (node.tag === 'rect') {
    const [x, y, w, h] = [n('x'), n('y'), n('width'), n('height')];
    return [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
  }
  if (node.tag === 'circle') {
    const [cx, cy, r] = [n('cx'), n('cy'), n('r')];
    return [[cx - r, cy - r], [cx + r, cy - r], [cx - r, cy + r], [cx + r, cy + r]];
  }
  if (node.tag === 'ellipse') {
    const [cx, cy, rx, ry] = [n('cx'), n('cy'), n('rx'), n('ry')];
    return [[cx - rx, cy - ry], [cx + rx, cy - ry], [cx - rx, cy + ry], [cx + rx, cy + ry]];
  }
  if (node.tag === 'path') return pathPoints(node.attrs.d || '');
  return [];
}

/** Bounding box of a subtree in the export's page coordinates. */
function bbox(node, parentM = I) {
  const m = mul(parentM, parseTransform(node.attrs.transform));
  let box = null;
  const grow = (x, y) => {
    if (!box) box = [x, y, x, y];
    else {
      if (x < box[0]) box[0] = x;
      if (y < box[1]) box[1] = y;
      if (x > box[2]) box[2] = x;
      if (y > box[3]) box[3] = y;
    }
  };
  for (const [x, y] of localPoints(node)) {
    const [px, py] = apply(m, x, y);
    grow(px, py);
  }
  for (const c of node.children) {
    const cb = bbox(c, m);
    if (cb) {
      grow(cb[0], cb[1]);
      grow(cb[2], cb[3]);
    }
  }
  return box;
}

const union = (boxes) =>
  boxes.filter(Boolean).reduce((a, b) => [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ]);

/* ── serialising back to JSX ────────────────────────────────────────────── */
/** SVG attribute names -> JSX. Only rewrites whole attribute names, never path data. */
const ATTRS = {
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray', 'stroke-miterlimit': 'strokeMiterlimit', 'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'clip-path': 'clipPath',
  'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity', 'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-opacity': 'floodOpacity', 'flood-color': 'floodColor', 'stdDeviation': 'stdDeviation',
  'shape-rendering': 'shapeRendering', 'class': 'className', 'xlink:href': 'xlinkHref',
};
const toJsx = (svg) =>
  svg
    .replace(/\sdata-figma-[a-z-]+="[^"]*"/g, '')
    .replace(/([a-zA-Z-]+:?[a-zA-Z-]*)=/g, (m, name) => (ATTRS[name] ? ATTRS[name] + '=' : m));

/**
 * Serialise a subtree. Groups that only exist to clip are dropped — the component is
 * clipped by the element it is placed in — while `opacity` and `filter` groups are kept
 * because they are part of the artwork.
 */
function serialise(node, depth = 0) {
  const pad = '  '.repeat(depth);
  if (node.tag === 'g' && node.attrs['clip-path'] && Object.keys(node.attrs).length === 1) {
    return node.children.map((c) => serialise(c, depth)).join('\n');
  }
  if (node.selfClosed || !node.children.length) {
    const open = node.open.endsWith('/>') ? node.open : node.open.replace(/>$/, '/>');
    return pad + open;
  }
  return `${pad}${node.open}\n${node.children.map((c) => serialise(c, depth + 1)).join('\n')}\n${pad}</${node.tag}>`;
}

/** The <defs> entries the kept markup actually references, followed recursively. */
function defsFor(src, markup) {
  const defs = (src.match(/<defs>([\s\S]*)<\/defs>/) || [, ''])[1];
  const entries = new Map();
  for (const m of defs.matchAll(
    /<(linearGradient|radialGradient|pattern|filter|clipPath|mask|image)\b((?:"[^"]*"|[^>"])*?)(?:\/>|>([\s\S]*?)<\/\1>)/g
  )) {
    const id = (m[2].match(/id="([^"]*)"/) || [, ''])[1];
    if (id) entries.set(id, m[0]);
  }
  const kept = [];
  const seen = new Set();
  let frontier = [...markup.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
  while (frontier.length) {
    const id = frontier.pop();
    if (seen.has(id) || !entries.has(id)) continue;
    seen.add(id);
    const entry = entries.get(id);
    kept.push(entry);
    // A pattern points at an <image>; a filter or gradient can point at more defs.
    frontier.push(
      ...[...entry.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]),
      ...[...entry.matchAll(/(?:xlink:href|href)="#([^"]+)"/g)].map((m) => m[1])
    );
  }
  // Emit in the export's own order so gradients read the same as in Figma.
  return [...entries.entries()].filter(([id]) => seen.has(id)).map(([, v]) => v).join('\n');
}

const r3 = (n) => Math.round(n * 1000) / 1000;

/**
 * Emit one React component from a list of nodes.
 *
 * `box` becomes the viewBox, so the component's intrinsic aspect ratio is the artwork's
 * and callers only ever set width/height. Pass an explicit box when the art has to line
 * up with something else (a card it is clipped to); omit it to use the art's own bounds.
 */
function component(name, src, nodes, { box = null, note = '' } = {}) {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  if (!list.length) throw new Error(`${name}: nothing selected`);
  const markup = list.map((n) => serialise(n, 1)).join('\n');
  const [x0, y0, x1, y1] = box || union(list.map((n) => bbox(n)));
  const defs = defsFor(src, markup);
  const w = r3(x1 - x0);
  const h = r3(y1 - y0);
  const body =
    `<svg width="${w}" height="${h}" viewBox="${r3(x0)} ${r3(y0)} ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">\n` +
    (defs ? `  <defs>\n${defs}\n  </defs>\n` : '') +
    `${markup}\n</svg>`;
  return { name, note, jsx: toJsx(body), size: `${w}x${h}`, count: list.length };
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
  console.log(`art  ${file.padEnd(24)} ${comps.map((c) => `${c.name}[${c.size}]`).join(' ')}`);
}

const H = (f) => `/* Generated by tools/design/gen_about.mjs from public/about/${f}. Do not hand-edit. */`;

/* ── selection helpers ──────────────────────────────────────────────────── */
const trees = {};
const all = {};
for (const f of [HERO, VISION, PRINCIPLES, LEADERSHIP, DEI, JAPAN, DRAWER]) {
  trees[f] = parse(load(f));
  all[f] = flatten(trees[f]);
}
/** Nodes whose own markup fills with one of the named paint ids. */
const byPaint = (file, ids) =>
  all[file].filter((n) => ids.some((i) => (n.attrs.fill || '') === `url(#${i})`));
/** The n-th node matching a tag and attribute pair. */
const nth = (file, tag, attr, value, index = 0) =>
  all[file].filter((n) => n.tag === tag && n.attrs[attr] === value)[index];

const paints = (file, from, to) => {
  const stem = { [HERO]: '123_1615', [PRINCIPLES]: '123_1638', [LEADERSHIP]: '123_2364', [DEI]: '123_1671', [JAPAN]: '123_1603', [DRAWER]: '123_2795' }[file];
  const out = [];
  for (let i = from; i <= to; i++) out.push(`paint${i}_linear_${stem}`);
  return out;
};

/* ── hero: the two gradient blades ──────────────────────────────────────── */
// Drawn on the page, not inside a box: the top-left one runs off the left edge and the
// bottom-right one off the right, so each is placed by its own offset and the section
// clips them.
const hero = load(HERO);
writeModule('HeroArt.tsx', H(HERO), [
  component('BladeTopLeft', hero, byPaint(HERO, paints(HERO, 1, 1)), {
    note: 'Pale blade crossing the top-left corner; design box x -176.4..292.8, y 163..519.7.',
  }),
  component('BladeBottomRight', hero, byPaint(HERO, paints(HERO, 0, 0)), {
    note: 'Navy blade crossing the bottom-right corner; design box x 1205.4..1674.6, y 702.5..1059.2.',
  }),
]);

/* ── principles: everything inside the navy card ────────────────────────── */
// The viewBox is the card itself (116,116 533x496) so the component drops straight into
// the card as `inset-0`, and the art that overhangs is clipped by the card, as in Figma.
const principles = load(PRINCIPLES);
const prinGlow = nth(PRINCIPLES, 'g', 'filter', 'url(#filter0_f_123_1638)');
writeModule('PrinciplesArt.tsx', H(PRINCIPLES), [
  component(
    'PrinciplesCardArt',
    principles,
    [prinGlow, ...byPaint(PRINCIPLES, paints(PRINCIPLES, 0, 1))],
    {
      box: [116, 116, 649, 612],
      note: 'Blurred top-left glow and the two gradient blades inside the navy card.',
    }
  ),
]);

/* ── leadership: the mosaic behind each portrait ────────────────────────── */
// One component for all three cards: the three mosaics in the export are the same drawing
// translated by a card pitch (405.333px), to within Figma's own sub-pixel rounding.
const leadership = load(LEADERSHIP);
// The drawer's own mosaic is the same idea at a larger tile size. Its viewBox is the
// drawer's photo frame, so it also drops in as `inset-0`.
const drawer = load(DRAWER);
writeModule('LeaderArt.tsx', `${H(LEADERSHIP)}\n${H(DRAWER)}`, [
  component('LeaderMosaic', leadership, nth(LEADERSHIP, 'g', 'opacity', '0.5'), {
    box: [120, 332, 509.333, 792],
    note: 'Checkerboard of gradient tiles behind the portrait, clipped to the card.',
  }),
  // section1.svg holds four of these: one per card, then the drawer's. Take the last.
  component('DrawerMosaic', drawer, nth(DRAWER, 'g', 'opacity', '0.5', 3), {
    box: [1018.496, 189, 1317.496, 518.746],
    note: 'The same checkerboard at the drawer\'s larger tile size, clipped to its photo frame.',
  }),
]);

/* ── DEI: the three value icons ─────────────────────────────────────────── */
const dei = load(DEI);
writeModule('DeiArt.tsx', H(DEI), [
  component('IconDiversity', dei, byPaint(DEI, paints(DEI, 1, 8)), { note: 'Plus, built from eight gradient bars.' }),
  component('IconEquity', dei, byPaint(DEI, paints(DEI, 9, 16)), { note: 'Equals sign.' }),
  component('IconInclusion', dei, byPaint(DEI, paints(DEI, 17, 21)), { note: 'Diamond with a diamond core.' }),
]);

/* ── "all of it, from Japan": the torii ─────────────────────────────────── */
const japan = load(JAPAN);
writeModule('JapanArt.tsx', H(JAPAN), [
  component('Torii', japan, byPaint(JAPAN, paints(JAPAN, 0, 4)), {
    note: 'Torii gate in gradient blocks; design box x 808.1..1288, y 70.7..453.3.',
  }),
]);
