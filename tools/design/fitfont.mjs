/**
 * Solve for the font size a design export was drawn at.
 *
 * The exports outline all type to paths, so the only thing measurable in them is the
 * ink box of a line (see `svg_lines.mjs`). Canvas `measureText` reports the same
 * quantity — `actualBoundingBox*` is the ink box, not the advance box — so scaling a
 * measurement at 100px by the design's width gives the size directly, and the ink
 * height that falls out is an independent check on the answer.
 *
 * Needs the dev server (for the webfonts) and headless Chrome on CDP, same as shoot.mjs.
 *
 *   node tools/design/fitfont.mjs tools/design/about_fit.json
 *
 * Each case: { name, text, family?, weight?, spacing?, w, h? }
 *   w/h = the design's ink width/height for that line.
 */
import fs from 'node:fs';

const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const url = process.env.FIT_URL || 'http://localhost:5199/';
const port = Number(process.env.CDP_PORT || 9333);

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Chrome did not expose a debugger socket');
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});
let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, { res, rej });
    ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable');
await S('Runtime.enable');
await S('Page.navigate', { url });
await new Promise((r) => setTimeout(r, 3500));

const evaluate = async (expr) => {
  const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};

// The webfonts are lazy; nothing measures correctly until the exact faces are in.
await evaluate(`(async () => {
  const faces = ['400 100px Inter','500 100px Inter','700 100px Inter','800 100px Inter',
                 '400 100px "Noto Sans JP"','500 100px "Noto Sans JP"','700 100px "Noto Sans JP"',
                 '400 100px "Roboto Mono"','500 100px "Roboto Mono"'];
  await Promise.all(faces.map((f) => document.fonts.load(f, 'あA0')));
  await document.fonts.ready;
  return document.fonts.status;
})()`);

const script = `(cases) => {
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d');
  const ink = (text, family, weight, spacing, size) => {
    ctx.letterSpacing = (spacing || 0) * size + 'px';
    ctx.font = weight + ' ' + size + 'px ' + family;
    const m = ctx.measureText(text);
    return {
      w: m.actualBoundingBoxRight + m.actualBoundingBoxLeft,
      h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
      left: m.actualBoundingBoxLeft,
      asc: m.actualBoundingBoxAscent,
      adv: m.width,
    };
  };
  return cases.map((c) => {
    const family = c.family || 'Inter, "Noto Sans JP", sans-serif';
    const weight = c.weight || 400;
    const at100 = ink(c.text, family, weight, c.spacing, 100);
    const size = (c.w / at100.w) * 100;
    // Chrome quantises actualBoundingBox* to whole pixels, so a fit taken at 100px
    // carries ~1% of slop — enough to leave 53 and 54 indistinguishable. Measuring at
    // 1000px pushes that to 0.1%. Height is the useful one here: it is independent of
    // tracking, so it separates "smaller size, no tracking" from "bigger size, tighter".
    const at1000 = ink(c.text, family, weight, c.spacing, 1000);
    const fitW1000 = (c.w / at1000.w) * 1000;
    const fitH1000 = c.h == null ? null : (c.h / at1000.h) * 1000;
    // Report the nearest half-pixel and whole-pixel candidates too: designs are authored
    // in round sizes, so a fit of 53.94 means 54, and the residual is the answer's error.
    // A size on a case forces the hypothesis being tested, so track answers "what
    // tracking would this size need?" rather than only ever testing the nearest integer.
    const round = c.size || Math.round(size);
    const at = ink(c.text, family, weight, c.spacing, round);
    return {
      name: c.name, fit: size, round, fitW1000, fitH1000,
      // Tracking implied if the size really is that one: the width the design is missing,
      // spread over the line's inter-character gaps, in em.
      trackAtRound:
        c.gaps ? (c.w - (at1000.w * round) / 1000) / c.gaps / round : null,
      wAtRound: at.w, dw: at.w - c.w,
      hAtRound: at.h, designH: c.h, dh: c.h == null ? null : at.h - c.h,
      advAtRound: at.adv, leftAtRound: at.left, ascAtRound: at.asc,
    };
  });
}`;

const rows = await evaluate(`(${script})(${JSON.stringify(cases)})`);
const f = (n, d = 2) => (n == null ? '—' : n.toFixed(d));
// fitW / fitH are the size implied by the design's ink width and ink height. They agree
// when the line has no tracking; fitH is the one to trust when they disagree.
console.log('name                     fitW    fitH   ->px   track@px    lsb');
for (const r of rows) {
  console.log(
    r.name.padEnd(24),
    f(r.fitW1000).padStart(6),
    f(r.fitH1000).padStart(7),
    String(r.round).padStart(5),
    (r.trackAtRound == null ? '—' : `${r.trackAtRound >= 0 ? '+' : ''}${f(r.trackAtRound, 4)}em`).padStart(11),
    f(r.leftAtRound, 1).padStart(6)
  );
}
await send('Target.closeTarget', { targetId });
ws.close();
