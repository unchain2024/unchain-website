/**
 * Turn a `userSpaceOnUse` linear gradient from a design export into the exact CSS
 * `linear-gradient()` for a given box.
 *
 * Figma writes gradients as a start and end point in page coordinates, and those points
 * usually sit outside the shape they fill. CSS instead runs its gradient line across the
 * box's own projection, so the same colours need different stop positions. This projects
 * the export's line onto the box and reports the angle and stops that reproduce it.
 *
 *   node tools/design/gradient_css.mjs "public/about/Section-4.svg" paint0_linear_123_1671 16 16 1408 693
 */
import fs from 'node:fs';

const [file, id, bx, by, bw, bh] = process.argv.slice(2);
const src = fs.readFileSync(file, 'utf8');

const defs = (src.match(/<defs>([\s\S]*)<\/defs>/) || [, ''])[1];
const g = [...defs.matchAll(/<linearGradient[\s\S]*?<\/linearGradient>/g)]
  .map((m) => m[0])
  .find((t) => t.includes(`id="${id}"`));
if (!g) throw new Error(`no linearGradient id="${id}" in ${file}`);

const at = (k) => Number((g.match(new RegExp(`\\b${k}="([^"]*)"`)) || [, '0'])[1]);
const [x1, y1, x2, y2] = [at('x1'), at('y1'), at('x2'), at('y2')];
const stops = [...g.matchAll(/<stop([^>]*)\/>/g)].map((m) => {
  const a = m[1];
  const off = a.match(/offset="([^"]*)"/);
  return {
    offset: off ? Number(off[1]) : 0,
    color: (a.match(/stop-color="([^"]*)"/) || [, '#000'])[1],
    opacity: (a.match(/stop-opacity="([^"]*)"/) || [, null])[1],
  };
});

const X = Number(bx), Y = Number(by), W = Number(bw), H = Number(bh);
const dx = x2 - x1, dy = y2 - y1;
const len = Math.hypot(dx, dy);
const ux = dx / len, uy = dy / len;

// CSS 0deg points up and angles run clockwise; SVG y grows downward.
let angle = (Math.atan2(ux, -uy) * 180) / Math.PI;
if (angle < 0) angle += 360;

// Where the box's centre falls along the export's gradient line, and how far the box
// projects either side of it — that span is exactly what CSS will paint across.
const cx = X + W / 2, cy = Y + H / 2;
const tc = ((cx - x1) * ux + (cy - y1) * uy) / len;
const half = (Math.abs(W * ux) + Math.abs(H * uy)) / 2 / len;
const t0 = tc - half, t1 = tc + half;

const r2 = (n) => Math.round(n * 100) / 100;
const pos = (t) => r2(((t - t0) / (t1 - t0)) * 100);

console.log(`${file}  #${id}`);
console.log(`  export line: (${x1}, ${y1}) -> (${x2}, ${y2})   box: ${W}x${H} at ${X},${Y}`);
console.log(`  box spans t = ${r2(t0)} .. ${r2(t1)} of that line`);
const parts = stops.map((s) => {
  const c = s.opacity == null ? s.color : `color-mix(in srgb, ${s.color} ${Number(s.opacity) * 100}%, transparent)`;
  return `${c} ${pos(s.offset)}%`;
});
// A stop that lands outside 0..100% is clamped by CSS anyway, but pinning the end colour
// at the boundary keeps the painted range identical to the export's.
console.log(`\n  linear-gradient(${r2(angle)}deg, ${parts.join(', ')})`);
const clamped = stops.map((s, i) => {
  const p = pos(s.offset);
  return `${s.color} ${Math.max(0, Math.min(100, p))}%${p < 0 || p > 100 ? '  /* clamped */' : ''}`;
});
console.log(`  clamped:  linear-gradient(${r2(angle)}deg, ${clamped.join(', ')})`);
