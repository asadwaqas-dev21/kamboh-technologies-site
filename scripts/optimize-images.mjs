// One-off image optimiser: converts site photos to right-sized WebP, rewrites the HTML
// references, and moves the heavy originals to brand-originals/ (kept out of the deploy).
// Run again after adding new .jpg/.png photos to public/services, public/projects or public/team:
//   node scripts/optimize-images.mjs
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";

const PUB = "public";
const ARCHIVE = "brand-originals/images";
const PAGES = ["index", "about", "services", "projects", "technologies", "contact"].map((p) => join(PUB, p + ".html"));

// folder -> max output width (pixels). Cards display at ~600px, so 1000px covers 1.6x screens.
const JOBS = [
  ["services", 1000],
  ["projects", 1100],
  ["team", 640],
  [".", 1100], // about-vision.jpg and similar top-level photos
];
const SKIP = new Set(["og-image.png", "og-image.jpg", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png"]);

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
let before = 0, after = 0;
const renames = [];

for (const [folder, maxW] of JOBS) {
  const dir = join(PUB, folder);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file) || SKIP.has(file)) continue;
    const src = join(dir, file);
    if (!statSync(src).isFile()) continue;
    const out = join(dir, parse(file).name + ".webp");
    const info = await sharp(src).resize({ width: maxW, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(out);
    before += statSync(src).size;
    after += info.size;
    console.log(`${kb(statSync(src).size).padStart(7)} -> ${kb(info.size).padStart(6)}  ${out} (${info.width}x${info.height})`);
    renames.push([`/${folder === "." ? "" : folder + "/"}${file}`, `/${folder === "." ? "" : folder + "/"}${parse(file).name}.webp`]);
    const archived = join(ARCHIVE, folder, file);
    mkdirSync(dirname(archived), { recursive: true });
    renameSync(src, archived);
  }
}

// Brand logos live in public/brand/ and are built by scripts/build-brand.mjs (npm run brand).
// Here we only shrink the app icons it produces.
{
  for (const icon of ["icon-192.png", "apple-touch-icon.png"]) {
    const buf = await sharp(join(PUB, icon)).png({ palette: true, quality: 90, effort: 10 }).toBuffer();
    const old = statSync(join(PUB, icon)).size;
    if (buf.length < old) writeFileSync(join(PUB, icon), buf);
    console.log(`${icon} ${kb(old)} -> ${kb(Math.min(buf.length, old))}`);
  }
  // Social sharing image: exact 1200x630 JPEG.
  const ogSrc = existsSync(join(PUB, "og-image.png")) ? join(PUB, "og-image.png") : join(PUB, "og-image.jpg");
  const og = await sharp(ogSrc).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  writeFileSync(join(PUB, "og-image.jpg"), og);
  for (const f of ["og-image.png"]) if (existsSync(join(PUB, f))) { mkdirSync(ARCHIVE, { recursive: true }); renameSync(join(PUB, f), join(ARCHIVE, f)); }
  console.log(`og-image.jpg 1200x630 ${kb(og.length)}`);
}

// Rewrite references in the pages.
for (const page of PAGES) {
  let html = readFileSync(page, "utf8");
  for (const [from, to] of renames) html = html.split(`"${from}"`).join(`"${to}"`);
  html = html.split("/og-image.png").join("/og-image.jpg");
  writeFileSync(page, html);
}
console.log(`\nPhotos: ${kb(before)} -> ${kb(after)} (${renames.length} files)`);
