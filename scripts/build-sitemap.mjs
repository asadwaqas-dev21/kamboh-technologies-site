// Generates public/sitemap.xml from the pages that actually exist, so it never goes out of date.
// Runs automatically before `next build` (see "prebuild"); run manually with:  npm run sitemap
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://kambohtechnologies.com";
const PUB = "public";
const listHtml = (dir) => (existsSync(join(PUB, dir)) ? readdirSync(join(PUB, dir)).filter((f) => f.endsWith(".html")).map((f) => join(dir, f)) : []);

// "services\\x.html" (Windows) or "services/x.html" -> "/services/x"
const toUrl = (file) => "/" + file.split("\\").join("/").replace(/\.html$/, "");

// [file, url path, priority, change frequency]
const PAGES = [
  ["index.html", "/", "1.0", "weekly"],
  ["services.html", "/services", "0.9", "monthly"],
  ...listHtml("services").map((f) => [f, toUrl(f), "0.8", "monthly"]),
  ["about.html", "/about", "0.8", "monthly"],
  ...listHtml("team").map((f) => [f, toUrl(f), "0.5", "monthly"]),
  ["projects.html", "/projects", "0.7", "monthly"],
  ["technologies.html", "/technologies", "0.6", "monthly"],
  ["contact.html", "/contact", "0.8", "yearly"],
  ["pricing.html", "/pricing", "0.8", "monthly"],
  ["reviews.html", "/reviews", "0.6", "monthly"],
  ["blog.html", "/blog", "0.7", "weekly"],
  ...listHtml("blog").map((f) => [f, toUrl(f), "0.6", "yearly"]),
  ...["privacy-policy", "terms-and-conditions", "cookie-policy", "accessibility", "contract-information", "disclaimer"].map((p) => [p + ".html", "/" + p, "0.3", "yearly"]),
].filter(([file]) => existsSync(join(PUB, file)));

const xml = (t) => String(t).replace(/&amp;/g, "&").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const day = (file) => statSync(join(PUB, file)).mtime.toISOString().slice(0, 10);

const urls = PAGES.map(([file, path, priority, freq]) => {
  const html = readFileSync(join(PUB, file), "utf8");
  const main = html.slice(html.search(/<main\b/), html.indexOf("</main>"));
  // Images that belong to the page content (not the logo or decorative ones).
  const seen = new Set();
  const images = [...main.matchAll(/<img\b[^>]*\bsrc="(\/[^"]+\.(?:webp|jpg|png))"[^>]*>/g)]
    .map((m) => ({ loc: SITE + m[1], title: (m[0].match(/\balt="([^"]+)"/) || [])[1] }))
    .filter((i) => !/\/logo\./.test(i.loc) && !seen.has(i.loc) && seen.add(i.loc))
    .slice(0, 10);
  const imgXml = images.map((i) => `    <image:image><image:loc>${i.loc}</image:loc>${i.title ? `<image:title>${xml(i.title)}</image:title>` : ""}</image:image>`).join("\n");
  return `  <url>
    <loc>${SITE}${path === "/" ? "/" : path}</loc>
    <lastmod>${day(file)}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>${imgXml ? "\n" + imgXml : ""}
  </url>`;
});

writeFileSync(join(PUB, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`);
console.log(`sitemap.xml: ${PAGES.length} pages`);
