// Big Man & Co — order page: cart, item options and hand-off. No dependencies.
// Nothing is sent to a server: the cart lives in this browser and the finished
// order is handed to WhatsApp, a phone call or Big Man's ordering app.
(() => {
  const cfg = JSON.parse(document.getElementById('order-config').textContent);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = (n) => n.toFixed(2);
  const KEY = 'bm-cart-v1';

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const els = {
    list: $('.cart__list'), empty: $('.cart__empty'), body: $('.cart__body'), subtotal: $('.cart__subtotal'),
    tbc: $('.cart__tbc'), counts: $$('[data-cart-count]'), barTotal: $('.cartbar__total'), bar: $('.cartbar'),
    cart: $('.cart'), toast: $('.toast'), dlg: $('.optdlg'), form: $('.optdlg form'),
  };

  /* ---- Cart model ---- */
  const lineTotal = (l) => (l.price === null ? null : (l.price + l.extra) * l.qty);
  const sameLine = (a, b) => a.name === b.name && a.detail === b.detail;
  function add(line) {
    const hit = cart.find((l) => sameLine(l, line));
    if (hit) hit.qty += line.qty; else cart.push(line);
    save(); render(); toast(`${line.name} added`);
  }

  function render() {
    const qty = cart.reduce((n, l) => n + l.qty, 0);
    const sub = cart.reduce((n, l) => n + (lineTotal(l) ?? 0), 0);
    const tbc = cart.some((l) => l.price === null);
    els.list.innerHTML = '';
    cart.forEach((l, i) => {
      const li = document.createElement('li');
      li.className = 'cline';
      const t = lineTotal(l);
      li.innerHTML = `<div class="cline__main"><strong></strong><span class="cline__detail"></span></div>
        <span class="cline__price">${t === null ? 'To confirm' : money(t)}</span>
        <div class="qty" role="group"><button type="button" data-act="dec" aria-label="Remove one">−</button><output>${l.qty}</output><button type="button" data-act="inc" aria-label="Add one">+</button></div>
        <button type="button" class="cline__rm" data-act="rm">Remove</button>`;
      $('strong', li).textContent = l.name;
      $('.cline__detail', li).textContent = l.detail;
      $('.qty', li).setAttribute('aria-label', `Quantity of ${l.name}`);
      li.dataset.i = i;
      els.list.append(li);
    });
    els.empty.hidden = cart.length > 0;
    els.body.hidden = cart.length === 0;
    els.subtotal.textContent = `MVR ${money(sub)}`;
    els.tbc.hidden = !tbc;
    els.counts.forEach((c) => { c.textContent = qty; });
    els.barTotal.textContent = `MVR ${money(sub)}`;
    els.bar.hidden = cart.length === 0;
  }

  els.list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const i = Number(btn.closest('li').dataset.i);
    if (btn.dataset.act === 'inc') cart[i].qty += 1;
    if (btn.dataset.act === 'dec') cart[i].qty -= 1;
    if (btn.dataset.act === 'rm' || cart[i].qty < 1) cart.splice(i, 1);
    save(); render();
  });
  $('.cart__clear').addEventListener('click', () => { cart = []; save(); render(); });

  /* ---- Toast ---- */
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('is-on'), 2200);
  }

  /* ---- Add buttons + options dialog ---- */
  let pending = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.oitem__add');
    if (!btn) return;
    const li = btn.closest('.oitem');
    const item = { name: li.dataset.name, price: li.dataset.price === '' ? null : Number(li.dataset.price) };
    const opts = (li.dataset.opts || '').split(',').filter(Boolean);
    if (!opts.length) return add({ ...item, extra: 0, detail: '', qty: 1 });
    pending = { item, opts };
    openOptions();
  });

  function openOptions() {
    const { item, opts } = pending;
    $('.optdlg__title').textContent = item.name;
    const wrap = $('.optdlg__groups');
    wrap.innerHTML = '';
    opts.forEach((key) => {
      const def = cfg.options[key];
      const fs = document.createElement('fieldset');
      fs.dataset.key = key;
      const lg = document.createElement('legend');
      lg.textContent = def.label;
      fs.append(lg);
      const box = document.createElement('div');
      box.className = 'optchips';
      def.choices.forEach((c, n) => {
        const [name, price] = Array.isArray(c) ? c : [c, 0];
        const id = `opt-${key}-${n}`;
        const input = document.createElement('input');
        input.type = def.type === 'one' ? 'radio' : 'checkbox';
        input.name = key; input.id = id; input.value = name; input.dataset.price = price;
        if (def.type === 'one') { input.required = true; if (n === 0) input.checked = true; }
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = price ? `${name} +${price}` : name;
        box.append(input, label);
      });
      fs.append(box);
      wrap.append(fs);
    });
    $('#opt-note').value = '';
    $('.optdlg__qty output').textContent = '1';
    updateOptTotal();
    els.dlg.showModal();
  }

  function readOptions() {
    const parts = []; let extra = 0;
    $$('fieldset[data-key]', els.form).forEach((fs) => {
      const def = cfg.options[fs.dataset.key];
      const picked = $$('input:checked', fs);
      if (!picked.length) return;
      extra += picked.reduce((n, p) => n + Number(p.dataset.price), 0);
      parts.push(`${def.label.replace(/ \(.*\)| on top\?/g, '')}: ${picked.map((p) => p.value).join(', ')}`);
    });
    const note = $('#opt-note').value.trim();
    if (note) parts.push(`Note: ${note}`);
    return { detail: parts.join(' · '), extra };
  }
  function updateOptTotal() {
    const { extra } = readOptions();
    const qty = Number($('.optdlg__qty output').textContent);
    const p = pending.item.price;
    $('.optdlg__total').textContent = p === null ? 'Price to confirm' : `MVR ${money((p + extra) * qty)}`;
  }
  els.form.addEventListener('change', (e) => {
    const fs = e.target.closest('fieldset[data-key]');
    if (fs) {
      const def = cfg.options[fs.dataset.key];
      if (def.max && $$('input:checked', fs).length > def.max) { e.target.checked = false; toast(`Choose up to ${def.max}`); }
    }
    updateOptTotal();
  });
  $('.optdlg__qty').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const out = $('.optdlg__qty output');
    out.textContent = Math.max(1, Number(out.textContent) + (b.dataset.act === 'inc' ? 1 : -1));
    updateOptTotal();
  });
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { detail, extra } = readOptions();
    add({ ...pending.item, extra, detail, qty: Number($('.optdlg__qty output').textContent) });
    els.dlg.close();
  });
  $$('.optdlg [data-close]').forEach((b) => b.addEventListener('click', () => els.dlg.close()));
  els.dlg.addEventListener('click', (e) => { if (e.target === els.dlg) els.dlg.close(); });

  /* ---- Mobile cart drawer ---- */
  const setDrawer = (open) => {
    els.cart.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    $('.cartbar__open').setAttribute('aria-expanded', String(open));
    if (open) $('.cart__close').focus();
  };
  $('.cartbar__open').addEventListener('click', () => setDrawer(true));
  $('.cart__close').addEventListener('click', () => setDrawer(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && els.cart.classList.contains('is-open')) setDrawer(false); });

  /* ---- Hand-off ---- */
  function message() {
    const f = $('.checkout');
    const v = (n) => f.elements[n].value.trim();
    const lines = cart.map((l) => {
      const t = lineTotal(l);
      return `${l.qty} x ${l.name}${l.detail ? ` (${l.detail})` : ''} = ${t === null ? 'price to confirm' : money(t)}`;
    });
    const sub = cart.reduce((n, l) => n + (lineTotal(l) ?? 0), 0);
    return [
      'Hi Big Man! I would like to order for delivery:', '', ...lines, '',
      `Estimated subtotal: MVR ${money(sub)} (before GST & delivery charge)`, '',
      `Name: ${v('name')}`, `Phone: ${v('phone')}`, `Address: ${v('address')}`,
      ...(v('note') ? [`Note: ${v('note')}`] : []),
    ].join('\n');
  }
  $('.checkout').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!cart.length) return toast('Your order is empty');
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(message())}`, '_blank', 'noopener');
  });
  $('.checkout__copy').addEventListener('click', async () => {
    const f = $('.checkout');
    if (!cart.length) return toast('Your order is empty');
    if (!f.reportValidity()) return;
    try { await navigator.clipboard.writeText(message()); toast('Order copied'); } catch { toast('Could not copy'); }
  });

  window.__bmOrder = { message }; // handy for testing in the console
  render();
})();
