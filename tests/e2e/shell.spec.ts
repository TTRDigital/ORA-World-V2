import { test, expect } from "@playwright/test";

test.describe("shell", () => {
  test("root redirects to a locale, home renders, legal notice present", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page).toHaveTitle(/ORA World/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("footer")).toContainText("Attorney General File No.: CP25-0047");
    await expect(page.locator("footer")).toContainText("All images on this page are artist renderings.");
  });

  test("language switch keeps the page and is remembered", async ({ page, isMobile }) => {
    await page.goto("/en/faq");
    if (isMobile) {
      await page.getByRole("button", { name: /open menu/i }).click();
      await page.locator("#mobile-menu").getByRole("button", { name: "es" }).click();
    } else {
      await page.locator("header").getByRole("button", { name: "es" }).click();
    }
    await expect(page).toHaveURL(/\/es\/faq$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
  });

  test("nav bar stays the same while scrolling (no shrinking)", async ({ page, isMobile }) => {
    // An inner page: the homepage opens with the clear bar over the film (its own test below).
    await page.goto("/en/living");
    await page.locator("html:not(.no-js)").waitFor();
    await page.waitForTimeout(500);
    const nav = page.locator("header nav");
    const before = await nav.boundingBox();
    if (!isMobile) await expect(nav.getByRole("link", { name: "Residences" })).toBeVisible();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(700);
    const after = await nav.boundingBox();
    expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
    expect(Math.abs(after!.width - before!.width)).toBeLessThan(1);
    if (!isMobile) await expect(nav.getByRole("link", { name: "Residences" })).toBeVisible();
  });

  test("homepage keeps the white bar at the top, with the banner below it", async ({ page, isMobile }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    await expect(page.locator("header[data-mode]")).toHaveAttribute("data-mode", "solid");
    if (!isMobile) await expect(page.locator("header nav").getByRole("link", { name: "Residences", exact: true })).toBeVisible();
    // The banner starts right under the bar (its 1px border), once the page's entrance motion has settled.
    await expect
      .poll(async () => {
        const bar = await page.locator("header[data-mode]").boundingBox();
        const hero = await page.locator("#hero").boundingBox();
        return Math.abs(hero!.y - bar!.height);
      })
      .toBeLessThanOrEqual(1);
  });

  // Client, 24 Nov: Version 2's phone menu on every version (large serif links, no "Version A" link).
  for (const [path, first] of [["/en", "Residences"], ["/en/b", "Living"], ["/en/d", "Residences"]] as const) {
    test(`mobile menu on ${path} opens, lists the pages, closes on Escape`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "phone menu only");
      await page.goto(path);
      await page.locator("header").getByRole("button", { name: /menu/i }).click();
      const menu = path === "/en/b" ? page.locator("header") : page.getByRole("dialog");
      await expect(menu.getByRole("link", { name: first, exact: true })).toBeVisible();
      await expect(menu.getByRole("link", { name: /version a/i })).toHaveCount(0);
      if (path !== "/en/b") {
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
      }
    });
  }

  test("Ask ORA opens with searchable questions and keyboard tabs", async ({ page }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    // The button appears once the banner is scrolled past (one button on the first screen).
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
    await page.getByRole("button", { name: "Ask ORA" }).click();
    const dialog = page.getByRole("dialog", { name: "Ask ORA" });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder(/search/i).fill("hurricane");
    await expect(dialog.getByRole("button", { name: /hurricanes and earthquakes/i })).toBeVisible();
    await dialog.getByRole("tab", { name: "Quick questions" }).focus();
    await page.keyboard.press("ArrowRight");
    // Client, 24 Nov: no phone number on the sites, so there is no "Call" tab; the next tab is "Book a visit".
    await expect(dialog.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(dialog.getByRole("tab", { name: /call/i })).toHaveCount(0);
    await expect(dialog.locator('a[href^="tel:"]')).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("home stays at the top after load (no component scrolls the window)", async ({ page }) => {
    await page.goto("/en", { waitUntil: "load" });
    await page.locator("html:not(.no-js)").waitFor();
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("redirects, robots, sitemap, noindex and CSP headers", async ({ request }) => {
    const r = await request.get("/en/our-residences", { maxRedirects: 0 });
    expect(r.status()).toBe(308);
    expect(r.headers()["location"]).toMatch(/\/en\/residences$/);
    const home = await request.get("/en");
    expect(home.headers()["content-security-policy"]).toContain("youtube-nocookie.com");
    expect(home.headers()["x-robots-tag"]).toContain("noindex");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Disallow");
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("/es/residences");
  });

  test("newsletter and lead API validate and accept", async ({ request }) => {
    // Each run gets its own client address, so the lead rate limit (8 per 10 minutes) does not carry across runs.
    const headers = { "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 250) + 1}` };
    const bad = await request.post("/api/lead", { headers, data: { variant: "short", name: "x" } });
    expect(bad.status()).toBe(400);
    const ok = await request.post("/api/lead", { headers, data: { variant: "short", name: "Test Person", email: "test@example.com", phone: "+1 787 555 0100", lead_type: "buyer", consent: true, locale: "en" } });
    expect(ok.status()).toBe(200);
    const honey = await request.post("/api/lead", { headers, data: { variant: "short", name: "Bot", email: "bot@example.com", lead_type: "buyer", consent: true, locale: "en", company: "" } });
    expect(honey.status()).toBe(200);
  });
});
