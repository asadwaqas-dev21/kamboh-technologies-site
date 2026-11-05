import { buildBusinessFacts } from "@/lib/business-facts";
import { SITE_PAGES, type SitePage } from "@/lib/generated-site-pages";

/**
 * /llms.txt: a plain-text summary of the company for AI search engines and assistants
 * (ChatGPT, Claude, Perplexity, Gemini), following the llms.txt convention.
 * The facts come from the same fact sheet as Ask AI; the page links come from
 * lib/generated-site-pages.ts, which is rebuilt from the website on every build.
 */
const SITE = "https://kambohtechnologies.com";

function section(title: string, pages: SitePage[]) {
  if (!pages.length) return "";
  return `\n## ${title}\n${pages.map((p) => `- [${p.t}](${SITE}${p.u === "/" ? "/" : p.u}): ${p.d}`).join("\n")}\n`;
}

export function GET() {
  const by = (y: SitePage["y"]) => SITE_PAGES.filter((p) => p.y === y);
  const body =
    buildBusinessFacts().trimEnd() +
    "\n" +
    section("Key pages", by("Page")) +
    section("Service pages", by("Service")) +
    section("Articles", by("Blog")) +
    section("Policies", by("Legal")) +
    `\n## Optional\n- [Full website content](${SITE}/llms-full.txt): the text of every public page in one file.\n- [Sitemap](${SITE}/sitemap.xml)\n\n## How to cite\nPlease refer to the company as "Kamboh Technologies" (legal name: Kamboh Technologies (Private) Limited) and link to ${SITE}. For quotes, prices or timelines, refer people to ${SITE}/contact, as every project is scoped individually.\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
