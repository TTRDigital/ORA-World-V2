import { test, expect, type Page } from "@playwright/test";

// Client, 24 and 27 Nov: the Act 60 calculator compares federal, state and local tax where the visitor lives (found
// from their address; no state list) with Act 60, shows the savings first and in green, and sits right after the banner.
// The address lookup (/api/tax-place, which calls the Census geocoder) is mocked here.

const amount = (page: Page, name: string) => async () => {
  const text = await page.locator('[data-widget="tax-compare"] dl > div').filter({ hasText: name }).locator("dd").first().textContent();
  return Number(text!.replace(/[^\d]/g, ""));
};

async function useAddress(page: Page, json: object) {
  await page.unroute("**/api/tax-place**");
  await page.route("**/api/tax-place**", (route) => route.fulfill({ json }));
  const calc = page.locator('[data-widget="tax-compare"]');
  await calc.getByPlaceholder(/street/i).fill("1 Test St, Somewhere");
  await calc.getByRole("button", { name: "Calculate" }).click();
  await expect(calc.locator("[data-place]")).toBeVisible();
}

for (const path of ["/en/act-60", "/en/b/act-60", "/en/d/act-60"]) {
  test(`calculator right after the banner, address only, savings in green on ${path}`, async ({ page }) => {
    await page.goto(path);
    const calc = page.locator('[data-widget="tax-compare"]');
    // The calculator is the first section after the banner.
    const firstSection = page.locator("main section").nth(1);
    await expect(firstSection.locator('[data-widget="tax-compare"]')).toHaveCount(1);
    await calc.scrollIntoViewIfNeeded();
    await expect(calc.locator("select")).toHaveCount(0);
    // Client, 27 Nov: four numbered steps, and Dr. Yan's words "qualified ordinary income" on the page itself.
    for (const n of ["1", "2", "3", "4"]) await expect(calc.locator(`[data-step="${n}"]`)).toBeVisible();
    await expect(page.locator("main")).toContainText("qualified ordinary income (certain interest and dividends)");
    await expect(calc.getByLabel(/current home address/i)).toBeVisible();
    // Before an address: federal tax only.
    await expect.poll(amount(page, "Estimated federal tax")).toBeGreaterThan(150_000);
    await expect.poll(amount(page, "Estimated state tax")).toBe(0);
    // The savings come first, in green.
    const savings = calc.locator("[data-savings]");
    await expect(savings).toContainText("Total potential tax savings");
    expect(await savings.locator("p").nth(2).evaluate((el) => getComputedStyle(el).color)).toBe("rgb(127, 214, 164)");

    await useAddress(page, { ok: true, code: "CA", matched: "1 TEST ST, LOS ANGELES, CA", areas: ["Los Angeles County"], locals: [] });
    await expect.poll(amount(page, "Estimated state tax (California)")).toBeGreaterThan(80_000);
    await useAddress(page, { ok: true, code: "TX", matched: "1 TEST ST, AUSTIN, TX", areas: ["Travis County"], locals: [] });
    await expect.poll(amount(page, "Estimated state tax (Texas)")).toBe(0);
    await expect(calc.locator("[data-place]")).toContainText("No local income tax on capital gains at this address.");

    // The 0% regime leaves no Puerto Rico tax.
    await calc.getByRole("radio", { name: /^0%/ }).click();
    await expect.poll(amount(page, "Estimated Puerto Rico tax")).toBe(0);
    await expect(savings).toContainText("100%");
    await expect(calc).toContainText("Consult a qualified tax advisor before making financial or relocation decisions.");
  });
}

test("an address adds the local taxes found there", async ({ page, request }) => {
  const bad = await request.get("/api/tax-place?q=x");
  expect(bad.status()).toBe(400);
  await page.goto("/en/act-60");
  await page.locator('[data-widget="tax-compare"]').scrollIntoViewIfNeeded();
  // Michigan 4.25% of the $1,000,000 gain less the $5,900 exemption, then Detroit's 2.4% less the $600 exemption.
  await useAddress(page, { ok: true, code: "MI", matched: "2 WOODWARD AVE, DETROIT, MI, 48226", areas: ["Wayne County", "Detroit city"], locals: [{ name: "Detroit city income tax", base: "gain", flat: 0.024, minus: 600, mfj: { minus: 1200 } }] });
  await expect(page.locator("[data-place]")).toContainText("Detroit city income tax (2.4%)");
  // Client, 24 Nov: "explain state, city and other taxes": the state and the city on separate lines.
  await expect.poll(amount(page, "Estimated state tax (Michigan)")).toBe(42_249);
  await expect.poll(amount(page, "Detroit city income tax")).toBe(23_986);
  // A married couple filing jointly has two Detroit exemptions ($600 each).
  await page.locator('[data-widget="tax-compare"]').getByRole("radio", { name: "Married, filing jointly" }).click();
  await expect.poll(amount(page, "Detroit city income tax")).toBe(23_971);
});

test("a city or ZIP without a street still finds the state", async ({ page }) => {
  await page.goto("/en/act-60");
  await page.locator('[data-widget="tax-compare"]').scrollIntoViewIfNeeded();
  await useAddress(page, { ok: true, code: "MI", matched: null, areas: [], locals: null, partial: true });
  await expect(page.locator("[data-place]")).toContainText("We found your state (Michigan) but not the exact address");
  await expect.poll(amount(page, "Estimated state tax (Michigan)")).toBe(42_249);
});

// Client meeting, 24 Nov: a second line for qualified ordinary income, and the yearly savings compounded.
test("ordinary income and the compounded savings", async ({ page }) => {
  await page.goto("/en/act-60");
  const calc = page.locator('[data-widget="tax-compare"]');
  await calc.scrollIntoViewIfNeeded();
  await expect.poll(amount(page, "Estimated federal tax")).toBe(192_488);
  const ordinary = calc.getByRole("slider", { name: /qualified ordinary income/i });
  await ordinary.evaluate((el: HTMLInputElement) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, "500000");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(calc.locator("dl")).toContainText("Qualified ordinary income");
  // $500,000 of interest and dividends on the ordinary brackets, the $1,000,000 gain stacked on top, 3.8% NIIT on both.
  await expect.poll(amount(page, "Estimated federal tax")).toBe(384_454);
  await expect.poll(amount(page, "Estimated Puerto Rico tax")).toBe(60_000);
  const box = calc.locator("[data-compound]");
  await box.getByRole("radio", { name: "20%" }).click();
  await box.getByRole("radio", { name: "10 years" }).click();
  await expect(box).toContainText("Hypothetical value after 10 years");
  await expect(box).toContainText("returns are not guaranteed");
  // Savings of about $324,454 a year; at 20% for 10 years: x 25.9587, about $8.42 million.
  const grown = async () => Number((await box.locator("p").nth(2).textContent())!.replace(/[^\d]/g, ""));
  await expect.poll(grown).toBeGreaterThan(8_420_000);
  await expect.poll(grown).toBeLessThan(8_425_000);
});

// Client, 27 Nov: single or married filing jointly, and amounts typed in (his $10M-a-year example and larger).
test("filing status and typed amounts", async ({ page }) => {
  await page.goto("/en/act-60");
  const calc = page.locator('[data-widget="tax-compare"]');
  await calc.scrollIntoViewIfNeeded();
  await expect.poll(amount(page, "Estimated federal tax")).toBe(192_488);
  await calc.getByRole("radio", { name: "Married, filing jointly" }).click();
  // Joint: $32,200 deduction, 15% from $98,900 and 20% from $613,700, NIIT over $250,000.
  await expect.poll(amount(page, "Estimated federal tax")).toBe(176_540);
  await expect(calc).toContainText("a married couple filing jointly");
  const box = calc.getByLabel("Long-term capital gains", { exact: true }).first();
  await box.fill("20000000");
  await box.press("Enter");
  await expect.poll(amount(page, "Total capital gains")).toBe(20_000_000);
  await expect.poll(amount(page, "Estimated Puerto Rico tax")).toBe(800_000);
});

// Client, 27 Nov: the homepage card has no calculator, just "Calculate your savings" and a link to the full one.
test("homepage card links to the calculator", async ({ page }) => {
  await page.goto("/en");
  const card = page.locator('[data-widget="tax"]');
  await expect(card).toContainText("Calculate your savings");
  await expect(card.locator('input[type="range"]')).toHaveCount(0);
  await expect(card.getByRole("link", { name: /calculate my savings/i })).toHaveAttribute("href", "/en/act-60#calculator");
});
