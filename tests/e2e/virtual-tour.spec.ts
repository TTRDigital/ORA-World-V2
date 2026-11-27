import { test, expect } from "@playwright/test";

// Client, 27 Nov: the homepage's 360° tour on its own link, showing only the tour.
test("the virtual tour link shows only the tour", async ({ page }) => {
  await page.goto("/en/virtual-tour");
  const frame = page.locator("iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", /kuula\.co/);
  const box = await frame.boundingBox();
  const vp = page.viewportSize()!;
  expect(Math.round(box!.width)).toBe(vp.width);
  expect(Math.round(box!.height)).toBe(vp.height);
  // No site header, footer or Ask ORA; just the logo back to the site.
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask ORA" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Go to ORA World" })).toHaveAttribute("href", "/en");
});
