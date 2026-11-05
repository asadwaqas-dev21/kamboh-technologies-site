// Builds the blog: public/blog.html (listing) and public/blog/<slug>.html (posts) from scripts/blog.data.mjs,
// reusing the head, navbar and footer of public/services.html.  Run:  npm run blog
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { POSTS } from "./blog.data.mjs";

const SITE = "https://kambohtechnologies.com";
// Scrollable tables need keyboard focus and a name (WCAG 2.1.1).
const tableWrap = (n) => `<div class="table-wrap" tabindex="0" role="region" aria-label="Table ${n}, scrolls sideways on small screens">`;
const ORG = `${SITE}/#organization`;
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const slugify = (t) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf(">", template.search(/<main\b/)) + 1);
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

// Accent colour per category (matches the service colours used across the site).
const CAT_COLOR = { "AI & Automation": "37,99,235", "Mobile Apps": "14,165,233", "Business Setup": "34,211,238", Technology: "37,99,235" };
const catColor = (c) => CAT_COLOR[c] || "37,99,235";
const catSlug = (c) => slugify(c);

const card = (p, i = 0) => `<a class="blog-card" href="/blog/${p.slug}" data-cat="${catSlug(p.category)}" data-reveal${i ? ` style="--d:.${(i % 3) * 6}s"` : ""}>
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
  const cats = [...new Set(posts.map((p) => p.category))];
  const avgRead = Math.round(posts.reduce((n, p) => n + p.readMins, 0) / posts.length);
  const updated = new Date(posts[0].date + "T00:00:00Z").toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const main = `
<section class="page-hero blog-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="hx-deco ph-deco" aria-hidden="true">
    <div class="hx-glow g1"></div>
    <div class="hx-glow g2"></div>
    <div class="hx-blob"></div>
    <svg class="hx-star s1" viewBox="0 0 100 100"><defs><linearGradient id="phStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".55" stop-color="#2563EB"/><stop offset="1" stop-color="#2563EB"/></linearGradient></defs><path d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z" fill="url(#phStar)"/></svg>
    <svg class="hx-star s2" viewBox="0 0 100 100"><path d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z" fill="url(#phStar)"/></svg>
  </div>
  <div class="wrap ph-grid">
    <div class="ph-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
      <span class="kicker">Insights &amp; guides</span>
      <h1 class="page-title" id="pageTitle">Practical guides for <span class="grad">growing businesses.</span></h1>
      <p class="lead">Clear, honest articles from our team in Lahore on AI, mobile apps and software, SECP company registration and growing your business online.</p>
      <div class="bh-topics" role="group" aria-label="Filter articles by topic">
        <button type="button" class="bh-chip" data-blog-filter="all" aria-pressed="true">All topics <span>${posts.length}</span></button>
        ${cats.map((c) => `<button type="button" class="bh-chip" data-blog-filter="${catSlug(c)}" aria-pressed="false" style="--c:${catColor(c)}"><i aria-hidden="true"></i>${c} <span>${posts.filter((p) => p.category === c).length}</span></button>`).join("\n        ")}
      </div>
      <dl class="bh-stats">
        <div><dt>In-depth guides</dt><dd>${posts.length}</dd></div>
        <div><dt>Average read</dt><dd>${avgRead} min</dd></div>
        <div><dt>Last updated</dt><dd>${updated}</dd></div>
      </dl>
    </div>
    <div class="ph-visual">
      <svg class="ph-rings" viewBox="0 0 400 400" aria-hidden="true"><g class="r1"><circle cx="200" cy="200" r="190" fill="none" stroke="rgba(148,163,184,.22)" stroke-dasharray="2 8"/><circle cx="200" cy="10" r="4" fill="#22D3EE"/></g><g class="r2"><circle cx="200" cy="200" r="140" fill="none" stroke="rgba(37,99,235,.32)"/><circle cx="340" cy="200" r="3.5" fill="#22D3EE"/></g></svg>
      <div class="ph-card bh-card">
        <div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="ph-head"><span>Reading list</span><span class="live">${posts.length} guides</span></div>
        <nav class="bh-list" aria-label="All articles">
          ${posts.map((p, i) => `<a href="/blog/${p.slug}" style="--c:${catColor(p.category)}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="bh-t"><b>${p.title}</b><small><i class="dot" aria-hidden="true"></i>${p.category} · ${p.readMins} min${i === 0 ? ' <em class="bh-new">New</em>' : ""}</small></span><span class="ar" aria-hidden="true">→</span></a>`).join("\n          ")}
        </nav>
      </div>
      <div class="ph-float f1" style="--c:34,211,238" aria-hidden="true"><i></i>Free, no sign-up</div>
      <div class="ph-float f2" style="--c:34,211,238" aria-hidden="true"><i></i>Written by our Lahore team</div>
    </div>
  </div>
  <div class="horizon" aria-hidden="true">
    <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
      <defs>
        <linearGradient id="phz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22D3EE" stop-opacity=".15"/><stop offset=".18" stop-color="#22D3EE"/><stop offset=".45" stop-color="#2563EB"/><stop offset=".7" stop-color="#2563EB"/><stop offset=".92" stop-color="#22D3EE"/><stop offset="1" stop-color="#22D3EE" stop-opacity=".15"/></linearGradient>
        <filter id="phzBlur" x="-5%" y="-200%" width="110%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <path class="hz-line" pathLength="1" d="M0 96 L250 62 L470 104 L620 66 L770 106 L960 48 L1180 92 L1440 56" fill="none" stroke="url(#phz)" stroke-width="8" filter="url(#phzBlur)" opacity=".6" vector-effect="non-scaling-stroke"/>
      <path class="hz-line" pathLength="1" d="M0 96 L250 62 L470 104 L620 66 L770 106 L960 48 L1180 92 L1440 56" fill="none" stroke="url(#phz)" stroke-width="2" vector-effect="non-scaling-stroke"/>
    </svg>
  </div>
</section>

<section class="sec" id="articles" aria-label="Articles" style="padding-top:clamp(24px,3vw,40px)">
  <div class="wrap">
    <a class="blog-feature" href="/blog/${posts[0].slug}" data-cat="${catSlug(posts[0].category)}" data-reveal>
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
  const html = pageHead({ title: "Blog: Software, AI & Business Guides | Kamboh Technologies", desc: "Practical guides on mobile apps, software, SECP company registration, tax filing and digital growth from Kamboh Technologies in Lahore.", url, image: posts[0].image, ld })
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
  const faqs = p.faqs || [];
  const faqHtml = faqs.length ? `
<h2>Frequently asked questions</h2>
<div class="acc faq post-faq">
  ${faqs.map(([q, a], i) => `<div class="acc-item${i ? "" : " open"}">
    <button class="acc-btn" aria-expanded="${i ? "false" : "true"}" aria-controls="pq${i}" id="pq${i}b"><h3>${q}</h3><span class="pm" aria-hidden="true"></span></button>
    <div class="acc-panel" id="pq${i}" role="region" aria-labelledby="pq${i}b"><div><p>${a}</p></div></div>
  </div>`).join("\n  ")}
</div>
` : "";
  // "In short": a direct answer at the top, which answer engines and AI assistants quote.
  const summaryHtml = p.summary ? `
<div class="callout answer-box">
  <p class="callout-h">In short</p>
  <ul>${p.summary.map((x) => `<li>${x}</li>`).join("")}</ul>
</div>
` : "";
  const body = (summaryHtml + p.body + faqHtml).replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => { const id = slugify(t); toc.push([id, t]); return `<h2 id="${id}">${t}</h2>`; });
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 2);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` }, { "@type": "ListItem", position: 3, name: p.title, item: url }] },
      { "@type": "BlogPosting", "@id": `${url}#article`, headline: p.title, description: p.desc, image: SITE + p.image, datePublished: p.date, dateModified: p.date,
        author: { "@type": "Organization", name: "Kamboh Technologies", url: `${SITE}/` }, publisher: { "@id": ORG }, mainEntityOfPage: url,
        ...(p.summary ? { abstract: p.summary.map((x) => x.replace(/<[^>]+>/g, "")).join(" ") } : {}), articleSection: p.category, keywords: p.tags.join(", "), inLanguage: "en", wordCount: p.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length },
      ...(faqs.length ? [{ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] : []),
    ],
  };
  const main = `
<section class="page-hero post-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="hx-deco ph-deco" aria-hidden="true">
    <div class="hx-glow g1"></div>
    <div class="hx-glow g2"></div>
    <div class="hx-blob"></div>
    <svg class="hx-star s1" viewBox="0 0 100 100"><defs><linearGradient id="phStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".55" stop-color="#2563EB"/><stop offset="1" stop-color="#2563EB"/></linearGradient></defs><path d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z" fill="url(#phStar)"/></svg>
    <svg class="hx-star s2" viewBox="0 0 100 100"><path d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z" fill="url(#phStar)"/></svg>
  </div>
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
${(() => { let n = 0; return body.replace(/<div class="table-wrap">/g, () => tableWrap(++n)); })()}
        <ul class="tags post-tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>
      <div class="post-side">
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
      </div>
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
