# Pizzeria Castello — static site

Modern, hand-rolled alternative to https://pizzeria-castello.com/?lang=de.
No build step, no framework, no dependencies. Open `index.html` directly or
serve the folder with any static server.

## Local preview

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

## Deploy

Drop the whole folder onto any static host (Netlify, Vercel, Cloudflare Pages,
GitHub Pages, plain Nginx). No build command. Make sure `speisekarte.pdf`
ships alongside `index.html`.

## File map

```
index.html              — single-page layout, all sections, data-i18n attrs
assets/css/styles.css   — theme tokens + layout (warm rustic Italian)
assets/js/i18n.js       — DE/EN strings + applyLang() + lang toggle
assets/js/menu.js       — full menu data + render functions
assets/js/main.js       — header scroll state, mobile nav, scroll-spy
speisekarte.pdf         — original menu PDF, linked from the menu section
```

## Editing the menu

All dishes live in `assets/js/menu.js`. Each item is:

```js
{
  num: '1',
  name: { de: 'Margherita', en: 'Margherita' },
  desc: { de: 'Gouda, Tomatensauce', en: 'Gouda, tomato sauce' },
  allergens: [2, 3, 8],
  price: { sizes: [{ label: 'ø24', amount: 8.50 }, { label: 'ø30', amount: 10.00 }] },
  // or for single-price items:
  // price: { single: 4.50 },
}
```

Pizzas are stored as flat tuples in the `PIZZAS` array at the top of the file,
then mapped to the object form — easier to scan and edit by row.

## Editing copy / translations

Static strings (nav labels, headings, etc.) live in `assets/js/i18n.js`. Add a
new key to both `de` and `en` blocks and put `data-i18n="my.key"` on the
matching HTML element. Selected language is remembered in `localStorage`.

## Updating opening hours

Edit the `HOURS` array near the bottom of `assets/js/menu.js`. The "Jetzt
geöffnet / geschlossen" badge in the hero recomputes from the current time
and season (May–Oct = summer hours, Nov–Apr = winter hours).
