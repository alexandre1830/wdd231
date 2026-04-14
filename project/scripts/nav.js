/**
 * nav.js — Navigation module
 * Handles hamburger menu, wayfinding, and scroll header
 */

export function initNav() {
  const header    = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // --- Scroll shadow ---
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Hamburger toggle ---
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // --- Close mobile nav on link click ---
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- Close on outside click ---
  document.addEventListener('click', (e) => {
    if (
      mobileNav?.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // --- Wayfinding: mark current page active ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
