// The JSON lives under the `chamber/data` folder. Since this script runs
// on `chamber/directory.html`, use a relative path from that page.
const url = './data/members.json';
const cards = document.querySelector('#cards');

async function getMemberData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    displayMembers(data);
  } catch (err) {
    console.error('Erro ao carregar membros:', err);
    if (cards) cards.textContent = 'Não foi possível carregar o diretório.';
  }
}

function displayMembers(members) {
  if (!cards) return console.warn('#cards container não encontrado');
  cards.innerHTML = '';

  if (!Array.isArray(members) || members.length === 0) {
    cards.textContent = 'Nenhum membro encontrado.';
    return;
  }

  members.forEach(member => {
    const card = document.createElement('section');
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

    image.src = member.image || '';
    image.alt = `Photo of ${member.name || ''}`;
    image.loading = 'lazy';
    image.setAttribute('width', '200px')

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(hours);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);
    cards.appendChild(card);
  });
}

// Start
getMemberData();

const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("article");

// The following code could be written cleaner. How? We may have to simplfiy our HTMl and think about a default view.

gridbutton.addEventListener("click", () => {
	// example using arrow function
	display.classList.add("grid");
	display.classList.remove("list");
});

listbutton.addEventListener("click", showList); // example using defined function

function showList() {
	display.classList.add("list");
	display.classList.remove("grid");
}