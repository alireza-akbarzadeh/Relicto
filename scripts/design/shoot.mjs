// Full-page screenshot over CDP: node shoot.mjs <url> <out.png> [width=1280] [viewportHeight=900]
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, width = "1280", vh = "900"] = process.argv.slice(2);
const CH = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CH, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), "relicto-design-chrome")}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("chrome did not start");
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const events = [];
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) pending.get(msg.id)(msg), pending.delete(msg.id);
  else if (msg.method) events.push(msg.method);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const n = ++id;
    pending.set(n, resolve);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: +width, height: +vh, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url });
  for (let i = 0; i < 120 && !events.includes("Page.loadEventFired"); i++) await sleep(250);
  await sleep(2500);
  const metrics = await send("Page.getLayoutMetrics");
  const height = Math.ceil(metrics.result.cssContentSize.height);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: +width, height, scale: 1 },
  });
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  console.log(`${out} ${width}x${height}`);
} finally {
  ws.close();
  chrome.kill();
}
