/**
 * Full-page screenshots at desktop 1440 and mobile 390.
 *   node scripts/screenshots.mjs <outDir> /en /en/residences ...
 * Scrolls through the page first so every reveal has fired, then captures.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir = "reports/screenshots", ...paths] = process.argv.slice(2);
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
  // Documentation captures show every section at rest: scroll-linked motion (ScrollFx, reveals) is off under
  // reduced motion, so a stitched full-page or element capture never freezes a section mid-transition.
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: v.viewport,
    deviceScaleFactor: v.scale,
    isMobile: v.mobile,
    hasTouch: v.mobile,
  });
  const page = await ctx.newPage();
  for (const p of paths.length ? paths : ["/en"]) {
    await page.goto(base + p, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(async () => {
      localStorage.setItem("ora2_consent", "denied");
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      // Documentation capture: make sure every reveal has fired (the motion itself is verified separately).
      document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-revealed"));
      await new Promise((r) => setTimeout(r, 1500));
    });
    const name = `${v.name}${p.replace(/\//g, "-") || "-root"}.jpg`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true, type: "jpeg", quality: 80 });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
