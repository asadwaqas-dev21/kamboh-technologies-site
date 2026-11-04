import { buildBusinessFacts } from "@/lib/business-facts";

/**
 * /llms.txt: a plain-text summary of the company for AI search engines and assistants
 * (ChatGPT, Perplexity, Gemini). Generated from the same fact sheet as Ask AI, so it
 * always matches the website.
 */
export function GET() {
  return new Response(buildBusinessFacts(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
