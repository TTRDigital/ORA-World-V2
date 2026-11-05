import { test, expect } from "@playwright/test";
import manifest from "../../src/content/images.json" with { type: "json" };

const PAGES = ["/en", "/en/residences", "/en/residences/villas", "/en/residences/plans", "/en/living", "/en/place", "/en/place/tesoro-del-mar", "/en/place/gallery", "/en/invest", "/en/portfolio", "/en/visit", "/es", "/es/living"];
const originals = new Map(Object.values(manifest).map((m) => [m.src, m.width]));

/**
 * Image audit. Fails on:
 *  - no-focal: a cover image without a focal point (data-focal on its frame or an inline object-position)
 *  - soft-source: the original asset is narrower than 1.5× the image's displayed CSS width
 *  - undersized-sizes: the `sizes` slot is smaller than the real rendered width (Chrome reports naturalWidth
 *    divided by the srcset density, which equals the sizes slot), so the browser fetches too small a file
 *  - blur: any data:image placeholder in the HTML or on an <img>
 */
test.describe("image audit", () => {
  for (const path of PAGES) {
    test(`no blur, focal points set, sources sharp on ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "load" });
      const html = (await res?.text()) ?? "";
      expect(html, "no data:image placeholders in the HTML").not.toMatch(/data:image\/(jpeg|png|webp|gif);base64/);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      const imgs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img")).map((img) => {
          const r = img.getBoundingClientRect();
          const frame = img.closest("[data-focal]") as HTMLElement | null;
          const raw = img.currentSrc || img.src;
          let original = raw;
          try {
            const u = new URL(raw);
            original = u.pathname === "/_next/image" ? decodeURIComponent(u.searchParams.get("url") || "") : u.pathname;
          } catch {}
          return {
            original,
            raw: img.getAttribute("src") || "",
            displayed: Math.round(r.width),
            slot: img.naturalWidth,
            complete: img.complete && img.naturalWidth > 0,
            hasSrcset: !!img.getAttribute("srcset"),
            cover: getComputedStyle(img).objectFit === "cover",
            focal: frame?.dataset.focal ?? (img.style.objectPosition || null),
            visible: r.width >= 24 && getComputedStyle(img).visibility !== "hidden",
          };
        }),
      );
      const issues: { original: string; issue: string; detail: string }[] = [];
      for (const i of imgs) {
        if (i.raw.startsWith("data:image")) issues.push({ original: "data:", issue: "blur", detail: "" });
        if (!i.visible || i.original.startsWith("/brand/") || i.original.endsWith(".svg")) continue;
        if (i.cover && !i.focal) issues.push({ original: i.original, issue: "no-focal", detail: "" });
        const w = originals.get(i.original);
        if (w && w < i.displayed * 1.5) issues.push({ original: i.original, issue: "soft-source", detail: `original ${w}px for ${i.displayed}px` });
        if (i.complete && i.hasSrcset && i.slot < i.displayed * 0.85) issues.push({ original: i.original, issue: "undersized-sizes", detail: `sizes slot ${i.slot}px for ${i.displayed}px` });
      }
      expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
    });
  }
});
