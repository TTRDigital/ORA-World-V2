/**
 * Vendors components from shadcn-style registries as source code, without `shadcn init` (which would rewrite
 * the global CSS and theme tokens).
 *
 *   node scripts/registry-add.mjs skiper-ui skiper47 skiper58
 *   node scripts/registry-add.mjs vengeance-ui perspective-carousel stats-counter
 *
 * For each item it fetches {registry}/{name}.json, writes every files[].content into
 * src/components/vendor/<library>/<file name>, prepends a "// Source: <url>" header (keeping any licence comment the
 * file already carries), and prints the npm dependencies the item declares so they can be installed with pnpm.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const REGISTRIES = {
  "skiper-ui": (name) => `https://skiper-ui.com/registry/${name}.json`,
  "vengeance-ui": (name) => `https://www.vengeanceui.com/r/${name}.json`,
};

const [library, ...names] = process.argv.slice(2);
if (!REGISTRIES[library] || names.length === 0) {
  console.error(`Usage: node scripts/registry-add.mjs <${Object.keys(REGISTRIES).join("|")}> <name> [name ...]`);
  process.exit(1);
}

const outDir = path.join("src/components/vendor", library);
await mkdir(outDir, { recursive: true });
const deps = new Set();
const devDeps = new Set();
const registryDeps = new Set();
let failed = 0;

for (const name of names) {
  const url = REGISTRIES[library](name);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    console.error(`✗ ${name}: HTTP ${res.status} (${res.status === 404 ? "not public, likely a paid component" : "failed"})`);
    failed++;
    continue;
  }
  const item = await res.json();
  for (const d of item.dependencies ?? []) deps.add(d);
  for (const d of item.devDependencies ?? []) devDeps.add(d);
  for (const d of item.registryDependencies ?? []) registryDeps.add(d);
  for (const file of item.files ?? []) {
    if (typeof file.content !== "string") continue;
    const base = path.basename(file.target || file.path);
    const target = path.join(outDir, base);
    const header = `// Source: ${url}\n`;
    await writeFile(target, header + file.content.replace(/^﻿/, ""));
    console.log(`✓ ${name} → ${target}`);
  }
}

if (deps.size) console.log(`\ndependencies: ${[...deps].join(" ")}`);
if (devDeps.size) console.log(`devDependencies: ${[...devDeps].join(" ")}`);
if (registryDeps.size) console.log(`registry dependencies (check by hand): ${[...registryDeps].join(" ")}`);
process.exit(failed ? 1 : 0);
