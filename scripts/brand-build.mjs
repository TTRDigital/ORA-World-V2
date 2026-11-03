/**
 * Official ORA World logo files (downloaded from oraworld.com, never redrawn):
 *  - assets-source/brand/ORA-WORLD-logo-scaled.png  → trimmed, gold on transparent, PNG + WebP at 1200px wide
 *  - assets-source/brand/ora_world_white_transparent.svg → copied as is for imagery and dark panels
 *  - assets-source/brand/ORA-WORLD-favicon.png → src/app/icon.png (512) and apple-icon.png (180)
 */
import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";

await mkdir("public/brand", { recursive: true });
const gold = sharp("assets-source/brand/ORA-WORLD-logo-scaled.png").trim({ threshold: 10 });
const trimmed = await gold.clone().png().toBuffer();
const meta = await sharp(trimmed).metadata();
console.log(`gold lockup trimmed to ${meta.width}×${meta.height}`);
await sharp(trimmed).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile("public/brand/ora-world-logo-gold.png");
await sharp(trimmed).resize({ width: 1200 }).webp({ quality: 90, alphaQuality: 100 }).toFile("public/brand/ora-world-logo-gold.webp");
await copyFile("assets-source/brand/ora_world_white_transparent.svg", "public/brand/ora-world-logo-white.svg");
await mkdir("src/app", { recursive: true });
await sharp("assets-source/brand/ORA-WORLD-favicon.png").resize(512, 512).png().toFile("src/app/icon.png");
await sharp("assets-source/brand/ORA-WORLD-favicon.png").resize(180, 180).png().toFile("src/app/apple-icon.png");
const w = await sharp("public/brand/ora-world-logo-gold.png").metadata();
console.log(`public/brand written: gold ${w.width}×${w.height}, white svg, icons`);
