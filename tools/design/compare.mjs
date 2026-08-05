/**
 * Build side-by-side + difference sheets for each section: the Figma export on the
 * left, the implemented page on the right, and a red/blue difference map below.
 *
 *   node tools/design/compare.mjs <sectionsJson>
 * sections: [{ name, design, y, h }]  — y/h are offsets into the captured page.
 */
import fs from 'node:fs';
import sharp from 'sharp';

const PAGE = process.env.PAGE_SHOT || 'tools/design/.work/shots/home-full.png';
const OUT = 'tools/design/.work/diff';
fs.mkdirSync(OUT, { recursive: true });

const sections = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const page = sharp(PAGE);
const pageMeta = await page.metadata();

for (const s of sections) {
  const h = Math.min(s.h, pageMeta.height - s.y);
  if (h <= 0) {
    console.log(`skip ${s.name}: outside page`);
    continue;
  }

  const mine = await sharp(PAGE)
    .extract({ left: 0, top: s.y, width: 1440, height: h })
    .png()
    .toBuffer();

  // The design export may be shorter/taller than the slice; letterbox it to match.
  const rendered = await sharp(fs.readFileSync(s.design), { unlimited: true })
    .resize({ width: 1440 })
    .flatten({ background: s.bg || '#ffffff' })
    .png()
    .toBuffer();
  // `dy` lets several sections share one long capture of the design instead of
  // pointing at a separately-exported png per section.
  const dy = s.dy ?? 0;
  const rm = await sharp(rendered).metadata();
  const design = await sharp(rendered)
    .extract({ left: 0, top: dy, width: 1440, height: Math.min(h, rm.height - dy) })
    .extend({
      bottom: Math.max(0, h - (rm.height - dy)),
      background: s.bg || '#ffffff',
    })
    .png()
    .toBuffer();

  // Difference map: brighten wherever the two disagree.
  const [a, b] = await Promise.all([
    sharp(design).greyscale().raw().toBuffer(),
    sharp(mine).greyscale().raw().toBuffer(),
  ]);
  const diff = Buffer.alloc(1440 * h * 3);
  let changed = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    if (d > 24) changed++;
    // design-only -> red, build-only -> cyan
    diff[i * 3] = a[i] > b[i] ? Math.min(255, d * 3) : 0;
    diff[i * 3 + 1] = b[i] > a[i] ? Math.min(255, d * 3) : 0;
    diff[i * 3 + 2] = b[i] > a[i] ? Math.min(255, d * 3) : 0;
  }
  const diffPng = await sharp(diff, { raw: { width: 1440, height: h, channels: 3 } }).png().toBuffer();

  const label = async (text, w) =>
    sharp({
      create: { width: w, height: 26, channels: 4, background: '#111827' },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${w}" height="26"><text x="8" y="18" font-family="monospace" font-size="14" fill="#e5e7eb">${text}</text></svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

  await sharp({
    create: { width: 2896, height: h * 2 + 60, channels: 4, background: '#111827' },
  })
    .composite([
      { input: await label(`DESIGN — ${s.name}`, 1440), left: 0, top: 0 },
      { input: await label(`BUILD — ${s.name}`, 1440), left: 1456, top: 0 },
      { input: design, left: 0, top: 28 },
      { input: mine, left: 1456, top: 28 },
      { input: await label(`DIFF (red = design only, cyan = build only) — ${Math.round((changed / (1440 * h)) * 1000) / 10}% pixels differ`, 2896), left: 0, top: h + 32 },
      { input: diffPng, left: 0, top: h + 60 },
    ])
    .png()
    .toFile(`${OUT}/${s.name}.png`);

  console.log(`${s.name.padEnd(12)} ${Math.round((changed / (1440 * h)) * 1000) / 10}% differ  -> ${OUT}/${s.name}.png`);
}
