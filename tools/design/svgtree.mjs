// Shared machinery for reading a Figma export as a tree and emitting React art from it.
//
// This is the walker `gen_about.mjs` grew: the exports nest art inside `<g opacity>` and
// `<g filter>` wrappers that carry part of the look, so a subtree has to come out intact,
// and `matrix`/`rotate`/`scale` transforms have to compose properly for a computed
// viewBox to be exact. `gen_news.mjs` needs the same thing, so it lives here rather than
// being copied. `gen_about.mjs` predates the split and still carries its own copy —
// leave it be unless you are prepared to diff its generated art afterwards.
import fs from 'node:fs';

/* ── the export as a tree ───────────────────────────────────────────────── */
/** Parse an SVG body into a shallow tree of `{ tag, attrs, open, children }`. */
export function parse(src) {
  const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '').replace(/<\?xml[^>]*\?>/g, '');
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  // The attribute run must not swallow the self-closing slash, or every element would be
  // treated as a container and adopt its following siblings as children.
  const tagRe = /<(\/)?([a-zA-Z][\w:-]*)((?:"[^"]*"|\/(?!>)|[^>"/])*)(\/)?>/g;
  let m;
  while ((m = tagRe.exec(body))) {
    const [raw, closing, tag, attrText, selfClose] = m;
    if (tag === 'svg') continue;
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
export function flatten(node, out = []) {
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
  let cx = 0;
  let cy = 0;
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
export function bbox(node, parentM = I) {
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

export const union = (boxes) =>
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
export function serialise(node, depth = 0) {
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
export function defsFor(src, markup) {
  const defs = (src.match(/<defs>([\s\S]*)<\/defs>/) || [, ''])[1];
  const entries = new Map();
  for (const m of defs.matchAll(
    /<(linearGradient|radialGradient|pattern|filter|clipPath|mask|image)\b((?:"[^"]*"|[^>"])*?)(?:\/>|>([\s\S]*?)<\/\1>)/g
  )) {
    const id = (m[2].match(/id="([^"]*)"/) || [, ''])[1];
    if (id) entries.set(id, m[0]);
  }
  const seen = new Set();
  let frontier = [...markup.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
  while (frontier.length) {
    const id = frontier.pop();
    if (seen.has(id) || !entries.has(id)) continue;
    seen.add(id);
    const entry = entries.get(id);
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
export function component(name, src, nodes, { box = null, note = '' } = {}) {
  const list = (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean);
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
export function writeModule(dir, file, header, comps) {
  const parts = comps.map(
    (c) => `${c.note ? `/* ${c.note} */\n` : ''}export const ${c.name} = ({ className }: Props) => (\n${c.jsx}\n);`
  );
  fs.writeFileSync(
    `${dir}/${file}`,
    `${header}\n\ntype Props = { className?: string };\n\n${parts.join('\n\n')}\n`
  );
  console.log(`art  ${file.padEnd(24)} ${comps.map((c) => `${c.name}[${c.size}]`).join(' ')}`);
}
