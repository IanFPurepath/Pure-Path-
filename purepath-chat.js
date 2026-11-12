/* PurePath "Ask PurePath AI" chat widget
   Floating launcher in the bottom-left corner. Clicking it opens a chat window
   that talks to the n8n Chat Trigger webhook below.
   It never covers the "Get the app" popup (app-popup.js): when the two would
   collide (phones, small tablets) the chat moves up to sit above the popup.
   It waits until the cookie banner is closed, like the popup does.
   To use on a page, add this line just before </body>:
   <script src="/purepath-chat.js" defer></script>
*/
(function () {
  var WEBHOOK_URL = 'https://darksalmon-butterfly-331202.hostingersite.com/webhook/77940290-bca3-45db-9ced-e09ddbe1bae2/chat';
  var ICON = '/assets/app-icon.png';
  var TITLE = 'PurePath AI Assistant';
  var SUBTITLE = 'AI-powered support';
  var LAUNCHER_LABEL = 'Ask PurePath AI';
  var WELCOME = "Hi, I'm the PurePath AI assistant. Ask me about scanning your home, your exposure scores, or Safe Swaps.";
  var PLACEHOLDER = 'Ask about scans, scores, or swaps';
  var FOOTNOTE = 'General information only, not medical advice.';
  var ERROR_TEXT = "Sorry, I couldn't reach PurePath AI just now. Please try again in a moment.";
  var TIMEOUT_MS = 45000;
  var SESSION_KEY = 'pp-chat-session';
  var HISTORY_KEY = 'pp-chat-history';

  if (window.__ppChatLoaded) { return; }
  window.__ppChatLoaded = true;

  var css = '' +
    '.ppc{--ppc-lift:0px;--ppc-kb:0px;--ppc-top:16px;--ppc-b:max(var(--ppc-lift),calc(24px + env(safe-area-inset-bottom,0px)));' +
    'font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}' +
    '.ppc *{box-sizing:border-box}' +
    '.ppc.ppc-wait{display:none}' +
    /* launcher */
    '.ppc-launch{position:fixed;left:calc(24px + env(safe-area-inset-left,0px));bottom:var(--ppc-b);z-index:2800;height:56px;min-width:56px;padding:0 22px 0 18px;' +
    'border:0;border-radius:999px;background:linear-gradient(90deg,#4ce0ff,#4a9cff);color:#00131d;display:inline-flex;align-items:center;justify-content:center;gap:10px;' +
    'font:inherit;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 12px 34px rgba(0,0,0,.55),0 0 28px rgba(61,193,255,.28);' +
    'transition:transform .2s ease,bottom .3s ease;-webkit-tap-highlight-color:transparent}' +
    '.ppc-launch:hover{transform:translateY(-2px)}' +
    '.ppc-launch:focus-visible,.ppc-x:focus-visible,.ppc-send:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.ppc-launch svg{width:24px;height:24px;flex:none}' +
    '.ppc-ico-close{display:none}' +
    '.ppc.ppc-open .ppc-launch{width:56px;padding:0;background:#07131c;color:#43ddff;border:1px solid rgba(67,221,255,.5);box-shadow:0 12px 34px rgba(0,0,0,.55)}' +
    '.ppc.ppc-open .ppc-ico-chat,.ppc.ppc-open .ppc-label{display:none}' +
    '.ppc.ppc-open .ppc-ico-close{display:block}' +
    /* panel */
    '.ppc-panel{position:fixed;left:calc(24px + env(safe-area-inset-left,0px));bottom:calc(var(--ppc-b) + 70px);z-index:2800;width:384px;max-width:calc(100vw - 48px);' +
    'height:600px;max-height:calc(100vh - var(--ppc-b) - 70px - var(--ppc-top));max-height:calc(100dvh - var(--ppc-b) - 70px - var(--ppc-top));' +
    'display:flex;flex-direction:column;border-radius:22px;overflow:hidden;background:linear-gradient(150deg,#0d1b24 0%,#071017 100%);' +
    'border:1px solid rgba(67,221,255,.36);box-shadow:0 24px 70px rgba(0,0,0,.6),0 0 44px rgba(0,229,255,.1);color:#f7fbff;' +
    'transform-origin:bottom left;transform:translateY(14px) scale(.97);opacity:0;visibility:hidden;pointer-events:none;' +
    'transition:transform .32s cubic-bezier(.2,.9,.25,1),opacity .22s ease,visibility 0s linear .32s,bottom .3s ease}' +
    '.ppc.ppc-open .ppc-panel{transform:none;opacity:1;visibility:visible;pointer-events:auto;transition:transform .32s cubic-bezier(.2,.9,.25,1),opacity .22s ease,visibility 0s,bottom .3s ease}' +
    '.ppc-head{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;border-bottom:1px solid rgba(67,221,255,.2);background:rgba(2,17,25,.55);flex:none}' +
    '.ppc-head img{width:40px;height:40px;border-radius:10px;flex:none;box-shadow:0 0 16px rgba(67,221,255,.25)}' +
    '.ppc-head-text{flex:1;min-width:0}' +
    '.ppc-title{margin:0;font-size:16px;line-height:1.25;font-weight:800;letter-spacing:-.02em;color:#f7fbff}' +
    '.ppc-sub{margin:2px 0 0;display:flex;align-items:center;gap:6px;font-size:12px;line-height:1.3;color:#98a3ad}' +
    '.ppc-sub i{width:7px;height:7px;border-radius:50%;background:#7cf0da;box-shadow:0 0 8px rgba(124,240,218,.8);flex:none}' +
    '.ppc-x{width:44px;height:44px;flex:none;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;display:grid;place-items:center;cursor:pointer;padding:0}' +
    '.ppc-x:hover{background:rgba(255,255,255,.16)}' +
    '.ppc-x svg{width:18px;height:18px}' +
    '.ppc-msgs{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;padding:16px;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    '.ppc-msgs>:first-child{margin-top:auto}' +
    '.ppc-msg{max-width:84%;padding:11px 14px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}' +
    '.ppc-ai{align-self:flex-start;border-radius:16px 16px 16px 5px;background:#0c212d;border:1px solid rgba(67,221,255,.2);color:#e9f3f7}' +
    '.ppc-ai a{color:#43ddff;text-decoration:underline}' +
    '.ppc-me{align-self:flex-end;border-radius:16px 16px 5px 16px;background:linear-gradient(90deg,#4ce0ff,#4a9cff);color:#00131d;font-weight:600}' +
    '.ppc-welcome{max-width:88%;background:rgba(67,221,255,.08);border-color:rgba(67,221,255,.36)}' +
    '.ppc-welcome b{display:block;color:#43ddff;font-size:11px;letter-spacing:.16em;font-weight:800;margin-bottom:4px}' +
    '.ppc-err{border-color:rgba(255,138,76,.5)}' +
    '.ppc-typing{align-self:flex-start;display:flex;align-items:center;gap:5px;padding:14px 16px;border-radius:16px 16px 16px 5px;background:#0c212d;border:1px solid rgba(67,221,255,.2)}' +
    '.ppc-typing span{width:7px;height:7px;border-radius:50%;background:#43ddff;animation:ppcDot 1.1s infinite}' +
    '.ppc-typing span:nth-child(2){animation-delay:.15s}.ppc-typing span:nth-child(3){animation-delay:.3s}' +
    '@keyframes ppcDot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}' +
    '.ppc-foot{padding:0 14px 10px;flex:none}' +
    '.ppc-form{display:flex;align-items:center;gap:8px;height:52px;padding:0 5px 0 18px;border:1px solid rgba(50,195,255,.6);border-radius:999px;background:rgba(1,12,18,.72)}' +
    '.ppc-form:focus-within{border-color:#4ce0ff;box-shadow:0 0 0 3px rgba(76,224,255,.15)}' +
    '.ppc-input{flex:1;min-width:0;height:100%;background:transparent;border:0;outline:0;color:#fff;font:inherit;font-size:14px;padding:0;margin:0}' +
    '.ppc-input::placeholder{color:#8a96a0}' +
    '.ppc-send{width:44px;height:44px;flex:none;border:0;border-radius:50%;background:linear-gradient(90deg,#4ce0ff,#4a9cff);color:#00131d;display:grid;place-items:center;cursor:pointer;padding:0;' +
    'box-shadow:0 0 18px rgba(61,193,255,.3)}' +
    '.ppc-send:disabled{opacity:.45;cursor:default;box-shadow:none}' +
    '.ppc-send svg{width:20px;height:20px}' +
    '.ppc-note{margin:8px 0 0;text-align:center;font-size:11px;line-height:1.3;color:#98a3ad}' +
    '.ppc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}' +
    /* tablets and phones with the hamburger menu button (top right) */
    '@media(max-width:820px){.ppc{--ppc-top:76px}}' +
    /* phones: full-width sheet, launcher hides while the chat is open */
    '@media(max-width:600px){' +
    '.ppc{--ppc-b:max(var(--ppc-lift),calc(16px + env(safe-area-inset-bottom,0px)))}' +
    '.ppc-launch{left:calc(16px + env(safe-area-inset-left,0px))}' +
    '.ppc.ppc-open .ppc-launch{display:none}' +
    '.ppc-panel{left:calc(12px + env(safe-area-inset-left,0px));right:calc(12px + env(safe-area-inset-right,0px));width:auto;max-width:none;' +
    'top:calc(var(--ppc-top) + env(safe-area-inset-top,0px));bottom:var(--ppc-b);height:auto;max-height:none;transform-origin:bottom center}' +
    '.ppc.ppc-kb .ppc-panel{bottom:calc(var(--ppc-kb) + 8px)}' +
    '.ppc-input{font-size:16px}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){.ppc-panel,.ppc.ppc-open .ppc-panel{transition:opacity .2s ease,visibility 0s;transform:none}.ppc-launch{transition:none}.ppc-typing span{animation:none}}';

  var chatIcon = '<svg class="ppc-ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.2 0-2.3-.25-3.3-.7L4 19.5l1.3-4.3A7.5 7.5 0 1 1 20 11.5Z"/><path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01"/></svg>';
  var downIcon = '<svg class="ppc-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var xIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var sendIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // Safe, minimal formatting for AI replies: **bold**, [label](https://link) and bare https links.
  function format(text) {
    var s = esc(String(text).replace(/^\s+|\s+$/g, ''));
    s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, function (m, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, function (m, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
    });
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    return s;
  }

  function store(key, value) { try { sessionStorage.setItem(key, value); } catch (e) {} }
  function load(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }

  function sessionId() {
    var id = load(SESSION_KEY);
    if (!id) {
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'pp-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
      store(SESSION_KEY, id);
    }
    return id;
  }

  // Pull the reply text out of whatever shape n8n sends back.
  function pick(obj) {
    if (obj == null) { return ''; }
    if (typeof obj === 'string') { return obj; }
    if (Array.isArray(obj)) { return obj.length ? pick(obj[0]) : ''; }
    if (typeof obj === 'object') {
      var keys = ['output', 'text', 'reply', 'response', 'message', 'answer', 'content'];
      for (var i = 0; i < keys.length; i++) {
        var v = obj[keys[i]];
        if (typeof v === 'string' && v) { return v; }
        if (v && typeof v === 'object') { var inner = pick(v); if (inner) { return inner; } }
      }
      if (obj.json) { return pick(obj.json); }
      if (obj.data) { return pick(obj.data); }
    }
    return '';
  }
  function parseReply(raw) {
    raw = String(raw || '').replace(/^\s+|\s+$/g, '');
    if (!raw) { return ''; }
    try { return pick(JSON.parse(raw)); } catch (e) {}
    // Streaming responses arrive as one JSON object per line.
    var out = '', parsedAny = false, lines = raw.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/^data:\s*/, '').replace(/^\s+|\s+$/g, '');
      if (!line) { continue; }
      try {
        var o = JSON.parse(line); parsedAny = true;
        if (o && (o.type === undefined || o.type === 'item' || o.type === 'chunk')) { out += pick(o); }
      } catch (e2) {}
    }
    if (parsedAny) { return out; }
    return raw.charAt(0) === '<' ? '' : raw; // never show an HTML error page as a reply
  }

  function ready(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

  ready(function () {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.className = 'ppc';
    root.innerHTML = '' +
      '<section class="ppc-panel" id="ppc-panel" role="dialog" aria-label="' + esc(TITLE) + '" aria-hidden="true">' +
        '<header class="ppc-head">' +
          '<img src="' + ICON + '" alt="">' +
          '<div class="ppc-head-text"><h2 class="ppc-title">' + esc(TITLE) + '</h2><p class="ppc-sub"><i></i>' + esc(SUBTITLE) + '</p></div>' +
          '<button type="button" class="ppc-x" aria-label="Close chat">' + xIcon + '</button>' +
        '</header>' +
        '<div class="ppc-msgs" role="log" aria-live="polite"></div>' +
        '<div class="ppc-foot">' +
          '<form class="ppc-form" autocomplete="off">' +
            '<label class="ppc-sr" for="ppc-input">Message PurePath AI</label>' +
            '<input class="ppc-input" id="ppc-input" type="text" maxlength="1000" placeholder="' + esc(PLACEHOLDER) + '" enterkeyhint="send">' +
            '<button type="submit" class="ppc-send" aria-label="Send message">' + sendIcon + '</button>' +
          '</form>' +
          '<p class="ppc-note">' + esc(FOOTNOTE) + '</p>' +
        '</div>' +
      '</section>' +
      '<button type="button" class="ppc-launch" aria-controls="ppc-panel" aria-expanded="false" aria-label="' + esc(LAUNCHER_LABEL) + '">' +
        chatIcon + downIcon + '<span class="ppc-label">' + esc(LAUNCHER_LABEL) + '</span>' +
      '</button>';
    document.body.appendChild(root);

    var panel = root.querySelector('.ppc-panel');
    var launch = root.querySelector('.ppc-launch');
    var closeBtn = root.querySelector('.ppc-x');
    var msgs = root.querySelector('.ppc-msgs');
    var form = root.querySelector('.ppc-form');
    var input = root.querySelector('.ppc-input');
    var sendBtn = root.querySelector('.ppc-send');
    var isOpen = false, busy = false, typingEl = null, history = [];

    /* ---------- messages ---------- */
    function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
    function bubble(role, text, extraClass) {
      var el = document.createElement('div');
      el.className = 'ppc-msg ' + (role === 'me' ? 'ppc-me' : 'ppc-ai') + (extraClass ? ' ' + extraClass : '');
      if (role === 'me') { el.textContent = text; } else { el.innerHTML = format(text); }
      msgs.appendChild(el);
      scrollDown();
      return el;
    }
    function remember(role, text) {
      history.push({ r: role, t: text });
      if (history.length > 40) { history = history.slice(-40); }
      store(HISTORY_KEY, JSON.stringify(history));
    }
    function showTyping(on) {
      if (on && !typingEl) {
        typingEl = document.createElement('div');
        typingEl.className = 'ppc-typing';
        typingEl.setAttribute('role', 'img');
        typingEl.setAttribute('aria-label', 'PurePath AI is typing');
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(typingEl);
        scrollDown();
      } else if (!on && typingEl) {
        if (typingEl.parentNode) { typingEl.parentNode.removeChild(typingEl); }
        typingEl = null;
      }
    }

    var welcome = document.createElement('div');
    welcome.className = 'ppc-msg ppc-ai ppc-welcome';
    welcome.innerHTML = '<b>WELCOME</b>' + esc(WELCOME);
    msgs.appendChild(welcome);

    try {
      var saved = JSON.parse(load(HISTORY_KEY) || '[]');
      if (Array.isArray(saved)) {
        history = saved;
        for (var i = 0; i < saved.length; i++) {
          if (saved[i] && typeof saved[i].t === 'string') { bubble(saved[i].r === 'me' ? 'me' : 'ai', saved[i].t); }
        }
      }
    } catch (e) { history = []; }

    /* ---------- talking to n8n ---------- */
    function send(text) {
      busy = true;
      sendBtn.disabled = true;
      bubble('me', text);
      remember('me', text);
      showTyping(true);

      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) { ctrl.abort(); } }, TIMEOUT_MS);

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendMessage', sessionId: sessionId(), chatInput: text }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.text();
      }).then(function (raw) {
        var reply = parseReply(raw);
        if (!reply) { throw new Error('Empty reply'); }
        showTyping(false);
        bubble('ai', reply);
        remember('ai', reply);
      }).catch(function (err) {
        if (window.console && console.warn) { console.warn('[PurePath chat]', err); }
        showTyping(false);
        bubble('ai', ERROR_TEXT, 'ppc-err');
      }).then(function () {
        clearTimeout(timer);
        busy = false;
        sendBtn.disabled = false;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.replace(/^\s+|\s+$/g, '');
      if (!text || busy) { return; }
      input.value = '';
      send(text);
    });

    /* ---------- open / close ---------- */
    function isPhone() { return window.matchMedia && window.matchMedia('(max-width:600px)').matches; }
    function setOpen(open) {
      isOpen = open;
      root.classList.toggle('ppc-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      launch.setAttribute('aria-expanded', open ? 'true' : 'false');
      launch.setAttribute('aria-label', open ? 'Close PurePath AI chat' : LAUNCHER_LABEL);
      layout();
      if (open) {
        scrollDown();
        if (!isPhone()) { setTimeout(function () { input.focus(); }, 60); }
      } else if (!isPhone()) {
        launch.focus();
      }
    }
    launch.addEventListener('click', function () { setOpen(!isOpen); });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });

    /* ---------- stay clear of the "Get the app" popup ---------- */
    function px(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
    function layout() {
      var lift = 0;
      var pop = document.querySelector('.pp-app-pop.pp-in');
      if (pop) {
        var cs = window.getComputedStyle(pop);
        var vw = document.documentElement.clientWidth || window.innerWidth;
        var popLeft = vw - px(cs.right) - pop.offsetWidth;
        var tall = pop.offsetHeight;
        var img = pop.querySelector('.pp-app-mock, .pp-app-phone');
        if (img && img.offsetHeight > tall) { tall = img.offsetHeight; }
        // Right edge of whatever the chat is showing right now (+12px breathing room)
        var mine = isOpen ? panel.getBoundingClientRect().left + panel.offsetWidth : launch.getBoundingClientRect().right;
        if (isPhone() || popLeft < mine + 12) { lift = px(cs.bottom) + tall + 12; }
      }
      root.style.setProperty('--ppc-lift', lift + 'px');
    }

    var watchedPop = null, popObserver = null;
    function watchPopup() {
      var pop = document.querySelector('.pp-app-pop');
      if (pop !== watchedPop) {
        if (popObserver) { popObserver.disconnect(); popObserver = null; }
        watchedPop = pop;
        if (pop && window.MutationObserver) {
          popObserver = new MutationObserver(layout);
          popObserver.observe(pop, { attributes: true, attributeFilter: ['class'] });
        }
      }
      layout();
    }
    if (window.MutationObserver) {
      new MutationObserver(watchPopup).observe(document.body, { childList: true });
    }
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);
    window.addEventListener('load', watchPopup);
    watchPopup();

    /* ---------- wait for the cookie banner ---------- */
    var cb = document.getElementById('pp-cookie-banner');
    function cookieCheck() {
      var waiting = !!(cb && cb.classList.contains('pp-show'));
      root.classList.toggle('ppc-wait', waiting);
      if (!waiting) { layout(); }
    }
    if (cb && window.MutationObserver) {
      new MutationObserver(cookieCheck).observe(cb, { attributes: true, attributeFilter: ['class'] });
    }
    cookieCheck();
    setTimeout(cookieCheck, 500);

    /* ---------- phones: keep the input above the on-screen keyboard ---------- */
    var vv = window.visualViewport;
    if (vv) {
      var onVV = function () {
        var kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        var up = kb > 120;
        root.classList.toggle('ppc-kb', up);
        root.style.setProperty('--ppc-kb', (up ? kb : 0) + 'px');
        if (up) { scrollDown(); }
      };
      vv.addEventListener('resize', onVV);
      vv.addEventListener('scroll', onVV);
    }
  });
})();
