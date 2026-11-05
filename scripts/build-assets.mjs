// Minifies the static site's shared CSS/JS and stamps every page with content hashes,
// so the files can be cached for a year and still update instantly after a deploy.
// Runs automatically before `next build` (see "prebuild" in package.json).
// After editing public/assets/site.css, site.js or ask-ai.js locally, run:  npm run assets
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { transform } from "lightningcss";

const require = createRequire(import.meta.url);
const { minify } = require("next/dist/compiled/terser");

const ASSETS = "public/assets";
const PAGES = [
  ...["index", "about", "services", "projects", "technologies", "contact", "pricing", "reviews"].filter((p) => existsSync(join("public", p + ".html"))).map((p) => join("public", p + ".html")),
  // Legal pages (scripts/build-legal.mjs), when built.
  ...["privacy-policy", "terms-and-conditions", "cookie-policy", "accessibility", "contract-information", "disclaimer"].map((p) => join("public", p + ".html")).filter((f) => existsSync(f)),
  ...readdirSync("public/services").filter((f) => f.endsWith(".html")).map((f) => join("public/services", f)),
  ...(existsSync("public/blog.html") ? ["public/blog.html"] : []),
  ...(existsSync("public/blog") ? readdirSync("public/blog").filter((f) => f.endsWith(".html")).map((f) => join("public/blog", f)) : []),
];
const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 10);
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

// CSS
const css = readFileSync(join(ASSETS, "site.css"));
const { code: cssMin } = transform({ filename: "site.css", code: css, minify: true, targets: { chrome: 100 << 16, safari: 15 << 16, firefox: 100 << 16 } });
writeFileSync(join(ASSETS, "site.min.css"), cssMin);

// JS
const js = {};
for (const name of ["site", "ask-ai"]) {
  const src = readFileSync(join(ASSETS, `${name}.js`), "utf8");
  const out = await minify(src, { compress: { passes: 2 }, mangle: true, format: { comments: false } });
  writeFileSync(join(ASSETS, `${name}.min.js`), out.code);
  js[name] = { size: src.length, min: out.code.length, v: hash(out.code) };
}

const v = { css: hash(cssMin), site: js.site.v, ask: js["ask-ai"].v };

for (const page of PAGES) {
  let html = readFileSync(page, "utf8");
  html = html
    .replace(/<link rel="stylesheet" href="\/assets\/site(?:\.min)?\.css(?:\?v=\w+)?">/, `<link rel="stylesheet" href="/assets/site.min.css?v=${v.css}">`)
    .replace(/<script src="(?:https:\/\/unpkg\.com\/lenis@1\.1\.13\/dist\/lenis\.min\.js|\/assets\/vendor\/lenis-1\.1\.13\.min\.js)"(?: defer)?><\/script>/, `<script src="/assets/vendor/lenis-1.1.13.min.js" defer></script>`)
    .replace(/<script src="\/assets\/site(?:\.min)?\.js(?:\?v=\w+)?"(?: defer)?><\/script>/, `<script src="/assets/site.min.js?v=${v.site}" defer></script>`)
    .replace(/<script src="\/assets\/ask-ai(?:\.min)?\.js(?:\?v=\w+)?"(?: defer)?><\/script>/, `<script src="/assets/ask-ai.min.js?v=${v.ask}" defer></script>`);
  writeFileSync(page, html);
}

console.log(`site.css   ${kb(css.length)} -> ${kb(cssMin.length)}`);
console.log(`site.js    ${kb(js.site.size)} -> ${kb(js.site.min)}`);
console.log(`ask-ai.js  ${kb(js["ask-ai"].size)} -> ${kb(js["ask-ai"].min)}`);
console.log(`pages stamped: css ${v.css}, site ${v.site}, ask-ai ${v.ask}`);
