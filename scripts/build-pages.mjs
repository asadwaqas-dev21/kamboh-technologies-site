// Builds public/pricing.html and public/reviews.html, reusing the head, navbar and footer of public/services.html.
// Run:  npm run pages   (review cards are copied from the homepage, so edit them in public/index.html)
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://kambohtechnologies.com";
const ORG = `${SITE}/#organization`;
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.75 12 2.83 2.83 5.67-5.66" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const STAR = "M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z";

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf(">", template.search(/<main\b/)) + 1);
const fromMainEnd = template.slice(template.indexOf("</main>"));

function pageHead({ title, desc, url, ld }) {
  return head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
}

const hero = ({ crumb, kicker, title, lead, actions }) => `
<section class="page-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="hx-deco ph-deco" aria-hidden="true">
    <div class="hx-glow g1"></div>
    <div class="hx-glow g2"></div>
    <div class="hx-blob"></div>
    <svg class="hx-star s1" viewBox="0 0 100 100"><defs><linearGradient id="phStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".55" stop-color="#2563EB"/><stop offset="1" stop-color="#2563EB"/></linearGradient></defs><path d="${STAR}" fill="url(#phStar)"/></svg>
    <svg class="hx-star s2" viewBox="0 0 100 100"><path d="${STAR}" fill="url(#phStar)"/></svg>
  </div>
  <div class="wrap ph-grid">
    <div class="ph-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${crumb}</span></nav>
      <span class="kicker">${kicker}</span>
      <h1 class="page-title" id="pageTitle">${title}</h1>
      <p class="lead">${lead}</p>
      <div class="page-actions">${actions}</div>
    </div>
  </div>
</section>
`;

const faqBlock = (faqs, id) => `
    <div class="acc faq pg-faq" data-reveal>
      ${faqs.map(([q, a], i) => `<div class="acc-item${i ? "" : " open"}">
        <button class="acc-btn" aria-expanded="${i ? "false" : "true"}" aria-controls="${id}${i}" id="${id}${i}b"><h3>${q}</h3><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel" id="${id}${i}" role="region" aria-labelledby="${id}${i}b"><div><p>${a}</p></div></div>
      </div>`).join("\n      ")}
    </div>`;

const ctaBand = (title, text) => `
<section class="sec pg-cta-sec" aria-label="Get in touch">
  <div class="wrap">
    <div class="pg-cta" data-reveal>
      <h2 class="h2">${title}</h2>
      <p>${text}</p>
      <div class="pg-cta-actions"><a href="/contact" class="btn btn-primary magnetic">Get a Quote ${ARROW}</a><button type="button" class="btn btn-outline" data-ask-ai>Ask Kamboh AI</button></div>
    </div>
  </div>
</section>
`;

// =================================================================== PRICING
{
  const url = `${SITE}/pricing`;
  const MODELS = [
    {
      name: "Fixed-scope project", tag: "Most popular", c: "34,211,238",
      best: "New apps, websites and software with clear requirements.",
      how: "One agreed price for an agreed scope, paid in milestones.",
      items: ["Discovery call and written scope", "Design, development and testing", "Milestone demos you approve", "Launch, app-store release and handover", "Warranty period for defects"],
      cta: ["Get a project quote", "/contact"],
    },
    {
      name: "Dedicated team", tag: "Flexible", c: "37,99,235",
      best: "Growing products, long roadmaps and changing priorities.",
      how: "A monthly fee for the developers and designers on your team.",
      items: ["Developers and designers as an extension of your team", "Priorities you can change every sprint", "Shared project board and sprint demos", "Scale the team up or down", "Regular progress reports"],
      cta: ["Discuss a team", "/contact?service=custom"],
    },
    {
      name: "Support & maintenance", tag: "Monthly", c: "52,211,153",
      best: "Live apps and websites that need ongoing care.",
      how: "A fixed monthly retainer for an agreed amount of work.",
      items: ["Security updates and dependency upgrades", "Monitoring and bug fixes", "Small improvements every month", "Agreed response times", "For products we built or ones you already have"],
      cta: ["Ask about support", "/contact"],
    },
  ];
  const SERVICES = [
    ["Mobile App Development", "mobile", "mobile-app-development"], ["Web Applications", "web", "web-application-development"], ["Custom Software", "custom", "custom-software-development"],
    ["UI/UX Design", "uiux", "ui-ux-design"], ["Backend & APIs", "api", "backend-api-development"], ["AI Automation", "ai", "ai-automation"],
    ["SEO & Growth", "seo", "seo-digital-growth"], ["SECP Registration", "secp", "secp-company-registration"], ["Company Tax Filing", "tax", "tax-filing"],
  ];
  const FACTORS = [
    ["Features and complexity", "The number of screens, user roles and features, and how complex each one is."],
    ["Platforms", "Web, iPhone, Android or all three. Cross-platform tools like Flutter keep this efficient."],
    ["Design", "From a clean standard interface to fully custom design with prototypes and user testing."],
    ["Integrations", "Payments, maps, SMS, ERPs and other services each need to be connected and tested."],
    ["Timeline", "Faster delivery may need a bigger team working in parallel."],
    ["Support after launch", "Updates, monitoring and new features once real users are on board."],
  ];
  const FAQS = [
    ["Why don't you publish fixed prices?", "Every business needs something different, and a price without a clear scope is usually wrong. After a short discovery call, we send a written scope with priorities, assumptions and an estimate, so you know exactly what you are paying for."],
    ["How do I get an estimate?", "Send us a few details through the contact form or WhatsApp. We reply with questions, have a short discovery call about your goals, users, timeline and budget, then send a written scope and estimate."],
    ["Can we start small and add features later?", "Yes, and we usually recommend it. Launching a focused first version gets you to market sooner, keeps the first budget lower and lets real users show you what to build next."],
    ["How are payments structured?", "Most projects start with an advance payment, with the balance due on agreed milestones and before final handover. The exact schedule is written in your proposal. See our <a href=\"/contract-information\">contract information</a> for details."],
    ["Do you work with clients outside Pakistan?", "Yes. Clients in Pakistan are usually invoiced in Pakistani rupees and international clients in US dollars or another agreed currency, with regular video calls and updates around your time zone."],
    ["Are there costs besides your fee?", "Third-party costs such as hosting, domains, app store accounts, paid APIs and government fees for SECP or FBR filings are separate. We list them clearly in your estimate."],
  ];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Pricing", item: url }] },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: "Pricing and engagement models", isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": ORG }, inLanguage: "en" },
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) },
    ],
  };
  const main = hero({
    crumb: "Pricing", kicker: "Pricing",
    title: `Clear pricing models, <span class="grad">honest estimates.</span>`,
    lead: "Every project is different, so we don't publish one-size-fits-all prices. Choose how you'd like to work with us, and we'll send a written scope and estimate after a short discovery call.",
    actions: `<a href="/contact" class="btn btn-primary magnetic">Get a Quote ${ARROW}</a><a href="#models" class="btn btn-outline magnetic">Compare Models</a>`,
  }) + `
<section class="sec" id="models" aria-labelledby="modelsTitle">
  <div class="wrap">
    <div class="sec-intro pg-intro" data-reveal>
      <span class="kicker">Ways to work together</span>
      <h2 class="h2" id="modelsTitle">Pick the model that fits your project.</h2>
    </div>
    <div class="pr-grid">
      ${MODELS.map((m, i) => `<article class="pr-card${i === 0 ? " pr-featured" : ""}" style="--c:${m.c};--d:${(i * 0.08).toFixed(2)}s" data-reveal>
        <div class="pr-top"><h3>${m.name}</h3><span class="pr-tag">${m.tag}</span></div>
        <p class="pr-best">${m.best}</p>
        <div class="pr-price"><b>Custom quote</b><span>${m.how}</span></div>
        <ul class="pr-list">${m.items.map((x) => `<li>${CHECK}<span>${x}</span></li>`).join("")}</ul>
        <a href="${m.cta[1]}" class="btn ${i === 0 ? "btn-primary" : "btn-outline"}">${m.cta[0]} ${ARROW}</a>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec alt" aria-labelledby="estTitle">
  <div class="wrap">
    <div class="sec-intro pg-intro" data-reveal>
      <span class="kicker">Get an estimate</span>
      <h2 class="h2" id="estTitle">Ask for a quote for any service.</h2>
      <p class="body">Pick a service and tell us a little about your project. SECP registration and tax filing are quoted as a service fee, with government fees listed separately.</p>
    </div>
    <div class="pr-services" data-reveal>
      ${SERVICES.map(([n, k, slug]) => `<div class="pr-svc"><a href="/services/${slug}" class="pr-svc-name">${n}</a><a href="/contact?service=${k}" class="pr-svc-cta">Get a quote ${ARROW}</a></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="factorsTitle">
  <div class="wrap">
    <div class="sec-intro pg-intro" data-reveal>
      <span class="kicker">What affects the cost</span>
      <h2 class="h2" id="factorsTitle">Six things that shape your estimate.</h2>
      <p class="body">Want the details? Read our guide to <a href="/blog/mobile-app-development-cost-pakistan">what affects the cost of building an app</a>.</p>
    </div>
    <div class="pr-factors">
      ${FACTORS.map(([t, d], i) => `<div class="pr-factor" data-reveal style="--d:.${(i % 3) * 6}s"><span class="pr-num">${String(i + 1).padStart(2, "0")}</span><h3>${t}</h3><p>${d}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec alt" aria-labelledby="pfaqTitle">
  <div class="wrap pg-faq-wrap">
    <div class="sec-intro pg-intro" data-reveal>
      <span class="kicker">Pricing questions</span>
      <h2 class="h2" id="pfaqTitle">Frequently asked questions.</h2>
    </div>
    ${faqBlock(FAQS, "pq")}
  </div>
</section>
`;
  const html = pageHead({ title: "Pricing & Engagement Models | Kamboh Technologies", desc: "How Kamboh Technologies prices projects: fixed-scope projects, dedicated teams and monthly support, with a written scope and estimate for every project.", url, ld })
    + `<body data-page="pricing">` + navToMain + main + fromMainEnd;
  writeFileSync("public/pricing.html", html);
  console.log("public/pricing.html");
}

// =================================================================== REVIEWS
{
  const url = `${SITE}/reviews`;
  const home = readFileSync("public/index.html", "utf8");
  const setStart = home.indexOf('<div class="rv-set">');
  const setEnd = home.indexOf('<div class="rv-set"', setStart + 10);
  const cards = [...home.slice(setStart, setEnd > 0 ? setEnd : undefined).matchAll(/<article class="rv-card"[\s\S]*?<\/article>/g)].map((m) => m[0]);
  const google = (home.match(/<a href="(https:\/\/www\.google\.com\/maps\/place\/[^"]+)"[^>]*>Review Us on Google/) || [])[1] || "https://www.google.com/maps";
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Reviews", item: url }] },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: "Client reviews", isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": ORG }, inLanguage: "en" },
    ],
  };
  const main = hero({
    crumb: "Reviews", kicker: "Client reviews",
    title: `What clients say about <span class="grad">working with us.</span>`,
    lead: "Feedback from the businesses we work with, about the products we built and what it was like to build them together.",
    actions: `<a href="${google}" target="_blank" rel="noopener" class="btn btn-primary magnetic">Review Us on Google ${ARROW}</a><a href="/projects" class="btn btn-outline magnetic">See Our Work</a>`,
  }) + `
<section class="sec" aria-label="Reviews">
  <div class="wrap">
    <div class="rv-grid">
      ${cards.map((c, i) => c.replace('<article class="rv-card"', `<article class="rv-card" data-reveal`).replace(/style="--c:([^"]+)"/, `style="--c:$1;--d:.${(i % 3) * 6}s"`)).join("\n      ")}
    </div>
  </div>
</section>
`;
  const html = pageHead({ title: "Client Reviews | Kamboh Technologies", desc: "Read what clients say about working with Kamboh Technologies, a software house in Lahore building mobile apps, web platforms and custom software.", url, ld })
    + `<body data-page="reviews">` + navToMain + main + fromMainEnd;
  writeFileSync("public/reviews.html", html);
  console.log(`public/reviews.html (${cards.length} cards)`);
}
