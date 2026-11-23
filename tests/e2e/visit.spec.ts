import { test, expect, type Page } from "@playwright/test";

// TTR-3011: the visitor picks buyer or broker; buyers go on to book a call, brokers get the thank-you line.
async function fill(page: Page, who: "buyer" | "broker", answer: Record<string, unknown>) {
  let sent: Record<string, unknown> = {};
  await page.route("**/api/lead", async (r) => {
    sent = JSON.parse(r.request().postData() || "{}");
    await r.fulfill({ json: { ok: true, ...answer } });
  });
  await page.goto("/en/visit");
  await page.locator(`[data-who=${who}]`).click();
  const form = page.locator("form[data-variant=visit]");
  expect(await form.getAttribute("data-ttr-skip")).not.toBeNull();
  await expect(form.getByRole("radio")).toHaveCount(0);
  await form.locator("#visit-name").fill("Test Person");
  await form.locator("#visit-email").fill("test@example.com");
  await form.locator("#visit-phone").fill("+1 787 555 0100");
  if (who === "broker") await form.locator("#visit-message").fill("A client is looking.");
  await form.locator("input[name=consent]").check();
  await form.locator("button[type=submit]").click();
  return () => sent;
}

test.describe("visit page", () => {
  test("buyer is saved, then books a call with the team through the returned link", async ({ page }) => {
    const sent = await fill(page, "buyer", { bookingUrl: "https://example.com/book/x" });
    const booking = page.getByTestId("visit-booking");
    await expect(booking.getByRole("heading")).toHaveText("Book a call with our team");
    await expect(booking.getByRole("link")).toHaveAttribute("href", "https://example.com/book/x");
    expect(sent().lead_type).toBe("buyer");
    expect(sent().message).toBeUndefined();
  });

  test("buyer without a booking link sees the thank-you line", async ({ page }) => {
    await fill(page, "buyer", {});
    await expect(page.getByTestId("visit-thanks")).toContainText("Your request has been received");
  });

  test("broker sends name, email, phone and message as a broker lead", async ({ page }) => {
    const sent = await fill(page, "broker", { bookingUrl: "https://example.com/book/x" });
    await expect(page.getByTestId("visit-thanks")).toBeVisible();
    await expect(page.getByTestId("visit-booking")).toHaveCount(0);
    expect(sent().lead_type).toBe("broker");
    expect(sent().message).toBe("A client is looking.");
  });
});
