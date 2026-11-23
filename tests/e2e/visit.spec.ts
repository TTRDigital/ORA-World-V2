import { test, expect } from "@playwright/test";

// TTR-3011 (Kia, Nov 23): no separate visit page. Visit and contact addresses open the inquiry form on the homepage.
test.describe("visit page redirects to the inquiry form", () => {
  for (const [from, to] of [
    ["/en/visit", "/en#inquire"],
    ["/es/visit", "/es#inquire"],
    ["/en/contact", "/en#inquire"],
  ] as const) {
    test(`${from} is a permanent redirect to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      const loc = new URL(res.headers()["location"], "http://x");
      expect(loc.pathname + loc.hash).toBe(to);
    });
  }

  test("the redirect keeps the campaign parameters", async ({ request }) => {
    const res = await request.get("/en/visit?utm_source=google&gclid=abc", { maxRedirects: 0 });
    const loc = new URL(res.headers()["location"], "http://x");
    expect(loc.searchParams.get("utm_source")).toBe("google");
    expect(loc.searchParams.get("gclid")).toBe("abc");
  });

  test("/en/visit lands on the inquiry form, which is unchanged", async ({ page }) => {
    await page.goto("/en/visit");
    await expect(page).toHaveURL(/\/en(\?.*)?#inquire$/);
    const form = page.locator("#inquire form[data-variant=full]");
    await expect(form).toBeVisible();
    expect(await form.getAttribute("data-ttr-skip")).not.toBeNull();
    await expect(form.locator('input[name="lead_type"]')).toHaveCount(2);
    await expect(page.locator("#inquire")).toContainText("Inquire about Tesoro Del Mar");
  });

  test("no link on the site still points to /visit", async ({ page }) => {
    for (const path of ["/en", "/en/faq", "/en/residences", "/en/guides/oceanfront-condos-dorado-puerto-rico"]) {
      await page.goto(path);
      await expect(page.locator('a[href$="/visit"]')).toHaveCount(0);
    }
  });
});
