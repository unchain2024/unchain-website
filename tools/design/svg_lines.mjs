// Recover per-line text geometry from a design export.
//
// Figma outlines a whole text node into ONE <path>, so `svg_layout.mjs` can only show
// the block's bounding box — not enough to read a font size or a leading. This splits
// each path into its subpaths (glyphs and their counters), clusters those into lines by
// vertical overlap, and prints a box per line plus the baseline-to-baseline step.
//
//   node tools/design/svg_lines.mjs "public/about/Section.svg"        # all paths
//   node tools/design/svg_lines.mjs "public/about/Section.svg" 3      # just path #3
import fs from 'node:fs';

const file = process.argv[2];
const only = process.argv[3] === undefined ? null : Number(process.argv[3]);
const src = fs
  .readFileSync(file, 'utf8')
  .replace(/(xlink:href|href)="data:image\/[a-z+]+;base64,[^"]*"/g, '$1="__IMG__"');

const numRe = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

/** Bounding box of every subpath of `d`, walking commands so H/V/A stay correct. */
function subpathBoxes(d) {
  const cmds = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  const out = [];
  let cur = null;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  const push = (x, y) => {
    if (!cur) cur = [x, y, x, y];
    else {
      if (x < cur[0]) cur[0] = x;
      if (y < cur[1]) cur[1] = y;
      if (x > cur[2]) cur[2] = x;
      if (y > cur[3]) cur[3] = y;
    }
  };
  const close = () => {
    if (cur) out.push(cur);
    cur = null;
  };
  for (const cm of cmds) {
    const op = cm[0];
    const up = op.toUpperCase();
    const rel = op === op.toLowerCase();
    const v = (cm.slice(1).match(numRe) || []).map(Number);
    const step = { M: 2, L: 2, C: 6, S: 4, Q: 4, T: 2, A: 7, H: 1, V: 1, Z: 0 }[up] ?? 2;
    if (up === 'Z') {
      cx = sx;
      cy = sy;
      continue;
    }
    for (let i = 0; i + step <= v.length; i += step) {
      const s = v.slice(i, i + step);
      let pts;
      if (up === 'H') pts = [[rel ? cx + s[0] : s[0], cy]];
      else if (up === 'V') pts = [[cx, rel ? cy + s[0] : s[0]]];
      else if (up === 'A') pts = [[rel ? cx + s[5] : s[5], rel ? cy + s[6] : s[6]]];
      else {
        pts = [];
        for (let k = 0; k + 1 < s.length; k += 2)
          pts.push([rel ? cx + s[k] : s[k], rel ? cy + s[k + 1] : s[k + 1]]);
      }
      // A fresh M starts a new subpath; every other command extends the current one.
      if (up === 'M' && i === 0) {
        close();
        sx = pts[0][0];
        sy = pts[0][1];
      }
      for (const [x, y] of pts) push(x, y);
      if (pts.length) {
        cx = pts[pts.length - 1][0];
        cy = pts[pts.length - 1][1];
      }
    }
  }
  close();
  return out;
}

/** Group subpath boxes into text lines: same line if their y ranges overlap at all. */
function lines(boxes) {
  const sorted = [...boxes].sort((a, b) => a[1] - b[1]);
  const rows = [];
  for (const b of sorted) {
    const hit = rows.find((r) => b[1] < r[3] - 0.5 && b[3] > r[1] + 0.5);
    if (hit) {
      if (b[0] < hit[0]) hit[0] = b[0];
      if (b[1] < hit[1]) hit[1] = b[1];
      if (b[2] > hit[2]) hit[2] = b[2];
      if (b[3] > hit[3]) hit[3] = b[3];
      hit[4] += 1;
    } else rows.push([b[0], b[1], b[2], b[3], 1]);
  }
  return rows.sort((a, b) => a[1] - b[1]);
}

const r1 = (n) => Math.round(n * 10) / 10;
const body = src.replace(/<defs>[\s\S]*?<\/defs>/g, '');
const paths = [...body.matchAll(/<path\b([^>]*?)\/?>/g)];

console.log(`=== ${file} ===`);
let idx = -1;
for (const m of paths) {
  idx += 1;
  const at = m[1];
  const d = (at.match(/\bd="([^"]*)"/) || [, ''])[1];
  if (!d) continue;
  const fill = (at.match(/\bfill="([^"]*)"/) || [, '(none)'])[1];
  const opacity = (at.match(/\bopacity="([^"]*)"/) || [, ''])[1];
  const all = subpathBoxes(d);
  const rows = lines(all);
  // Skip decorative art: a handful of huge subpaths is a shape, not a text block.
  if (only === null && rows.length && all.length < 3 && rows[0][3] - rows[0][1] > 60) {
    console.log(`\npath#${idx} fill=${fill}${opacity ? ` op=${opacity}` : ''}  [art, ${all.length} subpaths]`);
    console.log(`  box ${r1(rows[0][0])},${r1(rows[0][1])} → ${r1(rows[0][2])},${r1(rows[0][3])}`);
    continue;
  }
  if (only !== null && idx !== only) continue;
  console.log(
    `\npath#${idx} fill=${fill}${opacity ? ` op=${opacity}` : ''}  ${rows.length} line(s), ${all.length} subpaths`
  );
  let prev = null;
  for (const r of rows) {
    const step = prev === null ? '' : `  step=${r1(r[3] - prev)}`;
    console.log(
      `  x ${r1(r[0])}..${r1(r[2])}  y ${r1(r[1])}..${r1(r[3])}  w=${r1(r[2] - r[0])} h=${r1(r[3] - r[1])} n=${r[4]}${step}`
    );
    prev = r[3];
  }
}
