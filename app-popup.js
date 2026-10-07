/* PurePath "Get the app" popup
   Slides up from the bottom after the visitor scrolls a little (or after a few seconds).
   Waits until the cookie banner is closed so the two never overlap.
   Once closed, it stays hidden for 7 days on that browser.
   To use on a page, add this line just before </body>:
   <script src="/app-popup.js" defer></script>
*/
(function () {
  var APP_URL = 'https://apps.apple.com/ca/app/id6790146068';
  var ICON = '/assets/app-icon.png';
  var SCREEN = '/assets/app-popup-screen.jpg';
  // Tilted phone photo. Leave as '' to use the simple phone frame + SCREEN instead.
  var PHONE_IMAGE = '/assets/app-popup-phone.png';
  var HEADLINE = 'Your home, scanned.';
  var SUBLINE = 'Spot plastic risks room by room with PurePath.';
  var DISMISS_KEY = 'pp-app-popup-dismissed';
   var HIDE_DAYS = 0;
  var SCROLL_TRIGGER = 250;   // pixels scrolled before it appears
   var TIME_TRIGGER = 2000;    // or after this many milliseconds

  try {
    var last = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
    if (last && Date.now() - last < HIDE_DAYS * 864e5) { return; }
  } catch (e) {}

  var css = '' +
    '.pp-app-pop{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:460px;margin:0 auto;' +
    'transform:translateY(calc(100% + 60px));opacity:0;transition:transform .5s cubic-bezier(.2,.9,.25,1),opacity .35s ease;pointer-events:none;' +
    'font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.pp-app-pop.pp-in{transform:translateY(0);opacity:1;pointer-events:auto}' +
    '.pp-app-card{position:relative;display:flex;align-items:center;min-height:150px;padding:18px 18px 18px 148px;border-radius:22px;' +
    'background:linear-gradient(150deg,#0d1b24 0%,#071017 100%);border:1px solid rgba(0,229,255,.28);' +
    'box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 40px rgba(0,229,255,.08);color:#fff;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.pp-app-phone{position:absolute;left:18px;bottom:0;width:112px;height:190px;border-radius:20px 20px 0 0;background:#000;' +
    'border:3px solid #2a3640;border-bottom:0;overflow:hidden;box-shadow:0 -6px 24px rgba(0,229,255,.18)}' +
    '.pp-app-phone img{display:block;width:100%;height:auto}' +
    '.pp-app-phone:before{content:"";position:absolute;top:5px;left:50%;width:34px;height:9px;margin-left:-17px;border-radius:9px;background:#000;z-index:1}' +
    '.pp-app-body{display:flex;flex-direction:column;gap:6px;min-width:0}' +
    '.pp-app-brand{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#9fb3bf}' +
    '.pp-app-brand img{width:28px;height:28px;border-radius:7px}' +
    '.pp-app-title{margin:0;font-family:"Space Grotesk",Inter,sans-serif;font-size:19px;line-height:1.2;font-weight:700;color:#fff}' +
    '.pp-app-sub{margin:0;font-size:13.5px;line-height:1.4;color:#b7c5ce}' +
    '.pp-app-badge{display:inline-flex;align-items:center;gap:7px;align-self:flex-start;margin-top:6px;padding:6px 13px 6px 10px;' +
    'border-radius:9px;background:#000;border:1px solid #a6a6a6;color:#fff;line-height:1}' +
    '.pp-app-badge svg{width:20px;height:20px;fill:#fff;flex:none}' +
    '.pp-app-badge small{display:block;font-size:9px;letter-spacing:.02em}' +
    '.pp-app-badge strong{display:block;font-size:16px;font-weight:600;letter-spacing:-.01em;margin-top:1px}' +
    '.pp-app-close{position:absolute;top:10px;right:10px;width:30px;height:30px;border:0;border-radius:50%;' +
    'background:rgba(255,255,255,.12);color:#fff;font-size:16px;line-height:30px;text-align:center;cursor:pointer;padding:0}' +
    '.pp-app-close:hover{background:rgba(255,255,255,.22)}' +
    '.pp-app-mock{position:absolute;left:10px;bottom:0;width:132px;height:228px;overflow:hidden;border-bottom-left-radius:22px;pointer-events:none}' +
    '.pp-app-mock img{display:block;width:100%;height:auto}' +
    '@media(min-width:768px){.pp-app-pop{left:auto;right:24px;bottom:24px;width:420px;margin:0}}' +
    '@media(max-width:360px){.pp-app-card{padding-left:128px}.pp-app-phone{width:96px;height:166px}.pp-app-mock{width:114px;height:198px}.pp-app-title{font-size:17px}}' +
    '@media(prefers-reduced-motion:reduce){.pp-app-pop{transition:opacity .2s ease}}';

  var appleLogo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.23 2.73 2.19 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.3-3.5ZM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.07 1.96-.5 2.56-1.22Z"/></svg>';

  var html = '' +
    '<a class="pp-app-card" href="' + APP_URL + '" target="_blank" rel="noopener">' +
      (PHONE_IMAGE
        ? '<div class="pp-app-mock"><img src="' + PHONE_IMAGE + '" alt=""></div>'
        : '<div class="pp-app-phone"><img src="' + SCREEN + '" alt="" loading="lazy"></div>') +
      '<div class="pp-app-body">' +
        '<div class="pp-app-brand"><img src="' + ICON + '" alt="">PurePath</div>' +
        '<p class="pp-app-title">' + HEADLINE + '</p>' +
        '<p class="pp-app-sub">' + SUBLINE + '</p>' +
        '<span class="pp-app-badge">' + appleLogo + '<span><small>Download on the</small><strong>App Store</strong></span></span>' +
      '</div>' +
    '</a>' +
    '<button type="button" class="pp-app-close" aria-label="Close">&#10005;</button>';

  function ready(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

  ready(function () {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var pop = document.createElement('div');
    pop.className = 'pp-app-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Get the PurePath app');
    pop.innerHTML = html;
    document.body.appendChild(pop);

    var shown = false, wantShow = false;

    function cookieBannerOpen() {
      var b = document.getElementById('pp-cookie-banner');
      return !!(b && b.classList.contains('pp-show'));
    }
    function show() {
      wantShow = true;
      if (shown || cookieBannerOpen()) { return; }
      shown = true;
      requestAnimationFrame(function () { pop.classList.add('pp-in'); });
    }
    function hide() {
      pop.classList.remove('pp-in');
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
      setTimeout(function () { if (pop.parentNode) { pop.parentNode.removeChild(pop); } }, 600);
    }

    pop.querySelector('.pp-app-close').addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation(); hide();
    });

    function onScroll() {
      if ((window.scrollY || window.pageYOffset) > SCROLL_TRIGGER) {
        window.removeEventListener('scroll', onScroll);
        show();
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(show, TIME_TRIGGER);

    // When the visitor answers the cookie banner, show the popup if it was waiting
    var cb = document.getElementById('pp-cookie-banner');
    if (cb && window.MutationObserver) {
      new MutationObserver(function () {
        if (wantShow && !cookieBannerOpen()) { setTimeout(show, 800); }
      }).observe(cb, { attributes: true, attributeFilter: ['class'] });
    }
  });
})();
