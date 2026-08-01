// Build the production asset set for the new home page:
//  1. photos  -> optimised .webp in src/assets/home/
//  2. vectors -> standalone .svg slices (logo, icons) cut out of the design files by bbox
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAW = 'tools/design/.work/raw';
const IMG_OUT = 'src/assets/home';
const SVG_OUT = 'src/assets/home';
fs.mkdirSync(IMG_OUT, { recursive: true });

/* ── 1. photos ─────────────────────────────────────────────────────────── */
const photos = [
  ['hero-0.png', 'hero-collage.webp', 1400],
  ['section-1.png', 'business-neuron.webp', 1200],
  ['section-2.png', 'business-advisor.webp', 1200],
  ['section-1-0.png', 'news-1.webp', 1152],
  ['section-1-1.png', 'news-2.webp', 1152],
  ['section-1-2.png', 'news-3.webp', 1152],
  ['section-2-0.png', 'join-1.webp', 800],
  ['hero-0.png', 'join-2.webp', 800],
  ['section-2-2.png', 'join-3.webp', 800],
  ['section-2-3.png', 'join-4.webp', 800],
  ['section-2-4.png', 'join-5.webp', 800],
];
for (const [src, out, w] of photos) {
  await sharp(path.join(RAW, src)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(IMG_OUT, out));
  const { size } = fs.statSync(path.join(IMG_OUT, out));
  const m = await sharp(path.join(IMG_OUT, out)).metadata();
  console.log(`img  ${out.padEnd(24)} ${m.width}x${m.height} ${Math.round(size / 1024)}KB`);
}

/* ── 2. vector slices ──────────────────────────────────────────────────── */
const num = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
function bbox(d) {
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  let cx = 0, cy = 0, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of cmds) {
    const op = c[0];
    const v = (c.slice(1).match(num) || []).map(Number);
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
      for (const [x, y] of pts) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      if (pts.length) { cx = pts[pts.length - 1][0]; cy = pts[pts.length - 1][1]; }
    }
  }
  return isFinite(minX) ? [minX, minY, maxX, maxY] : null;
}

// name, source svg, clip region [x0,y0,x1,y1], pad
const slices = [
  ['logo-mark', 'Hero.svg', [38, 16, 72, 52]],
  ['logo-lockup', 'Hero.svg', [40, 18.3, 180.8, 49.7]],
  ['logo-mark-cta', 'CTA Banner - Desktop.svg', [688, 118, 752, 193]],
  ['logo-lockup-footer', 'Footer - Desktop.svg', [54, 54, 200, 90]],
  ['icon-globe', 'Hero.svg', [1164, 24, 1184, 44]],
  ['icon-arrow-ne', 'Hero.svg', [1270, 28, 1282, 40]],
  ['neuron-logo', 'Section.svg', [347, 338, 459, 369]],
  ['icon-social', 'Footer - Desktop.svg', [1080, 60, 1200, 84]],
];

for (const [name, file, [x0, y0, x1, y1]] of slices) {
  const src = fs.readFileSync(path.join('public/home', file), 'utf8').replace(/(xlink:href|href)="data:image\/[a-z+]+;base64,[^"]*"/g, '$1="X"');
  const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  const keep = [];
  for (const m of body.matchAll(/<(path|rect|circle)\b([^>]*?)\/?>/g)) {
    const tag = m[0].endsWith('/>') ? m[0] : m[0].replace(/>$/, '/>');
    const a = m[2];
    let bb;
    if (m[1] === 'path') {
      const d = (a.match(/\sd="([^"]*)"/) || [, ''])[1];
      bb = bbox(d);
    } else if (m[1] === 'rect') {
      const g = (k) => Number((a.match(new RegExp(`${k}="([^"]*)"`)) || [, NaN])[1]);
      const tr = (a.match(/transform="translate\(([^)]*)\)"/) || [, ''])[1].split(/[\s,]+/).map(Number);
      const ox = tr[0] || 0, oy = tr[1] || 0;
      bb = [(g('x') || 0) + ox, (g('y') || 0) + oy, (g('x') || 0) + ox + g('width'), (g('y') || 0) + oy + g('height')];
    } else {
      const g = (k) => Number((a.match(new RegExp(`${k}="([^"]*)"`)) || [, NaN])[1]);
      bb = [g('cx') - g('r'), g('cy') - g('r'), g('cx') + g('r'), g('cy') + g('r')];
    }
    if (!bb || bb.some((n) => !isFinite(n))) continue;
    if (bb[0] >= x0 - 0.6 && bb[1] >= y0 - 0.6 && bb[2] <= x1 + 0.6 && bb[3] <= y1 + 0.6) keep.push(tag);
  }
  const w = x1 - x0, h = y1 - y0;
  const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x0} ${y0} ${w} ${h}" fill="none">\n${keep.join('\n')}\n</svg>\n`;
  fs.writeFileSync(path.join(SVG_OUT, `${name}.svg`), out);
  console.log(`svg  ${(name + '.svg').padEnd(24)} ${keep.length} shapes  ${Math.round(out.length / 1024)}KB`);
}
