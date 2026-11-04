// Builds the blog: public/blog.html (listing) and public/blog/<slug>.html (posts) from scripts/blog.data.mjs,
// reusing the head, navbar and footer of public/services.html.  Run:  npm run blog
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { POSTS } from "./blog.data.mjs";

const SITE = "https://kambohtechnologies.com";
const ORG = `${SITE}/#organization`;
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const slugify = (t) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf("<main>") + "<main>".length);
const fromMainEnd = template.slice(template.indexOf("</main>"));
const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

function pageHead({ title, desc, url, image, ogType = "website", ld }) {
  let h = head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${ogType}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
  return h;
}

const card = (p, i = 0) => `<a class="blog-card" href="/blog/${p.slug}" data-reveal${i ? ` style="--d:.${(i % 3) * 6}s"` : ""}>
        <span class="blog-card-img"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="1000" height="558" loading="lazy" decoding="async"></span>
        <span class="blog-card-body">
          <span class="blog-meta"><span class="blog-cat">${p.category}</span><span>${fmtDate(p.date)}</span><span>${p.readMins} min read</span></span>
          <b>${p.title}</b>
          <span class="blog-excerpt">${p.excerpt}</span>
          <span class="link-arrow">Read article</span>
        </span>
      </a>`;

// ---------- Listing ----------
{
  const url = `${SITE}/blog`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: url }] },
      { "@type": "Blog", "@id": `${url}#blog`, url, name: "Kamboh Technologies Blog", description: "Practical guides on software, mobile apps, company registration and digital growth in Pakistan.", publisher: { "@id": ORG }, inLanguage: "en",
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}`, datePublished: p.date, image: SITE + p.image })) },
    ],
  };
  const main = `
<section class="page-hero blog-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
    <span class="kicker">Blog</span>
    <h1 class="page-title" id="pageTitle">Practical guides for <span class="grad">growing businesses.</span></h1>
    <p class="lead">Clear, honest articles on building apps and software, registering your company and growing online in Pakistan.</p>
  </div>
</section>

<section class="sec" aria-label="Articles">
  <div class="wrap">
    <a class="blog-feature" href="/blog/${posts[0].slug}" data-reveal>
      <span class="blog-card-img"><img src="${posts[0].image}" alt="${esc(posts[0].imageAlt)}" width="1000" height="558" fetchpriority="high" decoding="async"></span>
      <span class="blog-card-body">
        <span class="blog-meta"><span class="blog-cat">${posts[0].category}</span><span>${fmtDate(posts[0].date)}</span><span>${posts[0].readMins} min read</span></span>
        <b>${posts[0].title}</b>
        <span class="blog-excerpt">${posts[0].excerpt}</span>
        <span class="link-arrow">Read article</span>
      </span>
    </a>
    <div class="blog-grid">
      ${posts.slice(1).map(card).join("\n      ")}
    </div>
  </div>
</section>
`;
  const html = pageHead({ title: "Blog | Kamboh Technologies", desc: "Practical guides on mobile apps, software, SECP company registration, tax filing and digital growth from Kamboh Technologies in Lahore.", url, image: posts[0].image, ld })
    + `<body data-page="blog">` + navToMain + main + fromMainEnd;
  writeFileSync("public/blog.html", html);
  console.log("public/blog.html");
}

// ---------- Posts ----------
mkdirSync("public/blog", { recursive: true });
for (const p of posts) {
  const url = `${SITE}/blog/${p.slug}`;
  if (p.seoTitle.length > 62) throw new Error(`${p.slug} SEO title too long (${p.seoTitle.length})`);
  // Add the brand only when the full title still fits in Google results (about 65 characters).
  const fullTitle = p.seoTitle.length + 22 <= 65 ? `${p.seoTitle} | Kamboh Technologies` : p.seoTitle;
  if (p.desc.length > 160) throw new Error(`${p.slug} description too long (${p.desc.length})`);
  // Give every h2 an id for the table of contents.
  const toc = [];
  const body = p.body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => { const id = slugify(t); toc.push([id, t]); return `<h2 id="${id}">${t}</h2>`; });
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 2);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` }, { "@type": "ListItem", position: 3, name: p.title, item: url }] },
      { "@type": "BlogPosting", "@id": `${url}#article`, headline: p.title, description: p.desc, image: SITE + p.image, datePublished: p.date, dateModified: p.date,
        author: { "@type": "Organization", name: "Kamboh Technologies", url: `${SITE}/` }, publisher: { "@id": ORG }, mainEntityOfPage: url,
        articleSection: p.category, keywords: p.tags.join(", "), inLanguage: "en", wordCount: p.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length },
    ],
  };
  const main = `
<section class="page-hero post-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap post-wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog">Blog</a><span aria-hidden="true">/</span><span aria-current="page">${p.category}</span></nav>
    <span class="kicker">${p.category}</span>
    <h1 class="post-title" id="pageTitle">${p.title}</h1>
    <p class="blog-meta post-meta"><span>By the Kamboh Technologies team</span><span>${fmtDate(p.date)}</span><span>${p.readMins} min read</span></p>
  </div>
</section>

<section class="sec post-sec" aria-label="Article">
  <div class="wrap">
    <figure class="post-cover"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="1000" height="558" fetchpriority="high" decoding="async"></figure>
    <div class="post-layout">
      <article class="prose">
${body}
        <ul class="tags post-tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
      <aside class="post-side">
        <nav class="post-toc" aria-label="In this article">
          <p class="sd-label">In this article</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol>
        </nav>
        <div class="post-cta">
          <p class="sd-label">Related service</p>
          <b>${p.service[1]}</b>
          <p>Get expert help from our team in Lahore.</p>
          <a href="/services/${p.service[0]}" class="btn btn-primary btn-sm">View service ${ARROW}</a>
          <button type="button" class="btn btn-outline btn-sm" data-ask-ai>Ask Kamboh AI</button>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="sec alt" aria-labelledby="moreTitle">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Keep reading</span>
      <h2 class="h2" id="moreTitle">More from the blog.</h2>
    </div>
    <div class="blog-grid">
      ${related.map(card).join("\n      ")}
    </div>
  </div>
</section>
`;
  const html = pageHead({ title: fullTitle, desc: p.desc, url, image: p.image, ogType: "article", ld })
    .replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${SITE}${p.image}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${SITE}${p.image}$2`)
    .replace(/<meta property="og:image:type"[^>]*>\n?/, "")
    .replace(/<meta property="og:image:width" content="[^"]*">/, '<meta property="og:image:width" content="1000">')
    .replace(/<meta property="og:image:height" content="[^"]*">/, '<meta property="og:image:height" content="558">')
    + `<body data-page="blog">` + navToMain + main + fromMainEnd;
  writeFileSync(`public/blog/${p.slug}.html`, html);
  console.log(`public/blog/${p.slug}.html`);
}
