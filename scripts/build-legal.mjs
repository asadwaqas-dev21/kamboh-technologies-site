// Builds the legal pages (public/<slug>.html) from scripts/legal.data.mjs,
// reusing the head, navbar and footer of public/services.html.  Run:  npm run legal
import { readFileSync, writeFileSync } from "node:fs";
import { LEGAL, UPDATED } from "./legal.data.mjs";

const SITE = "https://kambohtechnologies.com";
const ORG = `${SITE}/#organization`;
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const slugify = (t) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf(">", template.search(/<main\b/)) + 1);
const fromMainEnd = template.slice(template.indexOf("</main>"));

for (const p of LEGAL) {
  const url = `${SITE}/${p.slug}`;
  const title = `${p.seoTitle} | Kamboh Technologies`;
  if (title.length > 65) throw new Error(`${p.slug} title too long (${title.length})`);
  if (p.desc.length > 160) throw new Error(`${p.slug} description too long (${p.desc.length})`);

  // Give every h2 an id (keep any id already set) and collect the table of contents.
  const toc = [];
  const body = p.body.replace(/<h2( id="([^"]+)")?>([\s\S]*?)<\/h2>/g, (_, __, given, t) => {
    const id = given || slugify(t);
    toc.push([id, t]);
    return `<h2 id="${id}">${t}</h2>`;
  });
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(2, Math.round(words / 230));

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: p.title, item: url }] },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: p.title, description: p.desc, inLanguage: "en", dateModified: UPDATED, isPartOf: { "@id": `${SITE}/#website` }, publisher: { "@id": ORG }, about: { "@id": ORG } },
    ],
  };

  const others = LEGAL.filter((x) => x.slug !== p.slug);
  const main = `
<section class="page-hero post-hero legal-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap post-wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Legal</span><span aria-hidden="true">/</span><span aria-current="page">${p.title}</span></nav>
    <span class="kicker">Legal</span>
    <h1 class="post-title" id="pageTitle">${p.title}</h1>
    <p class="lead legal-lead">${p.lead}</p>
    <p class="blog-meta post-meta"><span>Last updated <time datetime="${UPDATED}">${fmtDate(UPDATED)}</time></span><span>${mins} min read</span><span>Kamboh Technologies (Private) Limited</span></p>
  </div>
</section>

<section class="sec post-sec legal-sec" aria-label="${esc(p.title)}">
  <div class="wrap">
    <div class="post-layout">
      <article class="prose legal-prose">
${body}
      </article>
      <aside class="post-side">
        <nav class="post-toc" aria-label="On this page">
          <p class="sd-label">On this page</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol>
        </nav>
        <div class="post-cta">
          <p class="sd-label">Questions?</p>
          <b>Talk to our team</b>
          <p>We are happy to explain anything on this page.</p>
          <a href="mailto:info@kambohtechnologies.com" class="btn btn-primary btn-sm">Email us</a>
          <a href="/contact" class="btn btn-outline btn-sm">Contact page</a>
        </div>
        <nav class="post-toc legal-links" aria-label="Other legal pages">
          <p class="sd-label">Legal</p>
          <ol>${others.map((o) => `<li><a href="/${o.slug}">${o.title}</a></li>`).join("")}</ol>
        </nav>
      </aside>
    </div>
  </div>
</section>
`;

  const html = head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(p.desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(p.desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`)
    + `<body data-page="legal">` + navToMain + main + fromMainEnd;
  writeFileSync(`public/${p.slug}.html`, html);
  console.log(`public/${p.slug}.html  (${words} words)`);
}
