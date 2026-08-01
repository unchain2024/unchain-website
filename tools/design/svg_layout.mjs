// Summarise a design SVG's layout: gradient defs verbatim, all rects/circles/lines,
// and outlined-text paths collapsed into runs with bounding boxes (so font-size,
// baseline and alignment can be recovered).
import fs from 'node:fs';

const file = process.argv[2];
const raw = fs.readFileSync(file, 'utf8');
const src = raw.replace(/(xlink:href|href)="data:image\/[a-z+]+;base64,[^"]*"/g, '$1="__IMG__"');

const num = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
function bbox(d) {
  // Coarse but sufficient: every coordinate pair in the path data. Control points can
  // overshoot the true bbox slightly, which is fine for identifying text runs.
  const n = d.match(num);
  if (!n) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  let cx = 0, cy = 0;
  for (const c of cmds) {
    const op = c[0];
    const v = (c.slice(1).match(num) || []).map(Number);
    const rel = op === op.toLowerCase();
    const step = { M: 2, L: 2, C: 6, S: 4, Q: 4, T: 2, A: 7, H: 1, V: 1, Z: 0 }[op.toUpperCase()] ?? 2;
    if (step === 0) continue;
    for (let i = 0; i + step <= v.length; i += step) {
      const seg = v.slice(i, i + step);
      let pts = [];
      if (op.toUpperCase() === 'H') pts = [[rel ? cx + seg[0] : seg[0], cy]];
      else if (op.toUpperCase() === 'V') pts = [[cx, rel ? cy + seg[0] : seg[0]]];
      else if (op.toUpperCase() === 'A') pts = [[rel ? cx + seg[5] : seg[5], rel ? cy + seg[6] : seg[6]]];
      else for (let k = 0; k + 1 < seg.length; k += 2) pts.push([rel ? cx + seg[k] : seg[k], rel ? cy + seg[k + 1] : seg[k + 1]]);
      for (const [x, y] of pts) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      if (pts.length) { cx = pts[pts.length - 1][0]; cy = pts[pts.length - 1][1]; }
    }
  }
  if (!isFinite(minX)) return null;
  return [minX, minY, maxX, maxY];
}
const r2 = (n) => Math.round(n * 10) / 10;

console.log('=== ' + file + ' ===');
console.log((src.match(/<svg[^>]*>/) || [''])[0].slice(0, 300));

console.log('\n--- DEFS (gradients / clips) ---');
const defs = src.match(/<defs>([\s\S]*?)<\/defs>/);
if (defs) {
  console.log(
    defs[1]
      .replace(/<clipPath[\s\S]*?<\/clipPath>/g, (m) => m.replace(/ d="[^"]*"/, ' d="..."'))
      .replace(/\s+/g, ' ')
      .replace(/> </g, '>\n<')
  );
}

console.log('\n--- SHAPES (rect / circle / line / ellipse) ---');
for (const m of src.matchAll(/<(rect|circle|line|ellipse)\b([^>]*)\/?>/g)) {
  console.log(`<${m[1]} ${m[2].replace(/\s+/g, ' ').trim()}>`);
}

console.log('\n--- PATH RUNS (outlined text & vector art, grouped by fill) ---');
const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '');
let run = null;
const flush = () => {
  if (!run) return;
  const [a, b, c, d] = run.box;
  console.log(
    `fill=${run.fill}${run.opacity ? ` op=${run.opacity}` : ''} glyphs=${run.n} ` +
      `box=[${r2(a)},${r2(b)} → ${r2(c)},${r2(d)}] size=${r2(c - a)}x${r2(d - b)}`
  );
  run = null;
};
for (const m of body.matchAll(/<path\b([^>]*)\/?>/g)) {
  const a = m[1];
  const d = (a.match(/\sd="([^"]*)"/) || [, ''])[1];
  const fill = (a.match(/fill="([^"]*)"/) || [, 'none'])[1];
  const opacity = (a.match(/(?:fill-)?opacity="([^"]*)"/) || [, ''])[1];
  const bb = bbox(d);
  if (!bb) continue;
  const key = fill + '|' + opacity;
  // A new run starts on fill change or a big vertical jump (i.e. a different line of text).
  const sameLine = run && Math.abs(bb[1] - run.box[1]) < (run.box[3] - run.box[1]) * 1.2 + 6;
  if (run && run.key === key && sameLine && bb[0] >= run.box[0] - 2) {
    run.n++;
    run.box = [Math.min(run.box[0], bb[0]), Math.min(run.box[1], bb[1]), Math.max(run.box[2], bb[2]), Math.max(run.box[3], bb[3])];
  } else {
    flush();
    run = { key, fill, opacity, n: 1, box: bb };
  }
}
flush();
