// Catalogue for order.html.
// Items and prices are a snapshot of the live ordering app
// ("BIG MAN DH HULHUMALE" on app.ipos247.com) taken on 2026-10-11.
// The app is the source of truth: re-check it when prices change.
// Option lists (styles, toppings, add-ons) come from the official menu PDFs.
// price: null = the app lists 0.00, so Big Man confirms the price.

import { STYLES } from './menu-data.mjs';

export const OPTIONS = {
  style: { label: 'Style', type: 'one', choices: STYLES },
  toppings: { label: 'Toppings (3 free)', type: 'many', max: 3, choices: ['Lettuce', 'Pickles', 'Onion', 'Tomato', 'Olives', 'Cucumber', 'Scotch Bonnet', 'Carrot Strings', 'Grilled Cabbage', 'Grilled Pineapple', 'Grilled Red Pepper'] },
  addons: { label: 'Add-ons', type: 'many', choices: [['Sausage', 15], ['Bacon', 35], ['Extra Cheese', 25], ['Fried Egg', 15], ['Mushroom', 15], ['Chilli Jam', 25]] },
  sauce: { label: 'Sauce', type: 'one', choices: STYLES },
  manwichStyle: { label: 'Style', type: 'one', choices: ['OMG!', 'Red Indian', 'Wow-B-Q!', 'American Gangster'] },
  pasta: { label: 'Pasta', type: 'one', choices: ['Fusilli', 'Spaghetti', 'Penne'] },
  pastaSauce: { label: 'Sauce', type: 'one', choices: ['White Pepper', 'Hot Garlick', 'So-Good!', 'Pan Special'] },
  cheese: { label: 'Cheese on top?', type: 'many', choices: [['Parmesan', 35], ['Mozzarella', 25]] },
  protein: { label: 'Meat', type: 'one', choices: ['Beef', 'Chicken'] },
  rocketStyle: { label: 'Style', type: 'one', choices: ['Original', 'Classic', 'Red Alert', 'Pepper B.Q!'] },
  dawgStyle: { label: 'Style', type: 'one', choices: ['BBQ', 'Hot!', 'Classic'] },
  flavor: { label: 'Flavor', type: 'one', choices: ['Original 100%', 'Smoked BBQ!', 'Curry Cheese'] },
  side: { label: 'Free side', type: 'one', choices: ['Baked Beans', 'Mashed Potato', 'Coleslaw', 'Veg Rice'] },
  dip: { label: 'Free dip', type: 'one', choices: ['Tartar Sauce', 'Hotcheese Sauce', 'Chilimayo Sauce', 'Bigman Sauce'] },
  gorengStyle: { label: 'Style', type: 'one', choices: ['Hot-Chilli', 'Tandoori', 'Devilled', 'Ceylon Curry'] },
  kebabStyle: { label: 'Style', type: 'one', choices: ['Original', 'Hot BBQ!', 'Flamin Hot!'] },
};

// items: [name, price] or [name, price, description]
export const CATALOGUE = [
  { id: 'burger', title: 'Build Your Burger', note: '100% meat, always fresh. Only grilled burgers.', img: 'triple-burger', opts: ['style', 'toppings', 'addons'], items: [
    ['Beef Burger · Classic Double', 135.9], ['Beef Burger · Triple . Triple', 175.9],
    ['Chicken Burger · Classic Double', 135.9], ['Chicken Burger · Triple . Triple', 175.9],
    ['The Fatlamb · Classic Double', 220.9, 'Double cheese'], ['The Fatlamb · Triple . Triple', 280.9, 'Triple cheese'],
  ] },
  { id: 'huntsman', title: 'Huntsman', note: 'Operation: Burger Zone', img: 'burger-and-fries', opts: ['sauce'], items: [
    ['Huntsman Classic · Beef', 105.9, 'Lettuce + tomato + cheese'], ['Huntsman Classic · Chicken', 105.9, 'Lettuce + tomato + cheese'], ['Huntsman Classic · Mutton', 175.9, 'Lettuce + tomato + cheese'],
    ["Flamin'Shroom · Chicken", 115, 'Caramelized mushroom + cheese'], ["Flamin'Shroom · Beef", 115.9, 'Caramelized mushroom + cheese'],
    ['Crispy Fillet', 135.9, 'Lettuce + cheese'], ['Hotato Potato', 115.9, 'Spicy potato patty + lettuce + cheese'],
    ["De' Fried Bacon", 115.9, 'Fried bacon + cheese'], ['Oh Cheese!', 115.9, 'Caramelized onion + lettuce + mozzarella + cheese'],
  ] },
  { id: 'manwich', title: 'The Manwich', note: 'The king of sandwiches', img: 'manwich', opts: ['manwichStyle'], items: [
    ['Beef Manwich', 140.9], ['Chicken Manwich', 140.9], ['Tuna Manwich', 140.9],
  ] },
  { id: 'flying-guru', title: 'Manwich ft. Flying Guru', note: '', img: 'manwich-stack', opts: [], items: [
    ['Butter King', 140.9], ['Tikka King', 140.9], ['Tandoori King', 140.9], ['Chilli King', 150.9], ['Pepper King', 150.9],
  ] },
  { id: 'wtf', title: 'W.T.F Loaded Fries', note: '', img: 'wtf-nachos', opts: ['protein'], items: [
    ['Hot Fryday', 111.9, 'Crumbled meat, fried meat, ghost pepper cheese sauce, with extra cheese'],
    ['Baba-Don!', 105.9, 'Crumbled meat, hot garlic cheese sauce, with extra cheese'],
    ['Chicago', 95.9, 'Grilled meat cube, fried sausage, red chilli cheese sauce with extra cheese'],
    ['So-Basic!', 85.9, 'White cheese sauce, caramelized onion with extra cheese, potato wedges'],
  ] },
  { id: 'nachos', title: 'W.T.F ft. Nachos', note: '', opts: [], items: [
    ['Bigman Classic!', 185.9, 'Tortilla chips, fries, roasted chicken n beef, creamy cheese, redhot cheese, olives'],
    ['Keyolhu!', 190.9, 'Tortilla chips, fries, fried chicken n valhomas, creamy cheese, rihaakuru cheese, fried onion'],
    ['Tandoorians!', 185.9, 'Tortilla chips, fries, tandoori chicken, creamy cheese, tandoori cheese, olives, fried onion'],
    ['Super Kids!', 185.9, 'Tortilla chips, fries, roasted chicken & fried sausage, creamy cheese, cheddar cheese, olives, b.pepper, lettuce'],
  ] },
  { id: 'rockets', title: 'Rockets', note: 'Jumbo subs on fire!', img: 'rockets-jumbo-sub', opts: ['rocketStyle'], items: [
    ['Beef Rocket', 155.9], ['Chicken Rocket', 155.9], ['Tuna Rocket', 155.9],
  ] },
  { id: 'dawgs', title: 'Big Dawgs! Fiery Dawgs!', note: '', img: 'fiery-dawg', opts: ['dawgStyle'], items: [
    ['Beef Dawg', 75.9], ['Chicken Dawg', 75.9],
  ] },
  { id: 'pizza', title: 'Duper Pizza', note: '', opts: [], items: [
    ['Hummus Beef', 148.15], ['Smoked Beef BBQ', 143.52], ['Beef Pepperoni', 134.26], ["Pepper'd Beef Pizza", 134.26], ['Beef n Mushroom', 125], ['Beef Bolognese', 125],
    ['Professor Cow Pizza', 162.04], ['Lamb Gang', 199.07], ['Crazy Meat Lovers', 162.04], ['Sausage Nation', 152.78], ['Late Night', 162.04],
    ['Hummus Chicken', 138.89], ['Chicken Pesto', 138.89], ['Smoked Chicken BBQ', 134.26], ['Hot Garlic Chicken', 125], ['Chicken Limo', 125], ['Chicken Tandoori', 125],
    ['Chicken Hawaii', 125], ['Pepper Chicken Pizza', 125], ['Chicken Tikka', 125], ['Chicken N Mushroom', 115.74], ['Dancing Chicken', 162.04],
    ['Creamy Fried Calamari', 152.78], ['Smoked Seafood BBQ', 152.78], ['Shrimp Time', 152.78], ['Valhomas Rihaakuru', 143.52], ['Chilli Cheese Tuna', 120.37], ['Cheesy Tuna King', 115.74],
    ['Duper 4 Cheese', 134.26], ['Cheesy Garlic', 125], ['Yummy White Cheese', 120.37], ['Classic Margherita', 106.48],
  ] },
  { id: 'pasta', title: 'Pasta Pan', note: '', img: 'pasta-pan', opts: ['pasta', 'pastaSauce', 'cheese'], items: [
    ['Beef Pasta', 130.9], ['Chicken Pasta', 125.9], ['Tuna Pasta', 125.9], ['Seafood Pasta', 160.9],
  ] },
  { id: 'chip-chop', title: 'Chip Chop', note: 'Free 1 side + 1 dip', img: 'chip-chop', opts: ['flavor', 'side', 'dip'], items: [
    ['Fish n Chips', 135.9], ['Chicken n Chips', 135.9], ['Sausage n Chips', 115.9],
  ] },
  { id: 'valho-king', title: 'Valho King', note: 'VIP', img: 'valho-king', opts: [], items: [
    ['Rice VIP Valho King', 130], ['Rotti VIP Valho King', 130], ['Pasta VIP Valho King', 130], ['Noodles VIP Valho King', 130],
  ] },
  { id: 'goreng', title: 'Goreng! Goreng!', note: '', img: 'goreng-goreng', opts: ['gorengStyle'], items: [
    ['Goreng', null], ['Kottu', null], ['Tuna Goreng', 99],
  ] },
  { id: 'kebab', title: 'Yo! Kebab', note: '', img: 'yo-kebab', opts: ['kebabStyle'], items: [
    ['Yo Kebab Chicken', 157.9], ['Yo Kebab Beef', 175.9], ['Yo Kebab Lamb', 230.9],
  ] },
  { id: 'sides', title: 'Sides & Extras', note: '', opts: [], items: [
    ['Fries Portion', 20], ['Baked Beans', 25], ['Veg Rice', 25], ['Mashed Potato', 35], ['Coleslaw', 35], ['Mac n Cheese', 35], ['White Potato Salad', 35], ['Loaded Wedges', 55], ['Hot Wings', 55],
  ] },
];
