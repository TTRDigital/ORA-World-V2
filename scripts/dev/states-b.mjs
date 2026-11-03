import { chromium } from "@playwright/test";
const base = process.env.BASE_URL || "http://localhost:3102";
const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }));
const shot = async (page, name) => page.screenshot({ path: `/tmp/shots-b/${name}.jpg`, type: "jpeg", quality: 80 });
for (const v of [
  { name: "d", viewport: { width: 1440, height: 900 }, scale: 1 },
  { name: "m", viewport: { width: 390, height: 844 }, scale: 2, mobile: true },
]) {
  const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: v.scale, isMobile: v.mobile, hasTouch: v.mobile });
  const page = await ctx.newPage();
  await page.goto(base + "/en/dev/b", { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => localStorage.setItem("ora2_consent", "denied"));
  await page.reload({ waitUntil: "load" });
  // Explorer: select residences
  await page.locator("#explorer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.locator('[data-slug="residences"]').dispatchEvent('click');
  await page.waitForTimeout(900);
  await shot(page, `${v.name}-explorer-residences`);
  await page.getByRole("button", { name: "Garden" }).click();
  await page.waitForTimeout(600);
  await shot(page, `${v.name}-explorer-garden`);
  // Rooms: go to room 2, open a hotspot
  await page.locator("#rooms").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -40));
  await page.waitForTimeout(1200);
  await page.getByRole("tab", { name: "Living" }).click();
  await page.waitForTimeout(1200);
  await page.locator('#rooms [aria-controls^="spot-"]').first().dispatchEvent('click');
  await page.waitForTimeout(500);
  await shot(page, `${v.name}-rooms-hotspot`);
  // Dial: scroll until card 5 is in view
  const card = page.locator('#resilience [data-index="4"]');
  await card.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -120));
  await page.waitForTimeout(1200);
  await shot(page, `${v.name}-dial-mid`);
  const last = page.locator('#resilience [data-index="8"]');
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await shot(page, `${v.name}-dial-end`);
  await ctx.close();
}
await browser.close();
console.log("done");
