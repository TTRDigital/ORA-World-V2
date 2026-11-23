import { test, expect, type Page } from "@playwright/test";

// TTR-3011: the visitor picks buyer or broker, sends a short form, and sees one thank-you confirmation.
// No booking or calendar on the website: the team calls the lead and books from ORA World OS.
async function send(page: Page, who: "buyer" | "broker") {
  let sent: Record<string, unknown> = {};
  await page.route("**/api/lead", async (r) => {
    sent = JSON.parse(r.request().postData() || "{}");
    // Even if ORA World OS sends a booking link, the website ignores it.
    await r.fulfill({ json: { ok: true, bookingUrl: "https://example.com/book/x" } });
  });
  await page.goto("/en/visit");
  await page.locator(`[data-who=${who}]`).click();
  const form = page.locator("form[data-variant=visit]");
  expect(await form.getAttribute("data-ttr-skip")).not.toBeNull();
  await expect(form.getByRole("radio")).toHaveCount(0);
  await expect(form.locator("#visit-message")).toHaveCount(who === "broker" ? 1 : 0);
  await form.locator("#visit-name").fill("Test Person");
  await form.locator("#visit-email").fill("test@example.com");
  await form.locator("#visit-phone").fill("+1 787 555 0100");
  if (who === "broker") await form.locator("#visit-message").fill("A client is looking.");
  await form.locator("input[name=consent]").check();
  await form.locator("button[type=submit]").click();
  const thanks = page.getByTestId("visit-thanks");
  await expect(thanks).toContainText("Thank you, we received your details.");
  await expect(thanks).toContainText("Our team will reach out to you shortly.");
  await expect(thanks.getByRole("link")).toHaveCount(0);
  return sent;
}

test.describe("visit page", () => {
  test("no gallery, visit or booking words on the page", async ({ page }) => {
    await page.goto("/en/visit");
    await expect(page.locator("main")).not.toContainText(/gallery|book a visit|tour|calendar/i);
  });

  test("buyer sends name, email and phone as a buyer lead", async ({ page }) => {
    const sent = await send(page, "buyer");
    expect(sent.lead_type).toBe("buyer");
    expect(sent.message).toBeUndefined();
  });

  test("broker sends name, email, phone and message as a broker lead", async ({ page }) => {
    const sent = await send(page, "broker");
    expect(sent.lead_type).toBe("broker");
    expect(sent.message).toBe("A client is looking.");
  });
});
