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

  test("nav pill compacts on scroll down and expands on scroll up", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop pill only");
    await page.goto("/en");
    // Wait for hydration (MotionInit removes .no-js), otherwise the wheel scrolls before the header listens.
    await page.locator("html:not(.no-js)").waitFor();
    await page.waitForTimeout(500);
    await expect(page.locator("header nav").getByRole("link", { name: "Residences" })).toBeVisible();
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
    await expect(page.locator("header nav").getByRole("link", { name: "Residences" })).toBeHidden();
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(400);
    await expect(page.locator("header nav").getByRole("link", { name: "Residences" })).toBeVisible();
  });

  test("mobile bottom sheet opens with tiles, traps focus, closes on Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile sheet only");
    await page.goto("/en");
    await page.getByRole("button", { name: /open menu/i }).click();
    const sheet = page.locator("#mobile-menu");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("link", { name: "Residences" })).toBeVisible();
    await expect(sheet.locator("img").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  test("Ask ORA opens with searchable questions and keyboard tabs", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Ask ORA" }).click();
    const dialog = page.getByRole("dialog", { name: "Ask ORA" });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder(/search/i).fill("hurricane");
    await expect(dialog.getByRole("button", { name: /hurricanes and earthquakes/i })).toBeVisible();
    await dialog.getByRole("tab", { name: "Quick questions" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("tab", { name: "Book a visit" })).toHaveAttribute("aria-selected", "true");
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
    const bad = await request.post("/api/lead", { data: { variant: "short", name: "x" } });
    expect(bad.status()).toBe(400);
    const ok = await request.post("/api/lead", { data: { variant: "short", name: "Test Person", email: "test@example.com", phone: "+1 787 555 0100", consent: true, locale: "en" } });
    expect(ok.status()).toBe(200);
    const honey = await request.post("/api/lead", { data: { variant: "short", name: "Bot", email: "bot@example.com", consent: true, locale: "en", company: "" } });
    expect(honey.status()).toBe(200);
  });
});
