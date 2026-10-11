/**
 * Cut the eleven partner logos out of `public/our partners/Logo List.svg`.
 *
 * Each logo sits in its own rect inside a 178x73 card. Rather than unpick the SVG's
 * pattern transforms, the sheet is rendered at 4x and each logo's rect is cropped
 * straight out of it — whatever Figma draws is what lands in the asset.
 */
import fs from 'node:fs';
import sharp from 'sharp';

const SRC = 'public/our partners/Logo List.svg';
const OUT = 'src/assets/partners';
const SCALE = 4;
fs.mkdirSync(OUT, { recursive: true });

// name, then the logo's rect in the sheet's 1440x170 user units.
const LOGOS = [
  ['microsoft-for-startups', 38.1328, 7.94312, 101.735, 57.1136],
  ['cic', 239.219, 1.62231, 103.564, 68.9445],
  ['j-starx', 416.945, 8.92212, 152.109, 55.9667],
  ['institute-for-business-innovation', 635.936, 16.2222, 118.127, 40.5555],
  ['nvidia-inception', 834.699, 10.5444, 124.6, 52.7222],
  ['berkeley', 1033.46, 12.1667, 131.073, 48.6667],
  ['aws-startups', 1227.37, 12.1667, 148.064, 49.4778],
  ['chintai', 22.6543, 108.355, 132.691, 50.2889],
  // ascon is vector, not a raster fill; its ink box from the same sheet.
  ['ascon', 245.9, 118.7, 89.8, 30.6],
  ['aoyama-shoji', 424.656, 126.981, 136.685, 13.038],
  ['tanaka-engineering', 618.137, 125.389, 153.727, 15.4111],
];

const sheet = await sharp(fs.readFileSync(SRC), { unlimited: true, density: 72 * SCALE })
  .resize({ width: 1440 * SCALE })
  .flatten({ background: '#ffffff' })
  .png()
  .toBuffer();

const meta = await sharp(sheet).metadata();
console.log(`sheet ${meta.width}x${meta.height}\n`);

const manifest = [];
for (const [name, x, y, w, h] of LOGOS) {
  const file = `${name}.webp`;
  await sharp(sheet)
    .extract({
      left: Math.round(x * SCALE),
      top: Math.round(y * SCALE),
      width: Math.round(w * SCALE),
      height: Math.round(h * SCALE),
    })
    .webp({ lossless: true })
    .toFile(`${OUT}/${file}`);
  const { size } = fs.statSync(`${OUT}/${file}`);
  console.log(`${name.padEnd(36)} ${w.toFixed(1)}x${h.toFixed(1)}  ${Math.round(size / 1024)}KB`);
  manifest.push({ name, w: +w.toFixed(2), h: +h.toFixed(2) });
}
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log('\ntotal', Math.round(LOGOS.reduce((a, [n]) => a + fs.statSync(`${OUT}/${n}.webp`).size, 0) / 1024) + 'KB');
