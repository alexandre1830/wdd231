/**
 * products.js — Products page module
 * Fetches data, renders cards, handles filtering and modal
 */

import { saveLastFilter, getLastFilter, toggleWishlist, isWishlisted } from './storage.js';

let allProducts = [];
let activeFilter = 'Todos';

// --- Bootstrap ---

export async function initProducts() {
  activeFilter = getLastFilter();
  await loadProducts();
  initModal();
  initFilterButtons();
}

// --- Data Fetching ---

async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = `<div class="products-loading">
    <div class="spinner" role="status" aria-label="Carregando produtos..."></div>
    <p>Carregando nossos brownies...</p>
  </div>`;

  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    allProducts = await response.json();
    renderProducts(filterProducts(allProducts, activeFilter));
    syncFilterButtons();
  } catch (err) {
    console.error('Error loading products:', err);
    grid.innerHTML = `<div class="products-error">
      <p style="font-size:2rem;margin-bottom:12px">😕</p>
      <h3>Ops! Não conseguimos carregar os produtos.</h3>
      <p>Por favor, tente novamente em alguns instantes.</p>
    </div>`;
  }
}

// --- Filtering ---

function filterProducts(products, category) {
  if (category === 'Todos') return products;
  return products.filter(p => p.category === category);
}

function initFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter || 'Todos';
      saveLastFilter(activeFilter);
      syncFilterButtons();
      const filtered = filterProducts(allProducts, activeFilter);
      renderProducts(filtered);
    });
  });
}

function syncFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = (btn.dataset.filter || 'Todos') === activeFilter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive.toString());
  });
}

// --- Rendering ---

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="no-results">
      <h3>Nenhum produto encontrado</h3>
      <p>Tente outra categoria.</p>
    </div>`;
    return;
  }

  grid.innerHTML = products
    .map((product, idx) => buildCardHTML(product, idx))
    .join('');

  // Attach card click events
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      const product = allProducts.find(p => p.id === id);
      if (product) openModal(product);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function buildCardHTML(product, idx) {
  const minPrice = Math.min(...product.sizes.map(s => s.price));
  const wishlisted = isWishlisted(product.id);
  const delay = (idx % 6) * 0.07;

  const badges = [
    product.isPopular ? '<span class="badge badge--popular">⭐ Popular</span>' : '',
    product.isNew     ? '<span class="badge badge--new">Novidade</span>' : '',
  ].filter(Boolean).join('');

  return `
    <article
      class="product-card"
      data-id="${product.id}"
      tabindex="0"
      role="button"
      aria-label="Ver detalhes de ${escapeHtml(product.name)}"
      style="animation-delay:${delay}s"
    >
      <div class="card-image-wrap">
        <img
          src="${escapeHtml(product.image)}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          width="600"
          height="450"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22450%22><rect width=%22600%22 height=%22450%22 fill=%22%23e8f0d8%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%233f5d16%22 font-size=%2248%22>🍫</text></svg>'"
        >
        ${badges ? `<div class="card-badges">${badges}</div>` : ''}
      </div>
      <div class="card-body">
        <p class="card-category">${escapeHtml(product.category)}</p>
        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <p class="card-ref">"${escapeHtml(product.friendsRef)}"</p>
        <p class="card-desc">${escapeHtml(product.description)}</p>
      </div>
      <div class="card-footer">
        <div class="card-price">
          <span class="card-price-label">A partir de</span>
          R$ ${minPrice.toFixed(2).replace('.', ',')}
        </div>
        <span class="card-btn">Ver detalhes</span>
      </div>
    </article>`;
}

// --- Modal ---

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close button
  document.getElementById('modal-close')?.addEventListener('click', closeModal);

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

function openModal(product) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  // Populate modal content
  const img = overlay.querySelector('#modal-img');
  if (img) {
    img.src = product.image;
    img.alt = product.name;
    img.onerror = function() {
      this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="780" height="341"><rect width="780" height="341" fill="%23e8f0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%233f5d16" font-size="64">🍫</text></svg>';
    };
  }

  setModalText('modal-title',    product.name);
  setModalText('modal-category', product.category);
  setModalText('modal-ref',      `"${product.friendsRef}"`);
  setModalText('modal-desc',     product.description);

  // Ingredients
  const ingWrap = overlay.querySelector('#modal-ingredients');
  if (ingWrap) {
    ingWrap.innerHTML = product.ingredients
      .map(i => `<span class="ingredient-tag">${escapeHtml(i)}</span>`)
      .join('');
  }

  // Sizes
  const sizesWrap = overlay.querySelector('#modal-sizes');
  if (sizesWrap) {
    sizesWrap.innerHTML = product.sizes
      .map(s => `
        <div class="size-item">
          <div>
            <span class="size-label">${escapeHtml(s.label)}</span>
            <br><span class="size-weight">${escapeHtml(s.weight)}</span>
          </div>
          <span class="size-price">R$ ${s.price.toFixed(2).replace('.', ',')}</span>
        </div>`)
      .join('');
  }

  // Allergens
  const allergenWrap = overlay.querySelector('#modal-allergens');
  if (allergenWrap) {
    allergenWrap.innerHTML = product.allergens
      .map(a => `<span class="allergen-tag">⚠ ${escapeHtml(a)}</span>`)
      .join('');
  }

  // Badges
  const badgeWrap = overlay.querySelector('#modal-badges');
  if (badgeWrap) {
    badgeWrap.innerHTML = [
      product.isPopular ? '<span class="badge badge--popular">⭐ Popular</span>' : '',
      product.isNew     ? '<span class="badge badge--new">Novidade</span>'       : '',
    ].filter(Boolean).join('');
  }

  // Wishlist button state
  updateWishlistBtn(product.id);

  const wishBtn = overlay.querySelector('#modal-wishlist');
  wishBtn?.removeEventListener('click', wishBtn._handler);
  wishBtn._handler = () => {
    const isNow = toggleWishlist(product.id);
    updateWishlistBtn(product.id);
    wishBtn.textContent = isNow ? '❤️ Nos favoritos!' : '🤍 Adicionar aos favoritos';
  };
  wishBtn?.addEventListener('click', wishBtn._handler);

  // Open
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus management
  setTimeout(() => {
    overlay.querySelector('#modal-close')?.focus();
  }, 100);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay?.classList.remove('open');
  overlay?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateWishlistBtn(productId) {
  const btn = document.getElementById('modal-wishlist');
  if (!btn) return;
  const wishlisted = isWishlisted(productId);
  btn.textContent = wishlisted ? '❤️ Nos favoritos!' : '🤍 Adicionar aos favoritos';
  btn.style.color = wishlisted ? 'var(--friends-red)' : '';
}

// --- Utilities ---

function setModalText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
