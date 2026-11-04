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
    if (themeMeta) themeMeta.setAttribute('content', t === 'light' ? '#F6F8FC' : '#07090E');
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
      <p class="cookie-text">We use analytics cookies to understand how visitors use our site and improve it. No advertising cookies. You can change your choice anytime from “Cookie settings” in the footer.</p>
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
})();
