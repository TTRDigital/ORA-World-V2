import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/en", "/es", "/en/residences", "/en/residences/plans", "/en/residences/plans/residence-b1", "/en/living", "/en/place", "/en/place/tesoro-del-mar", "/en/place/gallery", "/en/invest", "/en/portfolio", "/en/visit", "/en/faq"];

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  for (const path of PAGES) {
    test(`no serious or critical violations on ${path}`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem("ora2_consent", "denied"));
      await page.goto(path, { waitUntil: "load" });
      await page.locator("html:not(.no-js)").waitFor();
      // Reveal everything so axe sees final colours rather than mid-fade opacity.
      await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((n) => n.classList.add("is-revealed")));
      await page.waitForTimeout(1000);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) })), JSON.stringify(serious.map((v) => v.id))).toEqual([]);
    });
  }
});
