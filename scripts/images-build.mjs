/**
 * Optimises assets-source/images/client/* into public/images/client/*.jpg (max 2560px wide, mozjpeg q85,
 * flattened on travertine) and writes src/content/images.json with { src, width, height }.
 * No blur or LQIP data is produced: the client does not want blurry previews. Images are shown only
 * when sharp, over a travertine ground. next/image serves WebP from these sources at quality 80.
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const MAX_W = 2560;
const SRC = "assets-source/images/client";
const OUT = "public/images/client";
const manifest = {};

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
for (const f of files) {
  const key = path.parse(f).name;
  const outPath = path.join(OUT, `${key}.jpg`);
  const src = sharp(path.join(SRC, f)).rotate();
  const meta = await src.metadata();
  const width = Math.min(meta.width ?? MAX_W, MAX_W);
  const height = Math.round((meta.height ?? width) * (width / (meta.width ?? width)));
  let needs = true;
  try {
    const [a, b] = await Promise.all([stat(outPath), stat(path.join(SRC, f))]);
    needs = a.mtimeMs < b.mtimeMs;
  } catch {}
  if (needs)
    await src
      .clone()
      .resize({ width, withoutEnlargement: true })
      .flatten({ background: "#e3d9c8" })
      .jpeg({ quality: 85, mozjpeg: true, progressive: true })
      .toFile(outPath);
  manifest[key] = { src: `/images/client/${key}.jpg`, width, height };
  console.log(`${key} ${width}×${height}`);
}
await mkdir("src/content", { recursive: true });
await writeFile("src/content/images.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} images → src/content/images.json`);
