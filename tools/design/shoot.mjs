/**
 * Drive headless Chrome over CDP to (a) capture full-page or clipped screenshots
 * at an exact device width and (b) read back real layout boxes, so the build can be
 * compared numerically against the design coordinates.
 *
 *   node tools/design/shoot.mjs <url> <outPrefix> [measureSelectorsJson]
 */
import fs from 'node:fs';

const url = process.argv[2] || 'http://localhost:5199/';
const outPrefix = process.argv[3] || 'tools/design/.work/shots/page';
const measureFile = process.argv[4];
const port = Number(process.env.CDP_PORT || 9333);
const VW = Number(process.env.VIEW_W || 1440);
// Extra settle before the capture. Resizing the viewport to the full page height brings
// every section into view at once, so any scroll-reveal that had not fired yet starts
// then — and a 1s reveal with a stagger delay is still moving 600ms later. Ink probes
// read the screenshot, so they need it stopped; `SETTLE_MS=2500` is enough for the
// longest stagger on the site. Default stays 0 so existing captures are unchanged.
const SETTLE = Number(process.env.SETTLE_MS || 0);

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      const j = await r.json();
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
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const mid = ++id;
    const timer = setTimeout(() => {
      pending.delete(mid);
      rej(new Error(`CDP timeout: ${method}`));
    }, 45000);
    pending.set(mid, {
      res: (v) => {
        clearTimeout(timer);
        res(v);
      },
      rej: (e) => {
        clearTimeout(timer);
        rej(e);
      },
    });
    process.stderr.write(`  -> ${method}\n`);
    ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  });

// Attach to a fresh tab.
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);

await S('Page.enable');
await S('Runtime.enable');
// A long-lived Chrome will happily re-serve the dev server's modules from its own cache,
// which silently captures the previous edit instead of the current one.
await S('Network.enable');
await S('Network.setCacheDisabled', { cacheDisabled: true });
// Without this the classic scrollbar steals 15px and every capture is 1425 wide.
await S('Emulation.setScrollbarsHidden', { hidden: true });
await S('Emulation.setDeviceMetricsOverride', {
  width: VW,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await S('Page.navigate', { url });

// Wait for the network to settle and fonts/images to finish.
await new Promise((r) => setTimeout(r, 2500));
// Scroll the whole page first so lazy images start loading, then wait for them
// (bounded — a never-loading image must not deadlock the capture).
await S('Runtime.evaluate', {
  expression: `(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await sleep(60); }
    window.scrollTo(0, 0); await sleep(300);
    await Promise.race([
      Promise.all([document.fonts.ready, ...[...document.images].map(i =>
        i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))]),
      sleep(8000),
    ]);
    await sleep(1800);  // let scroll-reveal animations settle before measuring
    return document.images.length + ':' + [...document.images].filter(i => !i.complete || !i.naturalWidth).length;
  })()`,
  awaitPromise: true,
  returnByValue: true,
}).then((r) => console.log('images total:broken =', r.result.value));

const { contentSize } = await S('Page.getLayoutMetrics');
const fullH = Math.ceil(contentSize.height);
console.log('page height', fullH);

// Full-page screenshot.
await S('Emulation.setDeviceMetricsOverride', {
  width: VW,
  height: fullH,
  deviceScaleFactor: 1,
  mobile: false,
});
await new Promise((r) => setTimeout(r, 600 + SETTLE));
const shot = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
fs.writeFileSync(`${outPrefix}-full.png`, Buffer.from(shot.data, 'base64'));
console.log('wrote', `${outPrefix}-full.png`);

// Measure requested selectors, in page coordinates.
if (measureFile && fs.existsSync(measureFile)) {
  const sels = JSON.parse(fs.readFileSync(measureFile, 'utf8'));
  const { result } = await S('Runtime.evaluate', {
    expression: `JSON.stringify((${JSON.stringify(sels)}).map(([name, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return [name, null];
      const r = el.getBoundingClientRect();
      const sx = window.scrollX, sy = window.scrollY;
      return [name, {x: +(r.x+sx).toFixed(1), y: +(r.y+sy).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
                     right: +(r.right+sx).toFixed(1), bottom: +(r.bottom+sy).toFixed(1)}];
    }))`,
    returnByValue: true,
  });
  fs.writeFileSync(`${outPrefix}-measure.json`, result.value);
  for (const [name, box] of JSON.parse(result.value)) {
    console.log(name.padEnd(28), box ? `x=${box.x} y=${box.y} w=${box.w} h=${box.h} r=${box.right} b=${box.bottom}` : 'NOT FOUND');
  }
}

await send('Target.closeTarget', { targetId });
ws.close();
setTimeout(() => process.exit(0), 200);
