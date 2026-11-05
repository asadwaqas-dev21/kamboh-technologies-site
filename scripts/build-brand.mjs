// Builds the website's logo files from the two master artworks in brand-source/.
//   brand-source/logo-light-mode.png  (artwork on white, used on light backgrounds)
//   brand-source/logo-dark-mode.png   (artwork on navy, used on dark backgrounds)
// Outputs (public/brand/): transparent, trimmed logos for the site and schema,
// plus the favicon and app icons in public/. Run after replacing a master file:  npm run brand
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "brand-source";
const OUT = "public/brand";
mkdirSync(OUT, { recursive: true });

/** Makes the background that touches the image edges transparent (flood fill), with soft edges. */
async function cutout(file, mode) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  // light: background is white; dark: background is navy with a soft glow around the shield
  const isBg = mode === "light"
    ? (i) => Math.min(...px(i)) >= 200
    : (i) => Math.max(...px(i)) <= 125;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !isBg(i)) continue;
    seen[i] = 1;
    const x = i % w, y = (i - x) / w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }
  const out = Buffer.from(data);
  for (let i = 0; i < w * h; i++) {
    if (!seen[i]) continue;
    const [r, g, b] = px(i);
    let a;
    if (mode === "light") {
      // white -> transparent; light anti-aliased edge pixels become partly transparent (colour-to-alpha against white)
      // near-white and very light grey -> fully transparent; only real edge pixels stay partly visible
      a = Math.max(0, Math.min(1, (232 - Math.min(r, g, b)) / 40));
      if (a > 0) for (const [k, c] of [[0, r], [1, g], [2, b]]) out[i * 4 + k] = Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a)));
    } else {
      // navy -> transparent; the blue glow fades out gradually (colour-to-alpha against black)
      const v = Math.max(r, g, b) / 255;
      a = Math.max(0, Math.min(1, (v - 0.2) / 0.29));
      a = a * a * (3 - 2 * a);
      if (a > 0) for (const [k, c] of [[0, r], [1, g], [2, b]]) out[i * 4 + k] = Math.min(255, Math.round(c / Math.max(a, 0.35)));
    }
    out[i * 4 + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).toBuffer());
}

for (const mode of ["light", "dark"]) {
  const master = `${SRC}/logo-${mode}-mode.png`;
  const cut = await cutout(master, mode);
  // 512px tall PNG for structured data, emails and anything that needs a large logo
  await sharp(cut).resize({ height: 512 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-${mode}.png`);
  // 2x-resolution WebP for the website (header logo is shown about 44px tall; emblems up to 160px)
  await sharp(cut).resize({ height: 352 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/logo-${mode}.webp`);
  const m = await sharp(`${OUT}/logo-${mode}.webp`).metadata();
  console.log(`${OUT}/logo-${mode}.webp ${m.width}x${m.height}`);
}

// Favicon and app icons: the dark artwork on its own navy background reads well as an app icon.
const icon = `${SRC}/logo-dark-mode.png`;
await sharp(icon).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(icon).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(icon).resize(192, 192).png().toFile("public/icon-192.png");
await sharp(icon).resize(512, 512).png().toFile("public/icon-512.png");
const ico = await sharp(icon).resize(48, 48).png().toBuffer();
// app/favicon.ico (used by the Next.js pages) as a single-image PNG-based ICO
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(ico.length, 14); header.writeUInt32LE(22, 18);
writeFileSync("app/favicon.ico", Buffer.concat([header, ico]));
console.log("icons: favicon-32, apple-touch-icon, icon-192, icon-512, app/favicon.ico");
