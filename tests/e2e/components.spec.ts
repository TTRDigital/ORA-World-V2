import { test, expect } from "@playwright/test";

test.describe("vendored components and the desktop menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("ora2_consent", "denied"));
  });

  test("header links keep their real names behind the TextRoll", async ({ page, isMobile }) => {
    test.skip(isMobile, "header links are desktop only");
    await page.goto("/en/living");
    const link = page.locator("header nav").getByRole("link", { name: "Residences", exact: true });
    await expect(link).toBeVisible();
    await expect(link.locator("[aria-hidden=true]").first()).toBeAttached();
  });

  test("home tells the ORA World story with one call to action, Inquire", async ({ page }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    // Checked first, while the banner is on screen (mobile browsers pause muted films scrolled out of view).
    // Client, 17 Nov: the banner plays "Tesoro Layout Film v5" (silent): no sound button; the pause button stops it.
    await expect(page.locator("#hero [data-film-sound]")).toHaveCount(0);
    const film = page.locator("#hero video").first();
    await expect(film.locator("source")).toHaveAttribute("src", "/videos/hero-film.mp4");
    await expect.poll(() => film.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    await page.locator("#hero [data-film-pause]").click();
    await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    // Client call, 10 Nov 2026: who → why Puerto Rico → longevity → what ORA World offers → how it helps → Inquire.
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll("main section[id]")).map((s) => s.id));
    expect(ids).toEqual(["hero", "who", "why-ora-world", "residences", "virtual-tour", "explorer", "location", "mission", "inquire"]);
    // Owner's content brief: his ready-to-use lines, the services and the ghost kitchen are on the page.
    const main = page.locator("main");
    // Client, 16 Nov: the longevity and fitness sections moved to their own page (tested below).
    // Client, 16 Nov: the Act 60 line is now a "Why ORA World" card (the tax section left the homepage).
    for (const line of [/act 60: the tax benefits of living here/i])
      await expect(main.getByText(line).first()).toBeVisible();
    // Client, 16 Nov: the amenities section left the homepage; the ORA services are in the "Longevity, built in" card.
    await expect(page.locator("#why-ora-world")).toContainText(/ghost kitchen/i);
    await expect(page.locator("#why-ora-world")).toContainText(/total body scan/i);
    // Client, 15 Nov: no founder card or quote on the homepage.
    await expect(page.locator("#who")).not.toContainText(/harvard|heard about anything like this/i);
    // Huddle: the Tesoro Del Mar property specs, as published.
    // The figures count up when scrolled into view (client, 16 Nov).
    await page.locator("#who dl").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    for (const spec of [/10\s*acres/i, /129\s*residences/i, /42\s*hotel suites/i, /65,500\s*sq ft of amenities/i]) await expect(page.locator("#who")).toContainText(spec);
    // Brief details that are easy to drop.
    // Client, 15 Nov: no nine-day week anywhere on the homepage.
    await expect(page.locator("main")).not.toContainText(/nine-day week/i);
    await expect(page.locator("#inquire")).toContainText(/brochure/i);
    // Never on the site: the owner's name, a guaranteed health outcome, helicopter promises.
    const text = (await main.innerText()).toLowerCase();
    expect(text).not.toMatch(/dr\.? ?yan|guarantee|helicopter|helipad/);
    await expect(page.locator("#hero h1")).toHaveText(/beyond expectations/i);
    // Client, 16 Nov: only "Beyond expectations" on the banner, no other text.
    await expect(page.locator("#hero p:not(.visually-hidden)")).toHaveCount(0);
    // No links over the film; "Inquire" is in the white bar at the top.
    await expect(page.locator("#hero a:not([data-scroll-cue])")).toHaveCount(0);
    await expect(page.locator("#hero a[data-scroll-cue]")).toHaveAttribute("href", "#who");
    await expect(page.locator('a[data-track="cta_inquire"]:visible').first()).toHaveText(/inquire/i);
    // No other wording for the main action anywhere on the page.
    await expect(page.getByText(/get price list|book a visit/i)).toHaveCount(0);
    // Act 60 figures with the not-tax-advice note.
    // The 360° tour loads only on click.
    const tour = page.getByTestId("home-vr-tour");
    await expect(tour.locator("iframe")).toHaveCount(0);
    await tour.getByRole("button").click();
    await expect(tour.locator("iframe")).toHaveAttribute("src", /kuula\.co/);
    // Card rail: the next arrow scrolls the row.
    const rail = page.locator("#who [aria-roledescription=carousel]");
    await rail.scrollIntoViewIfNeeded();
    const track = rail.locator("ul").first();
    const before = await track.evaluate((el) => el.scrollLeft);
    await rail.getByRole("button", { name: "Next" }).click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
    // Interiors: the counter follows the arrows.
    await page.locator("#residences").getByRole("button", { name: "Next image" }).click();
    await expect(page.locator("#residences")).toContainText("02 / 11");
    // Client, 17 Nov: the tower explorer ("Choose your altitude") in place of the floor plans.
    await expect(page.locator("#explorer")).toContainText(/choose your altitude/i);
    await expect(page.locator("#mission")).toContainText(/revolutionize puerto rico.s real estate landscape/i);
    await expect(page.locator("#inquire form")).toHaveCount(1);
    await expect(page.locator("#inquire").getByLabel(/what matters most to you/i)).toBeVisible();
  });

  test("Longevity page carries the owner's lines and the two sections", async ({ page }) => {
    await page.goto("/en/longevity");
    await page.locator("html:not(.no-js)").waitFor();
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll("main section[id]")).map((s) => s.id));
    expect(ids).toEqual(expect.arrayContaining(["longevity", "fitness"]));
    const main = page.locator("main");
    for (const line of [
      /planes don.t fall from the sky/i,
      /two lungs, two kidneys/i,
      /what is the value of an extra 10 years/i,
      /don.t you want to have a better life/i,
      /longevity is the foundation of our world/i,
    ])
      await expect(main.getByText(line).first()).toBeVisible();
    await expect(page.locator("#fitness")).toContainText(/an outlier/i);
    await expect(page.locator("#fitness")).toContainText(/work on it in advance/i);
    // In the menu, and gone from the homepage.
    await page.goto("/en");
    await expect(page.locator("#longevity, #fitness")).toHaveCount(0);
  });

  test("counters render real values in the server HTML", async ({ request }) => {
    const html = await (await request.get("/en")).text();
    expect(html).toContain("65,500");
    expect(html).toContain("335,995");
  });

  test("floor plans page carries the floor-plan explorer (moved from the homepage)", async ({ page }) => {
    await page.goto("/en/residences/plans");
    // Floor-plan explorer: pricing line, the default residence, a bedroom filter and a level.
    await expect(page.locator("#floor-plans")).toContainText("$2,000");
    await expect(page.locator("#floor-plans h3").first()).toHaveText(/residence 1002/i);
    await page.locator("#floor-plans").getByRole("button", { name: "4 Bed", exact: true }).click();
    await expect(page.locator("#floor-plans h3").first()).toHaveText(/residence 1301/i);
    const ph = page.locator("#floor-plans").getByRole("button", { name: /^PH/ });
    await ph.evaluate((el) => el.scrollIntoView({ block: "nearest", inline: "center" }));
    await ph.click();
    await expect(page.locator("#floor-plans h3").first()).toHaveText(/the penthouse/i);
  });

  test("gallery: in the top navigation, filters, and the full-screen view", async ({ page, isMobile }) => {
    await page.goto("/en/place/gallery");
    await expect(page).toHaveURL(/\/en\/gallery$/);
    await expect(page.locator("h1")).toHaveText(/gallery/i);
    const tiles = page.locator("main ul li");
    const all = await tiles.count();
    expect(all).toBeGreaterThan(20);
    await expect(page.locator("main video")).toHaveCount(0); // client, 18 Nov: images, not videos
    await page.getByRole("button", { name: /^Residences/ }).click();
    await expect.poll(() => tiles.count()).toBeLessThan(all);
    await tiles.first().getByRole("button").click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/01 \/ /);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText(/02 \/ /);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    if (!isMobile) {
      await page.goto("/en");
      await expect(page.locator("header nav").getByRole("link", { name: "Gallery" })).toHaveAttribute("href", "/en/gallery");
    }
  });

});
