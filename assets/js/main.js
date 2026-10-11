// Big Man & Co — interactions. No dependencies.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Nav: solid on scroll ---- */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = $('.nav__toggle');
  const mmenu = $('#mobile-menu');
  if (toggle && mmenu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mmenu.classList.toggle('is-open', open);
      mmenu.inert = !open;
      document.body.classList.toggle('is-locked', open);
      if (open) nav.classList.add('is-solid'); else onScroll();
    };
    setOpen(false);
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    mmenu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    matchMedia('(min-width: 960px)').addEventListener('change', (e) => e.matches && setOpen(false));
  }

  /* ---- Scroll reveals ---- */
  const targets = $$('.reveal, .mask, .lines');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('is-in'));
  }

  /* ---- Subtle parallax on selected large photographs ---- */
  const px = $$('[data-parallax]');
  if (px.length && !reduce && matchMedia('(min-width: 800px)').matches) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      for (const el of px) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around the viewport centre
        el.style.transform = `translate3d(0, ${(p * Number(el.dataset.parallax || 40)).toFixed(1)}px, 0)`;
      }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---- Active link for in-page sections ---- */
  const spy = $$('[data-spy]');
  if (spy.length && 'IntersectionObserver' in window) {
    const links = $$('a[data-spy-link]');
    const setCurrent = (id) => links.forEach((a) => {
      if (a.dataset.spyLink === id) a.setAttribute('aria-current', a.closest('.chipbar') ? 'true' : 'location');
      else a.removeAttribute('aria-current');
    });
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        setCurrent(en.target.dataset.spy);
        const chip = $(`.chipbar a[data-spy-link="${en.target.dataset.spy}"]`);
        if (chip) {
          const bar = chip.closest('ul');
          bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
        }
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    spy.forEach((s) => io.observe(s));
  }

  /* ---- Gallery lightbox ---- */
  const lb = $('.lb');
  const allThumbs = $$('.gallery button');
  if (lb && allThumbs.length) {
    let thumbs = allThumbs;
    const img = $('.lb__stage img', lb);
    const cap = $('.lb__foot p', lb);
    const count = $('.lb__count', lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + thumbs.length) % thumbs.length;
      const t = thumbs[idx];
      const src = $('img', t);
      img.srcset = ''; img.src = t.dataset.full; img.alt = src.alt;
      img.width = src.width; img.height = src.height;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      cap.textContent = t.dataset.caption;
      count.textContent = `${idx + 1} / ${thumbs.length}`;
    };
    const open = (t) => {
      thumbs = allThumbs.filter((b) => !b.closest('li').hidden);
      const i = thumbs.indexOf(t);
      const thumbImg = $('img', t);
      const run = () => { show(i); lb.showModal(); };
      if (document.startViewTransition && !reduce) {
        thumbImg.style.viewTransitionName = 'lb-photo';
        const vt = document.startViewTransition(() => {
          thumbImg.style.viewTransitionName = '';
          img.style.viewTransitionName = 'lb-photo';
          run();
        });
        vt.finished.finally(() => { img.style.viewTransitionName = ''; });
      } else run();
    };
    allThumbs.forEach((t) => t.addEventListener('click', () => open(t)));
    $('.lb__close', lb).addEventListener('click', () => lb.close());
    $('.lb__prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb__next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb__stage')) lb.close(); });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('close', () => thumbs[idx].focus());
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---- Gallery filters ---- */
  const filters = $$('.filters button');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    $$('.gallery li').forEach((li) => {
      li.hidden = btn.dataset.filter !== 'all' && li.dataset.cat !== btn.dataset.filter;
      li.classList.remove('is-swap'); void li.offsetWidth;
      if (!li.hidden && !reduce) li.classList.add('is-swap');
      $('.mask', li)?.classList.add('is-in');
    });
  }));

  /* ---- Branded wipe between the site's own pages ---- */
  if (!reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      try { sessionStorage.setItem('bm-nav', '1'); } catch {}
      root.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 400);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('is-leaving', 'from-nav'); });
  }

  /* ---- Menu page: keep the in-house / delivery choice in the URL ---- */
  const radios = $$('input[name="menu"]');
  if (radios.length) {
    const want = new URLSearchParams(location.search).get('menu');
    $(want === 'delivery' ? '#m-del' : '#m-in').checked = true;
    // Sections can hide once the choice is applied, so re-align a deep link.
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    radios.forEach((r) => r.addEventListener('change', () => {
      const u = new URL(location.href);
      if (r.value === 'delivery') u.searchParams.set('menu', 'delivery'); else u.searchParams.delete('menu');
      history.replaceState(null, '', u);
    }));
  }
})();
