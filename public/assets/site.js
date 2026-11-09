/* Kamboh Technologies: shared behaviour for every page. Each block checks that its elements exist first. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const page = document.body.dataset.page || 'home';

  /* ---------- smooth scrolling (Lenis) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#top') { e.preventDefault(); lenis.scrollTo(0); return; }
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(id === '#home' ? 0 : el, { offset: -80 });
      history.replaceState(null, '', id);
    });
  }

  /* ---------- theme: dark by default, light only when the visitor picks it ---------- */
  const root = document.documentElement, themeBtn = $('#themeBtn'), themeMeta = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'light' ? '#F8FAFC' : '#0B1220');
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(t);
    try { localStorage.setItem('kt-theme', t); } catch (e) {}
  });

  /* ---------- cookie consent (Google Consent Mode v2, see the GA snippet in each page <head>) ---------- */
  const CONSENT_KEY = 'kt-consent';
  const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
  let banner = null;
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('show');
    const b = banner; banner = null;
    setTimeout(() => b.remove(), 400);
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    if (window.gtag) gtag('consent', 'update', { analytics_storage: value === 'granted' ? 'granted' : 'denied' });
    closeBanner();
  }
  function showBanner() {
    if (banner) return;
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <p class="cookie-title">We value your privacy</p>
      <p class="cookie-text">We use analytics cookies to understand how visitors use our site and improve it. No advertising cookies. You can change your choice anytime from “Cookie settings” in the footer. <a href="/cookie-policy">Cookie policy</a></p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-outline btn-sm" data-consent="denied">Reject</button>
        <button type="button" class="btn btn-primary btn-sm" data-consent="granted">Accept</button>
      </div>`;
    banner.addEventListener('click', e => { const b = e.target.closest('[data-consent]'); if (b) setConsent(b.dataset.consent); });
    document.body.appendChild(banner);
    requestAnimationFrame(() => requestAnimationFrame(() => banner && banner.classList.add('show')));
  }
  if (!readConsent()) setTimeout(showBanner, 1200);
  document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); showBanner(); } });

  /* ---------- pause animations in sections that are off screen ---------- */
  if ('IntersectionObserver' in window) {
    const po = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('paused', !e.isIntersecting));
    }, { rootMargin: '100px 0px' });
    $$('main > section').forEach(s => po.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    reveals.forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add('in'); });
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });
  }

  /* ---------- nav: current page, indicator, mobile menu ---------- */
  const nav = $('#nav'), ind = $('#navInd');
  const current = $(`#navLinks a[data-nav="${page}"]`);
  $$(`[data-nav="${page}"]`).forEach(a => a.setAttribute('aria-current', 'page'));
  if (current) current.classList.add('active');
  function moveInd() {
    if (!ind) return;
    if (!current || getComputedStyle(current).display === 'none') { ind.style.opacity = 0; return; }
    ind.style.width = (current.offsetWidth - 28) + 'px';
    // Measured against the list, not offsetLeft: the Services link sits inside a dropdown wrapper.
    const left = current.getBoundingClientRect().left - current.closest('.nav-links').getBoundingClientRect().left;
    ind.style.transform = `translateX(${left + 14}px)`;
    ind.style.opacity = 1;
  }
  moveInd();
  addEventListener('resize', moveInd, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);

  const burger = $('#burger');
  function toggleMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  if (nav && burger) {
    burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
    $$('#mmenu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { toggleMenu(false); burger.focus(); } });
    matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) toggleMenu(false); });
  }

  /* ---------- scroll-linked: progress bar, nav state, to-top, timeline ---------- */
  const bar = $('#progress'), toTop = $('#toTop'), tl = $('#timeline'), fill = $('#tlFill'), steps = $$('.step'), procNum = $('#procNum');
  let ticking = false;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (toTop) toTop.classList.toggle('show', y > 900);
    if (tl && fill) {
      const r = tl.getBoundingClientRect();
      const line = innerHeight * 0.55;
      fill.style.transform = `scaleY(${Math.min(1, Math.max(0, (line - r.top) / r.height))})`;
      let cur = 0;
      steps.forEach((s, i) => { const on = s.getBoundingClientRect().top < line; s.classList.toggle('on', on || i === 0); if (on) cur = i; });
      if (procNum) procNum.textContent = String(cur + 1).padStart(2, '0');
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    $('.logo').focus({ preventScroll: true });
  });

  /* ---------- hero: pointer parallax ---------- */
  const hv = $('#heroVisual'), hero = $('.hero');
  if (hv && hero && finePointer && !reduce) {
    let raf = 0;
    hero.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hv.getBoundingClientRect();
        const x = ((e.clientX - (r.left + r.width / 2)) / innerWidth) * 2;
        const y = ((e.clientY - (r.top + r.height / 2)) / innerHeight) * 2;
        hv.style.setProperty('--px', Math.max(-1, Math.min(1, x)).toFixed(3));
        hv.style.setProperty('--py', Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => { hv.style.setProperty('--px', 0); hv.style.setProperty('--py', 0); });
  }

  /* ---------- hero v2: typewriter (types a word, pauses, deletes it, types the next) ---------- */
  const rot = $('#hxRot');
  if (rot && !reduce) {
    const words = ['mobile apps', 'web platforms', 'custom software', 'AI automation'];
    const caretBox = rot.parentElement;
    // Reserve room for the longest word so the line never shifts while typing (not on small phones, where it has its own line).
    const reserve = () => {
      if (matchMedia('(max-width: 480px)').matches) { caretBox.style.minWidth = ''; return; }
      const current = rot.textContent;
      let max = 0;
      for (const w of words) { rot.textContent = w; max = Math.max(max, rot.getBoundingClientRect().width); }
      rot.textContent = current;
      caretBox.style.minWidth = Math.ceil(max + 10) + 'px';
    };
    reserve();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);
    addEventListener('resize', reserve, { passive: true });
    let wi = 0, ci = words[0].length, deleting = true;
    const tick = () => {
      let delay;
      if (deleting) {
        ci--;
        delay = 38;
        if (ci <= 0) { ci = 0; deleting = false; wi = (wi + 1) % words.length; delay = 380; }
      } else {
        ci++;
        delay = 85 + Math.random() * 50; // slight variation feels like real typing
        if (ci >= words[wi].length) { deleting = true; delay = 1900; }
      }
      rot.textContent = (deleting && ci === 0) ? '' : words[wi].slice(0, ci);
      caretBox.classList.toggle('is-typing', delay < 300);
      setTimeout(tick, document.hidden ? 1000 : delay);
    };
    setTimeout(tick, 2200); // let the first word sit for a moment before deleting it
  }

  /* ---------- hero v2: process tabs (auto-advance when the progress line fills) ---------- */
  const hxTabs = $$('.hx-tab'), hxCap = $('#hxCap');
  if (hxTabs.length && hxCap) {
    const select = (tab) => {
      hxTabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)));
      hxCap.classList.add('fade');
      setTimeout(() => { hxCap.textContent = tab.dataset.cap; hxCap.classList.remove('fade'); }, 180);
    };
    hxTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      // The fill animation ends after 6s: move to the next step.
      tab.querySelector('i').addEventListener('animationend', () => select(hxTabs[(i + 1) % hxTabs.length]));
    });
  }

  /* hero: pipeline card */
  const pItems = $$('#pipeSteps li'), pBar = $('#pipeBar');
  if (pItems.length && pBar) {
    let pIdx = 2;
    const renderPipe = () => {
      pItems.forEach((li, i) => { li.className = i < pIdx ? 'done' : (i === pIdx ? 'now' : ''); });
      pBar.style.width = ((pIdx + (pIdx < pItems.length ? .5 : 0)) / pItems.length * 100) + '%';
    };
    renderPipe();
    if (!reduce) setInterval(() => { if (document.hidden) return; pIdx = (pIdx + 1) % (pItems.length + 1); renderPipe(); }, 1900);
  }

  /* code window: line scan */
  const codeLines = $$('#code .cl');
  if (codeLines.length && !reduce) {
    let ci = 0;
    setInterval(() => { if (document.hidden) return; codeLines.forEach(l => l.classList.remove('hot')); codeLines[ci % codeLines.length].classList.add('hot'); ci++; }, 1400);
  }

  /* ---------- cards: spotlight + tilt ---------- */
  if (finePointer) {
    $$('.card').forEach(card => {
      const tilt = card.hasAttribute('data-tilt') && !reduce;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        if (tilt) {
          const rx = ((y / r.height) - .5) * -4, ry = ((x / r.width) - .5) * 5;
          card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
        }
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- tech panel ---------- */
  const TECH = {
    flutter: ['Mobile apps layer', 'Flutter', 'Our default for cross-platform mobile apps. One codebase ships to iOS and Android with native performance and a consistent design.'],
    dart: ['Mobile apps layer', 'Dart', 'The language behind Flutter. Strong typing and fast compile times keep large mobile codebases readable and safe to change.'],
    react: ['Web apps layer', 'React', 'Component-based interfaces for dashboards, portals and interactive tools, built from reusable parts that stay consistent.'],
    next: ['Web apps layer', 'Next.js', 'Server-rendered React for websites and web apps that need fast first loads and strong search visibility.'],
    js: ['Web apps layer', 'JavaScript', 'The language of the web, shared across our front ends and Node.js services so logic and validation can be reused.'],
    node: ['Services layer', 'Node.js', 'Backend services, background jobs and third-party integrations, written in the same language as the front end.'],
    rest: ['Services layer', 'REST APIs', 'Clear, versioned interfaces that connect your apps, partners and outside systems such as payment gateways and ERPs.'],
    firebase: ['Data and auth layer', 'Firebase', 'Sign-in, real-time data and push notifications for apps that need to reach users quickly.'],
    supabase: ['Data and auth layer', 'Supabase', 'An open-source Postgres platform with authentication, file storage and row-level security built in.'],
    pg: ['Data and auth layer', 'PostgreSQL', 'A dependable relational database for business data that needs integrity, reporting and room to grow.']
  };
  const tBody = $('#tpBody'), chips = $$('.tchip');
  if (tBody) chips.forEach(c => c.addEventListener('click', () => {
    const d = TECH[c.dataset.t]; if (!d) return;
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    $('#tpRole').textContent = d[0]; $('#tpName').textContent = d[1]; $('#tpText').textContent = d[2];
    tBody.classList.remove('tp-anim'); void tBody.offsetWidth; tBody.classList.add('tp-anim');
  }));

  /* ---------- accordions (one open at a time, per accordion) ---------- */
  $$('.acc-btn').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item'), group = btn.closest('.acc');
    const open = btn.getAttribute('aria-expanded') !== 'true';
    $$('.acc-item', group).forEach(it => { it.classList.remove('open'); $('.acc-btn', it).setAttribute('aria-expanded', 'false'); });
    if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  }));

  /* ---------- client account: show the signed-in state (set by /account) ---------- */
  try {
    const acct = JSON.parse(localStorage.getItem("kt-account") || "null");
    if (acct && acct.name) {
      const btn = document.getElementById("acctBtn"), mm = document.getElementById("mmAcct");
      if (btn) { btn.classList.add("is-in"); btn.setAttribute("aria-label", `Your account (${acct.name})`); btn.title = `Signed in as ${acct.name}`; }
      if (mm) mm.querySelector("span").textContent = `Hi ${acct.name}, open your account`;
      const tab = document.getElementById("tabAcct");
      if (tab) { tab.classList.add("is-in"); tab.setAttribute("aria-label", `Your account (${acct.name})`); }
    }
  } catch {}

  /* ---------- blog: filter articles by topic ---------- */
  const blogChips = $$('[data-blog-filter]');
  if (blogChips.length) {
    const announce = document.createElement('p');
    announce.className = 'sr-only'; announce.setAttribute('role', 'status');
    document.getElementById('articles')?.prepend(announce);
    blogChips.forEach(chip => chip.addEventListener('click', () => {
      const cat = chip.dataset.blogFilter;
      blogChips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      $$('#articles [data-cat]').forEach(el => {
        const on = cat === 'all' || el.dataset.cat === cat;
        el.hidden = !on; if (on) { shown++; el.classList.add('in'); }
      });
      announce.textContent = `${shown} article${shown === 1 ? '' : 's'} shown`;
      const target = document.getElementById('articles');
      if (target && target.getBoundingClientRect().top > innerHeight * 0.85) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  /* ---------- services page: highlight the service in view ---------- */
  const svcLinks = $$('.svc-nav a');
  if (svcLinks.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) svcLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('.svc').forEach(s => so.observe(s));
  }

  /* ---------- contact form ---------- */
  const form = $('#form');
  if (form) {
    const status = $('#status'), sel = $('#f-service');
    const msg = $('#f-msg'), counter = $('#c-msg');
    const rules = {
      'f-name': v => v.trim().length >= 2 ? '' : 'Enter your full name (at least 2 characters).',
      'f-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@company.com.',
      'f-service': v => v ? '' : 'Choose the service you need, or pick "Not sure yet".',
      'f-msg': v => v.trim().length >= 20 ? '' : `Describe your project in at least 20 characters (${v.trim().length} so far).`
    };
    const showErr = (el, text) => { const e = $('#e-' + el.id.slice(2)); e.textContent = text; el.setAttribute('aria-invalid', text ? 'true' : 'false'); };
    const clearErr = el => { if (rules[el.id]) showErr(el, ''); };

    // Ask AI (ask-ai.js) can fill this form: directly on this page, or via sessionStorage after sending the visitor here.
    const fillForm = p => {
      if (!p) return;
      const set = (id, v) => { const el = document.getElementById(id); if (el && v) { el.value = v; clearErr(el); } };
      set('f-name', p.name); set('f-email', p.email); set('f-company', p.company); set('f-msg', p.message);
      if (p.service && sel.querySelector(`option[value="${CSS.escape(p.service)}"]`)) { sel.value = p.service; clearErr(sel); }
      counter.textContent = `${msg.value.length} / 1500`;
      form.classList.add('is-prefilled');
      setTimeout(() => form.classList.remove('is-prefilled'), 2400);
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      ($('#f-name').value ? ($('#f-email').value ? $('#submitBtn') : $('#f-email')) : $('#f-name')).focus({ preventScroll: true });
    };
    window.ktFillContactForm = fillForm;
    try {
      const saved = sessionStorage.getItem('kt-prefill');
      if (saved) { sessionStorage.removeItem('kt-prefill'); setTimeout(() => fillForm(JSON.parse(saved)), 500); }
    } catch {}

    // preselect a service from links such as /contact?service=web or in-page CTAs
    const want = new URLSearchParams(location.search).get('service');
    if (want && sel.querySelector(`option[value="${CSS.escape(want)}"]`)) sel.value = want;
    $$('.to-contact').forEach(a => a.addEventListener('click', () => { if (a.dataset.service) { sel.value = a.dataset.service; clearErr(sel); } }));

    msg.addEventListener('input', () => { counter.textContent = `${msg.value.length} / 1500`; });
    Object.keys(rules).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('blur', () => { if (el.value) showErr(el, rules[id](el.value)); });
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') showErr(el, rules[id](el.value)); });
      el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') showErr(el, rules[id](el.value)); });
    });
    const ICON_INFO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.995 16h.009" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const ICON_BAD = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    form.addEventListener('submit', e => {
      e.preventDefault();
      if ($('#f-web').value) return; // honeypot
      let first = null, bad = 0;
      Object.keys(rules).forEach(id => {
        const el = document.getElementById(id), m = rules[id](el.value);
        showErr(el, m); if (m) { bad++; if (!first) first = el; }
      });
      status.hidden = false;
      if (first) {
        status.className = 'status bad';
        status.innerHTML = `${ICON_BAD}<span><b>${bad} field${bad > 1 ? 's need' : ' needs'} attention.</b> Fix the highlighted ${bad > 1 ? 'fields' : 'field'} and try again.</span>`;
        first.focus();
        return;
      }
      const btn = $('#submitBtn');
      btn.disabled = true; btn.style.opacity = .7;
      status.hidden = true;
      // Sent to app/api/contact/route.ts, which emails the inquiry to the team.
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: $('#f-name').value, email: $('#f-email').value, company: $('#f-company').value,
          service: sel.value, message: msg.value, website: $('#f-web').value
        })
      })
        .then(res => res.json().catch(() => ({})).then(data => ({ ok: res.ok && data.ok, error: data.error })))
        .catch(() => ({ ok: false }))
        .then(({ ok, error }) => {
          btn.disabled = false; btn.style.opacity = '';
          status.hidden = false;
          if (ok) {
            status.className = 'status info';
            status.innerHTML = `${ICON_INFO}<span><b>Thank you, your inquiry has been sent.</b> We'll reply by email with questions, a suggested approach and next steps.</span>`;
            form.reset(); counter.textContent = '0 / 1500';
            if (window.gtag) gtag('event', 'generate_lead', { method: 'contact_form', service: sel.value || 'unknown' });
            Object.keys(rules).forEach(id => clearErr(document.getElementById(id)));
          } else {
            status.className = 'status bad';
            status.innerHTML = `${ICON_BAD}<span><b>Your message wasn't sent.</b> <span class="status-msg"></span></span>`;
            $('.status-msg', status).textContent = error || 'Please try again, or WhatsApp us at +92 302 8207226.';
          }
        });
    });
  }

  /* ---------- site search (Ctrl/Cmd+K, "/" or the Search button). Index: /search-index.json (scripts/build-search-index.mjs) ---------- */
  (() => {
    const ICON = {"search":"<svg aria-hidden=\"true\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","doc":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-miterlimit=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-miterlimit=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","box":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M22 8.52V3.98C22 2.57 21.36 2 19.77 2h-4.04c-1.59 0-2.23.57-2.23 1.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM22 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23h-4.04c-1.59 0-2.23.64-2.23 2.23v4.04c0 1.59.64 2.23 2.23 2.23h4.04c1.59 0 2.23-.64 2.23-2.23ZM10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM10.5 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23H4.23c-1.59 0-2.23.64-2.23 2.23v4.04C2 21.36 2.64 22 4.23 22h4.04c1.59 0 2.23-.64 2.23-2.23Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","book":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","shield":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M10.49 2.23 5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"m9.05 11.87 1.61 1.61 4.3-4.3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","arrow":"<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" stroke-width=\"1.5\" d=\"M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08\"></path></svg>","msg":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M16 2H8C4 2 2 4 2 8v13c0 .55.45 1 1 1h13c4 0 6-2 6-6V8c0-4-2-6-6-6Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M7 9.5h10M7 14.5h7\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-miterlimit=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>","flash":"<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-miterlimit=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>"};
    const TYPE_ICON = { Page: ICON.doc, Service: ICON.box, Blog: ICON.book, Legal: ICON.shield };
    const QUICK = [
      ['Start a project', '/contact', ICON.flash, 'Tell us what you want to build'],
      ['All services', '/services', ICON.box, 'Apps, web, software, AI, SEO, SECP and tax'],
      ['Latest articles', '/blog', ICON.book, 'Guides on AI, apps and business setup'],
      ['Ask Kamboh AI', '#ask-ai', ICON.msg, 'Get an instant answer from our assistant'],
    ];
    let index = null, loading = null, root, input, list, results = [], active = -1, lastFocus = null;
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    const mark = (s, toks) => {
      let out = esc(s);
      toks.forEach((t) => { if (t.length > 1) out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
      return out;
    };
    const load = () => loading || (loading = fetch('/search-index.json').then((r) => r.json()).then((d) => (index = d)).catch(() => (index = [])));

    function build() {
      root = document.createElement('div');
      root.className = 'srch';
      root.hidden = true;
      root.innerHTML = `<div class="srch-backdrop" data-close></div>
        <div class="srch-panel" role="dialog" aria-modal="true" aria-label="Search the website" data-lenis-prevent>
          <div class="srch-bar">${ICON.search}
            <input type="search" class="srch-input" placeholder="Search services, articles and pages…" autocomplete="off" spellcheck="false"
              role="combobox" aria-expanded="true" aria-controls="srchList" aria-autocomplete="list" aria-label="Search" style="border:none;outline:none;box-shadow:none;">
            <button type="button" class="srch-esc" data-close aria-label="Close search">Esc</button>
          </div>
          <div class="srch-body"><ul class="srch-list" id="srchList" role="listbox" aria-label="Search results"></ul></div>
          <div class="srch-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>
        </div>`;
      document.body.appendChild(root);
      input = root.querySelector('.srch-input');
      list = root.querySelector('.srch-list');
      root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
      input.addEventListener('input', render);
      input.addEventListener('keydown', onKey);
      list.addEventListener('mousemove', (e) => { const li = e.target.closest('[role="option"]'); if (li) setActive(+li.dataset.i, false); });
      list.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a && a.dataset.action === 'ask') { e.preventDefault(); close(); window.dispatchEvent(new Event('askai:open')); } else if (a) close(); });
      root.addEventListener('keydown', (e) => { // keep Tab inside the dialog
        if (e.key !== 'Tab') return;
        const f = [...root.querySelectorAll('input,button,a[href]')].filter((x) => x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      });
    }

    function search(q) {
      const toks = norm(q).split(/\s+/).filter(Boolean);
      if (!toks.length || !index) return { toks, items: [] };
      const items = [];
      for (const d of index) {
        const T = norm(d.t), H = norm(d.h), D = norm(d.d), B = norm(d.b), S = d.s.map((s) => norm(s.t)).join(' | ');
        let score = 0, ok = true;
        for (const t of toks) {
          let s = 0;
          if (T.includes(t)) s += new RegExp('(^|\\W)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(T) ? 14 : 9;
          if (H.includes(t)) s += 6;
          if (S.includes(t)) s += 4;
          if (D.includes(t)) s += 3;
          if (B.includes(t)) s += 1;
          if (!s) { ok = false; break; }
          score += s;
        }
        if (!ok) continue;
        if (d.y === 'Page' || d.y === 'Service') score += 1;
        // Best matching section, so the result can jump straight to it.
        let sec = null;
        if (!toks.every((t) => T.includes(t))) for (const h of d.s) { const n = norm(h.t); if (h.id && toks.every((t) => n.includes(t))) { sec = h; break; } }
        items.push({ d, score, sec });
      }
      items.sort((a, b) => b.score - a.score);
      // Keep each type together (ordered by its best result), so every group label appears once.
      const top = items.slice(0, 8), rank = {};
      top.forEach((it) => { if (!(it.d.y in rank)) rank[it.d.y] = Object.keys(rank).length; });
      top.sort((a, b) => rank[a.d.y] - rank[b.d.y] || b.score - a.score);
      return { toks, items: top };
    }

    function render() {
      const q = input.value.trim();
      let html = '';
      results = [];
      if (!q) {
        html = `<li class="srch-label" role="presentation">Quick links</li>` + QUICK.map(([t, u, ic, d], i) => {
          results.push(u);
          const ask = u === '#ask-ai';
          return `<li role="option" id="srch-${i}" data-i="${i}" aria-selected="false"><a href="${ask ? '/contact' : u}"${ask ? ' data-action="ask"' : ''}><span class="srch-ic">${ic}</span><span class="srch-tx"><b>${esc(t)}</b><small>${esc(d)}</small></span>${ICON.arrow}</a></li>`;
        }).join('');
      } else if (!index) {
        html = `<li class="srch-empty" role="presentation">Loading…</li>`;
        load().then(render);
      } else {
        const { toks, items } = search(q);
        if (!items.length) {
          html = `<li class="srch-empty" role="presentation"><b>No results for “${esc(q)}”</b><span>Try another word, or ask our assistant.</span></li>`
            + `<li role="option" id="srch-0" data-i="0" aria-selected="false"><a href="/contact" data-action="ask"><span class="srch-ic">${ICON.msg}</span><span class="srch-tx"><b>Ask Kamboh AI</b><small>Get an instant answer to your question</small></span>${ICON.arrow}</a></li>`;
          results.push('#ask-ai');
        } else {
          let lastType = '';
          html = items.map(({ d, sec }, i) => {
            const url = sec ? `${d.u}#${sec.id}` : d.u;
            results.push(url);
            const label = d.y !== lastType ? `<li class="srch-label" role="presentation">${{ Page: 'Pages', Service: 'Services', Blog: 'Articles', Legal: 'Legal' }[d.y]}</li>` : '';
            lastType = d.y;
            const sub = sec ? `${mark(sec.t, toks)}` : mark(d.d.length > 110 ? d.d.slice(0, 108) + '…' : d.d, toks);
            return `${label}<li role="option" id="srch-${i}" data-i="${i}" aria-selected="false"><a href="${esc(url)}"><span class="srch-ic">${TYPE_ICON[d.y]}</span><span class="srch-tx"><b>${mark(d.t, toks)}</b><small>${sub}</small></span>${ICON.arrow}</a></li>`;
          }).join('');
        }
      }
      list.innerHTML = html;
      setActive(results.length ? 0 : -1, false);
    }

    function setActive(i, scroll = true) {
      active = i;
      list.querySelectorAll('[role="option"]').forEach((li) => li.setAttribute('aria-selected', String(+li.dataset.i === i)));
      const cur = list.querySelector(`#srch-${i}`);
      if (cur) { input.setAttribute('aria-activedescendant', cur.id); if (scroll) cur.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    }

    function onKey(e) {
      const n = results.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); if (n) setActive((active + 1) % n); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (n) setActive((active - 1 + n) % n); }
      else if (e.key === 'Enter') { const a = list.querySelector(`#srch-${active} a`); if (a) { e.preventDefault(); a.click(); if (!a.dataset.action) location.href = a.href; } }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    }

    function open() {
      if (!root) build();
      lastFocus = document.activeElement;
      load();
      root.hidden = false;
      document.documentElement.classList.add('srch-open');
      if (lenis) lenis.stop();
      requestAnimationFrame(() => root.classList.add('show'));
      input.value = '';
      render();
      setTimeout(() => input.focus(), 30);
      if (window.gtag) gtag('event', 'search_open');
    }
    function close() {
      if (!root || root.hidden) return;
      root.classList.remove('show');
      document.documentElement.classList.remove('srch-open');
      if (lenis) lenis.start();
      const q = input.value.trim();
      if (q && window.gtag) gtag('event', 'search', { search_term: q.slice(0, 100) });
      setTimeout(() => { root.hidden = true; }, 180);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', (e) => { if (e.target.closest('[data-search]')) { e.preventDefault(); open(); } });
    addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); root && !root.hidden ? close() : open(); }
      else if (e.key === '/' && !typing) { e.preventDefault(); open(); }
    });
    // Show the right shortcut hint (⌘K on Mac, Ctrl K elsewhere).
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$('.search-btn kbd').forEach((k) => (k.textContent = '⌘K'));
  })();

  /* ---------- clickable team cards ---------- */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.member');
    if (!card) return;
    if (e.target.closest('.m-links a, .m-links button')) return;
    const link = card.querySelector('.m-profile, .m-name');
    if (link && !e.target.closest('a')) {
      link.click();
    }
  });
})();
