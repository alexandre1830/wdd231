/**
 * storage.js — Local Storage utilities
 * Persists user preferences and wishlist
 */

const KEYS = {
  PREFERENCES: 'brownie_preferences',
  WISHLIST:    'brownie_wishlist',
  LAST_FILTER: 'brownie_last_filter',
};

// --- Preferences ---

export function savePreference(key, value) {
  try {
    const prefs = getPreferences();
    prefs[key] = value;
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.warn('Storage unavailable:', err);
  }
}

export function getPreference(key, defaultValue = null) {
  try {
    const prefs = getPreferences();
    return key in prefs ? prefs[key] : defaultValue;
  } catch {
    return defaultValue;
  }
}

function getPreferences() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PREFERENCES) || '{}');
  } catch {
    return {};
  }
}

// --- Wishlist ---

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.WISHLIST) || '[]');
  } catch {
    return [];
  }
}

export function toggleWishlist(productId) {
  const list = getWishlist();
  const idx  = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
  } else {
    list.splice(idx, 1);
  }
  try {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(list));
  } catch (err) {
    console.warn('Storage unavailable:', err);
  }
  return list.includes(productId);
}

export function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

// --- Last filter ---

export function saveLastFilter(filter) {
  try {
    localStorage.setItem(KEYS.LAST_FILTER, filter);
  } catch (err) {
    console.warn('Storage unavailable:', err);
  }
}

export function getLastFilter() {
  try {
    return localStorage.getItem(KEYS.LAST_FILTER) || 'Todos';
  } catch {
    return 'Todos';
  }
}
