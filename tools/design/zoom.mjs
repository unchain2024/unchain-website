// Render a region of a design SVG by rewriting its viewBox, so only the crop is
// rasterised (crop.mjs renders the whole page first, which is far too slow at 12x).
import fs from 'node:fs';
import sharp from 'sharp';
const [file, x, y, w, h, scale, out] = process.argv.slice(2);
const S = Number(scale);
let s = fs.readFileSync(file, 'utf8');
s = s.replace(/<svg([^>]*)>/, (m, at) => {
  const cleaned = at.replace(/\s(width|height|viewBox)="[^"]*"/g, '');
  return `<svg${cleaned} width="${Number(w) * S}" height="${Number(h) * S}" viewBox="${x} ${y} ${w} ${h}">`;
});
await sharp(Buffer.from(s), { unlimited: true })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(out);
console.log('wrote', out);
