/**
 * Downloads the client's own renders and photography from oraworld.com/wp-content/uploads
 * into assets-source/images/client (git-ignored). The list lives in scripts/image-sources.json.
 * Run `pnpm images:build` afterwards to optimise them into public/images.
 */
import { mkdir, writeFile, stat, readFile } from "node:fs/promises";
import path from "node:path";

const { base, files } = JSON.parse(await readFile(new URL("./image-sources.json", import.meta.url), "utf8"));
const outDir = "assets-source/images/client";
await mkdir(outDir, { recursive: true });

let ok = 0;
for (const [key, rel] of Object.entries(files)) {
  const ext = path.extname(rel).toLowerCase();
  const out = path.join(outDir, `${key}${ext}`);
  try {
    const s = await stat(out);
    if (s.size > 10_000) {
      ok++;
      continue;
    }
  } catch {}
  const url = base + rel;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (ORA World v2 asset fetch)" } });
  if (!res.ok) {
    console.error(`FAILED ${res.status} ${url}`);
    continue;
  }
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  ok++;
  console.log(`${key} ← ${rel}`);
}
console.log(`${ok}/${Object.keys(files).length} source images in ${outDir}`);
