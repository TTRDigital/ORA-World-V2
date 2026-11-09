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

  test("3D render carousel opens on the middle slide and turns", async ({ page }) => {
    await page.goto("/en");
    const region = page.getByRole("region", { name: /3D carousel/i });
    await region.scrollIntoViewIfNeeded();
    // The polite live region announces "NN of 09: <render title>".
    const count = page.locator("#renders [aria-live=polite]").filter({ hasText: /of 09/ });
    await expect(count).toHaveText(/^05 of 09/);
    await region.getByRole("button", { name: "Next render" }).click();
    await expect(count).toHaveText(/^06 of 09/);
    const dot = region.getByRole("button", { name: /^Render 1:/ });
    const box = await dot.boundingBox();
    expect(box && box.height >= 24 && box.width >= 24).toBeTruthy();
  });

  test("counters render real values in the server HTML", async ({ request }) => {
    const html = await (await request.get("/en")).text();
    expect(html).toContain("65,500");
    expect(html).toContain("335,995");
  });

  test("room tour sticks while scrolling, scroll changes the room, and a tab click scrolls to its room", async ({ page }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    const tab = (name: string) => page.locator("#rooms").getByRole("tab", { name });
    // Scroll positions inside the sticky runway: a fraction f of the travel after the stage first sticks.
    const at = (f: number) =>
      page.evaluate((f) => {
        const sticky = document.querySelector<HTMLElement>("#rooms .sticky")!;
        const runway = sticky.parentElement!;
        const travel = runway.offsetHeight - sticky.offsetHeight;
        const y = runway.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(sticky).top) + travel * f;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
        document.documentElement.style.scrollBehavior = "";
        return y;
      }, f);
    const stageTop = () => page.evaluate(() => Math.round(document.querySelector("#rooms [aria-roledescription=carousel]")!.getBoundingClientRect().top));
    await at(0.05);
    await expect(tab(/Foyer/)).toHaveAttribute("aria-selected", "true");
    const stuck = await stageTop();
    await at(0.6);
    await expect(tab(/Bath/)).toHaveAttribute("aria-selected", "true");
    expect(Math.abs((await stageTop()) - stuck)).toBeLessThan(4);
    const before = await at(0.3);
    await page.waitForTimeout(300);
    await tab(/Penthouse/).click();
    await expect(tab(/Penthouse/)).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 4000 }).toBeGreaterThan(before);
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
