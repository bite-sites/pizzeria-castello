/* ==========================================================================
   Menu data + renderers
   Source: original Speisekarte PDF, "Neue Karte gültig ab März 2026"
   Schema:
     { id, num?, name: {de, en}, desc: {de, en}, allergens: [..], price }
     price: { sizes: [{label, amount}] }  OR  { single: amount }
   ========================================================================== */

const fmt = n => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const PIZZAS = [
  ['1',   'Margherita',         'Gouda, Tomatensauce',                                'Gouda, tomato sauce',                                          [],          8.50, 10.00],
  ['2',   'Salami',              'Salami',                                             'Salami',                                                       [2,3,8],     9.50, 11.50],
  ['3',   'Sucuk',               'Sucuk, Zwiebeln, Ei',                                'Sucuk, onions, egg',                                           [2,3,8],    11.50, 14.50],
  ['4',   'Prosciutto',          'Schinken',                                           'Ham',                                                          [2,3],       9.50, 11.50],
  ['5',   'Funghi',              'Champignons',                                        'Mushrooms',                                                    [],          9.50, 11.50],
  ['6',   'Tonno',               'Thunfisch',                                          'Tuna',                                                         [],         10.50, 12.50],
  ['7',   'Dernekamp',           'Salami, Schinken, Champignons',                      'Salami, ham, mushrooms',                                       [2,3,8],    11.00, 13.50],
  ['8',   'Fantasia',            'Lachs, Krabben, Meeresfrüchte, Oliven',              'Salmon, shrimps, seafood, olives',                             [5,6],      12.50, 15.50],
  ['9',   'Lachs Spezial',       'Räucherlachs, Spinat',                               'Smoked salmon, spinach',                                       [5],        11.50, 14.50],
  ['10',  'Aurora',              'Zucchini, Spinat, Schafskäse',                       'Zucchini, spinach, feta',                                      [],         11.00, 13.50],
  ['11',  'Münsterland',         'Schinken, Spargel, Ei',                              'Ham, asparagus, egg',                                          [2,3],      11.00, 13.50],
  ['12',  'Quattro Stagioni',    'Schinken, Salami, Paprika, Champignons',             'Ham, salami, bell peppers, mushrooms',                         [2,3],      11.50, 14.50],
  ['13',  'Vegetaria',           'Artischocken, Champignons, Paprika, Spargel',        'Artichokes, mushrooms, bell peppers, asparagus',               [],         11.50, 14.50],
  ['14',  'Pastore',             'Frische Tomaten, Schafskäse, Spinat',                'Fresh tomatoes, feta, spinach',                                [],         11.00, 13.50],
  ['15',  'Thunfisch Spezial',   'Thunfisch, Zwiebeln, milde Peperoni, Knoblauch',     'Tuna, onions, mild peppers, garlic',                           [2,3],      11.50, 14.50],
  ['16',  'Calzone',             'Schinken, Paprika, Champignons',                     'Ham, bell peppers, mushrooms',                                 [2,3],      11.00, 13.50],
  ['17',  'Calzone Spezial',     'Schinken, Thunfisch, Ananas, Champignons',           'Ham, tuna, pineapple, mushrooms',                              [2,3],      11.50, 14.50],
  ['18',  'Calzone di Mare',     'Meeresfrüchte, Krabben, Lachs, Knoblauch',           'Seafood, shrimps, salmon, garlic',                             [5],        12.50, 15.50],
  ['19',  'Aurita',              'Thunfisch, Champignons, Paprika, Knoblauch',         'Tuna, mushrooms, bell peppers, garlic',                        [],         11.50, 14.50],
  ['20',  'Castello',            'Spinat, Tomaten, Zwiebeln, Gambas, Knoblauch',       'Spinach, tomatoes, onions, prawns, garlic',                    [],         11.50, 14.50],
  ['21',  'Napoli',              'Sardellen, Oliven, Kapern, Knoblauch',               'Anchovies, olives, capers, garlic',                            [5,6],      12.50, 15.50],
  ['22',  'Krabben',             'Krabben, Knoblauch',                                 'Shrimps, garlic',                                              [],         11.50, 14.50],
  ['23',  'Frutti di Mare',      'Meeresfrüchte, Knoblauch',                           'Seafood, garlic',                                              [],         11.50, 14.50],
  ['24',  'Gyros',               'Gyros, Zwiebeln',                                    'Gyros, onions',                                                [2,3,8],    11.00, 13.50],
  ['25',  'Gyros Spezial',       'Gyros, Zwiebeln, Tomaten, Schafskäse',               'Gyros, onions, tomatoes, feta',                                [2,3,8],    12.00, 14.50],
  ['26',  'Josef',               'Gyros, Spargel, Brokkoli, Hollandaise',              'Gyros, asparagus, broccoli, hollandaise',                      [2,3,8],    12.00, 14.50],
  ['27',  'Milano',              'Metaxasauce, Lachs, Krabben, Zwiebeln',              'Metaxa sauce, salmon, shrimps, onions',                        [1,2,3,4,8],12.50, 15.50],
  ['28',  'Parma Spezial',       'Parmaschinken, Rucola, Tomaten, Parmesan',           'Parma ham, rocket, tomatoes, parmesan',                        [2,3],      12.00, 14.50],
  ['29',  'Pollo',               'Hähnchenfleisch, Napoli-Sahnesauce',                 'Chicken, Napoli cream sauce',                                  [2,3],      11.50, 14.50],
  ['30',  'Diabolo',             'Salami, scharfe & milde Peperoni, Paprika',          'Salami, hot & mild peppers, bell peppers',                     [2,3],      10.50, 13.50],
  ['31',  'Mediterran',          'Schafskäse, Tomaten, schwarze Oliven, Zwiebeln',     'Feta, tomatoes, black olives, onions',                         [5],        11.00, 13.50],
  ['32',  'Verde',               'Brokkoli, Champignons, Sahnesauce',                  'Broccoli, mushrooms, cream sauce',                             [],         11.00, 13.50],
  ['33',  'Hawaii',              'Schinken, Ananas',                                   'Ham, pineapple',                                               [2,3],      10.00, 12.50],
  ['34',  'Tonno e Cipolla',     'Thunfisch, Zwiebeln',                                'Tuna, onions',                                                 [],         11.00, 13.50],
  ['35',  'Calzone Greek',       'Gyros, Zwiebeln, Schafskäse, Oliven',                'Gyros, onions, feta, olives',                                  [2,3,5,8],  12.00, 14.50],
  ['36',  'La Bella',            'Artischocken, Thunfisch, Spargel, Kapern',           'Artichokes, tuna, asparagus, capers',                          [5],        12.00, 14.50],
  ['37',  'Fresh Pollo',         'Hähnchenfleisch, Spinat, Sahnesauce',                'Chicken, spinach, cream sauce',                                [2,3],      11.50, 14.50],
  ['38',  'Quattro Formaggi',    'Mozzarella, Gorgonzola, Gouda, Schafskäse',          'Mozzarella, gorgonzola, gouda, feta',                          [],         12.00, 14.50],
  ['39',  'Prosciutto Funghi',   'Schinken, Champignons',                              'Ham, mushrooms',                                               [2,3],      10.50, 12.50],
  ['391', 'Ajla',                'Thunfisch, Brokkoli, Paprika, Zwiebeln, Knoblauch',  'Tuna, broccoli, bell peppers, onions, garlic',                 [],         11.50, 14.50],
  ['392', 'Lia',                 'Brokkoli, Schinken, Hollandaise',                    'Broccoli, ham, hollandaise',                                   [2,3,8],    11.00, 13.50],
  ['393', 'Chicken',             'Hähnchenbruststreifen, Brokkoli, Mais, Hollandaise', 'Chicken breast strips, broccoli, corn, hollandaise',           [2,3,8],    11.50, 14.50],
  ['394', 'Pilates',             'Schinken, Champignons, Spinat, Ei',                  'Ham, mushrooms, spinach, egg',                                 [2,3],      11.50, 14.50],
  ['395', 'Bolognese',           'Bolognese, Zwiebeln',                                'Bolognese, onions',                                            [2,3,8],    11.50, 14.50],
  ['396', 'Sucuk Spezial',       'Sucuk, Schafskäse, Jalapenos, Hollandaise',          'Sucuk, feta, jalapeños, hollandaise',                          [2,3,8],    11.50, 14.50],
  ['397', 'Chicken Spezial',     'Hähnchenbruststreifen, Ananas, Jalapenos, Currysauce','Chicken breast strips, pineapple, jalapeños, curry sauce',    [1,2,3,4],  11.50, 14.50],
  ['398', 'Bistecca',            'Rindersteakstreifen, Paprika, Zwiebeln',             'Beef steak strips, bell peppers, onions',                      [],         12.50, 16.50],
  ['399', 'Nova',                'Spinat, Krabben, Meeresfrüchte, Thunfisch, Hollandaise','Spinach, shrimps, seafood, tuna, hollandaise',              [2,3,8],    12.50, 16.50],
  ['400', 'Roma',                'Thunfisch, Schinken, Salami, Zwiebeln, Paprika, Champignons','Tuna, ham, salami, onions, bell peppers, mushrooms',  [2,3,8],    12.50, 15.50],
  ['401', 'Gambas',              'Gambas, Thunfisch, Zwiebeln, Knoblauch',             'Prawns, tuna, onions, garlic',                                 [],         12.50, 15.50],
  ['402', 'Hollo',               'Brokkoli, Mais, Paprika, Hollandaise',               'Broccoli, corn, bell peppers, hollandaise',                    [2,3,8],    11.00, 13.50],
  ['403', 'Pastore Spezial',     'Räucherlachs, Hollandaise, Spinat, Schafskäse, frische Tomaten','Smoked salmon, hollandaise, spinach, feta, fresh tomatoes',[2,3,8],12.50, 15.50],
  ['404', 'BBQ',                 'Hähnchenbruststreifen, Zwiebeln, Mais, Paprika, BBQ-Sauce','Chicken breast strips, onions, corn, bell peppers, BBQ sauce',[2,3,8],11.50, 14.50],
  ['406', 'Royal',               'Gyros, Ananas, Zwiebeln, Hollandaise',               'Gyros, pineapple, onions, hollandaise',                        [2,3,8],    12.50, 15.50],
];

const pizzaItems = PIZZAS.map(([num, name, dDe, dEn, allergens, p1, p2]) => ({
  num,
  name: { de: name, en: name },
  desc: { de: dDe, en: dEn },
  allergens,
  price: { sizes: [{ label: 'ø24', amount: p1 }, { label: 'ø30', amount: p2 }] },
}));

const broetchen = [
  { num: '40',  name: { de: 'Pizzabrötchen',     en: 'Pizza rolls' },
    desc: { de: '6 Stück inkl. zwei Kräuterbutter', en: '6 pieces with two herb butters' },
    price: { single: 4.50 } },
  { num: '140', name: { de: 'Castello Brot',     en: 'Castello bread' },
    desc: { de: 'Knoblauchbrot, 6 Stück inkl. zwei Kräuterbutter', en: 'Garlic bread, 6 pieces with two herb butters' },
    price: { single: 6.50 } },
  { num: '142', name: { de: 'Gefüllte Brötchen', en: 'Stuffed rolls' },
    desc: { de: 'Mit Käse, einer Zutat nach Wahl und Castellosauce', en: 'With cheese, one topping of your choice and Castello sauce' },
    price: { single: 9.50 } },
];

const salate = [
  { num: '41',  name: { de: 'Gemischt',     en: 'Mixed' },
    desc: { de: 'Saisonsalat, Tomaten, Paprika, Zwiebeln, Gurken', en: 'Seasonal salad, tomatoes, bell peppers, onions, cucumber' },
    price: { single: 10.50 } },
  { num: '42',  name: { de: 'Krabben',      en: 'Shrimps' },
    desc: { de: 'Gemischter Salat mit Krabben in Knoblauchöl gebraten', en: 'Mixed salad with shrimps fried in garlic oil' },
    price: { single: 14.50 } },
  { num: '43',  name: { de: 'Thunfisch',    en: 'Tuna' },
    desc: { de: 'Gemischter Salat, Thunfisch, Käse, Ei', en: 'Mixed salad, tuna, cheese, egg' },
    price: { single: 14.50 } },
  { num: '44',  name: { de: 'Frutti di Mare', en: 'Frutti di Mare' },
    desc: { de: 'Gemischter Salat mit Meeresfrüchten in Knoblauchöl gebraten', en: 'Mixed salad with seafood fried in garlic oil' },
    price: { single: 14.50 } },
  { num: '45',  name: { de: 'Hähnchen',     en: 'Chicken' },
    desc: { de: 'Gemischter Salat, Mais, Hähnchenbruststreifen', en: 'Mixed salad, corn, chicken breast strips' },
    allergens: [2,3], price: { single: 14.50 } },
  { num: '46',  name: { de: 'Griechisch',   en: 'Greek' },
    desc: { de: 'Gemischter Salat, Schafskäse, Oliven, Peperoni', en: 'Mixed salad, feta, olives, peppers' },
    allergens: [5], price: { single: 13.50 } },
  { num: '47',  name: { de: 'Schinken',     en: 'Ham' },
    desc: { de: 'Gemischter Salat, Schinken, Käse, Ei', en: 'Mixed salad, ham, cheese, egg' },
    allergens: [2,3], price: { single: 13.50 } },
  { num: '48',  name: { de: 'Rucola',       en: 'Rocket' },
    desc: { de: 'Rucola, Cherrytomaten, Parmaschinken, Parmesan, Essig-Olivenöl-Dressing', en: 'Rocket, cherry tomatoes, Parma ham, parmesan, vinegar-olive oil dressing' },
    price: { single: 14.50 } },
  { num: '49',  name: { de: 'Salmone',      en: 'Salmone' },
    desc: { de: 'Gemischter Salat mit geräuchertem Lachs, Cherrytomaten und geschwenktem Brokkoli', en: 'Mixed salad with smoked salmon, cherry tomatoes and sautéed broccoli' },
    price: { single: 15.50 } },
  { num: '50',  name: { de: 'Castello',     en: 'Castello' },
    desc: { de: 'Gemischter Salat, Cherrytomaten, Rucola, Gambas', en: 'Mixed salad, cherry tomatoes, rocket, prawns' },
    price: { single: 15.50 } },
  { num: '150', name: { de: 'Di Manzo',     en: 'Di Manzo' },
    desc: { de: 'Gemischter Salat, Cherrytomaten, Rucola, Rindersteakstreifen', en: 'Mixed salad, cherry tomatoes, rocket, beef steak strips' },
    price: { single: 16.50 } },
  { num: '151', name: { de: 'Santorini',    en: 'Santorini' },
    desc: { de: 'Gemischter Salat, Schafskäse, Oliven, Zwiebeln, Gyros', en: 'Mixed salad, feta, olives, onions, gyros' },
    allergens: [2,3,5,8], price: { single: 15.00 } },
];

const pasta = [
  { num: '51',  name: { de: 'Napoli',         en: 'Napoli' },
    desc: { de: 'Tomatensauce', en: 'Tomato sauce' }, price: { single: 11.00 } },
  { num: '52',  name: { de: 'Bolognese',      en: 'Bolognese' },
    desc: { de: 'Rinderhack mit Tomatensauce', en: 'Ground beef with tomato sauce' }, price: { single: 13.50 } },
  { num: '521', name: { de: 'Scampi Spezial', en: 'Scampi Spezial' },
    desc: { de: 'Scampi, Zwiebeln, Knoblauch, Tomatensauce', en: 'Scampi, onions, garlic, tomato sauce' }, price: { single: 15.50 } },
  { num: '523', name: { de: 'Carbonara',      en: 'Carbonara' },
    desc: { de: 'Schinken, Ei, Sahnesauce', en: 'Ham, egg, cream sauce' }, allergens: [2,3], price: { single: 13.50 } },
  { num: '54',  name: { de: 'Hähnchen',       en: 'Chicken' },
    desc: { de: 'Hähnchen, Brokkoli, Champignons, Sahnesauce', en: 'Chicken, broccoli, mushrooms, cream sauce' }, allergens: [2,3], price: { single: 14.50 } },
  { num: '541', name: { de: 'Spinaci',        en: 'Spinaci' },
    desc: { de: 'Gorgonzola, Spinat, Sahnesauce', en: 'Gorgonzola, spinach, cream sauce' }, price: { single: 14.50 } },
  { num: '542', name: { de: 'Vegetaria',      en: 'Vegetaria' },
    desc: { de: 'Brokkoli, Champignons, Erbsen, Sahnesauce', en: 'Broccoli, mushrooms, peas, cream sauce' }, price: { single: 14.00 } },
  { num: '55',  name: { de: 'Scampi',         en: 'Scampi' },
    desc: { de: 'Scampi, Pesto-Sahnesauce', en: 'Scampi, pesto cream sauce' }, allergens: [1,2,3,4], price: { single: 15.50 } },
  { num: '56',  name: { de: 'Brokkoli',       en: 'Broccoli' },
    desc: { de: 'Brokkoli, Champignons, Sahne- oder Tomatensauce', en: 'Broccoli, mushrooms, cream or tomato sauce' }, price: { single: 13.50 } },
  { num: '59',  name: { de: 'Panna',          en: 'Panna' },
    desc: { de: 'Schinken, Sahnesauce', en: 'Ham, cream sauce' }, allergens: [2,3], price: { single: 12.50 } },
  { num: '591', name: { de: 'Tres',           en: 'Tres' },
    desc: { de: 'Spaghetti, Penne, Tortellini mit Schinken und Bolognesesauce (überbacken)', en: 'Spaghetti, penne, tortellini with ham and bolognese sauce (oven-baked)' }, price: { single: 14.50 } },
  { num: '593', name: { de: 'Rabbiata',       en: 'Rabbiata' },
    desc: { de: 'Gambas, Zucchini, Paprika, Zwiebeln, Cherrytomaten, Olivenöl, Tomatensauce', en: 'Prawns, zucchini, bell peppers, onions, cherry tomatoes, olive oil, tomato sauce' }, price: { single: 16.50 } },
  { num: '594', name: { de: 'Salmone',        en: 'Salmone' },
    desc: { de: 'Räucherlachs, Spinat, Knoblauch, Sahnesauce', en: 'Smoked salmon, spinach, garlic, cream sauce' }, price: { single: 16.50 } },
  { num: '595', name: { de: 'Manzo',          en: 'Manzo' },
    desc: { de: 'Rindersteakstreifen, Chili, Knoblauch, Zwiebeln, Tomatensauce', en: 'Beef steak strips, chili, garlic, onions, tomato sauce' }, price: { single: 16.50 } },
  { num: '596', name: { de: 'Curry',          en: 'Curry' },
    desc: { de: 'Hähnchenbruststreifen, Cherrytomaten, Curry-Sahnesauce', en: 'Chicken breast strips, cherry tomatoes, curry cream sauce' }, allergens: [2,3], price: { single: 15.00 } },
];

const gyros = [
  { num: '60', name: { de: 'Gyrosteller',   en: 'Gyros plate' },
    desc: { de: 'Hausgemachtes Gyros mit Zwiebeln und Tzatziki', en: 'Homemade gyros with onions and tzatziki' },
    allergens: [2,3,8,10], price: { single: 16.50 } },
  { num: '61', name: { de: 'Gyros Spezial', en: 'Gyros Spezial' },
    desc: { de: 'Hausgemachtes Gyros, Zwiebeln, Tomaten, Peperoni und Sahnesauce (überbacken)', en: 'Homemade gyros, onions, tomatoes, peppers and cream sauce (oven-baked)' },
    allergens: [1,2,3,4,8], price: { single: 18.50 } },
  { num: '62', name: { de: 'Gyros Metaxa',  en: 'Gyros Metaxa' },
    desc: { de: 'Hausgemachtes Gyros und Metaxasauce (überbacken)', en: 'Homemade gyros and Metaxa sauce (oven-baked)' },
    allergens: [1,2,3,4,8], price: { single: 18.50 } },
];

const schnitzel = [
  { num: '66', name: { de: 'Hawaii',        en: 'Hawaii' },
    desc: { de: 'Mit Schinken und Ananas (überbacken)', en: 'With ham and pineapple (oven-baked)' },
    allergens: [2,3], price: { single: 15.00 } },
  { num: '67', name: { de: 'Spargel',       en: 'Asparagus' },
    desc: { de: 'Mit Sahne-Hollandaisesauce', en: 'With cream-hollandaise sauce' },
    allergens: [2,3,8], price: { single: 14.50 } },
  { num: '68', name: { de: 'Champignon',    en: 'Mushroom' },
    desc: { de: 'Mit Champignonrahmensauce', en: 'With mushroom cream sauce' },
    allergens: [1,2,3,4], price: { single: 14.50 } },
  { num: '69', name: { de: 'Brokkoli',      en: 'Broccoli' },
    desc: { de: 'Mit Sahne-Hollandaisesauce', en: 'With cream-hollandaise sauce' },
    allergens: [2,3,8], price: { single: 14.50 } },
  { num: '70', name: { de: 'Wiener Art',    en: 'Vienna style' },
    desc: { de: 'Mit Zitrone', en: 'With lemon' }, price: { single: 12.50 } },
  { num: '71', name: { de: 'Zigeuner Art',  en: 'Paprika style' },
    desc: { de: 'Mit Zigeunersauce', en: 'With spicy paprika sauce' }, price: { single: 13.50 } },
  { num: '72', name: { de: 'Jäger Art',     en: "Hunter's style" },
    desc: { de: 'Mit Jägersauce', en: "With hunter's sauce" },
    allergens: [1,2,3,4], price: { single: 13.50 } },
  { num: '74', name: { de: 'Metaxa',        en: 'Metaxa' },
    desc: { de: 'Mit Metaxasauce', en: 'With Metaxa sauce' },
    allergens: [1,2,3,4,8], price: { single: 15.50 } },
];

const imbiss = [
  { num: '65', name: { de: 'Falafelteller',   en: 'Falafel platter' },
    desc: { de: 'Mit Tzatziki, Pommes und Beilagensalat', en: 'With tzatziki, fries and side salad' },
    allergens: [10], price: { single: 10.00 } },
  { num: '73', name: { de: 'Pommes',          en: 'Fries' },
    desc: { de: '', en: '' }, price: { single: 4.50 } },
  { num: '75', name: { de: 'Chicken Nuggets', en: 'Chicken nuggets' },
    desc: { de: 'Mit Pommes', en: 'With fries' },
    allergens: [1,2,3,4,8], price: { single: 8.50 } },
];

const saucen = [
  { name: { de: 'Mayo / Ketchup',     en: 'Mayo / Ketchup' },     allergens: [1,2,3,10,11], price: { single: 0.50 } },
  { name: { de: 'Castello',           en: 'Castello' },           allergens: [1,2,3,10,11], price: { single: 1.00 } },
  { name: { de: 'Tzatziki',           en: 'Tzatziki' },           allergens: [1,2,3,10,11], price: { single: 1.00 } },
  { name: { de: 'Jäger / Zigeuner',   en: 'Hunter / Paprika' },   allergens: [1,2,3,4],     price: { single: 1.00 } },
  { name: { de: 'Hollandaise',        en: 'Hollandaise' },        allergens: [2,3,8],       price: { single: 1.50 } },
  { name: { de: 'Kräuterbutter',      en: 'Herb butter' },                                  price: { single: 0.75 } },
];

/* Drinks — grouped by sub-section, rendered as one category with sub-headings. */
const getraenke = [
  { sub: { de: 'Alkoholfreie Getränke', en: 'Soft drinks' }, items: [
    { name: { de: 'Gerolsteiner', en: 'Gerolsteiner' },
      desc: { de: 'Still oder Sprudel', en: 'Still or sparkling' },
      price: { sizes: [{ label: '0,25L', amount: 2.90 }, { label: '0,75L', amount: 7.90 }] } },
    { name: { de: 'Säfte', en: 'Juices' },
      desc: { de: 'Apfel oder Orange', en: 'Apple or orange' },
      price: { sizes: [{ label: '0,2L', amount: 2.90 }, { label: '0,4L', amount: 4.90 }] } },
    { name: { de: 'Cola, Fanta, Sprite, Mezzo, Apfelschorle', en: 'Coke, Fanta, Sprite, Mezzo, apple spritzer' },
      desc: { de: 'Cola Classic, Light/Zero', en: 'Coke Classic, Light/Zero' },
      price: { sizes: [{ label: '0,2L', amount: 2.90 }, { label: '0,4L', amount: 4.90 }] } },
    { name: { de: 'Vitamalz', en: 'Vitamalz' },
      desc: { de: 'Malzgetränk', en: 'Malt drink' },
      price: { sizes: [{ label: '0,33L', amount: 3.90 }] } },
  ]},
  { sub: { de: 'Fassbrause', en: 'Fassbrause' }, items: [
    { name: { de: 'Maracuja',  en: 'Passion fruit' }, price: { sizes: [{ label: '0,3L', amount: 3.90 }] } },
    { name: { de: 'Zitrone',   en: 'Lemon' },         price: { sizes: [{ label: '0,3L', amount: 3.90 }] } },
    { name: { de: 'Holunder',  en: 'Elderflower' },   price: { sizes: [{ label: '0,3L', amount: 3.90 }] } },
  ]},
  { sub: { de: 'Frisch vom Fass', en: 'On tap' }, items: [
    { name: { de: 'Krombacher', en: 'Krombacher' },
      desc: { de: 'Pils, Radler oder Colabier', en: 'Pilsner, shandy or cola beer' },
      price: { sizes: [{ label: '0,2L', amount: 2.90 }, { label: '0,4L', amount: 4.90 }] } },
  ]},
  { sub: { de: 'Flaschenbiere', en: 'Bottled beers' }, items: [
    { name: { de: 'Krombacher Pils / Radler', en: 'Krombacher Pilsner / Shandy' },
      desc: { de: 'Auch alkoholfrei', en: 'Also non-alcoholic' },
      price: { sizes: [{ label: '0,33L', amount: 3.90 }] } },
    { name: { de: 'Erdinger Weizen', en: 'Erdinger wheat beer' },
      desc: { de: 'Alkoholfrei, weiß oder dunkel', en: 'Non-alcoholic, light or dark' },
      price: { sizes: [{ label: '0,5L', amount: 5.90 }] } },
    { name: { de: 'Erdinger Weizen Alkoholfrei', en: 'Erdinger wheat (non-alc.)' },
      desc: { de: 'Zitrone oder Grapefruit', en: 'Lemon or grapefruit' },
      price: { sizes: [{ label: '0,33L', amount: 3.90 }] } },
  ]},
  { sub: { de: 'Spirituosen', en: 'Spirits' }, items: [
    { name: { de: 'Ramazzotti / Ouzo', en: 'Ramazzotti / Ouzo' },
      price: { sizes: [{ label: '2cl', amount: 3.00 }] } },
    { name: { de: 'Aperol Spritz', en: 'Aperol Spritz' },
      price: { sizes: [{ label: '0,2L', amount: 7.50 }] } },
  ]},
  { sub: { de: 'Warme Getränke', en: 'Hot drinks' }, items: [
    { name: { de: 'Espresso',       en: 'Espresso' },       price: { single: 2.90 } },
    { name: { de: 'Caffè Crema',    en: 'Caffè Crema' },    price: { single: 3.90 } },
    { name: { de: 'Cappuccino',     en: 'Cappuccino' },     price: { single: 4.00 } },
    { name: { de: 'Latte Macchiato',en: 'Latte Macchiato' },price: { single: 4.90 } },
  ]},
  { sub: { de: 'Weine', en: 'Wines' }, items: [
    { name: { de: 'Dornfelder Rotwein', en: 'Dornfelder red' },
      desc: { de: 'Trocken, halbtrocken oder lieblich', en: 'Dry, semi-dry or sweet' },
      price: { sizes: [{ label: '0,2L', amount: 6.50 }] } },
    { name: { de: 'Weißer Burgunder', en: 'Pinot Blanc' },
      desc: { de: 'Trocken', en: 'Dry' },
      price: { sizes: [{ label: '0,2L', amount: 6.50 }] } },
    { name: { de: 'Dornfelder Rosé', en: 'Dornfelder rosé' },
      desc: { de: 'Halbtrocken', en: 'Semi-dry' },
      price: { sizes: [{ label: '0,2L', amount: 6.50 }] } },
    { name: { de: 'Schorle', en: 'Spritzer' },
      desc: { de: 'Wahlweise als Schorle (0,3L) +0,50 €', en: 'Available as spritzer (0,3L) +€0,50' },
      price: { single: null } },
  ]},
];

const partyservice = [
  { num: '100', name: { de: 'Pizzablech Margherita', en: 'Pizza tray Margherita' },
    desc: { de: '60 × 40 cm', en: '60 × 40 cm' }, price: { single: 30.00 } },
  { num: '100', name: { de: 'Pizzablech (1 Extra-Zutat)', en: 'Pizza tray (1 extra topping)' },
    desc: { de: '60 × 40 cm', en: '60 × 40 cm' }, price: { single: 35.00 } },
  { num: '100', name: { de: 'Pizzablech Gemischt', en: 'Pizza tray mixed' },
    desc: { de: '60 × 40 cm', en: '60 × 40 cm' }, price: { single: 40.00 } },
  { num: '101', name: { de: 'Salatblech', en: 'Salad tray' },
    desc: { de: 'Nach Portion', en: 'Per portion' }, price: { single: 50.00 } },
  { num: '102', name: { de: 'Nudelblech', en: 'Pasta tray' },
    desc: { de: 'Nach Portion', en: 'Per portion' }, price: { single: 50.00 } },
];

const MENU = [
  { id: 'pizzen',       titleKey: 'cat.pizzen',       noteKey: 'note.pizzen',    items: pizzaItems },
  { id: 'broetchen',    titleKey: 'cat.broetchen',                               items: broetchen },
  { id: 'salate',       titleKey: 'cat.salate',       noteKey: 'note.salate',    items: salate },
  { id: 'pasta',        titleKey: 'cat.pasta',        noteKey: 'note.pasta',     items: pasta },
  { id: 'gyros',        titleKey: 'cat.gyros',        noteKey: 'note.gyros',     items: gyros },
  { id: 'schnitzel',    titleKey: 'cat.schnitzel',    noteKey: 'note.schnitzel', items: schnitzel },
  { id: 'imbiss',       titleKey: 'cat.imbiss',                                  items: imbiss },
  { id: 'saucen',       titleKey: 'cat.saucen',                                  items: saucen },
  { id: 'getraenke',    titleKey: 'cat.getraenke',                               groups: getraenke },
];

/* ============= Renderers ============= */

function priceHtml(price) {
  if (!price) return '';
  if (price.sizes) {
    return price.sizes.map(s =>
      `<span class="row"><em>${s.label}</em>${fmt(s.amount)}</span>`
    ).join('');
  }
  if (price.single == null) return `<span class="single">—</span>`;
  return `<span class="single">${fmt(price.single)}</span>`;
}

function itemHtml(item, lang) {
  const name = item.name[lang] || item.name.de || '';
  const desc = (item.desc && (item.desc[lang] || item.desc.de)) || '';
  const allergens = (item.allergens || []).map(n => `<span>${n}</span>`).join('');
  const num  = item.num ? `<span class="num">${item.num}.</span>` : `<span class="num"></span>`;
  return `
    <article class="menu-item">
      ${num}
      <h4 class="name">
        ${escapeHtml(name)}
        ${allergens ? `<span class="allergens" aria-label="Allergene">${allergens}</span>` : ''}
      </h4>
      <div class="price">${priceHtml(item.price)}</div>
      ${desc ? `<p class="desc">${escapeHtml(desc)}</p>` : ''}
    </article>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function categoryHtml(cat, lang) {
  const title = t(cat.titleKey, lang);
  const note  = cat.noteKey ? `<p class="cat-note">${t(cat.noteKey, lang)}</p>` : '';
  let body = '';
  if (cat.groups) {
    body = cat.groups.map(g => `
      <div class="menu-subgroup">
        <h4 class="subgroup-title">${escapeHtml(g.sub[lang] || g.sub.de)}</h4>
        <div class="menu-grid">
          ${g.items.map(i => itemHtml(i, lang)).join('')}
        </div>
      </div>
    `).join('');
  } else {
    body = `<div class="menu-grid">${cat.items.map(i => itemHtml(i, lang)).join('')}</div>`;
  }
  return `
    <section class="menu-cat" id="cat-${cat.id}" data-cat="${cat.id}">
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
  root.innerHTML = MENU.map(c => categoryHtml(c, lang)).join('');
  tabs.innerHTML  = MENU.map(c =>
    `<button data-target="cat-${c.id}">${escapeHtml(t(c.titleKey, lang))}</button>`
  ).join('');
  bindTabs();
}

function bindTabs() {
  const tabs = document.querySelectorAll('#menuTabs button');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.target);
      if (!el) return;
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const tabsH   = document.getElementById('menuTabs')?.offsetHeight || 0;
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - tabsH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ============= Hours ============= */

const HOURS = [
  { dayKey: 'day.mon', winter: '11:00 – 22:00', summer: '11:00 – 23:00', dow: 1 },
  { dayKey: 'day.tue', winter: '11:00 – 22:00', summer: '11:00 – 23:00', dow: 2 },
  { dayKey: 'day.wed', winter: '11:00 – 22:00', summer: '11:00 – 23:00', dow: 3 },
  { dayKey: 'day.thu', winter: '11:00 – 22:00', summer: '11:00 – 23:00', dow: 4 },
  { dayKey: 'day.fri', winter: '11:00 – 22:00', summer: '11:00 – 23:00', dow: 5 },
  { dayKey: 'day.sat', winter: '12:00 – 22:00', summer: '12:00 – 23:00', dow: 6 },
  { dayKey: 'day.sun', winter: '12:00 – 22:00', summer: '12:00 – 23:00', dow: 0 },
];

function isSummerSeason(d = new Date()) {
  const m = d.getMonth(); /* 0 = Jan */
  return m >= 4 && m <= 9; /* May (4) – October (9) */
}

function renderHours(lang) {
  const tbody = document.getElementById('hoursBody');
  if (!tbody) return;
  const today = new Date().getDay();
  tbody.innerHTML = HOURS.map(h => `
    <tr class="${h.dow === today ? 'is-today' : ''}">
      <td>${escapeHtml(t(h.dayKey, lang))}</td>
      <td>${h.winter}</td>
      <td>${h.summer}</td>
    </tr>
  `).join('');
}

function updateOpenBadge(lang) {
  const badge = document.getElementById('openBadge');
  if (!badge) return;
  const now = new Date();
  const dow = now.getDay();
  const today = HOURS.find(h => h.dow === dow);
  const range = isSummerSeason(now) ? today.summer : today.winter;
  const [openH, openM]  = range.split(' – ')[0].split(':').map(Number);
  const [closeH, closeM] = range.split(' – ')[1].split(':').map(Number);
  const cur  = now.getHours() * 60 + now.getMinutes();
  const open = openH * 60 + openM;
  const close = closeH * 60 + closeM;
  const isOpen = cur >= open && cur < close;
  badge.textContent = isOpen ? t('hours.open', lang) : t('hours.closed', lang);
  badge.classList.toggle('is-open', isOpen);
  badge.classList.toggle('is-closed', !isOpen);
}

/* ============= Catering list ============= */

function renderCatering(lang) {
  const ul = document.getElementById('cateringList');
  if (!ul) return;
  ul.innerHTML = partyservice.map(p => `
    <li>
      <span class="name">${escapeHtml(p.name[lang] || p.name.de)}</span>
      <span class="price">${fmt(p.price.single)}</span>
      <p class="desc">${escapeHtml((p.desc && (p.desc[lang] || p.desc.de)) || '')}</p>
    </li>
  `).join('');
}

/* ============= Allergen legend ============= */

function renderAllergenLegend(lang) {
  const ol = document.getElementById('allergenLegend');
  if (!ol) return;
  const list = ALLERGEN_LEGEND[lang] || ALLERGEN_LEGEND.de;
  ol.innerHTML = list.map(s => `<li>${escapeHtml(s)}</li>`).join('');
}
