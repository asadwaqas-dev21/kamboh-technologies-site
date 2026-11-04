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
    sent: 'Inquiry sent'
  };

  const svg = (d, size = 19, extra = '') => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
  const ICON = {
    chat: svg('<path d="M8 9h8M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/>', 18),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>', 20),
    reset: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    send: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
    image: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><path d="M16 5h6M19 2v6"/>'),
    up: svg('<path d="M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 2 2.3l-1.4 8a2 2 0 0 1-2 1.7H7V10l4-8a3.1 3.1 0 0 1 4 3.9z"/>', 15),
    down: svg('<path d="M17 14V2M9 18.1 10 14H4.2a2 2 0 0 1-2-2.3l1.4-8a2 2 0 0 1 2-1.7H17v12l-4 8a3.1 3.1 0 0 1-4-3.9z"/>', 15),
    check: svg('<path d="M20 6 9 17l-5-5"/>', 14)
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
        <div class="ask-ai-brand"><span class="ask-ai-avatar"><img src="/logo.png" alt="" width="28" height="31"></span>
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
        <p class="ask-ai-disclaimer">${T.disclaimerPrefix} <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to discuss a software project.")}" target="_blank" rel="noopener noreferrer">${T.disclaimerLink}</a>.</p>
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
        error: !res.ok, quoteSent: !!data.quoteSent
      });
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
