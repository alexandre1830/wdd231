// The JSON lives under the `chamber/data` folder. Since this script runs
// on pages under /chamber, use a relative path from those pages.
const MEMBERS_JSON_URL = './data/members.json';
const cards = document.querySelector('#cards');

async function getMemberData() {
  try {
    const response = await fetch(MEMBERS_JSON_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    displayMembers(data);
  } catch (err) {
    console.error('Erro ao carregar membros:', err);
    if (cards) cards.textContent = 'Não foi possível carregar o diretório.';
  }
}

function makeHref(raw) {
  if (!raw) return '';
  // If user already provided protocol, return as-is, otherwise prefix https://
  return /^(https?:)?\/\//i.test(raw) ? raw : `https://${raw}`;
}

function displayMembers(members) {
  if (!cards) return console.warn('#cards container não encontrado');
  cards.innerHTML = '';

  if (!Array.isArray(members) || members.length === 0) {
    cards.textContent = 'Nenhum membro encontrado.';
    return;
  }

  members.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';

    const name = document.createElement('h2');
    const hours = document.createElement('p');
    const address = document.createElement('p');
    const phone = document.createElement('p');
    const website = document.createElement('a');
    const image = document.createElement('img');

    name.textContent = member.name || '';
    hours.textContent = member['opening-hours'] || '';
    address.textContent = member.address || '';
    phone.textContent = member.phone || '';

    website.textContent = member.website || '';
    website.href = makeHref(member.website || '');
    website.target = '_blank';
    website.rel = 'noopener';

    image.src = member.image || '';
    image.alt = `Photo of ${member.name || ''}`;
    image.loading = 'lazy';
    image.setAttribute('width', '200');

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(hours);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);
    cards.appendChild(card);
  });
}

// Only run fetch and UI wiring if the #cards container exists on this page
if (cards) {
  // Start
  getMemberData();

  // Optional view toggles (grid / list) — only attach if buttons exist
  const gridbutton = document.querySelector('#grid');
  const listbutton = document.querySelector('#list');
  const display = cards; // use the cards container as the display root

  if (gridbutton) {
    gridbutton.addEventListener('click', () => {
      display.classList.add('grid');
      display.classList.remove('list');
    });
  }

  if (listbutton) {
    listbutton.addEventListener('click', () => {
      display.classList.add('list');
      display.classList.remove('grid');
    });
  }

} else {
  console.info('members.js: #cards not present on this page — skipping members fetch.');
}