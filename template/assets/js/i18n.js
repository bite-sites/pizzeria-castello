const I18N = {
  de: {
    'nav.menu': 'Speisekarte',
    'nav.hours': 'Offnungszeiten',
    'nav.catering': 'Catering',
    'nav.contact': 'Kontakt',

    'hero.eyebrow': 'Konzept zuerst',
    'hero.sub': 'Dieser Starter teilt nur Dateinamen und Datenstruktur. Design und Ton sollen pro Restaurant neu gedacht werden.',
    'hero.cta1': 'Reservierungen starten',
    'hero.cta2': 'Menudaten ansehen',
    'hero.address': 'Musterstrasse 1, 00000 Stadt',

    'about.title': 'Positionierung',
    'about.p1': 'Beschreibe hier in drei Satzen, was dieses Restaurant besonders macht.',
    'about.p2': 'Erwahne Stil, Service und Kernprodukte statt austauschbarer Begrussung.',
    'about.sig': 'Notiz aus dem Blueprint',

    'menu.eyebrow': 'Datengesteuerte Karte',
    'menu.title': 'Speisekarte',
    'menu.sub': 'Schema bleibt gleich, Darstellung wird je Restaurant neu gebaut.',
    'menu.allergens': 'Allergeninformationen auf Anfrage.',
    'menu.legendToggle': 'Allergen-Legende anzeigen',

    'cat.starters': 'Vorspeisen',
    'cat.mains': 'Hauptgerichte',
    'cat.drinks': 'Getranke',
    'note.mains': 'Optionaler Hinweis zu Grossen oder Beilagen.',

    'price.from': 'ab',

    'hours.eyebrow': 'Betriebsrhythmus',
    'hours.title': 'Offnungszeiten',
    'hours.sub': 'Nutze Sommer/Winter oder ersetze durch ein anderes Zeitmodell.',
    'hours.day': 'Tag',
    'hours.winter': 'Winter',
    'hours.summer': 'Sommer',
    'hours.open': 'Jetzt geoffnet',
    'hours.closed': 'Jetzt geschlossen',
    'day.mon': 'Montag',
    'day.tue': 'Dienstag',
    'day.wed': 'Mittwoch',
    'day.thu': 'Donnerstag',
    'day.fri': 'Freitag',
    'day.sat': 'Samstag',
    'day.sun': 'Sonntag',

    'catering.eyebrow': 'Zusatzumsatz',
    'catering.title': 'Catering',
    'catering.p1': 'Beschreibe Event-Setup, Vorlaufzeit und Anfrageweg.',
    'catering.p2': 'Falls kein Catering angeboten wird, Abschnitt konsequent entfernen.',
    'catering.cta': 'Jetzt anfragen',

    'contact.eyebrow': 'Ort und Kanale',
    'contact.title': 'Kontakt und Anfahrt',
    'contact.addressLabel': 'Adresse',
    'contact.phoneLabel': 'Telefon',
    'contact.emailLabel': 'E-Mail',
    'contact.socialLabel': 'Social',

    'footer.tagline': 'Design-neutraler Starter',
    'footer.imprint': 'Impressum',
    'footer.owner': 'Inhaber:',
    'footer.vat': 'USt-IdNr.:',
    'footer.kontaktTitle': 'Kontakt',
  },
  en: {
    'nav.menu': 'Menu',
    'nav.hours': 'Hours',
    'nav.catering': 'Catering',
    'nav.contact': 'Contact',

    'hero.eyebrow': 'Concept first',
    'hero.sub': 'This starter shares file names and data schema only. Visual identity should be rebuilt per restaurant.',
    'hero.cta1': 'Start reservations',
    'hero.cta2': 'Inspect menu data',
    'hero.address': 'Example Street 1, 00000 City',

    'about.title': 'Positioning',
    'about.p1': 'Use this section to define what makes the concept distinct.',
    'about.p2': 'Write about service tone, product focus, and audience fit.',
    'about.sig': 'Blueprint note',

    'menu.eyebrow': 'Data-driven menu',
    'menu.title': 'Menu',
    'menu.sub': 'Keep schema compatibility, redesign presentation per brand.',
    'menu.allergens': 'Allergen details available on request.',
    'menu.legendToggle': 'Show allergen legend',

    'cat.starters': 'Starters',
    'cat.mains': 'Mains',
    'cat.drinks': 'Drinks',
    'note.mains': 'Optional note for sizes or side dishes.',

    'price.from': 'from',

    'hours.eyebrow': 'Operating rhythm',
    'hours.title': 'Opening hours',
    'hours.sub': 'Use seasonal split or replace with a schedule that fits the concept.',
    'hours.day': 'Day',
    'hours.winter': 'Winter',
    'hours.summer': 'Summer',
    'hours.open': 'Open now',
    'hours.closed': 'Closed now',
    'day.mon': 'Monday',
    'day.tue': 'Tuesday',
    'day.wed': 'Wednesday',
    'day.thu': 'Thursday',
    'day.fri': 'Friday',
    'day.sat': 'Saturday',
    'day.sun': 'Sunday',

    'catering.eyebrow': 'Revenue extension',
    'catering.title': 'Catering',
    'catering.p1': 'Describe event format, lead times, and inquiry workflow.',
    'catering.p2': 'If catering is not offered, remove this section entirely.',
    'catering.cta': 'Request now',

    'contact.eyebrow': 'Location and channels',
    'contact.title': 'Contact and directions',
    'contact.addressLabel': 'Address',
    'contact.phoneLabel': 'Phone',
    'contact.emailLabel': 'Email',
    'contact.socialLabel': 'Social',

    'footer.tagline': 'Design-neutral starter',
    'footer.imprint': 'Imprint',
    'footer.owner': 'Owner:',
    'footer.vat': 'VAT ID:',
    'footer.kontaktTitle': 'Contact',
  },
};

const ALLERGEN_LEGEND = {
  de: [
    'Mit Farbstoff',
    'Mit Konservierungsstoff',
    'Mit Antioxidationsmitteln',
  ],
  en: [
    'With colouring',
    'With preservatives',
    'With antioxidants',
  ],
};

function t(key, lang) {
  const selected = I18N[lang] || I18N.de;
  return selected[key] ?? I18N.de[key] ?? key;
}

function applyLang(lang) {
  if (!I18N[lang]) lang = 'de';
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });

  document.querySelectorAll('.lang-toggle button').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  try {
    localStorage.setItem('bite-template.lang', lang);
  } catch { }

  if (typeof renderMenu === 'function') renderMenu(lang);
  if (typeof renderHours === 'function') renderHours(lang);
  if (typeof renderCatering === 'function') renderCatering(lang);
  if (typeof renderAllergenLegend === 'function') renderAllergenLegend(lang);
  if (typeof updateOpenBadge === 'function') updateOpenBadge(lang);
}

function initLangToggle() {
  document.querySelectorAll('.lang-toggle button').forEach((button) => {
    button.addEventListener('click', () => applyLang(button.dataset.lang));
  });
}

function getInitialLang() {
  try {
    const saved = localStorage.getItem('bite-template.lang');
    if (saved && I18N[saved]) return saved;
  } catch { }

  const browserLang = (navigator.language || 'de').slice(0, 2).toLowerCase();
  return I18N[browserLang] ? browserLang : 'de';
}
