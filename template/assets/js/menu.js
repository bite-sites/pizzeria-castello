const fmt = (amount) => amount.toLocaleString('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}) + ' EUR';

const MENU = [
  {
    id: 'starters',
    titleKey: 'cat.starters',
    items: [
      {
        num: '1',
        name: { de: 'Beispiel Vorspeise', en: 'Sample starter' },
        desc: { de: 'Kurzbeschreibung der Vorspeise.', en: 'Short starter description.' },
        allergens: [1],
        price: { single: 6.50 },
      },
    ],
  },
  {
    id: 'mains',
    titleKey: 'cat.mains',
    noteKey: 'note.mains',
    items: [
      {
        num: '10',
        name: { de: 'Beispiel Hauptgericht', en: 'Sample main course' },
        desc: { de: 'Mit Beilage und Sauce nach Wahl.', en: 'Served with side dish and sauce of choice.' },
        allergens: [2, 3],
        price: { sizes: [{ label: 'Klein', amount: 11.50 }, { label: 'Gross', amount: 14.50 }] },
      },
    ],
  },
  {
    id: 'drinks',
    titleKey: 'cat.drinks',
    groups: [
      {
        sub: { de: 'Alkoholfrei', en: 'Non-alcoholic' },
        items: [
          {
            name: { de: 'Hauslimonade', en: 'House lemonade' },
            desc: { de: 'Frisch zubereitet', en: 'Freshly prepared' },
            price: { sizes: [{ label: '0,3L', amount: 3.90 }, { label: '0,5L', amount: 5.20 }] },
          },
        ],
      },
    ],
  },
];

const HOURS = [
  { dayKey: 'day.mon', winter: '11:30 - 21:30', summer: '11:30 - 22:00', dow: 1 },
  { dayKey: 'day.tue', winter: '11:30 - 21:30', summer: '11:30 - 22:00', dow: 2 },
  { dayKey: 'day.wed', winter: '11:30 - 21:30', summer: '11:30 - 22:00', dow: 3 },
  { dayKey: 'day.thu', winter: '11:30 - 21:30', summer: '11:30 - 22:00', dow: 4 },
  { dayKey: 'day.fri', winter: '11:30 - 22:00', summer: '11:30 - 22:30', dow: 5 },
  { dayKey: 'day.sat', winter: '12:00 - 22:00', summer: '12:00 - 22:30', dow: 6 },
  { dayKey: 'day.sun', winter: '12:00 - 21:30', summer: '12:00 - 22:00', dow: 0 },
];

const CATERING = [
  {
    name: { de: 'Buffet Small', en: 'Buffet Small' },
    desc: { de: 'Ideal fur 10-15 Personen', en: 'Ideal for 10-15 guests' },
    price: { single: 169.00 },
  },
  {
    name: { de: 'Buffet Large', en: 'Buffet Large' },
    desc: { de: 'Ideal fur 20-30 Personen', en: 'Ideal for 20-30 guests' },
    price: { single: 299.00 },
  },
];

function priceHtml(price) {
  if (!price) return '';

  if (price.sizes) {
    return price.sizes.map((size) =>
      `<span class="row"><em>${escapeHtml(size.label)}</em>${fmt(size.amount)}</span>`
    ).join('');
  }

  if (price.single == null) return '<span class="single">-</span>';
  return `<span class="single">${fmt(price.single)}</span>`;
}

function itemHtml(item, lang) {
  const name = item.name?.[lang] || item.name?.de || '';
  const desc = item.desc?.[lang] || item.desc?.de || '';
  const allergens = (item.allergens || []).map((value) => `<span>${value}</span>`).join('');
  const num = item.num ? `<span class="num">${escapeHtml(item.num)}.</span>` : '<span class="num"></span>';

  return `
    <article class="menu-item">
      ${num}
      <h4 class="name">
        ${escapeHtml(name)}
        ${allergens ? `<span class="allergens" aria-label="Allergens">${allergens}</span>` : ''}
      </h4>
      <div class="price">${priceHtml(item.price)}</div>
      ${desc ? `<p class="desc">${escapeHtml(desc)}</p>` : ''}
    </article>
  `;
}

function categoryHtml(category, lang) {
  const title = t(category.titleKey, lang);
  const note = category.noteKey ? `<p class="cat-note">${t(category.noteKey, lang)}</p>` : '';

  let body = '';
  if (category.groups) {
    body = category.groups.map((group) => `
      <div class="menu-subgroup">
        <h4 class="subgroup-title">${escapeHtml(group.sub[lang] || group.sub.de)}</h4>
        <div class="menu-grid">
          ${group.items.map((item) => itemHtml(item, lang)).join('')}
        </div>
      </div>
    `).join('');
  } else {
    body = `<div class="menu-grid">${category.items.map((item) => itemHtml(item, lang)).join('')}</div>`;
  }

  return `
    <section class="menu-cat" id="cat-${category.id}" data-cat="${category.id}">
      <header class="menu-cat-head">
        <h3>${escapeHtml(title)}</h3>
        ${note}
      </header>
      ${body}
    </section>
  `;
}

function renderMenu(lang) {
  const root = document.getElementById('menuRoot');
  const tabs = document.getElementById('menuTabs');
  if (!root || !tabs) return;

  root.innerHTML = MENU.map((category) => categoryHtml(category, lang)).join('');
  tabs.innerHTML = MENU.map((category) =>
    `<button data-target="cat-${category.id}">${escapeHtml(t(category.titleKey, lang))}</button>`
  ).join('');

  bindTabs();
}

function bindTabs() {
  document.querySelectorAll('#menuTabs button').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      const tabsHeight = document.getElementById('menuTabs')?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - tabsHeight - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

function renderHours(lang) {
  const body = document.getElementById('hoursBody');
  if (!body) return;

  const today = new Date().getDay();
  body.innerHTML = HOURS.map((entry) => `
    <tr class="${entry.dow === today ? 'is-today' : ''}">
      <td>${escapeHtml(t(entry.dayKey, lang))}</td>
      <td>${entry.winter}</td>
      <td>${entry.summer}</td>
    </tr>
  `).join('');
}

function renderCatering(lang) {
  const list = document.getElementById('cateringList');
  if (!list) return;

  list.innerHTML = CATERING.map((entry) => `
    <li>
      <span class="name">${escapeHtml(entry.name[lang] || entry.name.de)}</span>
      <span class="price">${fmt(entry.price.single)}</span>
      <p class="desc">${escapeHtml(entry.desc[lang] || entry.desc.de)}</p>
    </li>
  `).join('');
}

function isSummerSeason(date = new Date()) {
  const month = date.getMonth();
  return month >= 4 && month <= 9;
}

function updateOpenBadge(lang) {
  const badge = document.getElementById('openBadge');
  if (!badge) return;

  const now = new Date();
  const day = now.getDay();
  const schedule = HOURS.find((entry) => entry.dow === day);
  if (!schedule) return;

  const range = isSummerSeason(now) ? schedule.summer : schedule.winter;
  const [openText, closeText] = range.split(' - ');
  const [openHour, openMinute] = openText.split(':').map(Number);
  const [closeHour, closeMinute] = closeText.split(':').map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  const isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  badge.textContent = isOpen ? t('hours.open', lang) : t('hours.closed', lang);
  badge.classList.toggle('is-open', isOpen);
  badge.classList.toggle('is-closed', !isOpen);
}

function renderAllergenLegend(lang) {
  const list = document.getElementById('allergenLegend');
  if (!list) return;

  const entries = ALLERGEN_LEGEND[lang] || ALLERGEN_LEGEND.de;
  list.innerHTML = entries.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char];
  });
}
