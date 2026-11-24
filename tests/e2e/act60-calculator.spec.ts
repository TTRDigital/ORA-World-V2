import { test, expect } from "@playwright/test";

// Client, 24 Nov: the Act 60 calculator compares federal, state and local tax where the visitor lives with Act 60.
test.describe("Act 60 calculator", () => {
  for (const path of ["/en/act-60", "/en/b/act-60"]) {
    test(`location changes the estimate on ${path}`, async ({ page }) => {
      await page.goto(path);
      const calc = page.locator('[data-widget="tax-compare"]');
      await calc.scrollIntoViewIfNeeded();
      const select = calc.getByLabel("Current State of Residence");
      await expect(select).toHaveValue("US");
      await expect(select.locator("option")).toHaveCount(53); // federal only, 50 states, DC and New York City
      const row = (name: string) => calc.locator("dl > div").filter({ hasText: name }).locator("dd");
      const amount = async (name: string) => Number((await row(name).textContent())!.replace(/[^\d]/g, ""));

      await expect.poll(() => amount("Estimated federal tax")).toBeGreaterThan(150_000);
      await expect.poll(() => amount("Estimated state and local taxes")).toBe(0);

      await select.selectOption("CA");
      await expect.poll(() => amount("Estimated state and local taxes")).toBeGreaterThan(80_000);
      await select.selectOption("NYC");
      await expect.poll(() => amount("Estimated state and local taxes")).toBeGreaterThan(100_000);
      await select.selectOption("TX");
      await expect.poll(() => amount("Estimated state and local taxes")).toBe(0);

      // The 0% regime leaves no Puerto Rico tax.
      await calc.getByRole("radio", { name: /^0%/ }).click();
      await expect.poll(() => amount("Estimated Puerto Rico tax")).toBe(0);
      await expect(calc).toContainText("100%");
      await expect(calc).toContainText("Consult a qualified tax advisor before making financial or relocation decisions.");
    });
  }
});

// Client meeting, 24 Nov: an address adds county, city and school district taxes. The Census lookup is mocked here.
test("an address adds the local taxes found there", async ({ page, request }) => {
  const bad = await request.get("/api/tax-place?q=x");
  expect(bad.status()).toBe(400);
  await page.route("**/api/tax-place**", (route) =>
    route.fulfill({
      json: { ok: true, code: "MI", matched: "2 WOODWARD AVE, DETROIT, MI, 48226", areas: ["Wayne County", "Detroit city"], locals: [{ name: "Detroit city income tax", base: "gain", flat: 0.024, minus: 600 }] },
    }),
  );
  await page.goto("/en/act-60");
  const calc = page.locator('[data-widget="tax-compare"]');
  await calc.scrollIntoViewIfNeeded();
  const stateLocal = async () => Number((await calc.locator("dl > div").filter({ hasText: "Estimated state and local taxes" }).locator("dd").textContent())!.replace(/[^\d]/g, ""));
  await calc.getByLabel("Current State of Residence").selectOption("MI");
  // Michigan 4.25% of the $1,000,000 gain less the $5,900 exemption.
  await expect.poll(stateLocal).toBe(42_249);
  await calc.getByPlaceholder(/street/i).fill("2 Woodward Ave, Detroit, MI 48226");
  await calc.getByRole("button", { name: "Find" }).click();
  await expect(calc.locator("[data-place]")).toContainText("Detroit city income tax (2.4%)");
  // 2.4% of the $1,000,000 gain less the $600 exemption.
  await expect.poll(stateLocal).toBe(42_249 + 23_986);
  // Choosing a state by hand drops the address.
  await calc.getByLabel("Current State of Residence").selectOption("MI");
  await calc.getByLabel("Current State of Residence").selectOption("OH");
  await expect(calc.locator("[data-place]")).toHaveCount(0);
});

// Client meeting, 24 Nov: a second line for qualified ordinary income, and the yearly savings compounded.
test("ordinary income and the compounded savings", async ({ page }) => {
  await page.goto("/en/act-60");
  const calc = page.locator('[data-widget="tax-compare"]');
  await calc.scrollIntoViewIfNeeded();
  const amount = async (name: string) => Number((await calc.locator("dl > div").filter({ hasText: name }).locator("dd").first().textContent())!.replace(/[^\d]/g, ""));
  await expect.poll(() => amount("Estimated federal tax")).toBe(192_488);
  const ordinary = calc.getByRole("slider", { name: /qualified ordinary income/i });
  await ordinary.evaluate((el: HTMLInputElement) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, "500000");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(calc.locator("dl")).toContainText("Qualified ordinary income");
  // $500,000 of interest and dividends on the ordinary brackets, the $1,000,000 gain stacked on top, 3.8% NIIT on both.
  await expect.poll(() => amount("Estimated federal tax")).toBe(384_454);
  await expect.poll(() => amount("Estimated Puerto Rico tax")).toBe(60_000);
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
