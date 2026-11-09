import { test, expect } from "@playwright/test";

test.describe("vendored components and the desktop menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("ora2_consent", "denied"));
  });

  test("header links keep their real names behind the TextRoll", async ({ page, isMobile }) => {
    test.skip(isMobile, "header links are desktop only");
    await page.goto("/en");
    const link = page.locator("header nav").getByRole("link", { name: "Residences", exact: true });
    await expect(link).toBeVisible();
    await expect(link.locator("[aria-hidden=true]").first()).toBeAttached();
  });

  test("home follows the Cipriani layout: banner, eight numbered sections, living card rails", async ({ page }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll("main section[id]")).map((s) => s.id));
    expect(ids).toEqual(["hero", "virtual-tour", "amenities", "residences", "penthouse", "floor-plans", "charters", "location", "contact"]);
    await expect(page.locator("#hero h1")).toHaveText(/a life to treasure/i);
    // The 360° tour loads only on click.
    const tour = page.getByTestId("home-vr-tour");
    await expect(tour.locator("iframe")).toHaveCount(0);
    await tour.getByRole("button").click();
    await expect(tour.locator("iframe")).toHaveAttribute("src", /kuula\.co/);
    // Card rail: the next arrow scrolls the row.
    const rail = page.locator("#residences [aria-roledescription=carousel]");
    await rail.scrollIntoViewIfNeeded();
    const track = rail.locator("ul").first();
    const before = await track.evaluate((el) => el.scrollLeft);
    await rail.getByRole("button", { name: "Next" }).click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
    // Phase 1 pricing and the real floor plans.
    await expect(page.locator("#floor-plans")).toContainText("$2,250");
    await expect(page.locator("#floor-plans a[href*='/residences/plans/residence-501']")).toHaveCount(1);
  });

  test("counters render real values in the server HTML", async ({ request }) => {
    const html = await (await request.get("/en")).text();
    expect(html).toContain("65,500");
    expect(html).toContain("335,995");
  });

  test("gallery coverflow carousel has labelled, clickable pagination", async ({ page }) => {
    await page.goto("/en/place/gallery");
    const carousel = page.getByTestId("featured-carousel");
    await carousel.scrollIntoViewIfNeeded();
    const bullets = carousel.getByRole("button", { name: /Go to render/ });
    await expect(bullets.first()).toBeVisible();
    await bullets.nth(2).click();
    await expect(bullets.nth(2)).toHaveClass(/swiper-pagination-bullet-active/);
  });
});
