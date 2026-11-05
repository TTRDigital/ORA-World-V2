/**
 * Element screenshots at desktop 1440 and mobile 390 (device scale 2 so type is legible).
 *   node scripts/sections.mjs <outDir> <path> <css-selector> [<css-selector> ...]
 * Scrolls each element into view, waits for reveals and counters, then captures it.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir = "reports/screenshots/sections", route = "/en", ...selectors] = process.argv.slice(2);
const base = process.env.BASE_URL || "http://localhost:3000";
await mkdir(outDir, { recursive: true });
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }));
const views = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, scale: 1 },
  { name: "mobile", viewport: { width: 390, height: 844 }, scale: 2, mobile: true },
];
for (const v of views) {
  const ctx = await browser.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.scale,
    isMobile: v.mobile,
    hasTouch: v.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => localStorage.setItem("ora2_consent", "denied"));
  // Fixed chrome (nav pill, skip link, Ask ORA, consent) would otherwise be stamped into element captures.
  await page.addStyleTag({ content: "header, a[href='#main'], [aria-haspopup='dialog'], [aria-label='Cookie consent'] { visibility: hidden !important; }" });
  for (const sel of selectors.length ? selectors : ["main"]) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.evaluate(async (s) => {
      const node = document.querySelector(s);
      if (!node) return;
      const top = node.getBoundingClientRect().top + window.scrollY;
      const h = node.getBoundingClientRect().height;
      for (let y = top - 300; y < top + h; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      await new Promise((r) => setTimeout(r, 1600));
    }, sel);
    const name = `${v.name}${route.replace(/\//g, "-")}${sel.replace(/[^a-z0-9]+/gi, "-")}.jpg`;
    await page.evaluate(() =>
      document.activeElement instanceof HTMLElement ? document.activeElement.blur() : null,
    );
    // Clip from a full-page capture so the layout is never re-flowed for a taller viewport.
    const box = await page.evaluate((s) => {
      const r = document.querySelector(s)?.getBoundingClientRect();
      return r ? { x: r.left, y: r.top + window.scrollY, width: r.width, height: r.height } : null;
    }, sel);
    if (!box) continue;
    await page.screenshot({
      path: path.join(outDir, name),
      type: "jpeg",
      quality: 82,
      fullPage: true,
      clip: box,
    });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
