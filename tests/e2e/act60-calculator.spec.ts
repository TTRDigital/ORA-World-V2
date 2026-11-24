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
