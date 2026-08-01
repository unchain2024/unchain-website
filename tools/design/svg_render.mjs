// Render design SVGs to PNG so they can be inspected visually.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = process.argv[2];
const outDir = process.argv[3];
const width = Number(process.argv[4] || 1440);
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.svg'));
for (const f of files) {
  const out = path.join(outDir, f.replace(/\.svg$/i, '.png'));
  try {
    const buf = fs.readFileSync(path.join(srcDir, f));
    await sharp(buf, { density: Math.round((72 * width) / 1440), unlimited: true })
      .resize({ width })
      .png({ compressionLevel: 9 })
      .toFile(out);
    const { size } = fs.statSync(out);
    const meta = await sharp(out).metadata();
    console.log(`OK   ${f} -> ${path.basename(out)} ${meta.width}x${meta.height} ${Math.round(size / 1024)}KB`);
  } catch (e) {
    console.log(`FAIL ${f}: ${e.message}`);
  }
}
