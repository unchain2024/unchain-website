// Capture the contact form with the filled export's own values in it, so the second
// export (Frame 2147226132.svg) can be diffed against the build the same way the empty
// one is. React owns the inputs, so values go in through the native setter + an `input`
// event rather than by assignment, which React would not see.
const port = Number(process.env.CDP_PORT || 9333);
const j = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
const ws = new WebSocket(j.webSocketDebuggerUrl);
await new Promise((r, x) => { ws.onopen = r; ws.onerror = x; });
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, { res, rej }); ws.send(JSON.stringify({ id: mid, method, params, sessionId })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Emulation.setScrollbarsHidden', { hidden: true });
await S('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
await S('Page.navigate', { url: 'http://localhost:5199/contact' });
await new Promise((r) => setTimeout(r, 4000));
const ev = async (expr) => { const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
const VALUES = {
  'input-company': '株式会社グローバルテック',
  'input-name': '佐藤 健一',
  'input-email': 'k.sato@globaltech.co.jp',
  'input-message':
    '現在、経営会議での意思決定に時間がかかっており、リスク管理も属人化しているのが課題です。NEURONを導入することで、どの程度改善できるのか実際のデモを拝見したくご連絡いたしました。まずは30分程度でご説明いただけますと幸いです。',
};
await ev(`(() => {
  const vals = ${JSON.stringify(VALUES)};
  for (const [probe, v] of Object.entries(vals)) {
    const el = document.querySelector('[data-probe="' + probe + '"]');
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  document.querySelector('[data-probe="consent"] input[type=checkbox]').click();
  return 1;
})()`);
await new Promise((r) => setTimeout(r, 800));
const { data } = await S('Page.captureScreenshot', {
  format: 'png',
  clip: { x: 0, y: 68, width: 1440, height: 1052, scale: 1 },
  captureBeyondViewport: true,
});
const fs = await import('node:fs');
fs.writeFileSync('tools/design/.work/shots/contact-filled.png', Buffer.from(data, 'base64'));
console.log('wrote tools/design/.work/shots/contact-filled.png');
await send('Target.closeTarget', { targetId }); ws.close();
