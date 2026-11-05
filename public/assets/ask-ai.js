/* Kamboh Technologies: "Ask Kamboh AI" chat widget. Talks to /api/chat (app/api/chat/route.ts).
   Any element with [data-ask-ai] opens it, as does window.dispatchEvent(new Event('askai:open')). */
(() => {
  const WHATSAPP_NUMBER = '923028207226';
  const INTRO_ID = 1;
  const T = {
    intro: "Hi! I'm Kamboh AI, the Kamboh Technologies assistant. Ask me about our services, process or technology, or tell me about your project.",
    unavailable: "Sorry, I'm unavailable right now. Please try again later.",
    title: 'Ask Kamboh AI',
    subtitle: 'Instant answers about our services',
    startOver: 'Start over',
    close: 'Close',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    starters: ['Start a project', 'What services do you offer?', 'How does your process work?'],
    typing: 'Typing…',
    slow: 'Still thinking…',
    addPhoto: 'Add image',
    inputLabel: 'Message',
    placeholder: 'Ask about your project…',
    send: 'Send',
    disclaimerPrefix: 'AI answers can be wrong; our team confirms every detail. Or message us on',
    disclaimerLink: 'WhatsApp',
    buttonLabel: 'Ask AI',
    sent: 'Inquiry sent',
    filled: 'Contact form filled'
  };

  /** Puts Ask AI's suggested values into the contact form: here if this page has one, otherwise on /contact. */
  function applyPrefill(p) {
    if (document.getElementById('form') && window.ktFillContactForm) {
      if (matchMedia('(max-width: 1023px)').matches) setTimeout(() => setOpen(false), 900);
      window.ktFillContactForm(p);
    } else {
      try { sessionStorage.setItem('kt-prefill', JSON.stringify(p)); } catch {}
      setTimeout(() => { location.href = '/contact#form'; }, 1200);
    }
  }

  // Iconsax icons (https://iconsax.io), pre-rendered to static SVG.
  const ICON = {
    chat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2H8C4 2 2 4 2 8v13c0 .55.45 1 1 1h13c4 0 6-2 6-6V8c0-4-2-6-6-6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 9.5h10M7 14.5h7" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    reset: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.25 22h4.5C15.5 22 17 20.5 17 16.75v-4.5C17 8.5 15.5 7 11.75 7h-4.5C3.5 7 2 8.5 2 12.25v4.5C2 20.5 3.5 22 7.25 22ZM22 9c0-3.87-3.13-7-7-7l1.05 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    send: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M18.07 9.57L12 3.5 5.93 9.57M12 20.5V3.67"></path></svg>',
    image: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.75 5h5.5M18.5 7.75v-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    up: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.48 18.35 3.1 2.4c.4.4 1.3.6 1.9.6h3.8c1.2 0 2.5-.9 2.8-2.1l2.4-7.3c.5-1.4-.4-2.6-1.9-2.6h-4c-.6 0-1.1-.5-1-1.2l.5-3.2c.2-.9-.4-1.9-1.3-2.2-.8-.3-1.8.1-2.2.7l-4.1 6.1" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M2.38 18.35v-9.8c0-1.4.6-1.9 2-1.9h1c1.4 0 2 .5 2 1.9v9.8c0 1.4-.6 1.9-2 1.9h-1c-1.4 0-2-.5-2-1.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    down: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m16.52 5.65-3.1-2.4c-.4-.4-1.3-.6-1.9-.6h-3.8c-1.2 0-2.5.9-2.8 2.1l-2.4 7.3c-.5 1.4.4 2.6 1.9 2.6h4c.6 0 1.1.5 1 1.2l-.5 3.2c-.2.9.4 1.9 1.3 2.2.8.3 1.8-.1 2.2-.7l4.1-6.1" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M21.62 5.65v9.8c0 1.4-.6 1.9-2 1.9h-1c-1.4 0-2-.5-2-1.9v-9.8c0-1.4.6-1.9 2-1.9h1c1.4 0 2 .5 2 1.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m7.75 12 2.83 2.83 5.67-5.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
  };

  let open = false, pending = false, slow = false, slowTimer = 0, nextId = 2;
  let messages = [{ id: INTRO_ID, role: 'assistant', content: T.intro }];
  let root, launcher, scrim, panel, list, endEl, input, fileInput, sendBtn;

  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /** Text with clickable URLs. Built from text nodes, so model output is never parsed as HTML. */
  function linkify(text) {
    const frag = document.createDocumentFragment();
    String(text).split(/(https?:\/\/[^\s]+)/g).forEach(part => {
      if (/^https?:\/\//.test(part)) {
        const a = document.createElement('a');
        a.href = part; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = part;
        frag.appendChild(a);
      } else if (part) frag.appendChild(document.createTextNode(part));
    });
    return frag;
  }

  async function shrinkImage(file) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return { mime: 'image/jpeg', data: canvas.toDataURL('image/jpeg', 0.82).split(',')[1] };
    } catch { return undefined; }
  }

  function buildRoot() {
    root = h('div', 'ask-ai-root');
    launcher = h('button', 'ask-ai-launcher', `${ICON.chat}<span>${T.buttonLabel}</span>`);
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.addEventListener('click', () => setOpen(true));
    root.appendChild(launcher);
    document.body.appendChild(root);
  }

  function buildPanel() {
    scrim = h('button', 'ask-ai-scrim');
    scrim.type = 'button';
    scrim.setAttribute('aria-label', T.close);
    scrim.addEventListener('click', () => setOpen(false));

    panel = h('section', 'ask-ai-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'ask-ai-title');
    panel.setAttribute('data-lenis-prevent', '');
    panel.innerHTML = `
      <span aria-hidden="true" class="ask-ai-grabber"></span>
      <header class="ask-ai-header">
        <div class="ask-ai-brand"><span class="ask-ai-avatar"><img src="/brand/logo-light.webp" alt="" width="28" height="28"></span>
          <div class="ask-ai-header-copy"><h2 id="ask-ai-title">${T.title}</h2><p>${T.subtitle}</p></div></div>
        <div class="ask-ai-header-actions">
          <button type="button" class="ask-ai-icon-btn" data-act="reset" aria-label="${T.startOver}">${ICON.reset}</button>
          <button type="button" class="ask-ai-icon-btn" data-act="close" aria-label="${T.close}">${ICON.close}</button>
        </div>
      </header>
      <div class="ask-ai-log" role="log" aria-live="polite"><ol></ol><div class="ask-ai-end"></div></div>
      <div class="ask-ai-composer-wrap">
        <form class="ask-ai-composer">
          <button type="button" class="ask-ai-icon-btn" data-act="photo" aria-label="${T.addPhoto}">${ICON.image}</button>
          <input type="file" accept="image/*" hidden>
          <label for="ask-ai-message" class="sr">${T.inputLabel}</label>
          <textarea id="ask-ai-message" class="ask-ai-textarea" rows="1" maxlength="600" placeholder="${T.placeholder}"></textarea>
          <button type="submit" class="ask-ai-send-btn" aria-label="${T.send}" disabled>${ICON.send}</button>
        </form>
        <p class="ask-ai-disclaimer">${T.disclaimerPrefix} <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to discuss a software project.")}" target="_blank" rel="noopener noreferrer">${T.disclaimerLink}</a>. <a href="/privacy-policy#ask-ai">Privacy</a></p>
      </div>`;

    list = panel.querySelector('ol');
    endEl = panel.querySelector('.ask-ai-end');
    input = panel.querySelector('textarea');
    fileInput = panel.querySelector('input[type=file]');
    sendBtn = panel.querySelector('.ask-ai-send-btn');

    panel.querySelector('[data-act=reset]').addEventListener('click', reset);
    panel.querySelector('[data-act=close]').addEventListener('click', () => setOpen(false));
    panel.querySelector('[data-act=photo]').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { const f = fileInput.files && fileInput.files[0]; if (f) sendPhoto(f); fileInput.value = ''; });
    panel.querySelector('form').addEventListener('submit', e => { e.preventDefault(); send(); });
    input.addEventListener('input', () => { autosize(); sendBtn.disabled = !input.value.trim() || pending; });
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

    root.prepend(panel);
    root.prepend(scrim);
    renderMessages();
  }

  function autosize() {
    const MAX = 160;
    input.style.height = 'auto';
    input.style.height = (input.value ? Math.min(input.scrollHeight, MAX) : 40) + 'px';
    input.style.overflowY = input.value && input.scrollHeight > MAX ? 'auto' : 'hidden';
  }

  function setOpen(next) {
    open = next;
    if (open && !panel) buildPanel();
    if (open && window.gtag) gtag('event', 'ask_ai_open');
    root.classList.toggle('is-open', open);
    launcher.hidden = open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      document.documentElement.classList.add('ask-ai-lock');
      setTimeout(() => input && input.focus(), 50);
    } else {
      document.documentElement.classList.remove('ask-ai-lock');
      launcher.focus({ preventScroll: true });
    }
  }

  function reset() {
    messages = [{ id: INTRO_ID, role: 'assistant', content: T.intro }];
    input.value = ''; autosize(); sendBtn.disabled = true;
    renderMessages();
  }

  function renderMessages() {
    if (!list) return;
    list.textContent = '';
    messages.forEach(m => {
      const li = h('li', `ask-ai-msg ask-ai-msg--${m.role}`);
      if (m.role === 'user') {
        if (m.image) { const img = h('img', 'ask-ai-msg-image'); img.src = m.image; img.alt = ''; li.appendChild(img); }
        else { const p = h('p', 'ask-ai-bubble'); p.appendChild(linkify(m.content)); li.appendChild(p); }
      } else {
        const p = h('p', m.error ? 'ask-ai-text ask-ai-text--error' : 'ask-ai-text');
        p.appendChild(linkify(m.content));
        li.appendChild(p);
        if (m.quoteSent) li.appendChild(h('span', 'ask-ai-quote-badge', `${ICON.check}${T.sent}`));
        if (m.prefilled) li.appendChild(h('span', 'ask-ai-quote-badge', `${ICON.check}${T.filled}`));
        if (m.id !== INTRO_ID && !m.error) {
          const vote = h('div', 'ask-ai-vote');
          ['up', 'down'].forEach(choice => {
            if (m.vote && m.vote !== choice) return;
            const b = h('button', `ask-ai-icon-btn ask-ai-icon-btn--small${m.vote === choice ? ' is-active' : ''}`, ICON[choice]);
            b.type = 'button';
            b.disabled = !!m.vote;
            b.setAttribute('aria-label', choice === 'up' ? T.helpful : T.notHelpful);
            b.setAttribute('aria-pressed', String(m.vote === choice));
            b.addEventListener('click', () => { m.vote = choice; renderMessages(); });
            vote.appendChild(b);
          });
          li.appendChild(vote);
        }
      }
      list.appendChild(li);
    });

    if (messages.length === 1 && !pending) {
      const li = h('li', 'ask-ai-starters');
      T.starters.forEach(s => {
        const b = h('button', 'ask-ai-starter');
        b.type = 'button'; b.textContent = s;
        b.addEventListener('click', () => send(s));
        li.appendChild(b);
      });
      list.appendChild(li);
    }

    if (pending) {
      const li = h('li', 'ask-ai-pending', '<span aria-hidden="true" class="ask-ai-typing"><span class="ask-ai-dot"></span><span class="ask-ai-dot"></span><span class="ask-ai-dot"></span></span>');
      li.appendChild(h('p', 'sr', T.typing));
      if (slow) li.appendChild(h('p', 'ask-ai-slow', T.slow));
      list.appendChild(li);
    }
    panel.querySelector('.ask-ai-log').setAttribute('aria-busy', String(pending));
    if (messages.length > 1 || pending) endEl.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  async function requestReply(nextMessages, image) {
    slow = false; pending = true; sendBtn.disabled = true;
    clearTimeout(slowTimer);
    slowTimer = setTimeout(() => { slow = true; renderMessages(); }, 6000);
    renderMessages();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })), image })
      });
      let data = {};
      try { data = await res.json(); } catch {}
      messages.push({
        id: nextId++, role: 'assistant',
        content: res.ok && data.reply ? data.reply : data.error || T.unavailable,
        error: !res.ok, quoteSent: !!data.quoteSent, prefilled: !!data.prefill
      });
      if (data.quoteSent && window.gtag) gtag('event', 'generate_lead', { method: 'ask_ai' });
      if (data.prefill) applyPrefill(data.prefill);
    } catch {
      messages.push({ id: nextId++, role: 'assistant', content: T.unavailable, error: true });
    } finally {
      pending = false; slow = false; clearTimeout(slowTimer);
      sendBtn.disabled = !input.value.trim();
      renderMessages();
    }
  }

  function send(suggestion) {
    const content = (suggestion != null ? suggestion : input.value).trim();
    if (!content || pending) return;
    messages = messages.filter(m => !m.error);
    messages.push({ id: nextId++, role: 'user', content: content.slice(0, 600) });
    input.value = ''; autosize();
    requestReply(messages.slice());
  }

  async function sendPhoto(file) {
    if (pending) return;
    messages = messages.filter(m => !m.error);
    messages.push({ id: nextId++, role: 'user', content: file.name.slice(0, 120) || 'image', image: URL.createObjectURL(file) });
    renderMessages();
    const image = await shrinkImage(file);
    requestReply(messages.slice(), image);
  }

  buildRoot();
  window.addEventListener('askai:open', () => setOpen(true));
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-ask-ai]');
    if (t) { e.preventDefault(); setOpen(true); }
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
})();
