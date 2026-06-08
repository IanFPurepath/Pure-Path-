/* ─────────────────────────────────────────────────
   PurePath — app.js
   1. Scroll-reveal (IntersectionObserver)
   2. Microplastic Journey auto-cycle
───────────────────────────────────────────────── */

/* ══════════════════════════════════════════════
   1. SCROLL REVEAL
══════════════════════════════════════════════ */
(function () {
  function q(s)  { return document.querySelector(s); }
  function qa(s) { return [...document.querySelectorAll(s)]; }

  /* Mark element as hidden (reveal-ready) */
  function hide(el, isPill) {
    el.classList.add(isPill ? 'pp-reveal-pill' : 'pp-reveal');
  }

  /* Animate element into view */
  function show(el) {
    requestAnimationFrame(() => {
      el.classList.add('pp-visible');
      el.addEventListener('transitionend', function once() {
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', once);
      });
    });
  }

  /* Show element after `ms` delay */
  function showAfter(el, ms) {
    setTimeout(() => show(el), ms);
  }

  /* ── HERO: hide all, force reflow, then stagger reveals ── */
  const heroDefs = [
    { sel: '.disc',       delay: 80,   pill: false },
    { sel: '.kicker',     delay: 200,  pill: false },
    { sel: '.mega',       delay: 280,  pill: false },
    { sel: '.kicker-lg',  delay: 380,  pill: false },
    { sel: '.hero-sub',   delay: 460,  pill: false },
    { sel: '.cta-button',  delay: 580,  pill: false },
    { sel: '.hero-trust',  delay: 720,  pill: false },
    { sel: '.pill-tl',    delay: 160,  pill: true  },
    { sel: '.pill-tr',    delay: 280,  pill: true  },
    { sel: '.pill-ml',    delay: 420,  pill: true  },
    { sel: '.pill-mr',    delay: 540,  pill: true  },
    { sel: '.pill-bl',    delay: 680,  pill: true  },
    { sel: '.pill-br',    delay: 800,  pill: true  },
  ];

  // Step 1: hide all hero elements
  const heroEls = heroDefs.map(({ sel, pill }) => {
    const el = q(sel);
    if (el) hide(el, pill);
    return { el, pill, delay: heroDefs.find(d => d.sel === sel).delay };
  });

  // Step 2: single forced reflow so hidden state is painted
  void document.body.offsetHeight;

  // Step 3: stagger reveals
  heroDefs.forEach(({ sel, delay }) => {
    const el = q(sel);
    if (el) showAfter(el, delay);
  });

  /* ── SECTIONS: reveal on scroll ── */
  const sectionDefs = [
    {
      sel: '.vision',
      items: [
        { sel: '.section-label', delay: 0   },
        { sel: '.section-title', delay: 100 },
        { sel: '.section-sub',   delay: 200 },
        { sel: '.vision-image',  delay: 320 },
        { sel: '.ai-panel',      delay: 460 },
      ]
    },
    {
      sel: '.protocol',
      items: [
        { sel: '.section-title',          delay: 0   },
        { sel: '.section-sub',            delay: 120 },
        { sel: '.room-card:nth-child(1)', delay: 240 },
        { sel: '.room-card:nth-child(2)', delay: 380 },
        { sel: '.room-card:nth-child(3)', delay: 520 },
      ]
    },
    {
      sel: '.journey',
      items: [
        { sel: '.section-label',  delay: 0   },
        { sel: '.section-title',  delay: 100 },
        { sel: '.section-sub',    delay: 200 },
        { sel: '.journey-hint',   delay: 280 },
        { sel: '.journey-steps',  delay: 400 },
        { sel: '.journey-detail', delay: 560 },
      ]
    },
    {
      sel: '.science',
      items: [
        { sel: '.section-label',         delay: 0   },
        { sel: '.section-title',         delay: 100 },
        { sel: '.section-sub',           delay: 200 },
        { sel: '.stats-row',             delay: 300 },
        { sel: '.sci-card:nth-child(1)', delay: 420 },
        { sel: '.sci-card:nth-child(2)', delay: 540 },
        { sel: '.sci-card:nth-child(3)', delay: 660 },
        { sel: '.sci-card:nth-child(4)', delay: 780 },
        { sel: '.sci-badge',             delay: 880 },
      ]
    },
    {
      sel: '.dossier',
      items: [
        { sel: '.section-title', delay: 0   },
        { sel: '.phone-mockup',  delay: 200 },
        { sel: '.dossier-body',  delay: 360 },
      ]
    },
    {
      sel: '.testimonials',
      items: [
        { sel: '.section-label',       delay: 0   },
        { sel: '.section-title',       delay: 100 },
        { sel: '.section-sub',         delay: 200 },
        { sel: '.t-card:nth-child(1)', delay: 300 },
        { sel: '.t-card:nth-child(2)', delay: 400 },
        { sel: '.t-card:nth-child(3)', delay: 500 },
        { sel: '.t-card:nth-child(4)', delay: 600 },
        { sel: '.t-card:nth-child(5)', delay: 700 },
        { sel: '.t-card:nth-child(6)', delay: 800 },
      ]
    },
    {
      sel: '.final-cta',
      items: [
        { sel: '.section-label',    delay: 0   },
        { sel: '.final-title',      delay: 140 },
        { sel: '.final-sub',        delay: 260 },
        { sel: '.download-auditor', delay: 380 },
        { sel: '.store-buttons',    delay: 500 },
      ]
    },
  ];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      const def = sectionDefs.find(d => section.matches(d.sel));
      if (!def) return;

      // Collect valid elements
      const elDefs = def.items.map(({ sel, delay }) => ({
        el: section.querySelector(sel), delay
      })).filter(({ el }) => el && !el.classList.contains('pp-visible'));

      if (!elDefs.length) return;

      // Hide all at once
      elDefs.forEach(({ el }) => hide(el, false));

      // Force reflow so hidden state is painted before transition starts
      void section.offsetHeight;

      // Stagger shows
      elDefs.forEach(({ el, delay }) => showAfter(el, delay));

      observer.unobserve(section);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  sectionDefs.forEach(({ sel }) => {
    const sec = q(sel);
    if (sec) observer.observe(sec);
  });

})();


/* ══════════════════════════════════════════════
   2. MICROPLASTIC JOURNEY — auto-cycle
══════════════════════════════════════════════ */
(function () {
  const steps = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6"/></svg>',
      tag: "THE ORIGIN", title: "RAW FOSSIL FUELS",
      sub: "Extracted from petroleum & natural gas",
      desc: "Plastics begin as crude oil or natural gas. Refineries crack these into ethylene and propylene — the chemical building blocks of every synthetic polymer that will eventually touch your food, skin, and lungs.",
      stat: "99% OF PLASTICS ARE DERIVED FROM FOSSIL FUELS",
      accent: "#ff8a4c",
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
      tag: "MASS PRODUCTION", title: "INDUSTRIAL MANUFACTURING",
      sub: "Polymerized into consumer-grade plastics",
      desc: "Refined hydrocarbons are polymerized into PET, PVC, PTFE and a hundred other resins. Additives — plasticizers, flame retardants, stabilizers — bind to those chains and leach out for the rest of the product's life.",
      stat: "430 MILLION TONNES OF PLASTIC MANUFACTURED EACH YEAR",
      accent: "#22d3ee",
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1.5 12H6.5z"/><path d="M9 8V5a3 3 0 016 0v3"/></svg>',
      tag: "IN YOUR HOME", title: "CONSUMER PRODUCTS",
      sub: "Embedded in everything you touch daily",
      desc: "Cookware, packaging, textiles, furniture, personal care — synthetic polymers infiltrate every category of household goods. Heat, friction and time all accelerate the release of microscopic fragments.",
      stat: "AVERAGE HOME CONTAINS 7,000+ PLASTIC ITEMS",
      accent: "#22d3ee",
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4v6c0 5-4 8-8 8s-8-3-8-8V7l8-4z"/></svg>',
      tag: "BREAKING DOWN", title: "FRAGMENTATION",
      sub: "Plastics shed into invisible particles",
      desc: "UV light, abrasion and washing break macroplastics into micro- and nano-particles. These fragments are small enough to float in air, contaminate water, and absorb into food — undetectable without instrumentation.",
      stat: "10⁹ MICROPLASTIC PARTICLES IN 1L OF BOTTLED WATER",
      accent: "#22d3ee",
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M8 15c1.5 1.5 6.5 1.5 8 0"/></svg>',
      tag: "INSIDE YOU", title: "HUMAN INGESTION",
      sub: "Entering the body through food, water & air",
      desc: "We ingest microplastics through contaminated tap water, food cooked in degraded cookware, inhaled laundry vapours, and even the air inside our homes. Nano-plastics can cross the blood-brain barrier.",
      stat: "1.2 CREDIT CARDS WORTH OF PLASTIC INGESTED PER WEEK",
      accent: "#ff4d8d",
    },
  ];

  const CYCLE_MS = 3500, FADE_MS = 350;
  const jsteps   = document.querySelectorAll('.jstep');
  const detail   = document.getElementById('journey-detail');
  if (!jsteps.length || !detail) return;

  const els = {
    iconSvg: document.getElementById('jd-icon-svg'),
    stepOf:  document.getElementById('jd-step-of'),
    body:    document.getElementById('jd-body'),
    tag:     document.getElementById('jd-tag'),
    title:   document.getElementById('jd-title'),
    sub:     document.getElementById('jd-sub'),
    desc:    document.getElementById('jd-desc'),
    stat:    document.getElementById('jd-stat'),
    num:     document.getElementById('jd-num'),
  };

  let active = 0, timer = null;

  function render(idx) {
    const s = steps[idx];
    jsteps.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    detail.style.setProperty('--accent', s.accent);
    els.body.classList.add('is-leaving');
    setTimeout(() => {
      els.iconSvg.innerHTML = s.icon;
      els.stepOf.textContent = `STEP ${idx + 1} OF 5`;
      els.tag.textContent    = s.tag;
      els.title.textContent  = s.title;
      els.sub.textContent    = s.sub;
      els.desc.textContent   = s.desc;
      els.stat.textContent   = s.stat;
      els.num.textContent    = String(idx + 1);
      els.body.classList.remove('is-leaving');
      els.body.classList.add('is-entering');
      requestAnimationFrame(() => els.body.classList.remove('is-entering'));
    }, FADE_MS);
  }

  function go(idx) {
    active = (idx + steps.length) % steps.length;
    render(active);
    restartCycle();
  }

  function restartCycle() {
    clearInterval(timer);
    timer = setInterval(() => { active = (active + 1) % steps.length; render(active); }, CYCLE_MS);
  }

  jsteps.forEach((el, i) => el.addEventListener('click', () => go(i)));
  document.getElementById('jd-prev').addEventListener('click', () => go(active - 1));
  document.getElementById('jd-next').addEventListener('click', () => go(active + 1));
  render(0);
  restartCycle();
})();
