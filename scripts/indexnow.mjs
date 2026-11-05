// Tells Bing (which powers ChatGPT search and Copilot), Yandex, Seznam and Naver about every page in the sitemap
// via IndexNow, so new and updated pages are picked up quickly.
// Run AFTER deploying (the key file must be live):  npm run indexnow
import { readFileSync } from "node:fs";

const HOST = "kambohtechnologies.com";
const KEY = "d87730146e88c08a0c49cc16746c7d4e"; // public/d87730146e88c08a0c49cc16746c7d4e.txt must contain exactly this key
const urls = [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs, response ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
