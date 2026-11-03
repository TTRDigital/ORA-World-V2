import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  use: { baseURL: process.env.BASE_URL || "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 14"], browserName: "chromium" } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "pnpm start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
});
