// Emit Logo.tsx / NeuronLogo.tsx from the design SVGs, recoloured to currentColor.
import fs from 'node:fs';
const rd = (f) => fs.readFileSync('src/assets/home/' + f, 'utf8');
const inner = (s) => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '').trim();
const jsx = (s) =>
  s.replace(/fill="(white|black|#0A0A0A)"/g, 'fill="currentColor"')
   .replace(/fill-rule=/g, 'fillRule=').replace(/clip-rule=/g, 'clipRule=');

const lockup = rd('logo-lockup.svg');
const vbL = lockup.match(/viewBox="([^"]*)"/)[1];
fs.writeFileSync(
  'src/components/home/Logo.tsx',
  `/* Generated from public/home/Hero.svg + Section.svg — vector logos, recoloured to currentColor. */

type Props = { className?: string };

/** UNCHAIN mark + wordmark lock-up, exactly as drawn in the designs. */
export const UnchainLogo = ({ className }: Props) => (
  <svg viewBox="${vbL}" fill="none" className={className} role="img" aria-label="UNCHAIN">
${jsx(inner(lockup))}
  </svg>
);

/** UNCHAIN mark on its own (used by the CTA banner). */
export const UnchainMark = ({ className }: Props) => (
  <svg viewBox="${rd('logo-mark-cta.svg').match(/viewBox="([^"]*)"/)[1]}" fill="none" className={className} role="img" aria-label="UNCHAIN">
${jsx(inner(rd('logo-mark-cta.svg')))}
  </svg>
);

/** Neuron product logo from the business section. */
export const NeuronLogo = ({ className }: Props) => (
  <svg viewBox="${rd('neuron-logo.svg').match(/viewBox="([^"]*)"/)[1]}" fill="none" className={className} role="img" aria-label="Neuron">
${jsx(inner(rd('neuron-logo.svg')))}
  </svg>
);
`
);

// Footer social glyphs -> individual components sitting inside a white circle.
const soc = inner(rd('icon-social.svg')).split('\n').filter((l) => l.trim());
const names = ['XIcon', 'MediumIcon', 'LinkedInIcon'];
// Ink boxes of each glyph, straight from the export's clip rects.
const boxes = ['1082.32 64.4443 16 15.1111', '1127.65 66.2222 21.3333 11.5556', '1177.43 62.2227 18.9085 18.1206'];
fs.writeFileSync(
  'src/components/home/social.tsx',
  `/* Generated from public/home/Footer - Desktop.svg — social glyphs, recoloured to currentColor. */

type Props = { className?: string };

${names
  .map(
    (n, i) => `export const ${n} = ({ className }: Props) => (
  <svg viewBox="${boxes[i]}" width="${boxes[i].split(' ')[2]}" height="${boxes[i].split(' ')[3]}" fill="none" className={className} aria-hidden="true">
    ${jsx(soc[i])}
  </svg>
);`
  )
  .join('\n\n')}
`
);
console.log('wrote Logo.tsx, social.tsx');
