import { attractions } from "../data/attractions.mjs";

// ─── Last-Visit Banner ───────────────────────────────────────────────────────
function showVisitMessage() {
  const banner = document.getElementById("visit-message");
  if (!banner) return;

  const STORAGE_KEY = "discoverLastVisit";
  const now = Date.now();
  const lastVisit = localStorage.getItem(STORAGE_KEY);

  if (!lastVisit) {
    banner.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((now - Number(lastVisit)) / msPerDay);

    if (days < 1) {
      banner.textContent = "Back so soon! Awesome!";
    } else {
      const label = days === 1 ? "day" : "days";
      banner.textContent = `You last visited ${days} ${label} ago.`;
    }
  }

  localStorage.setItem(STORAGE_KEY, String(now));
}

// ─── Render Cards ─────────────────────────────────────────────────────────────
function renderCards() {
  const grid = document.getElementById("discover-grid");
  if (!grid) return;

  attractions.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("discover-card");
    card.dataset.id = item.id;

    card.innerHTML = `
      <h2>${item.name}</h2>
      <figure>
        <img
          src="${item.image}"
          alt="${item.alt}"
          width="300"
          height="200"
          loading="lazy"
        >
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more-btn" aria-label="Learn more about ${item.name}">Learn More</button>
    `;

    grid.appendChild(card);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  showVisitMessage();
  renderCards();
});