// Single source of truth for the menu.
// Transcribed from the official menus linked on bigmanco.com:
//   In-house:  "BIGMAN CAFE MENU.pdf"
//   Delivery:  "BM DELIVERY HOUSE MENU JULY 2024.pdf"
// `in` = in-house price, `del` = delivery price (defaults to `in` when the
// section is on the delivery menu). Sections with delivery:false are dine-in only.

export const STYLES = ['Bigman', 'American', 'Ghost Pepper!!!', 'Black Pepper', 'Asian', "1970's BBQ"];

export const SECTIONS = [
  {
    id: 'build-your-burger', title: 'Build Your Burger', kicker: '100% meat, always fresh. Only grilled burgers.',
    short: 'Beef or chicken, your style, three free toppings', from: 135.9,
    img: 'triple-burger', alt: 'Triple-patty grilled burger with melted cheese on a sesame bun',
    delivery: true,
    blocks: [
      { type: 'prices', note: 'Beef or chicken', rows: [
        { name: 'Classic Double', in: 135.9 },
        { name: 'Triple . Triple', in: 175.9 },
      ] },
      { type: 'chips', label: 'Style', items: STYLES },
      { type: 'chips', label: 'Toppings (free × 3)', items: ['Lettuce', 'Pickles', 'Onion', 'Tomato', 'Olives', 'Cucumber', 'Scotch Bonnet', 'Carrot Strings', 'Grilled Cabbage', 'Grilled Pineapple', 'Grilled Red Pepper'] },
      { type: 'extras', label: 'Add-ons', rows: [['Sausage', 15], ['Bacon', 35], ['Extra Cheese', 25], ['Fried Egg', 15], ['Mushroom', 15], ['Chilli Jam', 25]] },
      { type: 'prices', heading: 'The Fatlamb', note: 'Lamb', rows: [
        { name: 'Classic Double', desc: 'Double cheese', in: 220.9 },
        { name: 'Triple . Triple', desc: 'Triple cheese', in: 280.9 },
      ] },
    ],
  },
  {
    id: 'huntsman', title: 'Huntsman', kicker: 'Operation: Burger Zone',
    short: 'Six house burgers, choose your sauce', from: 105.9,
    img: 'burger-and-fries', alt: 'Grilled double cheeseburger with a pile of fries on a wooden board',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [
        { name: 'Huntsman Classic', desc: 'Lettuce + tomato + cheese', variants: [['Chicken', 105.9], ['Beef', 105.9], ['Lamb', 175.9]] },
        { name: "Flamin'Shroom", desc: 'Caramelized mushroom + cheese', variants: [['Chicken', 115.9], ['Beef', 115.9]] },
        { name: 'Crispy Fillet', desc: 'Lettuce + cheese · chicken', in: 135.9 },
        { name: 'Hotato Potato', desc: 'Spicy potato patty + lettuce + cheese · chicken or beef', in: 115.9 },
        { name: "De' Fried Bacon", desc: 'Fried bacon + cheese · chicken or beef', in: 115.9 },
        { name: 'Oh Cheese!', desc: 'Caramelized onion + lettuce + mozzarella + cheese · chicken or beef', in: 115.9 },
      ] },
      { type: 'chips', label: 'Choose your sauce', items: STYLES },
    ],
  },
  {
    id: 'manwich', title: 'The Manwich', kicker: 'The king of sandwiches',
    short: 'Big Man Style or Flying Guru', from: 140.9,
    img: 'manwich', alt: 'Toasted Manwich sandwich branded with its name, served with fries on a cast-iron tray',
    delivery: true,
    blocks: [
      { type: 'prices', heading: 'Big Man Style', note: 'Beef, chicken or fish', rows: [{ name: 'Big Man Style', in: 140.9 }] },
      { type: 'chips', label: 'Style', items: ['OMG!', 'Red Indian', 'Wow-B-Q!', 'American Gangster'] },
      { type: 'prices', heading: 'Flying Guru', rows: [
        { name: 'Chicken', desc: 'Tandoori · Butter · Tikka', in: 140.9 },
        { name: 'Beef', desc: 'Pepper · Chilli', in: 150.9 },
      ] },
    ],
  },
  {
    id: 'loaded-fries', title: 'W.T.F Loaded Fries', kicker: 'Beef or chicken',
    short: 'Cheese-sauced, fully loaded', from: 85.9,
    img: 'wtf-nachos', alt: 'Bucket of loaded fries beside a plate of loaded nachos with olives and melted cheese',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [
        { name: 'Hot Fryday', desc: 'Crumbled meat, fried meat, ghost pepper cheese sauce, with extra cheese', in: 111.9, del: 119.9 },
        { name: 'Baba-Don!', desc: 'Crumbled meat, hot garlic cheese sauce, with extra cheese', in: 105.9, del: 114.9 },
        { name: 'Chicago', desc: 'Grilled meat cube, fried sausage, red chilli cheese sauce with extra cheese', in: 95.9, del: 99.9 },
        { name: 'So-Basic', desc: 'White cheese sauce, caramelized onion with extra cheese, potato wedges, +/- chilli', in: 85.9, del: 89.9 },
      ] },
    ],
  },
  {
    id: 'nachos', title: 'W.T.F ft. Nachos', kicker: 'Tortilla chips, fries and everything on top',
    short: 'Four loaded plates, including Keyolhu!', from: 185.9,
    img: 'wtf-nachos', alt: 'Plate of nachos loaded with meat, olives and melted cheese',
    delivery: true, noImage: true,
    blocks: [
      { type: 'prices', rows: [
        { name: 'Bigman Classic!', desc: 'Tortilla chips, fries, roasted chicken n beef, creamy cheese, redhot cheese, olives', in: 185.9, del: 199.9 },
        { name: 'Keyolhu!', desc: 'Tortilla chips, fries, fried chicken n valhomas, creamy cheese, rihaakuru cheese, fried onion', in: 190.9, del: 204.9 },
        { name: 'Tandoorians!', desc: 'Tortilla chips, fries, tandoori chicken, creamy cheese, tandoori cheese, olives, fried onion', in: 185.9, del: 199.9 },
        { name: 'Super Kids!', desc: 'Tortilla chips, fries, roasted chicken & fried sausage, creamy cheese, cheddar cheese, olives, b.pepper, lettuce', in: 185.9, del: 199.9 },
      ] },
    ],
  },
  {
    id: 'rockets', title: 'Rockets', kicker: 'Jumbo subs on fire! Bigger than ever.',
    short: 'Jumbo subs — beef, chicken or fish', from: 155.9,
    img: 'rockets-jumbo-sub', alt: 'Jumbo sesame sub cut in half, stacked on a plate with fries',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [{ name: 'Jumbo Sub', variants: [['Beef', 155.9], ['Chicken', 155.9], ['Fish', 155.9]] }] },
      { type: 'chips', label: 'Style', items: ['Original', 'Classic', 'Red Alert', 'Pepper B.Q!'] },
    ],
  },
  {
    id: 'dawgs', title: 'Big Dawgs! Fiery Dawgs!', kicker: 'Premium quality since 2017',
    short: 'Hot dogs — beef or chicken', from: 75.9,
    img: 'fiery-dawg', alt: 'Hot dog topped with cheese slices and sauce on a tray of fries',
    delivery: false,
    blocks: [
      { type: 'prices', note: 'Beef or chicken', rows: [{ name: 'Dawg', in: 75.9 }] },
      { type: 'chips', label: 'Style', items: ['BBQ', 'Hot!', 'Classic'] },
    ],
  },
  {
    id: 'melts', title: 'Melts.', kicker: 'Flat bread or parata bread',
    short: 'Grilled flat bread or parata', from: 115.9,
    img: 'melts', alt: 'Grilled flat bread melt cut into wedges with fries',
    delivery: false,
    blocks: [
      { type: 'prices', note: 'Beef, fish or chicken', rows: [{ name: 'Flat Bread . Parata Bread', in: 115.9 }] },
      { type: 'chips', label: 'Style', items: ['Original!', 'Red Chilli'] },
    ],
  },
  {
    id: 'mighty', title: 'Mighty', kicker: 'Loaded sub',
    short: 'Loaded subs with egg and cheese', from: 130.9,
    img: 'mighty-loaded-sub', alt: 'Four loaded sub halves topped with meat, peppers and sauce beside fries',
    delivery: false,
    blocks: [
      { type: 'prices', rows: [
        { name: 'Meat Explosion!', desc: 'Chicken & beef chunk, C&B sausage, egg, cheese', in: 140.9 },
        { name: 'ChicKung-Fu!', desc: 'Chicken chunk, chicken sausage, egg, cheese', in: 130.9 },
        { name: 'Professor Cow!', desc: 'Beef chunk, beef sausage, egg, cheese', in: 130.9 },
      ] },
    ],
  },
  {
    id: 'chip-chop', title: 'Chip Chop', kicker: 'Free 1 side + 1 dip',
    short: 'Fish, chicken or sausage n chips', from: 115.9,
    img: 'chip-chop', alt: 'Crumbed fillets with seasoned fries, mashed potato and dip',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [
        { name: 'Fish n Chips', in: 135.9 },
        { name: 'Chicken n Chips', in: 135.9 },
        { name: 'Sausage n Chips', in: 115.9 },
      ] },
      { type: 'chips', label: 'Choose your flavor', items: ['Original 100%', 'Smoked BBQ!', 'Curry Cheese'] },
      { type: 'extras', label: 'Choose one side', rows: [['Baked Beans', 25], ['Mashed Potato', 35], ['Coleslaw', 35], ['Veg Rice', 25]] },
      { type: 'extras', label: 'Xtraz!', rows: [['Loaded Wedges', 55], ['Mac n Cheese', 35], ['White Potato Salad', 35], ['Hot Wings', 55]] },
      { type: 'chips', label: 'Choose your favourite dip', items: ['Tartar Sauce', 'Hotcheese Sauce', 'Chilimayo Sauce', 'Bigman Sauce'] },
    ],
  },
  {
    id: 'pasta-pan', title: 'Pasta Pan', kicker: 'Fusilli, spaghetti or penne',
    short: 'Your pasta, your sauce', from: 125.9,
    img: 'pasta-pan', alt: 'Penne in a dark sauce on a black plate, scattered with fries',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [{ name: 'Pasta Pan', variants: [['Beef', 130.9], ['Chicken', 125.9], ['Fish', 125.9], ['Prawn', 160.9]] }] },
      { type: 'chips', label: 'Pasta', items: ['Fusilli', 'Spaghetti', 'Penne'] },
      { type: 'chips', label: 'Sauce', items: ['White Pepper', 'Hot Garlick', 'So-Good!', 'Pan Special'] },
      { type: 'extras', label: 'Cheese on top?', rows: [['Parmesan', 35], ['Mozzarella', 25]] },
    ],
  },
  {
    id: 'valho-king', title: 'Valho King', kicker: 'VIP',
    short: 'Rice, rotti, pasta or noodles', from: 130,
    img: 'valho-king', alt: 'Spiced rice with fries and fried greens on a black plate',
    delivery: false,
    blocks: [
      { type: 'prices', rows: [{ name: 'Rice . Rotti . Pasta . Noodles', in: 130 }] },
    ],
  },
  {
    id: 'goreng', title: 'Goreng! Goreng!', kicker: 'Nasi, mie or roti',
    short: 'Nasi, mie or roti, four styles', from: 120.9,
    img: 'goreng-goreng', alt: 'Goreng in a red bowl with a fried egg, fries, tomato and cucumber',
    delivery: true,
    blocks: [
      { type: 'prices', rows: [{ name: 'Nasi . Mie . Roti', variants: [['Beef', 130.9], ['Chicken', 120.9], ['Fish', 120.9]] }] },
      { type: 'chips', label: 'Style', items: ['Hot-Chilli', 'Tandoori', 'Devilled', "Ceylon Curry (Roti 'G' special)"] },
    ],
  },
  {
    id: 'rocking-wok', title: 'Rocking Wok', kicker: 'Yellow rice, sautéed veggies, fries',
    short: 'Wok plates with yellow rice', from: 125.9,
    img: 'rocking-wok', alt: 'Wok plate with yellow rice, sautéed vegetables, fries and glazed meat',
    delivery: false,
    blocks: [
      { type: 'prices', rows: [{ name: 'Rocking Wok', variants: [['Beef', 130.9], ['Chicken', 125.9], ['Prawn', 160.9]] }] },
      { type: 'chips', label: 'Style', items: ['Thai! Thai!', 'Smoky BBQ!', 'Rocking Hot!'] },
    ],
  },
  {
    id: 'yo-kebab', title: 'Yo! Kebab', kicker: 'Skewer on flat bread',
    short: 'Beef, chicken or lamb', from: 157.9,
    img: 'yo-kebab', alt: 'Grilled kebab skewer over flat bread with fries, slaw and dip',
    delivery: false,
    blocks: [
      { type: 'prices', rows: [{ name: 'Yo! Kebab', variants: [['Beef', 175.9], ['Chicken', 157.9], ['Lamb', 230.9]] }] },
      { type: 'chips', label: 'Style', items: ['Original', 'Hot BBQ!', 'Flamin Hot!'] },
    ],
  },
  {
    id: 'drinks', title: 'Shakes & Drinks', kicker: 'Ice Burst, Shake Shakes, juice, coffee',
    short: 'Shakes, fresh juice, coffee and tea', from: 10,
    img: 'shake-shakes', alt: 'Five milkshakes in mason jars topped with whipped cream',
    delivery: false, wide: true,
    blocks: [
      { type: 'prices', heading: 'Ice Burst', rows: [{ name: 'Vanilla · Chocolate · White Chocolate · Mocha · Milo Monster · Sweet Milk', in: 79.9 }] },
      { type: 'prices', heading: 'Shake Shakes', rows: [{ name: 'Twix It! · Vanilla Espresso! · Oreo Galaxy! · Ferreroar! · Milo-Godzilla! · Peanut . Peanut!', in: 116.9 }] },
      { type: 'extras', label: 'Fresh juice', rows: [['Orange', 75], ['Mango', 80], ['Watermelon', 70], ['Lemon & Lime', 70], ['Pineapple', 80], ['Lemon n Orange', 85], ['Mixed Fruit', 85]] },
      { type: 'extras', label: 'Cold drinks', rows: [['Mojito', 70], ['Ice Lemon Tea', 65], ['Ice Coffee', 70], ['Rose Faluda', 70], ['Honey Milk', 60], ['Soft Drinks', 25], ['Redbull', 60], ['Granini', 40], ['Water', 12]] },
      { type: 'extras', label: 'Hot drinks', rows: [['Chocolate', 65], ['Milo', 45], ['Milk Tea', 20], ['Bombay Tea', 40], ['Ceylon Tea', 10], ['Earl Grey Tea', 20], ['English Breakfast Tea', 20], ['Green Tea', 20], ['Ginger Tea', 25], ['Lemon Tea', 30]] },
      { type: 'extras', label: 'Coffee', rows: [['Espresso (single)', 35], ['Espresso (double)', 50], ['Regular Coffee', 35], ['Americano', 45], ['Latte', 45], ['Mocha', 60], ['Cappuccino', 55], ['Flat White', 50], ['Caramel Macchiato', 55]] },
    ],
  },
];
