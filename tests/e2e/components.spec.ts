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

  test("home tells the ORA World story with one call to action, Inquire", async ({ page }) => {
    await page.goto("/en");
    await page.locator("html:not(.no-js)").waitFor();
    // Client call, 10 Nov 2026: who → why Puerto Rico → longevity → what ORA World offers → how it helps → Inquire.
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll("main section[id]")).map((s) => s.id));
    expect(ids).toEqual(["hero", "who", "why-ora-world", "longevity", "fitness", "why-puerto-rico", "virtual-tour", "residences", "amenities", "charters", "floor-plans", "steps", "inquire"]);
    // Owner's content brief: his ready-to-use lines, the services and the ghost kitchen are on the page.
    const main = page.locator("main");
    for (const line of [
      /nine-day week/i,
      /planes don.t fall from the sky/i,
      /two lungs, two kidneys/i,
      /what is the value of an extra 10 years/i,
      /don.t you want to have a better life/i,
      /you don.t need to move now\. you just need to apply/i,
      /longevity is the foundation of our world/i,
    ])
      await expect(main.getByText(line).first()).toBeVisible();
    await expect(page.locator("#amenities")).toContainText(/ghost kitchen/i);
    await expect(page.locator("#amenities")).toContainText(/total body scan/i);
    await expect(page.locator("#who")).toContainText(/harvard-trained heart surgeon/i);
    // Huddle: the Tesoro Del Mar property specs, as published.
    for (const spec of [/10\s*acres/i, /129\s*residences/i, /42\s*hotel suites/i, /65,500\s*sq ft of amenities/i]) await expect(page.locator("#who")).toContainText(spec);
    // Brief details that are easy to drop.
    await expect(page.locator("#fitness")).toContainText(/an outlier/i);
    await expect(page.locator("#fitness")).toContainText(/work on it in advance/i);
    await expect(page.locator("#why-puerto-rico")).toContainText(/9 or 10 am until 7 pm/i);
    await expect(page.locator("#why-puerto-rico")).toContainText(/advertising or management business/i);
    await expect(page.locator("#steps")).toContainText(/how ora world helps you/i);
    await expect(page.locator("#inquire")).toContainText(/brochure/i);
    // Never on the site: the owner's name, a guaranteed health outcome, helicopter promises.
    const text = (await main.innerText()).toLowerCase();
    expect(text).not.toMatch(/dr\.? ?yan|guarantee|helicopter|helipad/);
    await expect(page.locator("#hero h1")).toHaveText(/a life to treasure/i);
    // One link in the banner, "Inquire", plus the film's sound toggle.
    await expect(page.locator("#hero a")).toHaveCount(1);
    await expect(page.locator("#hero a")).toHaveText(/inquire/i);
    // Sound on when the page opens (client); one click on the button turns it off, and the choice is remembered.
    const sound = page.locator("#hero [data-film-sound]");
    await expect(sound).toBeVisible();
    await page.waitForTimeout(2000); // the film mounts after load + idle and starts with sound where allowed
    const pressedBefore = await sound.getAttribute("aria-pressed");
    await sound.click();
    await expect(sound).toHaveAttribute("aria-pressed", pressedBefore === "true" ? "false" : "true");
    if (pressedBefore === "true") {
      await expect(sound).toHaveText(/watch the film/i);
      expect(await page.evaluate(() => localStorage.getItem("ora2_film_sound"))).toBe("off");
    }
    // No other wording for the main action anywhere on the page.
    await expect(page.getByText(/get price list|book a visit/i)).toHaveCount(0);
    // Act 60 figures with the not-tax-advice note.
    await expect(page.locator("#why-puerto-rico")).toContainText("0%");
    await expect(page.locator("#why-puerto-rico")).toContainText(/not tax or legal advice/i);
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
    // Pricing, the real plans, the three steps and the inquiry form.
    await expect(page.locator("#floor-plans")).toContainText("$2,250");
    await expect(page.locator("#floor-plans a[href*='/residences/plans/residence-501']")).toHaveCount(1);
    await expect(page.locator("#steps li")).toHaveCount(3);
    await expect(page.locator("#inquire form")).toHaveCount(1);
    await expect(page.locator("#inquire").getByLabel(/what matters most to you/i)).toBeVisible();
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
