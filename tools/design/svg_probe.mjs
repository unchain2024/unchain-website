// Probe an SVG design export: report size, tag histogram, embedded image count,
// and dump all text content with positions/styles. Base64 payloads are never printed.
import fs from 'node:fs';

const file = process.argv[2];
const raw = fs.readFileSync(file, 'utf8');

// Strip base64 payloads first so everything downstream is cheap.
const images = [];
const stripped = raw.replace(/(xlink:href|href)="data:image\/([a-z+]+);base64,([^"]*)"/g, (m, attr, fmt, b64) => {
  images.push({ fmt, bytes: b64.length });
  return `${attr}="__IMG_${images.length - 1}__"`;
});

console.log('=== FILE ===', file);
console.log('raw bytes:', raw.length, '| stripped bytes:', stripped.length);
console.log('embedded images:', images.map((i, n) => `#${n}:${i.fmt}:${Math.round(i.bytes / 1024)}KB`).join(' '));

const svgTag = stripped.match(/<svg[^>]*>/);
console.log('\n=== SVG ROOT ===');
console.log(svgTag ? svgTag[0].slice(0, 600) : 'none');

const tags = {};
for (const m of stripped.matchAll(/<([a-zA-Z][\w:-]*)/g)) tags[m[1]] = (tags[m[1]] || 0) + 1;
console.log('\n=== TAGS ===');
console.log(Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join(' '));

console.log('\n=== FILLS / COLORS ===');
const colors = {};
for (const m of stripped.matchAll(/(?:fill|stroke|stop-color|flood-color)="(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))"/g)) {
  colors[m[1].toLowerCase()] = (colors[m[1].toLowerCase()] || 0) + 1;
}
console.log(Object.entries(colors).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}(${n})`).join(' '));

console.log('\n=== FONTS ===');
const fonts = {};
for (const m of stripped.matchAll(/font-family="([^"]+)"/g)) fonts[m[1]] = (fonts[m[1]] || 0) + 1;
console.log(Object.entries(fonts).map(([f, n]) => `${f}(${n})`).join(' '));

console.log('\n=== TEXT NODES ===');
let n = 0;
for (const m of stripped.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
  const attrs = m[1];
  const inner = m[2];
  const get = (k) => (attrs.match(new RegExp(`${k}="([^"]*)"`)) || [, ''])[1];
  const spans = [...inner.matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g)].map((s) => {
    const sx = (s[1].match(/x="([^"]*)"/) || [, ''])[1];
    const sy = (s[1].match(/y="([^"]*)"/) || [, ''])[1];
    return `[${sx},${sy}] ${s[2].replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d)).trim()}`;
  });
  const bare = inner.replace(/<tspan[\s\S]*?<\/tspan>/g, '').replace(/<[^>]*>/g, '').trim();
  const text = spans.length ? spans.join(' ⏎ ') : bare;
  if (!text) continue;
  console.log(
    `#${n++} fill=${get('fill')} size=${get('font-size')} weight=${get('font-weight')} ` +
      `family=${get('font-family')} spacing=${get('letter-spacing')} x=${get('x')} y=${get('y')} ` +
      `transform=${get('transform')} anchor=${get('text-anchor')}\n     ${text}`
  );
}
if (n === 0) console.log('(no <text> elements — text is likely outlined to paths)');
