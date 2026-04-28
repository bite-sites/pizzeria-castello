/* ==========================================================================
   App init: header scroll state, mobile nav, scroll-spy on menu tabs
   Plus open-now badge tick-tock and footer year stamp.
   ========================================================================== */

(function init() {
  document.getElementById('year').textContent = new Date().getFullYear();

  initLangToggle();
  applyLang(getInitialLang());

  initHeaderScroll();
  initMobileNav();
  initSectionSpy();
  initMenuScrollSpy();

  /* Refresh "open now" badge once a minute. */
  setInterval(() => updateOpenBadge(document.documentElement.lang || 'de'), 60_000);
})();

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.getElementById('primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* Top-level nav: highlight current section while scrolling. */
function initSectionSpy() {
  const links = document.querySelectorAll('.primary-nav a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = map.get(e.target);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((_link, sec) => io.observe(sec));
}

/* Menu category tabs: highlight active tab as you scroll through categories. */
function initMenuScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  let cats = []; let tabBtns = [];
  const refresh = () => {
    cats    = Array.from(document.querySelectorAll('.menu-cat'));
    tabBtns = Array.from(document.querySelectorAll('#menuTabs button'));
  };
  refresh();
  /* renderMenu rebuilds the DOM on language switch — re-read on each tick. */
  const io = new IntersectionObserver(entries => {
    refresh();
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      tabBtns.forEach(b => b.classList.toggle('is-active', b.dataset.target === id));
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  /* Observe whatever exists now and set up a MutationObserver for re-renders. */
  const observeAll = () => {
    refresh();
    cats.forEach(c => io.observe(c));
  };
  observeAll();
  const mo = new MutationObserver(() => {
    io.disconnect();
    observeAll();
  });
  const root = document.getElementById('menuRoot');
  if (root) mo.observe(root, { childList: true });
}
