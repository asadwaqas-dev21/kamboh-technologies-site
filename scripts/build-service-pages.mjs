// Builds the service detail pages (public/services/<slug>.html) from scripts/service-pages.data.mjs,
// reusing the head, navbar and footer of public/services.html so every page stays consistent.
// Run after editing the data or the site's navbar/footer:  npm run service-pages
import { readFileSync, writeFileSync } from "node:fs";
import { SERVICES } from "./service-pages.data.mjs";
import { EXTRA } from "./service-pages.extra.mjs";

const SITE = "https://kambohtechnologies.com";
const ORG = `${SITE}/#organization`;
const WHATSAPP = "https://wa.me/923028207226";
const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const plain = (t) => String(t).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");

const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHAT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4ZM7 8h10M7 13h6" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const bodyOpen = template.slice(headEnd, template.indexOf(">", headEnd) + 1);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf(">", template.search(/<main\b/)) + 1);
const fromMainEnd = template.slice(template.indexOf("</main>"));

function pageHead(s) {
  const url = `${SITE}/services/${s.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
          { "@type": "ListItem", position: 3, name: plain(s.name), item: url },
        ],
      },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: plain(s.title), description: s.desc, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${url}#service` }, primaryImageOfPage: { "@type": "ImageObject", url: SITE + s.image }, inLanguage: "en" },
      {
        "@type": "Service", "@id": `${url}#service`, name: plain(s.name), serviceType: plain(s.name), description: s.lead, url, image: SITE + s.image,
        provider: { "@id": ORG }, areaServed: [{ "@type": "City", name: "Lahore" }, { "@type": "Country", name: "Pakistan" }, "Worldwide"],
        hasOfferCatalog: { "@type": "OfferCatalog", name: `${plain(s.name)}: what's included`, itemListElement: s.included.map((i) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: i } })) },
      },
      { "@type": "FAQPage", mainEntity: s.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };
  return head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(s.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(s.desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(s.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(s.desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(s.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(s.desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
}

function pageMain(s) {
  const e = EXTRA[s.id];
  const contact = `/contact?service=${s.id}`;
  const related = s.related.map((id) => byId[id]);
  const lname = plain(s.name).toLowerCase();
  const ENGAGE = [
    ["Fixed-scope project", "A clear scope, timeline and estimate agreed up front. Best when you know what you need.", ["Written scope and estimate", "Milestone-based delivery", "Launch and handover"]],
    ["Dedicated team", "Our people working as an extension of your team, with priorities you set each sprint.", ["Flexible priorities", "Sprint demos", "Scale up or down"]],
    ["Support and care", "Ongoing help once you are live: updates, fixes and small improvements every month.", ["Monitoring and fixes", "Updates and patches", "Monthly improvements"]],
  ];
  return `
<!-- SERVICE HERO -->
<section class="page-hero sd-hero" aria-labelledby="pageTitle" style="--acc:${s.acc}">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap ph-grid">
    <div class="ph-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/services">Services</a><span aria-hidden="true">/</span><span aria-current="page">${s.name}</span></nav>
      <span class="kicker">${s.name}</span>
      <h1 class="page-title" id="pageTitle">${s.h1}</h1>
      <p class="lead">${s.lead}</p>
      <ul class="sd-chips">${e.chips.map((c) => `<li>${c}</li>`).join("")}</ul>
      <div class="page-actions">
        <a href="${contact}" class="btn btn-primary magnetic">Start This Project ${ARROW}</a>
        <button type="button" class="btn btn-outline magnetic" data-ask-ai>${CHAT} Ask Kamboh AI</button>
      </div>
      <ul class="sd-trust" aria-label="About Kamboh Technologies">
        <li>SECP registered company</li><li>Office in Johar Town, Lahore</li><li>Clients in Pakistan and abroad</li>
      </ul>
    </div>
    <div class="ph-visual sd-visual">
      <figure class="sd-shot">
        <img src="${s.image}" alt="${esc(s.imageAlt)}" width="1000" height="558" fetchpriority="high" decoding="async">
      </figure>
    </div>
  </div>
</section>

<nav class="sd-tabs" aria-label="On this page">
  <div class="wrap"><a href="#overview">Overview</a><a href="#problems">Problems we solve</a><a href="#features">Features</a><a href="#process">Process</a><a href="#deliverables">Deliverables</a><a href="#faq">FAQ</a></div>
</nav>

<!-- OVERVIEW -->
<section class="sec" id="overview" aria-labelledby="ovTitle">
  <div class="wrap two">
    <div data-reveal>
      <span class="kicker">Overview</span>
      <h2 class="h2" id="ovTitle">What we deliver.</h2>
    </div>
    <div class="stack-text">
      ${s.overview.map((p, i) => `<p class="${i ? "body" : "lead"}" data-reveal${i ? ' style="--d:.06s"' : ""}>${p}</p>`).join("\n      ")}
      <div class="sd-who" data-reveal style="--d:.1s">
        <p class="sd-label">Who it's for</p>
        <ul class="checks">${s.forWho.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>
    </div>
  </div>
</section>

<!-- PROBLEMS -->
<section class="sec alt" id="problems" aria-labelledby="probTitle">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Problems we solve</span>
      <h2 class="h2" id="probTitle">Sound familiar?</h2>
      <p class="body">These are the issues businesses most often bring to us, and how this service fixes them.</p>
    </div>
    <div class="sd-probs">
      ${e.problems.map(([p, fix], i) => `<article class="sd-prob" data-reveal${i ? ` style="--d:.${i * 6}s"` : ""}>
        <p class="sd-prob-q"><span class="sd-label">The problem</span>${p}</p>
        <p class="sd-prob-a"><span class="sd-label">How we solve it</span>${fix}</p>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="sec" id="features" aria-labelledby="featTitle" style="--acc:${s.acc}">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Features</span>
      <h2 class="h2" id="featTitle">What's included.</h2>
      <p class="body">Every ${lname} project is scoped to your goals in a written estimate, and can include:</p>
    </div>
    <div class="sd-feats">
      ${e.features.map(([t, d], i) => `<article class="sd-feat" data-reveal style="--d:.${(i % 3) * 5}s"><span class="sd-feat-n">${String(i + 1).padStart(2, "0")}</span><h3>${t}</h3><p>${d}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="sec alt" id="process" aria-labelledby="procTitle2" style="--acc:${s.acc}">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">How we deliver it</span>
      <h2 class="h2" id="procTitle2">A clear path, step by step.</h2>
      <p class="body">Each step ends with something you can see and approve, so you stay in control of scope and budget.</p>
    </div>
    <ol class="sd-steps" data-reveal>
      ${s.process.map(([t, d], i) => `<li><span class="sd-step-n">${i + 1}</span><b>${t}</b><span>${d}</span></li>`).join("\n      ")}
    </ol>
  </div>
</section>

<!-- DELIVERABLES + PREPARE -->
<section class="sec" id="deliverables" aria-labelledby="delTitle">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Deliverables</span>
      <h2 class="h2" id="delTitle">What you get, and how to prepare.</h2>
    </div>
    <div class="sd-two">
      <div class="sd-panel" data-reveal>
        <p class="sd-panel-h">You receive</p>
        <ul class="checks">${e.deliverables.map((d) => `<li>${d}</li>`).join("")}</ul>
      </div>
      <div class="sd-panel sd-panel--prep" data-reveal style="--d:.08s">
        <p class="sd-panel-h">Before you contact us, have ready</p>
        <ol class="sd-prep">${e.prepare.map((p) => `<li>${p}</li>`).join("")}</ol>
        <p class="sd-note">Don't have everything? That's fine. We'll work it out together on the first call.</p>
      </div>
    </div>
  </div>
</section>

<!-- STACK -->
<section class="sec alt" id="stack" aria-labelledby="stackTitle">
  <div class="wrap two">
    <div data-reveal>
      <span class="kicker">Tools and technology</span>
      <h2 class="h2" id="stackTitle">Chosen for the long run.</h2>
    </div>
    <div class="stack-text" data-reveal style="--d:.08s">
      <p class="lead">${e.whyStack}</p>
      <ul class="tags sd-tags">${s.stack.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>
  </div>
</section>

<!-- ENGAGEMENT -->
<section class="sec" id="engagement" aria-labelledby="engTitle2">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Ways to work with us</span>
      <h2 class="h2" id="engTitle2">Pick the model that fits.</h2>
    </div>
    <div class="tiles3">
      ${ENGAGE.map(([t, d, list], i) => `<article class="tile" data-reveal${i ? ` style="--d:.${i * 6}s"` : ""}><h3>${t}</h3><p>${d}</p><ul class="checks">${list.map((l) => `<li>${l}</li>`).join("")}</ul></article>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="sec alt" id="faq" aria-labelledby="faqTitle">
  <div class="wrap two">
    <div data-reveal>
      <span class="kicker">FAQ</span>
      <h2 class="h2" id="faqTitle">Common questions.</h2>
      <p class="body" style="margin-top:22px">Something else on your mind? <a href="${contact}" style="color:var(--cyan);font-weight:700">Ask us directly</a> or ask Kamboh AI.</p>
    </div>
    <div class="acc faq" data-reveal style="--d:.08s">
      ${s.faqs.map(([q, a], i) => `<div class="acc-item${i ? "" : " open"}">
        <button class="acc-btn" aria-expanded="${i ? "false" : "true"}" aria-controls="sq${i}" id="sq${i}b"><h3>${q}</h3><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel" id="sq${i}" role="region" aria-labelledby="sq${i}b"><div><p>${a}</p></div></div>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- RELATED -->
<section class="sec" id="related" aria-labelledby="relTitle">
  <div class="wrap">
    <div class="sec-intro" data-reveal>
      <span class="kicker">Related services</span>
      <h2 class="h2" id="relTitle">Often combined with.</h2>
    </div>
    <div class="tiles3">
      ${related.map((r, i) => `<a class="sd-rel" href="/services/${r.slug}" data-reveal style="--acc:${r.acc}${i ? `;--d:.${i * 6}s` : ""}">
        <span class="sd-rel-img"><img src="${r.image}" alt="" width="1000" height="558" loading="lazy" decoding="async"></span>
        <span class="sd-rel-body"><b>${r.name}</b><span>${r.lead}</span><span class="link-arrow">View service</span></span>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- CONTACT PANEL -->
<section class="sec" id="start" aria-labelledby="startTitle" style="padding-top:0">
  <div class="wrap">
    <div class="sd-cta" data-reveal style="--acc:${s.acc}">
      <div>
        <span class="kicker">Start a project</span>
        <h2 class="h2" id="startTitle">Ready to talk about ${lname}?</h2>
        <p class="body">Tell us what you need. We reply with questions, a suggested approach and next steps.</p>
      </div>
      <div class="sd-cta-actions">
        <a href="${contact}" class="btn btn-primary magnetic">Send an Inquiry ${ARROW}</a>
        <a href="${WHATSAPP}" target="_blank" rel="noopener" class="btn btn-outline magnetic">WhatsApp Us</a>
      </div>
    </div>
  </div>
</section>
`;
}

// Merge the extra FAQs so the page and its FAQ schema show the same questions.
for (const s of SERVICES) s.faqs = [...s.faqs, ...(EXTRA[s.id]?.moreFaqs || [])];

for (const s of SERVICES) {
  if (!EXTRA[s.id]) throw new Error(`no extra content for ${s.id}`);
  for (const k of ["title", "desc"]) if (plain(s[k]).length > (k === "title" ? 62 : 160)) throw new Error(`${s.slug} ${k} too long (${plain(s[k]).length})`);
  const html = pageHead(s) + bodyOpen + navToMain + pageMain(s) + fromMainEnd;
  writeFileSync(`public/services/${s.slug}.html`, html);
  console.log(`public/services/${s.slug}.html  (${(html.length / 1024).toFixed(0)}KB)`);
}
