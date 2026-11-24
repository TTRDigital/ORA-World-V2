import { test, expect } from "@playwright/test";

// Client meeting, 24 Nov: "Reserve your spot in paradise", the digital reservation journey.
test.describe("reserve", () => {
  test("floor plans lead to the reservation form with the residence filled in", async ({ page }) => {
    await page.goto("/en/residences/plans");
    const reserve = page.locator("#floor-plans").getByRole("link", { name: /^reserve 1002/i });
    await expect(reserve).toHaveAttribute("href", "/en/reserve?residence=1002#reserve-form");
    await page.goto("/en/reserve?residence=1002");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Reserve your place in paradise");
    await expect(page.getByRole("listitem").filter({ hasText: "Sign with DocuSign" })).toBeVisible();
    await expect(page.locator("#reserve-residence")).toHaveValue("1002");
    await expect(page.locator("#reserve-form")).toContainText("Nothing is charged here.");
    // Only a residence number is carried into the form.
    await page.goto("/en/reserve?residence=%3Cscript%3E");
    await expect(page.locator("#reserve-residence")).toHaveValue("");
  });

  test("the lead API accepts a reservation request", async ({ request }) => {
    const headers = { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250) + 1}` };
    const ok = await request.post("/api/lead", { headers, data: { variant: "reserve", name: "Test Person", email: "test@example.com", lead_type: "buyer", residence: "1002", attorney: true, consent: true, locale: "en" } });
    expect(ok.status()).toBe(200);
  });
});
