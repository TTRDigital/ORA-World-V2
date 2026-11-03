import { test, expect } from "@playwright/test";

const PAGES = ["/en", "/en/residences", "/en/residences/plans", "/en/living", "/en/place", "/en/place/tesoro-del-mar", "/en/place/gallery", "/en/invest", "/en/portfolio", "/en/visit", "/es", "/es/living"];

/**
 * Image audit (fails the build on any of these):
 *  - a rendered image without a focal point (object-position left at the default 50% 50% without data-focal)
 *  - a rendered image whose natural width is below 1.5× its displayed width
 *  - any data:image blur placeholder in the HTML
 */
test.describe("image audit", () => {
  for (const path of PAGES) {
    test(`no blur, focal points set, sources sharp on ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      const html = (await res?.text()) ?? "";
      expect(html, "no data:image placeholders in the HTML").not.toMatch(/data:image\/(jpeg|png|webp);base64/);
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      const report = await page.evaluate(() => {
        const out: { src: string; natural: number; displayed: number; focal: string | null; issue: string }[] = [];
        for (const img of Array.from(document.querySelectorAll("img"))) {
          const r = img.getBoundingClientRect();
          if (r.width < 24 || img.src.includes("/brand/") || img.src.endsWith(".svg")) continue;
          const frame = img.closest("[data-focal]") as HTMLElement | null;
          const focal = frame?.dataset.focal ?? (img.style.objectPosition || null);
          if (getComputedStyle(img).objectFit === "cover" && !focal) out.push({ src: img.currentSrc, natural: img.naturalWidth, displayed: r.width, focal, issue: "no-focal" });
          if (img.complete && img.naturalWidth > 0 && img.naturalWidth < r.width * 1.5 * (window.devicePixelRatio >= 2 ? 1 : 1)) out.push({ src: img.currentSrc, natural: img.naturalWidth, displayed: Math.round(r.width), focal, issue: "soft-source" });
          if (img.getAttribute("src")?.startsWith("data:image")) out.push({ src: "data:", natural: 0, displayed: 0, focal, issue: "blur" });
        }
        return out;
      });
      expect(report, JSON.stringify(report, null, 2)).toEqual([]);
    });
  }
});
