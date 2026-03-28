const SPOTLIGHTS_JSON = './data/members.json';
const container = document.querySelector('#displaySpotlights') || document.querySelector('#spotlights-cards');

const membershipMap = {
    '3': 'Gold',
    '2': 'Silver',
    '1': 'Bronze'
};

async function getSpotlights() {
    try {
        const response = await fetch(SPOTLIGHTS_JSON);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        displaySpotlights(data);

    } catch (error) {
        console.error('Error loading spotlights:', error);
        if (container) container.textContent = 'Spotlights unavailable.';
    }
}

function displaySpotlights(members) {
    if (!container) return console.warn('No spotlight container found (expected #displaySpotlights)');
    if (!Array.isArray(members) || members.length === 0) {
        container.textContent = 'No spotlights available.';
        return;
    }

    // Filter: choose members with membership-level 3 (Gold) or 2 (Silver)
    const qualified = members.filter(m => {
        const lvl = String(m['membership-level'] || '');
        return lvl === '3' || lvl === '2';
    });

    // Shuffle and pick 2 or 3
    const shuffled = qualified.sort(() => 0.5 - Math.random());
    const count = Math.random() < 0.5 ? 2 : 3;
    const selected = shuffled.slice(0, count);

    container.innerHTML = '';

    selected.forEach(member => {
        const card = document.createElement('section');
        card.classList.add('spotlight-card');

        const level = membershipMap[String(member['membership-level'] || '')] || 'Member';

        // Build inner HTML using fields that exist in members.json
        card.innerHTML = `
            <h3>${member.name || 'Unnamed'}</h3>
            <p class="tagline">${member.website || ''}</p>
            <div class="spotlight-content">
                <img src="${member.image || ''}" alt="${member.name || ''} logo" loading="lazy">
                <div class="info">
                    <p><strong>PHONE:</strong> ${member.phone || 'N/A'}</p>
                    <p><strong>ADDRESS:</strong> ${member.address || 'N/A'}</p>
                    <p><strong>URL:</strong> <a href="https://${member.website || ''}" target="_blank" rel="noopener">${member.website || 'N/A'}</a></p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

getSpotlights();