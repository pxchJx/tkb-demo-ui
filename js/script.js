// ============ MOBILE DRAWER ============
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawer = document.getElementById('closeDrawer');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
}
function closeDrawerFn() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
}
hamburgerBtn.addEventListener('click', openDrawer);
closeDrawer.addEventListener('click', closeDrawerFn);
drawerOverlay.addEventListener('click', closeDrawerFn);

// ============ HERO DOTS AUTO-ROTATE ============
const dots = document.querySelectorAll('.hero-dots .dot');
let dotIndex = 0;
setInterval(() => {
  dots[dotIndex].classList.remove('active');
  dotIndex = (dotIndex + 1) % dots.length;
  dots[dotIndex].classList.add('active');
}, 3500);

// ============ GAME DATA (placeholder demo content) ============
const GAME_ICONS = ['🎰', '🍒', '💎', '🃏', '🎲', '🐉', '👑', '🍀', '⭐', '🔔', '🦁', '🐯', '🍇', '🎯', '🥇'];
const PROVIDERS = ['Starforge', 'NovaPlay', 'RedTiger Labs', 'PixelWin', 'GoldenRock'];
const CATEGORIES = ['slots', 'live', 'table', 'jackpot'];
const CATEGORY_LABEL = { slots: 'Slots', live: 'Live Casino', table: 'Table Games', jackpot: 'Jackpot' };
const NAME_PARTS_A = ['Golden', 'Wild', 'Mystic', 'Royal', 'Fortune', 'Blazing', 'Crystal', 'Neon', 'Ancient', 'Diamond'];
const NAME_PARTS_B = ['Reels', 'Riches', 'Fortune', 'Vault', 'Strike', 'Empire', 'Quest', 'Rush', 'Kingdom', 'Odyssey'];

function generateGames(count) {
  const games = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const badgeRoll = Math.random();
    let badge = null;
    if (badgeRoll < 0.15) badge = 'hot';
    else if (badgeRoll < 0.3) badge = 'new';
    else if (category === 'jackpot') badge = 'jackpot';

    games.push({
      name: `${NAME_PARTS_A[Math.floor(Math.random() * NAME_PARTS_A.length)]} ${NAME_PARTS_B[Math.floor(Math.random() * NAME_PARTS_B.length)]}`,
      provider: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
      icon: GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)],
      category,
      badge
    });
  }
  return games;
}

let allGames = generateGames(20);
let visibleCount = 10;
let activeFilter = 'all';

const gameGrid = document.getElementById('gameGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const tabs = document.querySelectorAll('.tab');

function renderGames() {
  const filtered = activeFilter === 'all'
    ? allGames
    : allGames.filter(g => g.category === activeFilter);

  const toShow = filtered.slice(0, visibleCount);
  gameGrid.innerHTML = toShow.map(game => `
    <div class="game-card">
      <div class="game-thumb">
        ${game.badge ? `<span class="game-badge badge-${game.badge}">${game.badge.toUpperCase()}</span>` : ''}
        <span>${game.icon}</span>
        <div class="play-overlay"><span class="play-btn">▶</span></div>
      </div>
      <div class="game-info">
        <h4>${game.name}</h4>
        <span>${game.provider} · ${CATEGORY_LABEL[game.category]}</span>
      </div>
    </div>
  `).join('');

  loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    visibleCount = 10;
    renderGames();
  });
});

loadMoreBtn.addEventListener('click', () => {
  visibleCount += 10;
  if (visibleCount > allGames.length) {
    allGames = allGames.concat(generateGames(10));
  }
  renderGames();
});

renderGames();

// ============ JACKPOT TICKER ============
const jackpotEl = document.getElementById('jackpotAmount');
let jackpotValue = 1284502.17;
setInterval(() => {
  jackpotValue += Math.random() * 8;
  jackpotEl.textContent = '$' + jackpotValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}, 1200);
