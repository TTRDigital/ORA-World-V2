/**
 * Lighthouse mobile + desktop against BASE_URL (default localhost:3000) for the given paths.
 *   node scripts/lighthouse.mjs /en /en/residences ...
 * JSON reports in reports/lighthouse/, a summary table on stdout.
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/en"];
await mkdir("reports/lighthouse", { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: "/opt/pw-browsers/chromium", chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
const rows = [];
for (const p of paths) {
  for (const form of ["mobile", "desktop"]) {
    const res = await lighthouse(base + p, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] }, {
      extends: "lighthouse:default",
      settings: form === "desktop" ? { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } : {},
    });
    const c = res.lhr.categories;
    const a = res.lhr.audits;
    const row = { path: p, form, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100), lcp: a["largest-contentful-paint"].displayValue, cls: a["cumulative-layout-shift"].displayValue, tbt: a["total-blocking-time"].displayValue };
    rows.push(row);
    await writeFile(`reports/lighthouse/${form}${p.replace(/\//g, "-") || "-root"}.json`, res.report);
    console.log(JSON.stringify(row));
  }
}
await chrome.kill();
console.table(rows);
