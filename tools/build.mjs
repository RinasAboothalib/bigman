// Generates index.html and menu.html from the templates below + menu-data.mjs.
// Zero dependencies:  node tools/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SECTIONS, STYLES } from './menu-data.mjs';
import { CATALOGUE, OPTIONS } from './order-data.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const META = JSON.parse(readFileSync(join(here, 'image-meta.json'), 'utf8'));

/* ---------- Verified business facts (bigmanco.com + official Facebook / Instagram profiles) ---------- */
const SITE = 'https://bigmanco.com';
const L = {
  orderApp: `${SITE}/order`, // redirects to the hosted iPOS247 ordering app
  inhousePdf: `${SITE}/menu/inhouse`,
  deliveryPdf: `${SITE}/menu/delivery`,
  instagram: 'https://www.instagram.com/bigman.ith/',
  facebook: 'https://www.facebook.com/bigman.ith',
  maps: 'https://www.google.com/maps/search/?api=1&amp;query=Big+Man+Chaandhanee+Magu+Male+Maldives',
  email: 'info@bigmanco.com',
};
const WHATSAPP = '9609446699'; // "Viber / WhatsApp: 9446699" as published in the ordering app
const PHONES = { dine: [['+9609199333', '919 9333'], ['+9609199961', '919 9961']], delivery: [['+9609446699', '944 6699']] };

/* ---------- Helpers ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const src = (name, w) => `assets/img/${META[name].dir}/${name}-${w}.webp`;
// Lightbox source: the biggest rendition up to 1600px wide.
const largest = (name) => src(name, META[name].widths.filter((w) => w <= 1653).at(-1));
function img(name, { sizes = '100vw', alt = '', eager = false, attrs = '' } = {}) {
  const m = META[name];
  const srcset = m.widths.map((w) => `${src(name, w)} ${w}w`).join(', ');
  const def = m.widths.includes(960) ? 960 : m.widths.at(-1);
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<img src="${src(name, def)}" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${load}${attrs ? ' ' + attrs : ''}>`;
}
const price = (n) => {
  const [a, b] = Number(n).toFixed(2).split('.');
  return b === '00' ? `<span class="price">${a}</span>` : `<span class="price">${a}<sup>.${b}</sup></span>`;
};
const plain = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
const lines = (arr) => arr.map((t, i) => `<span class="line" style="--l:${i}"><span>${t}</span></span>`).join('');
const ext = 'target="_blank" rel="noopener"';

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

const telList = (list) => `<div class="tel">${list.map(([n, t]) => `<a href="tel:${n}">${ICON.phone}<span>+960 ${t}</span></a>`).join('')}</div>`;

/* ---------- Shared chrome ---------- */
function head({ title, desc, path, preload = '', noindex = false }) {
  const url = `${SITE}/${path}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: 'Big Man & Co', alternateName: 'BIG MAN', url: SITE,
    image: `${SITE}/assets/img/og-image.jpg`, logo: `${SITE}/assets/img/brand/logo-square-512.png`,
    telephone: PHONES.dine[0][0], email: L.email,
    address: { '@type': 'PostalAddress', streetAddress: 'Chaandhanee Magu', addressLocality: 'Malé', postalCode: '20046', addressCountry: 'MV' },
    servesCuisine: ['Burgers', 'Sandwiches'], hasMenu: `${SITE}/menu.html`,
    potentialAction: { '@type': 'OrderAction', target: `${SITE}/order.html` },
    sameAs: [L.instagram, L.facebook],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#0d0d0d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Big Man &amp; Co">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/brand/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="assets/img/brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<script>document.documentElement.classList.add('js');try{if(sessionStorage.getItem('bm-nav')){sessionStorage.removeItem('bm-nav');document.documentElement.classList.add('from-nav')}}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet">
${preload}<link rel="stylesheet" href="assets/css/styles.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script src="assets/js/main.js" defer></script>
</head>`;
}

function nav(page) {
  const home = page === 'home';
  const items = [
    ['Home', home ? '#top' : 'index.html', 'home'],
    ['Menu', 'menu.html', 'menu'],
    ['About', 'about.html', 'about'],
    ['Gallery', 'gallery.html', 'gallery'],
    ['Visit Us', 'contact.html', 'contact'],
  ];
  const cur = (k) => (k === page ? ' aria-current="page"' : '');
  const link = ([t, href, k]) => `<a href="${href}"${cur(k)}>${t}</a>`;
  return `<a class="skip" href="#main">Skip to content</a>
<div class="wipe" aria-hidden="true"><img src="assets/img/brand/logo-mark-black.webp" width="266" height="400" alt=""></div>
<header class="nav">
  <div class="wrap nav__inner">
    <a class="brand" href="${home ? '#top' : 'index.html'}" aria-label="Big Man &amp; Co — home">
      <img src="assets/img/brand/logo-mark-white.webp" width="266" height="400" alt="">
      <span>Big Man &amp; Co.</span>
    </a>
    <nav class="nav__links" aria-label="Primary">${items.map(link).join('')}</nav>
    <div class="nav__actions">
      <a class="btn btn--primary btn--sm" href="order.html"${cur('order')}>Order Online ${ICON.arrow}</a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mobile-menu">
  <nav class="mmenu__links" aria-label="Mobile">
    ${items.map(([t, href, k], i) => `<a href="${href}" style="--i:${i}"${cur(k)}><small>0${i + 1}</small>${t}</a>`).join('\n    ')}
  </nav>
  <div class="mmenu__foot">
    <a class="btn btn--primary" href="order.html">Order Online ${ICON.arrow}</a>
    <div class="row">
      <a class="btn btn--ghost btn--sm" href="menu.html">In-house menu</a>
      <a class="btn btn--ghost btn--sm" href="menu.html?menu=delivery">Delivery menu</a>
    </div>
  </div>
</div>`;
}

function footer(page) {
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand reveal">
        <img src="assets/img/brand/logo-full-white.webp" width="461" height="900" alt="Big Man in the house — logo" loading="lazy">
        <p>Grilled burgers, the Manwich, jumbo subs and loaded fries on Chaandhanee Magu, Malé.</p>
      </div>
      <nav class="reveal" style="--i:1" aria-label="Footer">
        <h3>Explore</h3>
        <ul>
          <li><a href="${page === 'home' ? '#top' : 'index.html'}">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="contact.html">Visit us</a></li>
          <li><a href="order.html">Order online</a></li>
        </ul>
      </nav>
      <nav class="reveal" style="--i:2" aria-label="Menus and ordering">
        <h3>Menu</h3>
        <ul>
          <li><a href="menu.html">In-house menu</a></li>
          <li><a href="menu.html?menu=delivery">Delivery menu</a></li>
          <li><a href="${L.inhousePdf}" ${ext}>In-house menu (PDF)</a></li>
          <li><a href="${L.deliveryPdf}" ${ext}>Delivery menu (PDF)</a></li>
        </ul>
      </nav>
      <div class="reveal" style="--i:3">
        <h3>Contact</h3>
        <address>
          <span>Chaandhanee Magu</span>
          <span>Malé 20046, Maldives</span>
          ${PHONES.dine.map(([n, t]) => `<a href="tel:${n}">+960 ${t}</a>`).join('\n          ')}
          <a href="tel:${PHONES.delivery[0][0]}">+960 ${PHONES.delivery[0][1]} (delivery)</a>
          <a href="mailto:${L.email}">${L.email}</a>
          <a href="${L.instagram}" ${ext}>Instagram</a>
          <a href="${L.facebook}" ${ext}>Facebook</a>
        </address>
      </div>
    </div>
    <p class="display footer__big" aria-hidden="true">Big Man &amp; Co.</p>
    <div class="footer__base">
      <span>© Big Man &amp; Co. All rights reserved.</span>
      <span>All prices are subject to GST &amp; service charge.</span>
    </div>
  </div>
</footer>`;
}

/* ---------- Home ---------- */
const MARQUEE = ['Burger', 'Manwich', 'Fiery Dawg', 'Pasta Pan', 'Rockets', 'W.T.F', 'Mighty', 'Chip Chop', 'Goreng! Goreng!', 'Yo! Kebab'];

const SIGS = [
  { id: 'build-your-burger', img: 'burger-and-fries', alt: 'Grilled double cheeseburger with fries on a wooden board', title: 'Build Your Burger', desc: 'Classic Double or Triple . Triple. Six styles, three free toppings.', from: 135.9, sizes: '(min-width:1024px) 58vw, 100vw' },
  { id: 'manwich', img: 'manwich-stack', alt: 'Stacked Manwich sandwich halves with melted cheese and fries', title: 'The Manwich', desc: 'The king of sandwiches, Big Man Style or Flying Guru.', from: 140.9, sizes: '(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw' },
  { id: 'nachos', img: 'wtf-nachos', alt: 'Loaded nachos with meat, olives and melted cheese beside a bucket of loaded fries', title: 'W.T.F ft. Nachos', desc: 'Tortilla chips, fries and everything on top.', from: 185.9, sizes: '(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw' },
  { id: 'rockets', img: 'rockets-jumbo-sub', alt: 'Jumbo sesame sub cut in half with fries', title: 'Rockets', desc: 'Jumbo subs on fire. Beef, chicken or fish.', from: 155.9, sizes: '(min-width:1024px) 42vw, 100vw' },
  { id: 'mighty', img: 'mighty-loaded-sub', alt: 'Loaded sub halves topped with meat, peppers and sauce', title: 'Mighty', desc: 'Loaded subs with egg and cheese.', from: 130.9, sizes: '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw' },
  { id: 'goreng', img: 'goreng-goreng', alt: 'Goreng with a fried egg, fries, tomato and cucumber in a red bowl', title: 'Goreng! Goreng!', desc: 'Nasi, mie or roti in four styles.', from: 120.9, sizes: '(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw' },
];

const CATS = { burgers: 'Burgers', subs: 'Subs & sandwiches', plates: 'Plates', sides: 'Fries & shakes' };
const GALLERY = [
  ['triple-burger', 'Triple . Triple', 'Triple-patty grilled burger with melted cheese', 'burgers'],
  ['fiery-dawg', 'Fiery Dawgs', 'Hot dog with cheese slices on a tray of fries', 'subs'],
  ['wtf-nachos', 'W.T.F ft. Nachos', 'Loaded nachos and loaded fries', 'sides'],
  ['valho-king', 'Valho King', 'Spiced rice with fries and fried greens', 'plates'],
  ['pasta-pan', 'Pasta Pan', 'Penne in dark sauce scattered with fries', 'plates'],
  ['chip-chop', 'Chip Chop', 'Crumbed fillets with seasoned fries and dips', 'plates'],
  ['manwich', 'The Manwich', 'Toasted Manwich branded with its name, with fries', 'subs'],
  ['yo-kebab', 'Yo! Kebab', 'Grilled kebab skewer over flat bread', 'plates'],
  ['rocking-wok', 'Rocking Wok', 'Wok plate with yellow rice, vegetables and fries', 'plates'],
  ['shake-shakes', 'Shake Shakes', 'Five milkshakes in mason jars', 'sides'],
  ['goreng-bowl', 'Goreng! Goreng!', 'Goreng with a fried egg in a red bowl', 'plates'],
  ['melts', 'Melts.', 'Grilled flat bread melt with fries', 'subs'],
  ['rockets-sub-closeup', 'Rockets', 'Close-up of a jumbo sesame sub', 'subs'],
  ['mighty-loaded-sub', 'Mighty', 'Loaded sub halves with fries', 'subs'],
  ['burger-and-fries', 'Build Your Burger', 'Grilled double cheeseburger with fries on a wooden board', 'burgers'],
  ['manwich-stack', 'The Manwich', 'Stacked Manwich halves with melted cheese and fries', 'subs'],
  ['rockets-jumbo-sub', 'Rockets jumbo sub', 'Jumbo sesame sub cut in half with fries', 'subs'],
  ['goreng-goreng', 'Goreng! Goreng!', 'Goreng with a fried egg, tomato and cucumber, seen from above', 'plates'],
];
const galleryItem = ([n, cap, alt, cat], i) => `<li data-cat="${cat}"><button type="button" data-full="${largest(n)}" data-caption="${esc(cap)}" aria-label="View photo: ${esc(cap)}"><div class="mask" style="--i:${i % 3}">${img(n, { alt, sizes: '(min-width:1400px) 23vw, (min-width:900px) 31vw, 48vw' })}</div><span class="cap">${esc(cap)}</span></button></li>`;
const LIGHTBOX = `<dialog class="lb" aria-label="Photo viewer">
  <div class="lb__bar"><span class="lb__count"></span><button class="lb__btn lb__close" type="button" aria-label="Close photo viewer">${ICON.close}</button></div>
  <div class="lb__stage"><img alt=""></div>
  <div class="lb__foot"><p></p><div class="lb__nav"><button class="lb__btn lb__prev" type="button" aria-label="Previous photo">${ICON.left}</button><button class="lb__btn lb__next" type="button" aria-label="Next photo">${ICON.arrow}</button></div></div>
</dialog>`;
const VCARDS = `<div class="vcards">
      <article class="vcard reveal">
        <h3>Dine-in &amp; takeaway</h3>
        <p class="big">Chaandhanee Magu, Malé</p>
        <address>Chaandhanee Magu, Malé 20046, Maldives</address>
        ${telList(PHONES.dine)}
        <a class="link-arrow" href="${L.maps}" ${ext}>Open in Google Maps ${ICON.up}</a>
      </article>
      <article class="vcard reveal" style="--i:1">
        <h3>Delivery House</h3>
        <p class="big">Hulhumalé</p>
        <p>Call the Delivery House or order online and we’ll bring it to you.</p>
        ${telList(PHONES.delivery)}
        <a class="link-arrow" href="menu.html?menu=delivery">See the delivery menu ${ICON.arrow}</a>
      </article>
      <article class="vcard vcard--accent reveal" style="--i:2">
        <h3>Hours &amp; contact</h3>
        <p class="big">Check today’s hours</p>
        <p>Opening hours are kept up to date on our Facebook page. For anything else, email <a href="mailto:${L.email}"><strong>${L.email}</strong></a>.</p>
        <a class="btn btn--dark" href="${L.facebook}" ${ext}>Hours on Facebook ${ICON.up}</a>
      </article>
    </div>`;
const CTA_BAND = `<section class="section band">
  <div class="wrap band__inner">
    <h2 class="display h-lg lines">${lines(['Hungry yet?'])}</h2>
    <div class="hero__cta reveal">
      <a class="btn btn--dark" href="order.html">Order Online ${ICON.arrow}</a>
      <a class="btn btn--line-dark" href="menu.html">Explore the Menu ${ICON.arrow}</a>
      <a class="btn btn--line-dark" href="contact.html">Visit Us ${ICON.arrow}</a>
    </div>
  </div>
</section>`;


function home() {
  const hero = META['burger-and-fries'];
  const preload = `<link rel="preload" as="image" imagesrcset="${hero.widths.map((w) => `${src('burger-and-fries', w)} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">\n`;
  return `${head({
    title: 'Big Man & Co — Grilled Burgers, Manwich & Jumbo Subs in Malé',
    desc: 'Big Man & Co on Chaandhanee Magu, Malé. Only grilled burgers, the Manwich, Rockets jumbo subs, W.T.F loaded fries and nachos. See the menu and order online.',
    path: '', preload,
  })}
<body>
${nav('home')}
<main id="main">

<section class="hero" id="top" data-spy="top">
  <div class="hero__media">${img('burger-and-fries', { alt: 'Grilled double cheeseburger with a pile of fries on a wooden board', eager: true })}</div>
  <div class="wrap hero__content">
    <p class="eyebrow fade">Chaandhanee Magu · Malé, Maldives</p>
    <h1 class="display h-xl lines">${lines(['Big Man', 'in the <em>house.</em>'])}</h1>
    <div class="hero__row">
      <p class="lede fade" style="--i:1">Only grilled burgers. The Manwich. Jumbo subs on fire. Loaded fries and nachos, piled high. 100% meat, always fresh.</p>
      <div class="hero__cta fade" style="--i:2">
        <a class="btn btn--primary" href="order.html">Order Online ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="menu.html">Explore the Menu ${ICON.arrow}</a>
      </div>
    </div>
    <ul class="hero__meta fade" style="--i:3">
      <li><strong>Dine-in &amp; takeaway</strong> · Malé</li>
      <li><strong>Delivery House</strong> · Hulhumalé</li>
      <li><strong>Since</strong> 2017</li>
    </ul>
  </div>
  <a class="scroll-cue" href="#signatures"><span>Scroll</span></a>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    ${[0, 1].map(() => `<ul>${MARQUEE.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`).join('\n    ')}
  </div>
</div>

<section class="section" id="signatures" data-spy="signatures">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">The signatures</p>
        <h2 class="display h-lg lines">${lines(['Built big.', 'Grilled only.'])}</h2>
      </div>
      <p class="lede reveal">The plates the house is known for, straight from the menu. Pick one to see every style, topping and price.</p>
    </header>
    <div class="sig">
      ${SIGS.map((s, i) => `<a class="sig__item" href="menu.html#${s.id}">
        <div class="sig__media mask" style="--i:${i % 3}"><div class="sig__inner">${img(s.img, { alt: s.alt, sizes: s.sizes })}</div></div>
        <span class="sig__go">${ICON.up}</span>
        <div class="sig__body">
          <span class="sig__num">0${i + 1}</span>
          <h3 class="display h-sm">${esc(s.title)}</h3>
          <p>${esc(s.desc)}</p>
          <span class="sig__price">from <b>${plain(s.from)}</b></span>
        </div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section theme-light" id="story" data-spy="story">
  <div class="wrap story">
    <div class="story__media">
      <div class="a mask">${img('cover-good-to-see-you', { alt: 'Big Man & Co menu cover reading “It’s good to see you!” over the bearded Big Man logo', sizes: '(min-width:900px) 40vw, 85vw', attrs: 'data-parallax="24"' })}</div>
      <div class="b mask" style="--i:2">${img('triple-burger', { alt: 'Triple-patty grilled burger with melted cheese', sizes: '(min-width:900px) 24vw, 45vw' })}</div>
    </div>
    <div class="story__text">
      <p class="eyebrow reveal">About Big Man &amp; Co</p>
      <h2 class="display h-lg lines">${lines(['It’s good', 'to see you!'])}</h2>
      <p class="lede reveal">That is the first line on our menu, and we mean it. Big Man is a restaurant on Chaandhanee Magu in Malé, with a Delivery House in Hulhumalé.</p>
      <p class="reveal">The burgers are grilled, never anything else, and the meat is 100% meat, always fresh. Build your own in six styles from Bigman to Ghost Pepper, or go straight for the Manwich, the king of sandwiches.</p>
      <p class="reveal">Beyond the bun there are Rockets jumbo subs, W.T.F loaded fries and nachos, pasta, wok plates and kebabs, plus local favourites like Valho King and the Keyolhu! nachos with valhomas and rihaakuru cheese.</p>
      <dl class="facts">
        <div class="reveal"><dt>2017</dt><dd>Premium quality since</dd></div>
        <div class="reveal" style="--i:1"><dt>100%</dt><dd>Meat, always fresh</dd></div>
        <div class="reveal" style="--i:2"><dt>6</dt><dd>Burger styles to choose from</dd></div>
        <div class="reveal" style="--i:3"><dt>11</dt><dd>Toppings, pick three free</dd></div>
      </dl>
      <p class="reveal"><a class="btn btn--dark" href="about.html">More about Big Man ${ICON.arrow}</a></p>
    </div>
  </div>
</section>

<section class="section" id="menu" data-spy="menu">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">Find your order</p>
        <h2 class="display h-lg lines">${lines(['Two menus.', 'One big appetite.'])}</h2>
      </div>
      <p class="lede reveal">Eating in or ordering to your door? Choose the menu that fits, then jump to any section.</p>
    </header>
    <div class="duo">
      <article class="duo__card reveal">
        ${img('yo-kebab', { alt: '', sizes: '(min-width:800px) 50vw, 100vw' })}
        <span class="duo__tag">Dine-in &amp; takeaway</span>
        <h3 class="display h-md">In-house menu</h3>
        <p>The full menu served at Chaandhanee Magu, Malé: ${SECTIONS.length} sections including dawgs, melts, wok plates, kebabs, shakes and coffee.</p>
        <div class="duo__actions">
          <a class="btn btn--primary btn--sm" href="menu.html">View in-house menu ${ICON.arrow}</a>
          <a class="btn btn--ghost btn--sm" href="${L.inhousePdf}" ${ext}>PDF ${ICON.up}</a>
        </div>
      </article>
      <article class="duo__card reveal" style="--i:1">
        ${img('goreng-bowl', { alt: '', sizes: '(min-width:800px) 50vw, 100vw' })}
        <span class="duo__tag">BM Delivery House · Hulhumalé</span>
        <h3 class="display h-md">Delivery menu</h3>
        <p>Burgers, the Manwich, loaded fries and nachos, Rockets, Chip Chop, pasta and goreng, with delivery prices.</p>
        <div class="duo__actions">
          <a class="btn btn--primary btn--sm" href="menu.html?menu=delivery">View delivery menu ${ICON.arrow}</a>
          <a class="btn btn--ghost btn--sm" href="${L.deliveryPdf}" ${ext}>PDF ${ICON.up}</a>
          <a class="btn btn--ghost btn--sm" href="order.html">Order online ${ICON.up}</a>
        </div>
      </article>
    </div>
    <ol class="cats">
      ${SECTIONS.map((s, i) => `<li class="reveal"><a href="menu.html#${s.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(s.title)}<span class="d">${esc(s.short)}</span></span><span class="p">from <b>${plain(s.from)}</b></span>${ICON.arrow}</a></li>`).join('\n      ')}
    </ol>
    <p class="fineprint">In-house prices shown. All prices are subject to GST &amp; service charge.</p>
  </div>
</section>

<section class="section theme-coal" id="gallery" data-spy="gallery">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">Gallery</p>
        <h2 class="display h-lg lines">${lines(['Straight off', 'the grill.'])}</h2>
      </div>
      <p class="lede reveal">Big Man’s own food photography. Tap any photo to see it larger.</p>
    </header>
    <ul class="gallery">
      ${GALLERY.slice(0, 8).map(galleryItem).join('\n      ')}
    </ul>
    <div class="social">
      <p class="reveal">New plates, combos and promos land on our socials first. Follow <strong>@bigman.ith</strong>.</p>
      <div class="reveal" style="--i:1">
        <a class="btn btn--primary" href="gallery.html">View the full gallery ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="${L.instagram}" ${ext}>Instagram ${ICON.up}</a>
        <a class="btn btn--ghost" href="${L.facebook}" ${ext}>Facebook ${ICON.up}</a>
      </div>
    </div>
  </div>
</section>

<section class="section visit" id="visit" data-spy="visit">
  <div class="visit__bg">${img('wtf-nachos', { alt: '', attrs: 'data-parallax="50"' })}</div>
  <div class="wrap">
    <header class="visit__head">
      <p class="eyebrow reveal">Visit us</p>
      <h2 class="display h-xl lines">${lines(['Come', 'hungry.'])}</h2>
      <div class="hero__cta reveal">
        <a class="btn btn--primary" href="order.html">Order Online ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="${L.maps}" ${ext}>Get Directions ${ICON.up}</a>
      </div>
    </header>
    ${VCARDS}
    <p class="reveal" style="margin-top:2rem"><a class="link-arrow" href="contact.html">All the ways to reach us ${ICON.arrow}</a></p>
  </div>
</section>

</main>
${footer('home')}

${LIGHTBOX}
</body>
</html>
`;
}

/* ---------- Menu page ---------- */
const both = (inP, delP) => (delP === undefined || delP === inP ? price(inP) : `<span class="p-in">${price(inP)}</span><span class="p-del">${price(delP)}</span>`);

function block(b) {
  if (b.type === 'prices') {
    const hd = b.heading || b.note ? `<div class="mblock__h">${b.heading ? `<h3>${esc(b.heading)}</h3>` : '<span></span>'}${b.note ? `<span class="mblock__note">${esc(b.note)}</span>` : ''}</div>` : '';
    const rows = b.rows.map((r) => `<li class="mrow"><span class="mrow__name">${esc(r.name)}</span>${r.variants ? '' : `<span class="mrow__price">${both(r.in, r.del)}</span>`}${r.desc ? `<span class="mrow__desc">${esc(r.desc)}</span>` : ''}${r.variants ? `<span class="mrow__variants">${r.variants.map(([l, p]) => `<span>${esc(l)} ${price(p)}</span>`).join('')}</span>` : ''}</li>`).join('\n          ');
    return `<div class="mblock">${hd}<ul>\n          ${rows}\n        </ul></div>`;
  }
  if (b.type === 'chips') return `<div class="mblock"><p class="mblock__label">${esc(b.label)}</p><ul class="tags">${b.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
  return `<div class="mblock mblock--extras"><p class="mblock__label">${esc(b.label)}</p><ul class="xlist">${b.rows.map(([n, p]) => `<li><span>${esc(n)}</span><b>${plain(p)}</b></li>`).join('')}</ul></div>`;
}

function menu() {
  return `${head({
    title: 'Menu — Big Man & Co, Malé',
    desc: 'The full Big Man & Co menu with prices: build-your-own grilled burgers, Huntsman burgers, the Manwich, W.T.F loaded fries and nachos, Rockets jumbo subs, pasta, goreng, kebabs and shakes. In-house and delivery.',
    path: 'menu.html',
  })}
<body class="has-orderbar">
${nav('menu')}
<main id="main">

<header class="phead">
  <div class="phead__bg">${img('pasta-pan', { alt: '', eager: true })}</div>
  <div class="wrap phead__grid">
    <div>
      <p class="eyebrow fade">Big Man &amp; Co · Malé</p>
      <h1 class="display h-xl lines" style="margin-top:1rem">${lines(['The Menu'])}</h1>
      <p class="lede fade" style="--i:1">Every section, style and price from the Big Man menu. Switch between dining in and delivery.</p>
    </div>
    <div class="fade" style="--i:2">
      <fieldset class="switch" style="margin:0">
        <legend class="sr-only">Choose a menu</legend>
        <input type="radio" name="menu" id="m-in" value="inhouse" checked><label for="m-in">In-house</label>
        <input type="radio" name="menu" id="m-del" value="delivery"><label for="m-del">Delivery</label>
      </fieldset>
      <p class="switch__note only-in">Dine-in &amp; takeaway · Chaandhanee Magu, Malé</p>
      <p class="switch__note only-del">BM Delivery House · Hulhumalé</p>
    </div>
  </div>
</header>

<nav class="chipbar" aria-label="Menu sections">
  <ul>
    ${SECTIONS.map((s) => `<li data-delivery="${s.delivery}"><a href="#${s.id}" data-spy-link="${s.id}">${esc(s.title)}</a></li>`).join('\n    ')}
  </ul>
</nav>

<div class="wrap">
  ${SECTIONS.map((s) => `<section class="msec${s.wide ? ' msec--wide' : ''}${s.noImage ? ' msec--text' : ''}" id="${s.id}" data-spy="${s.id}" data-delivery="${s.delivery}" aria-labelledby="${s.id}-h">
    ${s.noImage ? '' : `<div class="msec__media mask">${img(s.img, { alt: s.alt, sizes: s.wide ? '100vw' : '(min-width:900px) 42vw, 100vw' })}</div>`}
    <div>
      <div class="msec__head"><h2 class="display h-md" id="${s.id}-h">${esc(s.title)}</h2>${s.delivery ? '' : '<span class="badge">In-house only</span>'}</div>
      <p class="msec__kicker">${esc(s.kicker)}</p>
      <div class="mblocks">
        ${s.blocks.map(block).join('\n        ')}
      </div>
    </div>
  </section>`).join('\n  ')}

  <section class="mend">
    <h2 class="display h-lg lines">${lines(['Ready when', 'you are.'])}</h2>
    <p class="only-in reveal">All prices are subject to GST &amp; service charge. This page follows the official in-house menu; the PDF is the original.</p>
    <p class="only-del reveal">All prices are subject to GST &amp; delivery charge. This page follows the official BM Delivery House menu (July 2024); the PDF is the original.</p>
    <div class="hero__cta reveal">
      <a class="btn btn--primary" href="order.html">Order Online ${ICON.arrow}</a>
      <a class="btn btn--ghost only-in" href="${L.inhousePdf}" ${ext}>In-house menu PDF ${ICON.up}</a>
      <a class="btn btn--ghost only-del" href="${L.deliveryPdf}" ${ext}>Delivery menu PDF ${ICON.up}</a>
      <a class="btn btn--ghost only-in" href="tel:${PHONES.dine[0][0]}">Call +960 ${PHONES.dine[0][1]}</a>
      <a class="btn btn--ghost only-del" href="tel:${PHONES.delivery[0][0]}">Call +960 ${PHONES.delivery[0][1]}</a>
    </div>
  </section>
</div>

</main>
${footer('menu')}
<div class="orderbar">
  <a class="btn btn--primary" href="order.html">Order Online ${ICON.arrow}</a>
</div>
</body>
</html>
`;
}

/* ---------- Shared page header ---------- */
const phead = ({ bg, eyebrow, title, lede }) => `<header class="phead">
  <div class="phead__bg">${img(bg, { alt: '', eager: true })}</div>
  <div class="wrap">
    <p class="eyebrow fade">${eyebrow}</p>
    <h1 class="display h-xl lines" style="margin-top:1rem">${lines(title)}</h1>
    <p class="lede fade" style="--i:1">${lede}</p>
  </div>
</header>`;

/* ---------- About ---------- */
function about() {
  const toppings = SECTIONS[0].blocks.find((b) => b.label && b.label.startsWith('Toppings')).items;
  const lineup = SECTIONS.filter((s) => !s.noImage);
  return `${head({
    title: 'About — Big Man & Co, Malé',
    desc: 'About Big Man & Co: only grilled burgers, 100% meat that is always fresh, the Manwich, jumbo subs and Maldivian favourites, on Chaandhanee Magu in Malé since 2017.',
    path: 'about.html',
  })}
<body>
${nav('about')}
<main id="main">
${phead({ bg: 'triple-burger', eyebrow: 'About Big Man &amp; Co', title: ['Big food.', 'No shortcuts.'], lede: 'A restaurant on Chaandhanee Magu in Malé, with a Delivery House in Hulhumalé. Premium quality since 2017.' })}

<section class="section theme-light">
  <div class="wrap story">
    <div class="story__media">
      <div class="a mask">${img('cover-good-to-see-you', { alt: 'Big Man & Co menu cover reading “It’s good to see you!” over the bearded Big Man logo', sizes: '(min-width:900px) 40vw, 85vw', attrs: 'data-parallax="24"' })}</div>
      <div class="b mask" style="--i:2">${img('manwich', { alt: 'Toasted Manwich branded with its name, served with fries', sizes: '(min-width:900px) 24vw, 45vw' })}</div>
    </div>
    <div class="story__text">
      <p class="eyebrow reveal">The house</p>
      <h2 class="display h-lg lines">${lines(['It’s good', 'to see you!'])}</h2>
      <p class="lede reveal">That is the first line on our menu, and we mean it. Big Man serves grilled burgers and a sandwich with its own name branded into the bread.</p>
      <p class="reveal">You can eat in or take away at Chaandhanee Magu, or have it brought to you from the BM Delivery House in Hulhumalé. Either way the menu works the same: pick your plate, pick your protein, pick your style.</p>
      <p class="reveal">Alongside the burgers and subs you will find local favourites: Valho King over rice, rotti, pasta or noodles, and the Keyolhu! nachos with valhomas and rihaakuru cheese.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">What we stand for</p>
        <h2 class="display h-lg lines">${lines(['Three rules', 'of the house.'])}</h2>
      </div>
      <p class="lede reveal">They are printed on the menu, so we are held to them.</p>
    </header>
    <ol class="rules">
      <li class="reveal"><span class="rules__n">01</span><h3 class="display h-md">Only grilled burgers</h3><p>Every burger comes off the grill. Beef, chicken or lamb.</p></li>
      <li class="reveal" style="--i:1"><span class="rules__n">02</span><h3 class="display h-md">100% meat, always fresh</h3><p>It says so on the first page of the burger menu, right next to the prices.</p></li>
      <li class="reveal" style="--i:2"><span class="rules__n">03</span><h3 class="display h-md">Premium quality since 2017</h3><p>The badge on our dawgs page, and the standard for everything else.</p></li>
    </ol>
  </div>
</section>

<section class="section theme-coal">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">Make it yours</p>
        <h2 class="display h-lg lines">${lines(['Six styles.', 'Eleven toppings.'])}</h2>
      </div>
      <p class="lede reveal">Build Your Burger starts with a Classic Double or a Triple . Triple. Then choose a style and any three toppings, free.</p>
    </header>
    <div class="make">
      <div class="reveal"><p class="mblock__label">Style</p><ul class="tags tags--lg">${STYLES.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      <div class="reveal" style="--i:1"><p class="mblock__label">Toppings (free × 3)</p><ul class="tags tags--lg">${toppings.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    </div>
    <p class="reveal" style="margin-top:2.5rem"><a class="btn btn--primary" href="menu.html#build-your-burger">Build your burger ${ICON.arrow}</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">The line-up</p>
        <h2 class="display h-lg lines">${lines(['Every name', 'on the menu.'])}</h2>
      </div>
      <p class="lede reveal">Each section of the Big Man menu has its own name. Tap one to see what is in it.</p>
    </header>
    <ul class="lineup">
      ${lineup.map((s, i) => `<li><a href="menu.html#${s.id}"><div class="mask" style="--i:${i % 4}">${img(s.img, { alt: s.alt, sizes: '(min-width:1100px) 23vw, (min-width:700px) 31vw, 48vw' })}</div><h3 class="display h-sm">${esc(s.title)}</h3><p>${esc(s.kicker)}</p></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

${CTA_BAND}
</main>
${footer('about')}
</body>
</html>
`;
}

/* ---------- Gallery ---------- */
function gallery() {
  return `${head({
    title: 'Gallery — Big Man & Co, Malé',
    desc: 'Food photography from Big Man & Co in Malé: grilled burgers, the Manwich, Rockets jumbo subs, loaded nachos, wok plates, kebabs and shakes.',
    path: 'gallery.html',
  })}
<body>
${nav('gallery')}
<main id="main">
${phead({ bg: 'wtf-nachos', eyebrow: 'Gallery', title: ['Straight off', 'the grill.'], lede: 'Big Man’s own food photography, from the burgers to the shakes. Tap any photo to see it larger.' })}

<section class="section" style="padding-top:clamp(2rem,4vw,3.5rem)">
  <div class="wrap">
    <div class="filters reveal" role="group" aria-label="Filter photos">
      <button type="button" class="is-on" aria-pressed="true" data-filter="all">All <small>${GALLERY.length}</small></button>
      ${Object.entries(CATS).map(([k, v]) => `<button type="button" aria-pressed="false" data-filter="${k}">${esc(v)} <small>${GALLERY.filter((g) => g[3] === k).length}</small></button>`).join('\n      ')}
    </div>
    <ul class="gallery">
      ${GALLERY.map(galleryItem).join('\n      ')}
    </ul>
    <div class="social">
      <p class="reveal">New plates, combos and promos land on our socials first. Follow <strong>@bigman.ith</strong>.</p>
      <div class="reveal" style="--i:1">
        <a class="btn btn--ghost" href="${L.instagram}" ${ext}>Instagram ${ICON.up}</a>
        <a class="btn btn--ghost" href="${L.facebook}" ${ext}>Facebook ${ICON.up}</a>
      </div>
    </div>
  </div>
</section>

${CTA_BAND}
</main>
${footer('gallery')}
${LIGHTBOX}
</body>
</html>
`;
}

/* ---------- Visit / contact ---------- */
function contact() {
  return `${head({
    title: 'Visit Us & Contact — Big Man & Co, Malé',
    desc: 'Find Big Man & Co on Chaandhanee Magu, Malé. Call +960 919 9333, order online, or ring the Delivery House in Hulhumalé on +960 944 6699.',
    path: 'contact.html',
  })}
<body>
${nav('contact')}
<main id="main">
${phead({ bg: 'burger-and-fries', eyebrow: 'Visit us', title: ['Come', 'hungry.'], lede: 'Dine in or take away on Chaandhanee Magu in Malé, or get it delivered from our Delivery House in Hulhumalé.' })}

<section class="section" style="padding-top:clamp(2rem,4vw,3.5rem)">
  <div class="wrap">
    ${VCARDS}
  </div>
</section>

<section class="section theme-light">
  <div class="wrap">
    <header class="shead">
      <div>
        <p class="eyebrow reveal">Three ways to eat</p>
        <h2 class="display h-lg lines">${lines(['Pick your', 'route.'])}</h2>
      </div>
      <p class="lede reveal">However you want it, the next step is one tap away.</p>
    </header>
    <ol class="ways">
      <li class="reveal">
        <span class="ways__n">01</span>
        <div><h3 class="display h-md">Order online</h3><p>Use our online ordering to put your order together from your phone.</p></div>
        <a class="btn btn--dark" href="order.html">Order Online ${ICON.arrow}</a>
      </li>
      <li class="reveal">
        <span class="ways__n">02</span>
        <div><h3 class="display h-md">Call for delivery</h3><p>Ring the BM Delivery House in Hulhumalé. Delivery prices are subject to GST &amp; delivery charge.</p></div>
        <a class="btn btn--line-dark" href="tel:${PHONES.delivery[0][0]}">+960 ${PHONES.delivery[0][1]}</a>
      </li>
      <li class="reveal">
        <span class="ways__n">03</span>
        <div><h3 class="display h-md">Walk in</h3><p>Dine in or take away at Chaandhanee Magu, Malé. In-house prices are subject to GST &amp; service charge.</p></div>
        <a class="btn btn--line-dark" href="${L.maps}" ${ext}>Get Directions ${ICON.up}</a>
      </li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="wrap reach">
    <div>
      <p class="eyebrow reveal">Get in touch</p>
      <h2 class="display h-lg lines">${lines(['Say hello.'])}</h2>
    </div>
    <ul class="reach__list">
      <li class="reveal"><span>Email</span><a href="mailto:${L.email}">${L.email}</a></li>
      ${PHONES.dine.map(([n, t]) => `<li class="reveal"><span>Malé</span><a href="tel:${n}">+960 ${t}</a></li>`).join('\n      ')}
      <li class="reveal"><span>Delivery House</span><a href="tel:${PHONES.delivery[0][0]}">+960 ${PHONES.delivery[0][1]}</a></li>
      <li class="reveal"><span>Instagram</span><a href="${L.instagram}" ${ext}>@bigman.ith</a></li>
      <li class="reveal"><span>Facebook</span><a href="${L.facebook}" ${ext}>facebook.com/bigman.ith</a></li>
    </ul>
  </div>
</section>
</main>
${footer('contact')}
</body>
</html>
`;
}

/* ---------- 404 ---------- */
function notFound() {
  return `${head({ title: 'Page not found — Big Man & Co', desc: 'That page is not on the menu.', path: '404.html', noindex: true })}
<body>
${nav('404')}
<main id="main">
<section class="hero" style="align-items:center">
  <div class="hero__media">${img('pasta-pan', { alt: '', eager: true })}</div>
  <div class="wrap hero__content">
    <p class="eyebrow fade">Error 404</p>
    <h1 class="display h-xl lines">${lines(['Not on', 'the <em>menu.</em>'])}</h1>
    <p class="lede fade" style="--i:1">We could not find that page. Everything we do serve is one tap away.</p>
    <div class="hero__cta fade" style="--i:2;justify-content:flex-start">
      <a class="btn btn--primary" href="menu.html">Explore the Menu ${ICON.arrow}</a>
      <a class="btn btn--ghost" href="index.html">Back to Home ${ICON.arrow}</a>
    </div>
  </div>
</section>
</main>
${footer('404')}
</body>
</html>
`;
}

/* ---------- Order ---------- */
function order() {
  const config = { whatsapp: WHATSAPP, options: OPTIONS };
  const item = (cat) => ([name, p, desc]) => `<li class="oitem" data-name="${esc(name)}" data-price="${p === null ? '' : p}" data-opts="${cat.opts.join(',')}">
          <div class="oitem__text"><h3>${esc(name)}</h3>${desc ? `<p>${esc(desc)}</p>` : ''}</div>
          <div class="oitem__buy">${p === null ? '<span class="oitem__tbc">Price on confirmation</span>' : price(p)}<button type="button" class="oitem__add" aria-label="Add ${esc(name)} to order">Add <span aria-hidden="true">+</span></button></div>
        </li>`;
  return `${head({
    title: 'Order Online — Big Man & Co, Hulhumalé Delivery',
    desc: 'Order Big Man & Co for delivery from the BM Delivery House in Hulhumalé: grilled burgers, the Manwich, Duper Pizza, loaded fries, Rockets subs and more. Build your order and send it in one tap.',
    path: 'order.html',
  })}
<body class="has-cartbar">
${nav('order')}
<main id="main">

<header class="phead phead--slim">
  <div class="phead__bg">${img('burger-and-fries', { alt: '', eager: true })}</div>
  <div class="wrap">
    <p class="eyebrow fade">BM Delivery House · Hulhumalé</p>
    <h1 class="display h-lg lines" style="margin-top:1rem">${lines(['Order online'])}</h1>
    <p class="lede fade" style="--i:1">Build your order, then send it straight to the Delivery House. Prices in MVR, before GST &amp; delivery charge.</p>
  </div>
</header>

<nav class="chipbar" aria-label="Order sections">
  <ul>
    ${CATALOGUE.map((c) => `<li><a href="#${c.id}" data-spy-link="${c.id}">${esc(c.title)}</a></li>`).join('\n    ')}
  </ul>
</nav>

<div class="wrap olayout">
  <div class="ocats">
    ${CATALOGUE.map((c) => `<section class="ocat" id="${c.id}" data-spy="${c.id}" aria-labelledby="${c.id}-h">
      <header class="ocat__head">
        ${c.img ? `<div class="ocat__thumb">${img(c.img, { alt: '', sizes: '96px' })}</div>` : ''}
        <div><h2 class="display h-md" id="${c.id}-h">${esc(c.title)}</h2>${c.note ? `<p>${esc(c.note)}</p>` : ''}</div>
      </header>
      <ul class="oitems">
        ${c.items.map(item(c)).join('\n        ')}
      </ul>
    </section>`).join('\n    ')}
  </div>

  <aside class="cart" id="cart" aria-label="Your order">
    <div class="cart__head">
      <h2 class="display h-sm">Your order <span class="cart__count" data-cart-count>0</span></h2>
      <button type="button" class="lb__btn cart__close" aria-label="Close your order">${ICON.close}</button>
    </div>
    <p class="cart__empty">Nothing here yet. Tap <strong>Add</strong> on anything you fancy.</p>
    <div class="cart__body" hidden>
      <ul class="cart__list"></ul>
      <div class="cart__sum"><span>Estimated subtotal</span><strong class="cart__subtotal">MVR 0.00</strong></div>
      <p class="cart__fine cart__tbc" hidden>Items marked “To confirm” are priced by Big Man when they reply.</p>
      <p class="cart__fine">GST and delivery charge are added on top. Big Man confirms the final total and how to pay.</p>
      <form class="checkout">
        <h3>Delivery details</h3>
        <label>Name<input name="name" autocomplete="name" required></label>
        <label>Phone<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
        <label>Delivery address<textarea name="address" rows="2" autocomplete="street-address" required></textarea></label>
        <label>Note for the kitchen <small>(optional)</small><input name="note"></label>
        <button class="btn btn--primary" type="submit">Send order on WhatsApp ${ICON.arrow}</button>
        <div class="checkout__row">
          <a class="btn btn--ghost btn--sm" href="tel:${PHONES.delivery[0][0]}">Call ${PHONES.delivery[0][1]}</a>
          <button type="button" class="btn btn--ghost btn--sm checkout__copy">Copy order</button>
        </div>
        <a class="link-arrow" href="${L.orderApp}" ${ext}>Use Big Man’s ordering app instead ${ICON.up}</a>
      </form>
      <button type="button" class="cart__clear">Clear order</button>
    </div>
  </aside>
</div>

</main>
${footer('order')}

<div class="cartbar" hidden>
  <button type="button" class="btn btn--primary cartbar__open" aria-expanded="false" aria-controls="cart">
    <span>View order · <span data-cart-count>0</span></span><span class="cartbar__total">MVR 0.00</span>
  </button>
</div>

<dialog class="optdlg" aria-labelledby="optdlg-title">
  <form method="dialog">
    <div class="optdlg__head">
      <h2 class="display h-sm optdlg__title" id="optdlg-title"></h2>
      <button type="button" class="lb__btn" data-close aria-label="Close">${ICON.close}</button>
    </div>
    <div class="optdlg__groups"></div>
    <label class="optdlg__note" for="opt-note">Special request <small>(optional)</small><input id="opt-note" name="note" maxlength="140"></label>
    <div class="optdlg__foot">
      <div class="qty optdlg__qty" role="group" aria-label="Quantity"><button type="button" data-act="dec" aria-label="One fewer">−</button><output>1</output><button type="button" data-act="inc" aria-label="One more">+</button></div>
      <button class="btn btn--primary" type="submit"><span>Add to order</span><span class="optdlg__total"></span></button>
    </div>
  </form>
</dialog>
<div class="toast" role="status" aria-live="polite"></div>
<script type="application/json" id="order-config">${JSON.stringify(config).replace(/</g, '\\u003c')}</script>
<script src="assets/js/order.js" defer></script>
</body>
</html>
`;
}

const PAGES = { 'index.html': home, 'menu.html': menu, 'about.html': about, 'gallery.html': gallery, 'contact.html': contact, 'order.html': order, '404.html': notFound };
for (const [file, fn] of Object.entries(PAGES)) writeFileSync(join(root, file), fn());

const indexed = Object.keys(PAGES).filter((f) => f !== '404.html');
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map((f) => `  <url><loc>${SITE}/${f === 'index.html' ? '' : f}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(root, 'site.webmanifest'), JSON.stringify({
  name: 'Big Man & Co', short_name: 'Big Man', start_url: 'index.html', display: 'browser', background_color: '#0d0d0d', theme_color: '#0d0d0d',
  icons: [{ src: 'assets/img/brand/logo-square-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2) + '\n');
console.log(`Built ${Object.keys(PAGES).join(', ')}, sitemap.xml, robots.txt, site.webmanifest`);
