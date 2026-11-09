// Builds public/team/<slug>.html for every member in scripts/team.data.mjs,
// reusing the head, navbar and footer of public/services.html.  Run:  npm run team
import { readFileSync, writeFileSync } from "node:fs";
import { TEAM } from "./team.data.mjs";

const SITE = "https://kambohtechnologies.com";
const ORG = `${SITE}/#organization`;
const esc = (t) => String(t).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.75 12 2.83 2.83 5.67-5.66" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MAIL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CALL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.42 28.42 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/></svg>';
const STAR = "M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z";

const template = readFileSync("public/services.html", "utf8");
const headEnd = template.indexOf("<body");
const head = template.slice(0, headEnd);
const navToMain = template.slice(template.indexOf(">", headEnd) + 1, template.indexOf(">", template.search(/<main\b/)) + 1);
const fromMainEnd = template.slice(template.indexOf("</main>"));

for (const m of TEAM) {
  const url = `${SITE}/team/${m.slug}`;
  const first = m.name.split(" ")[0];
  const title = `${m.name}, ${m.role} | Kamboh Technologies`;
  const desc = m.metaDesc || `${m.name} is the ${m.role} of Kamboh Technologies, a software house in Lahore. ${m.summary}`.slice(0, 158);
  const person = {
    "@type": "Person", "@id": `${url}#person`, name: m.name, jobTitle: m.role, image: SITE + m.photo, url,
    worksFor: { "@id": ORG }, description: m.summary,
    ...(m.email ? { email: `mailto:${m.email}` } : {}), ...(m.phone ? { telephone: m.phone[1] } : {}),
    ...(m.links ? { sameAs: m.links.map((l) => l[1]) } : {}),
    knowsAbout: m.focus,
  };
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about` },
        { "@type": "ListItem", position: 3, name: "Team", item: `${SITE}/about#team` },
        { "@type": "ListItem", position: 4, name: m.name, item: url } ] },
      { "@type": "ProfilePage", "@id": `${url}#webpage`, url, name: title, isPartOf: { "@id": `${SITE}/#website` }, mainEntity: { "@id": `${url}#person` }, inLanguage: "en" },
      person,
    ],
  };

  const actions = [
    m.email ? `<a href="mailto:${m.email}" class="btn btn-primary magnetic">${MAIL} Email ${first}</a>` : `<a href="/contact" class="btn btn-primary magnetic">Contact the team ${ARROW}</a>`,
    m.phone ? `<a href="tel:${m.phone[1]}" class="btn btn-outline magnetic">${CALL} ${m.phone[0]}</a>` : "",
    ...(m.links || []).slice(0, 2).map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener" class="btn btn-outline magnetic">${label}</a>`),
  ].filter(Boolean).join("");

  const others = TEAM.filter((x) => x.slug !== m.slug);
  const contactRows = [
    m.email ? `<li><span>Email</span><a href="mailto:${m.email}">${m.email}</a></li>` : "",
    m.phone ? `<li><span>Phone</span><a href="tel:${m.phone[1]}">${m.phone[0]}</a></li>` : "",
    ...(m.links || []).map(([label, href]) => `<li><span>${label}</span><a href="${href}" target="_blank" rel="noopener">${href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></li>`),
    `<li><span>Office</span><a href="/contact">Johar Town, Lahore</a></li>`,
  ].filter(Boolean).join("");

  const main = `
<section class="page-hero tm-hero" aria-labelledby="pageTitle">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="hx-deco ph-deco" aria-hidden="true">
    <div class="hx-glow g1"></div>
    <div class="hx-glow g2"></div>
    <div class="hx-blob"></div>
    <svg class="hx-star s1" viewBox="0 0 100 100"><defs><linearGradient id="phStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#2563EB"/></linearGradient></defs><path d="${STAR}" fill="url(#phStar)"/></svg>
    <svg class="hx-star s2" viewBox="0 0 100 100"><path d="${STAR}" fill="url(#phStar)"/></svg>
  </div>
  <div class="wrap ph-grid">
    <div class="ph-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/about#team">Team</a><span aria-hidden="true">/</span><span aria-current="page">${m.name}</span></nav>
      <figure class="tm-photo"><img src="${m.photo}" alt="${esc(m.name)}, ${esc(m.role)} at Kamboh Technologies" width="${m.w}" height="${m.h}" fetchpriority="high" decoding="async"></figure>
      <span class="kicker">${m.role}</span>
      <h1 class="page-title" id="pageTitle">${m.name}</h1>
      <p class="lead">${m.summary}</p>
      <div class="page-actions">${actions}</div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="aboutTitle">
  <div class="wrap tm-layout">
    <div class="tm-main" data-reveal>
      <span class="kicker">About ${first}</span>
      <h2 class="h2" id="aboutTitle">${m.role} at Kamboh Technologies.</h2>
      <div class="prose tm-prose">${m.about.map((p) => `<p>${p}</p>`).join("")}</div>
      <h3 class="tm-h3">Areas of focus</h3>
      <ul class="tags tm-tags">${m.focus.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>
    <div class="tm-side" data-reveal style="--d:.08s">
      <div class="tm-card">
        <p class="sd-label">Contact ${first} about</p>
        <ul class="tm-list">${m.contactFor.map((c) => `<li>${CHECK}<span>${c}</span></li>`).join("")}</ul>
      </div>
      <div class="tm-card">
        <p class="sd-label">Get in touch</p>
        <ul class="tm-contact">${contactRows}</ul>
        <a href="/contact" class="btn btn-primary btn-sm">Start a project ${ARROW}</a>
      </div>
    </div>
  </div>
</section>

<section class="sec alt" aria-labelledby="teamTitle">
  <div class="wrap">
    <div class="sec-intro pg-intro" data-reveal>
      <span class="kicker">Our team</span>
      <h2 class="h2" id="teamTitle">Meet the rest of the team.</h2>
    </div>
    <div class="tm-others">
      ${others.map((o, i) => `<a class="tm-other" href="/team/${o.slug}" data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
        <span class="tm-other-img"><img src="${o.photo}" alt="" width="${o.w}" height="${o.h}" loading="lazy" decoding="async"></span>
        <span class="tm-other-body"><small>${o.role}</small><b>${o.name}</b><span class="link-arrow">View profile</span></span>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>
`;
  const html = head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="profile">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`)
    + `<body data-page="about">` + navToMain + main + fromMainEnd;
  writeFileSync(`public/team/${m.slug}.html`, html);
  console.log(`public/team/${m.slug}.html`);
}
