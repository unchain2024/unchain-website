/**
 * Report the tight ink bounding box of a region in both the design export and the
 * built page, so type size / baseline / alignment can be compared numerically.
 *
 *   node tools/design/ink.mjs <probesJson>
 * probe: { name, design, dy, x, y, w, h, mode }
 *   dy   = where this section starts in the captured page
 *   x/y/w/h = region in design coordinates
 *   mode = "light" (dark ink on light bg) | "dark" (light ink on dark bg)
 */
import fs from 'node:fs';
import sharp from 'sharp';

// Defaults are the home page's capture; `$PAGE_SHOT` / `$PAGE_MEASURE` point the same
// probes at another page's, the way compare.mjs does.
const PAGE = process.env.PAGE_SHOT || 'tools/design/.work/shots/home-full.png';
const probes = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// Resolve `section` -> the live y offset captured by shoot.mjs, so probes stay
// correct as edits change section heights.
const MEASURE = process.env.PAGE_MEASURE || 'tools/design/.work/shots/home-measure.json';
if (fs.existsSync(MEASURE)) {
  const offsets = Object.fromEntries(
    JSON.parse(fs.readFileSync(MEASURE, 'utf8')).filter(([, b]) => b).map(([n, b]) => [n, b.y])
  );
  for (const p of probes) {
    if (p.section) {
      if (!(p.section in offsets)) throw new Error(`no measured offset for section "${p.section}"`);
      p.dy = Math.round(offsets[p.section]);
    }
  }
}

async function inkBox(buf, w, h, mode) {
  const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  // Background = the modal luminance of the region's border pixels.
  const edge = [];
  for (let x = 0; x < w; x++) {
    edge.push(data[x], data[(h - 1) * w + x]);
  }
  const bg = edge.sort((a, b) => a - b)[Math.floor(edge.length / 2)];
  const hit = (v) => (mode === 'dark' ? v - bg > 40 : bg - v > 40);

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (hit(data[y * w + x])) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return isFinite(minX) ? { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 } : null;
}

const r1 = (n) => Math.round(n * 10) / 10;

const pageMeta = await sharp(PAGE).metadata();

for (const p of probes) {
  const base = await sharp(fs.readFileSync(p.design), { unlimited: true })
    .resize({ width: 1440 })
    .flatten({ background: p.mode === 'dark' ? '#000000' : '#ffffff' })
    .png()
    .toBuffer();
  const bm = await sharp(base).metadata();
  // Clamp so a probe never runs past either image.
  p.h = Math.min(p.h, bm.height - p.y, pageMeta.height - (p.y + p.dy));
  if (p.h <= 0) {
    console.log(`\n${p.name}\n  (region outside image)`);
    continue;
  }

  const designPng = await sharp(base)
    .extract({ left: p.x, top: p.y, width: p.w, height: p.h })
    .png()
    .toBuffer();

  const minePng = await sharp(PAGE)
    .extract({ left: p.x, top: p.y + p.dy, width: p.w, height: p.h })
    .png()
    .toBuffer();

  const [d, m] = await Promise.all([
    inkBox(designPng, p.w, p.h, p.mode),
    inkBox(minePng, p.w, p.h, p.mode),
  ]);

  const abs = (b) => (b ? { x: p.x + b.minX, y: p.y + b.minY, r: p.x + b.maxX, b2: p.y + b.maxY, w: b.w, h: b.h } : null);
  const D = abs(d), M = abs(m);
  console.log(`\n${p.name}`);
  console.log(`  design  x=${D?.x} y=${D?.y} → ${D?.r},${D?.b2}   size ${D?.w}x${D?.h}`);
  console.log(`  build   x=${M?.x} y=${M?.y} → ${M?.r},${M?.b2}   size ${M?.w}x${M?.h}`);
  if (D && M)
    console.log(
      `  delta   dx=${r1(M.x - D.x)} dy=${r1(M.y - D.y)}  dw=${r1(M.w - D.w)} dh=${r1(M.h - D.h)}  scale=${r1((M.w / D.w) * 100)}%`
    );
}
