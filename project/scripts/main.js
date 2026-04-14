/**
 * main.js — Entry module
 * Bootstraps shared features on every page
 */

import { initNav } from './nav.js';

// --- Shared init (all pages) ---
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollRevealGlobal();
});

// --- Global scroll reveal for any page ---
function initScrollRevealGlobal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  revealEls.forEach(el => io.observe(el));
}
