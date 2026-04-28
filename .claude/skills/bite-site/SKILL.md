---
name: bite-site
description: Build a new restaurant static site from scratch and deploy it to the bite-sites GitHub org as a Pages site. Takes a restaurant URL or menu input, extracts the real business data, and builds a unique site. Share ONLY file names and rough JS data schema across projects; do NOT reuse HTML structure, CSS patterns, or visual language from other restaurants. Use whenever the user asks for a new restaurant site, a new bite-sites repo, or anything that should land at `https://bite-sites.github.io/<slug>/`.
---

# bite-site - unique-by-default restaurant workflow

## Non-negotiable rule

Every restaurant site must be unique.

Allowed reuse across restaurants:
- file names
- rough JavaScript data schema
- deployment workflow

Not allowed reuse across restaurants:
- HTML section structure/order/component hierarchy
- CSS architecture, tokens, spacing scale, effects, ornaments, or typography pairing
- copy blocks, hero treatment, nav treatment, cards, or section visual patterns
- cloning or lightly modifying a previous restaurant site

If a generated site resembles an earlier one, redesign before shipping.

## 1. Input collection

Collect one of:
- Existing restaurant website URL (and follow menu links such as PDF pages)
- Menu file/text plus business basics (name, address, phone, email, hours, socials)

Also collect:
- slug (`kebab-case`)
- language scope (`de`, `en`, or both)
- explicit brand constraints from user (if any)

## 2. Data extraction

Extract real business facts:
- Brand name and concept
- Address, phone(s), email, socials
- Owner and VAT ID if available/required
- Hours with seasonal split if present
- Menu items with categories, descriptions, prices, allergens
- Distinct vibe/cuisine cues

Never fabricate missing legal or contact data. Ask user when missing.

## 3. Shared contract: filenames + rough schema only

Use these file names in each restaurant repo:
- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/js/i18n.js`
- `assets/js/menu.js`

Keep rough data schema compatibility (shape may extend per project):

```js
// assets/js/menu.js
const MENU = [
  {
    id: 'category-id',
    titleKey: 'cat.example',
    noteKey: 'note.example', // optional
    items: [
      {
        num: '1', // optional
        name: { de: '...', en: '...' },
        desc: { de: '...', en: '...' }, // optional
        allergens: [1, 2], // optional
        price: { single: 9.5 } // or { sizes: [{ label: '...', amount: 9.5 }] }
      }
    ],
    groups: [ // optional subgroup form
      {
        sub: { de: '...', en: '...' },
        items: []
      }
    ]
  }
];

const HOURS = [
  { dayKey: 'day.mon', winter: '11:00 - 22:00', summer: '11:00 - 23:00', dow: 1 }
];

const CATERING = [
  {
    name: { de: '...', en: '...' },
    desc: { de: '...', en: '...' },
    price: { single: 100 }
  }
];
```

In `assets/js/i18n.js`, keep:
- `I18N` object for selected languages
- matching keys between language blocks
- helper behavior for language switching

You may add/remove keys and sections for each concept.

## 4. Design workflow (fresh every project)

Before coding, define and confirm with user:
- color direction
- typography pair
- hero concept
- ornament/shape language
- section strategy (which sections exist, order, and emphasis)

Then build from blank design intent. Do not mirror another restaurant site's layout.

## 5. Build guidance

- Reuse behavior-level logic where useful, but adapt markup/classes as needed.
- `assets/css/styles.css` should be authored per restaurant from scratch.
- Preserve accessibility and responsiveness.
- Keep mobile navigation and sticky offset behavior correct for the final structure.
- Ensure language switching updates both static copy and rendered menu content.

## 6. Deploy workflow

```bash
# In target repo
python3 -m http.server 8765
# smoke test in browser

git init
git symbolic-ref HEAD refs/heads/main
git add -A
git commit -m "Initial commit: <Brand> site"

# create and push repo (HTTPS if org/SAML requires)
# enable GitHub Pages from main / root
```

## 7. Final validation checklist

Before reporting done:
- Site looks visually distinct from all existing restaurant sites
- No inherited CSS token set or copied section composition
- File names and schema contract are respected
- Content matches source material
- Missing required business/legal fields are listed as TODOs
