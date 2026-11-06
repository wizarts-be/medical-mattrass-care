// Medical Mattress Care: kleine stukjes interactie, zonder libraries.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const INDEX = window.MMC_INDEX || [];
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const escH = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const params = new URLSearchParams(location.search);
  // Op een gedeelde kopie (relatieve paden) zet de pagina window.MMC_BASE; anders blijven paden absoluut.
  const BASE = window.MMC_BASE;
  const rel = (u) => {
    if (BASE === undefined || !u || !u.startsWith('/')) return u;
    let p = u.slice(1);
    if (p === '') p = window.MMC_HOME ?? 'home.html';
    else if (p.endsWith('/')) p += 'index.html';
    return BASE + p;
  };

  // ── Panelen in de navigatie: menu (mobiel), productmenu, zoeken ──
  const toggles = [];
  const makeToggle = (btn, target, { onOpen } = {}) => {
    if (!btn || !target) return;
    const isClass = target.classList.contains('nav__menu');
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      if (isClass) target.classList.toggle('is-open', open); else target.hidden = !open;
      if (open) { toggles.forEach((t) => { if (t.btn !== btn) t.set(false); }); if (onOpen) onOpen(); }
    };
    toggles.push({ btn, target, set });
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  };
  const mega = $('[data-mega]');
  if (mega) mega.hidden = false;
  makeToggle($('[data-burger]'), $('#navmenu'));
  makeToggle(mega, $('#mega'));
  makeToggle($('[data-searchtoggle]'), $('#zoekpaneel'), { onOpen: () => $('#zoek-nav').focus() });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    toggles.forEach((t) => { if (t.btn.getAttribute('aria-expanded') === 'true') { t.set(false); t.btn.focus(); } });
  });
  document.addEventListener('click', (e) => {
    toggles.forEach((t) => { if (t.btn.getAttribute('aria-expanded') === 'true' && !t.target.contains(e.target) && !t.btn.contains(e.target)) t.set(false); });
  });

  // ── Navigatie over de hero: wit zodra de hero voorbij is ──
  const navEl = $('[data-nav]');
  const heroEl = $('[data-hero]');
  if (navEl && heroEl && navEl.classList.contains('nav--over')) {
    let ticking = false;
    const syncNav = () => { ticking = false; navEl.classList.toggle('is-solid', heroEl.getBoundingClientRect().bottom <= navEl.offsetHeight); };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(syncNav); } }, { passive: true });
    addEventListener('resize', syncNav);
    syncNav();
  }

  // ── Zoeken (combobox) ──
  const zoek = (q) => {
    const n = norm(q);
    if (!n) return [];
    const words = n.split(' ');
    return INDEX.map((p) => {
      const hay = norm(`${p.n} ${p.c} ${p.v.join(' ')} ${p.k}`);
      if (!words.every((w) => hay.includes(w))) return null;
      let score = 0;
      if (norm(p.c).startsWith(n) || p.v.some((v) => norm(v).startsWith(n))) score += 3;
      if (norm(p.n).includes(n)) score += 2;
      return { p, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map((x) => x.p);
  };
  $$('[data-search]').forEach((form) => {
    const input = $('input', form);
    const list = $('.search__results', form);
    let active = -1;
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const render = () => {
      if (!input.value.trim()) return close();
      const res = zoek(input.value).slice(0, 7);
      list.innerHTML = res.length
        ? res.map((p, i) => `<li role="option" id="zr-${i}" aria-selected="false"><a href="${rel(p.u)}" tabindex="-1">${p.f ? `<img src="${rel(p.f)}" alt="">` : '<span class="thumb-empty"></span>'}<span><b>${escH(p.n)}</b><small>${escH(p.c)}</small></span></a></li>`).join('')
        : '<li class="search__empty" role="option" aria-disabled="true">Geen product gevonden. Probeer een bestelcode, zoals MMC V10.</li>';
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      active = -1;
    };
    const move = (d) => {
      const opts = $$('[role="option"]:not([aria-disabled])', list);
      if (!opts.length) return;
      active = (active + d + opts.length) % opts.length;
      opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === active)));
      input.setAttribute('aria-activedescendant', opts[active].id);
      opts[active].scrollIntoView({ block: 'nearest' });
    };
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' && active > -1) { e.preventDefault(); location.href = $$('[role="option"]:not([aria-disabled]) a', list)[active].href; }
    });
    input.addEventListener('blur', () => setTimeout(close, 150));
  });

  // ── Productgalerij ──
  $$('[data-gallery]').forEach((g) => {
    const main = $('.gallery__main img', g);
    const label = $('[data-gallery-label]', g);
    $$('.gallery__thumbs button', g).forEach((b) => b.addEventListener('click', () => {
      $$('.gallery__thumbs button', g).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      main.src = b.dataset.src;
      main.alt = b.dataset.alt;
      if (label && b.dataset.label) label.textContent = b.dataset.label;
    }));
  });

  // ── Filters op /producten/ ──
  const finder = $('[data-finder]');
  if (finder) {
    const q = $('#zoek-lijst', finder);
    const status = $('[data-finder-status]', finder);
    const empty = $('[data-finder-empty]', finder);
    const groups = $$('[data-group]', finder);
    q.value = params.get('q') || '';
    const t0 = params.get('toepassing');
    const r0 = t0 && $(`input[name="toepassing"][value="${CSS.escape(t0)}"]`, finder);
    if (r0) r0.checked = true;
    const apply = (push) => {
      const words = norm(q.value).split(' ').filter(Boolean);
      const tv = $('input[name="toepassing"]:checked', finder).value;
      let n = 0;
      groups.forEach((g) => {
        let gn = 0;
        $$('.pcard', g).forEach((c) => {
          const ok = (!tv || c.dataset.toep.split(' ').includes(tv)) && words.every((w) => norm(c.dataset.zoek).includes(w));
          c.hidden = !ok;
          if (ok) gn++;
        });
        g.hidden = gn === 0;
        n += gn;
      });
      empty.hidden = n > 0;
      status.textContent = (q.value || tv) ? `${n} ${n === 1 ? 'product' : 'producten'} gevonden` : '';
      if (push) {
        const u = new URL(location.href);
        if (q.value) u.searchParams.set('q', q.value); else u.searchParams.delete('q');
        if (tv) u.searchParams.set('toepassing', tv); else u.searchParams.delete('toepassing');
        history.replaceState(null, '', u);
      }
    };
    finder.addEventListener('input', () => apply(true));
    finder.addEventListener('change', () => apply(true));
    $('form', finder).addEventListener('submit', (e) => { e.preventDefault(); apply(true); });
    apply(false);
  }

  // ── Offerteformulier ──
  const form = $('[data-form]');
  if (form) {
    const lines = $('[data-lines]', form);
    let n = 1;
    const sync = () => { const all = $$('[data-line]', lines); all.forEach((l) => { $('[data-remove]', l).disabled = all.length === 1; }); };
    const add = (val = '', qty = 1) => {
      n++;
      const tpl = $('[data-line]', lines).cloneNode(true);
      $$('input', tpl).forEach((i) => { i.id = i.id.replace(/\d+$/, n); });
      $$('label', tpl).forEach((l) => { l.htmlFor = l.htmlFor.replace(/\d+$/, n); });
      $('input[name="product[]"]', tpl).value = val;
      $('input[name="aantal[]"]', tpl).value = qty;
      lines.append(tpl);
      sync();
      return tpl;
    };
    $('[data-add]', form).addEventListener('click', () => { $('input', add()).focus(); });
    lines.addEventListener('click', (e) => {
      const b = e.target.closest('[data-remove]');
      if (!b || b.disabled) return;
      const line = b.closest('[data-line]');
      const prev = line.previousElementSibling || line.nextElementSibling;
      line.remove();
      sync();
      if (prev) $('input', prev).focus();
    });
    const pr = params.getAll('product');
    if (pr.length) { $('input[name="product[]"]', lines).value = pr[0]; pr.slice(1).forEach((p) => add(p)); }
    const ty = params.get('type');
    if (ty && $(`#ty-${ty}`, form)) $(`#ty-${ty}`, form).checked = true;
    if (params.get('maatwerk') === 'ja') $('#mw-ja', form).checked = true;

    const status = $('[data-status]', form);
    const msg = { instelling: 'Vul de naam van uw instelling in.', naam: 'Vul uw naam in.', email: 'Dit e-mailadres lijkt onvolledig. Schrijf het als naam@instelling.be.' };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      $$('[required]', form).forEach((f) => {
        const ok = f.checkValidity() && f.value.trim() !== '';
        f.setAttribute('aria-invalid', String(!ok));
        const help = f.parentElement.querySelector('.field__help');
        if (help) { help.textContent = ok ? '' : msg[f.name] || 'Vul dit veld in.'; help.classList.toggle('is-error', !ok); if (!ok) f.setAttribute('aria-describedby', help.id); }
        if (!ok && !first) first = f;
      });
      if (first) { status.textContent = ''; first.focus(); return; }
      if (!form.dataset.endpoint) {
        status.classList.add('is-error');
        status.textContent = 'Er is niets verstuurd: dit formulier is nog niet gekoppeld. Bel 0473 59 11 71 of mail info@medical-mattress-care.com.';
        return;
      }
      const btn = $('button[type="submit"]', form);
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then((r) => { status.classList.toggle('is-error', !r.ok); status.textContent = r.ok ? 'Uw aanvraag is verstuurd. U krijgt een antwoord per e-mail.' : 'Dat is niet gelukt. Probeer het zo meteen opnieuw of bel ons.'; })
        .catch(() => { status.classList.add('is-error'); status.textContent = 'Dat is niet gelukt. Probeer het zo meteen opnieuw of bel ons.'; })
        .finally(() => { btn.removeAttribute('aria-busy'); btn.disabled = false; });
    });
  }
})();
