(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- data ---------- */
  const SERVICES = [
    { id: 'Dental check-up & X-ray', cat: 'general', ic: '🦷', t: 'Check-up & digital X-ray', d: 'Full exam of teeth, gums, bite and oral tissues. X-rays only when clinically justified.', m: ['30 min', 'From ₹500'] },
    { id: 'Scaling & polishing', cat: 'general', ic: '✨', t: 'Scaling & polishing', d: 'Removes plaque and tartar that brushing cannot, helping prevent gum disease and bad breath.', m: ['45 min', 'From ₹1,200'] },
    { id: "Children's dentistry", cat: 'general', ic: '🧸', t: "Children's dentistry", d: 'Gentle check-ups, fluoride varnish, sealants and habit advice for ages 2 and up.', m: ['30 min', 'From ₹600'] },
    { id: 'Tooth-coloured filling', cat: 'restore', ic: '🪥', t: 'Tooth-coloured fillings', d: 'Composite resin restores cavities and chipped teeth, matched to your natural shade.', m: ['45 min', 'From ₹1,500'] },
    { id: 'Root canal treatment', cat: 'restore', ic: '🩺', t: 'Root canal treatment', d: 'Removes infected pulp to save a tooth and relieve pain, usually followed by a crown.', m: ['1 to 2 visits', 'From ₹5,500'] },
    { id: 'Crown or bridge', cat: 'restore', ic: '👑', t: 'Crowns & bridges', d: 'Zirconia and porcelain-fused options that restore strength, shape and appearance.', m: ['2 visits', 'From ₹7,000'] },
    { id: 'Dental implant', cat: 'restore', ic: '🔩', t: 'Dental implants', d: 'A titanium post replaces the root of a missing tooth. Needs adequate bone and healthy gums.', m: ['3 to 6 months', 'From ₹32,000'] },
    { id: 'Teeth whitening', cat: 'cosmetic', ic: '😁', t: 'Professional whitening', d: 'Supervised in-clinic whitening for a brighter smile in about an hour.', m: ['60 min', 'From ₹6,000'] },
    { id: 'Clear aligners / braces', cat: 'cosmetic', ic: '📐', t: 'Clear aligners & braces', d: 'Straighten crowded or spaced teeth with removable aligners or traditional braces.', m: ['6 to 18 months', 'From ₹45,000'] }
  ];
  const REVIEWS = [
    ['I have been nervous about dentists since childhood. Everything was explained, I was never rushed, and I felt nothing during the filling.', 'Meera K.', 'Sample patient · Filling'],
    ['The written estimate before my root canal meant no surprises. Follow-up call the next day to check on me was a lovely touch.', 'Rohan S.', 'Sample patient · Root canal'],
    ['My daughter actually asks when her next visit is. The team made her first check-up feel like a game.', 'Priya & Aanya', 'Sample family · Little Smiles'],
    ['Clear aligners were planned with a simulation first, so I knew the end result before starting. Eight months in, I am delighted.', 'Kabir D.', 'Sample patient · Aligners']
  ];
  const FAQS = [
    ['How often should I visit the dentist?', 'Most adults benefit from a check-up and cleaning every six months. If you have gum disease, diabetes or a high cavity risk, we may suggest every three to four months.'],
    ['Is a root canal painful?', 'With modern local anaesthesia the procedure feels similar to having a filling. Most of the pain people associate with root canals comes from the infection, which the treatment relieves.'],
    ['Are dental X-rays safe?', 'Digital dental X-rays use a very low dose, comparable to a few days of natural background radiation. We only take them when they will change your diagnosis or treatment, and we use protective shielding.'],
    ['How long does teeth whitening last?', 'Typically one to three years depending on diet and habits such as tea, coffee, red wine and smoking. Touch-up trays can extend results.'],
    ['When can my child first see a dentist?', 'Ideally by their first birthday or when the first tooth appears. Early visits are short and mainly help children become comfortable.'],
    ['What should I do if a tooth is knocked out?', 'Pick it up by the crown, not the root. Rinse gently with milk or saline, do not scrub, and try placing it back in the socket or keep it in milk. Call us immediately; the first 30 to 60 minutes matter most.'],
    ['Do you offer payment options?', 'Yes. We accept cash, UPI and cards, and can split larger treatment into stages. Details are shared in your written estimate.']
  ];

  /* ---------- nav ---------- */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), fb = $('.float-book');
  addEventListener('scroll', () => {
    nav.classList.toggle('stuck', scrollY > 10);
    fb.classList.toggle('show', scrollY > 700);
  }, { passive: true });
  burger.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
  const secs = $$('main section[id]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('#menu a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- reveal + counters ---------- */
  const countUp = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('en-IN') + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));
  $$('.hero-points [data-count]').forEach(countUp);

  /* ---------- services ---------- */
  const cards = $('#cards');
  const renderCards = cat => {
    cards.innerHTML = SERVICES.filter(s => cat === 'all' || s.cat === cat).map((s, i) => `
      <article class="card" style="animation-delay:${i * 50}ms">
        <div class="ic" aria-hidden="true">${s.ic}</div>
        <h3>${s.t}</h3><p>${s.d}</p>
        <div class="meta"><span>${s.m[0]}</span><span>${s.m[1]}</span></div>
        <button data-service="${s.id}">Book this treatment →</button>
      </article>`).join('');
  };
  renderCards('all');
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    renderCards(b.dataset.tab);
  }));
  cards.addEventListener('click', e => {
    const b = e.target.closest('[data-service]');
    if (!b) return;
    serviceSel.value = b.dataset.service;
    $('#book').scrollIntoView({ behavior: 'smooth' });
  });
  $$('[data-plan]').forEach(a => a.addEventListener('click', () => { planNote = a.dataset.plan; }));
  let planNote = '';

  /* ---------- whitening slider (illustrative SVG) ---------- */
  const mouth = tone => {
    const [a, b] = tone;
    let teeth = '';
    for (let i = 0; i < 8; i++) {
      const x = 90 + i * 40, h = i > 1 && i < 6 ? 78 : 66, y = 120 - (i > 1 && i < 6 ? 0 : -4);
      teeth += `<rect x="${x}" y="${y}" width="36" height="${h}" rx="14" fill="url(#t${tone[2]})" stroke="rgba(0,0,0,.08)"/>`;
    }
    return `<defs><linearGradient id="t${tone[2]}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="480" height="300" fill="#e8c8b0"/>
      <path d="M40 150c40-70 360-70 400 0-30 90-370 90-400 0z" fill="#9c3c3c"/>
      <path d="M60 140c60-40 300-40 360 0v20c-60-30-300-30-360 0z" fill="#e38b8b"/>
      ${teeth}`;
  };
  // bottom layer = "after", top layer (clipped) = "before"
  $$('.ba-svg')[0].innerHTML = mouth(['#ffffff', '#eaf3f1', 'a']);
  $$('.ba-svg')[1].innerHTML = mouth(['#f1dd9a', '#d2b562', 'b']);
  $('#baRange').addEventListener('input', e => {
    const v = e.target.value;
    $('.ba-top').style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    $('.ba-handle').style.left = v + '%';
  });

  /* ---------- reviews ---------- */
  const track = $('#track'), dots = $('#dots');
  track.innerHTML = REVIEWS.map(r => `<figure class="rev"><div class="st" aria-label="5 out of 5 stars">★★★★★</div><blockquote>${r[0]}</blockquote><cite><i>${r[1][0]}</i><div>${r[1]}<span>${r[2]}</span></div></cite></figure>`).join('');
  dots.innerHTML = REVIEWS.map((_, i) => `<button aria-label="Review ${i + 1}"></button>`).join('');
  let cur = 0, timer;
  const go = n => {
    cur = (n + REVIEWS.length) % REVIEWS.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === cur));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6500); };
  $('#prev').onclick = () => { go(cur - 1); auto(); };
  $('#next').onclick = () => { go(cur + 1); auto(); };
  $$('button', dots).forEach((d, i) => d.onclick = () => { go(i); auto(); });
  go(0); auto();

  /* ---------- faq ---------- */
  $('#acc').innerHTML = FAQS.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
  $$('#acc details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('#acc details').forEach(o => o !== d && (o.open = false));
  }));

  /* ---------- booking ---------- */
  const form = $('#form'), serviceSel = $('#serviceSel'), dateIn = $('#dateIn'), slotsEl = $('#slots');
  serviceSel.innerHTML = '<option value="">Select a treatment</option>' + SERVICES.map(s => `<option>${s.id}</option>`).join('') + '<option>Not sure / consultation</option>';
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const today = new Date(), max = new Date(); max.setDate(max.getDate() + 60);
  dateIn.min = iso(today); dateIn.max = iso(max);
  let slot = '';
  const store = () => { try { return JSON.parse(localStorage.getItem('lumina-bookings') || '[]'); } catch { return []; } };
  const fmt = h => { const m = h % 1 ? '30' : '00', hh = Math.floor(h), ap = hh >= 12 ? 'PM' : 'AM'; return `${((hh + 11) % 12) + 1}:${m} ${ap}`; };

  const renderSlots = () => {
    slot = ''; $('#slotErr').textContent = '';
    if (!dateIn.value) return;
    const d = new Date(dateIn.value + 'T00:00');
    if (d.getDay() === 0) { slotsEl.innerHTML = '<p class="hint">Closed on Sundays except for emergencies. Please call us or pick another day.</p>'; return; }
    const end = d.getDay() === 6 ? 16 : 19, taken = store().filter(b => b.date === dateIn.value).map(b => b.slot);
    const now = new Date(), isToday = iso(now) === dateIn.value, nowH = now.getHours() + now.getMinutes() / 60;
    let html = '';
    for (let h = 9; h < end; h += .5) {
      if (h >= 13 && h < 14) continue; // lunch
      const label = fmt(h), off = taken.includes(label) || (isToday && h <= nowH + 1) || (h * 7 + d.getDate()) % 5 === 0;
      html += `<button type="button" class="slot" aria-pressed="false" ${off ? 'disabled' : ''}>${label}</button>`;
    }
    slotsEl.innerHTML = html || '<p class="hint">No slots left on this day.</p>';
  };
  dateIn.addEventListener('change', renderSlots);
  slotsEl.addEventListener('click', e => {
    const b = e.target.closest('.slot'); if (!b || b.disabled) return;
    $$('.slot', slotsEl).forEach(x => x.setAttribute('aria-pressed', x === b));
    slot = b.textContent; $('#slotErr').textContent = '';
  });

  const setErr = (el, msg) => { el.classList.toggle('invalid', !!msg); const e = el.parentElement.querySelector('.err'); if (e) e.textContent = msg || ''; return !msg; };
  const rules = {
    name: v => v.trim().length < 2 ? 'Please enter your name.' : '',
    phone: v => /^(91)?[6-9]\d{9}$/.test(v.replace(/[\s+-]/g, '')) ? '' : 'Enter a valid 10-digit mobile number.',
    email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    service: v => v ? '' : 'Please choose a treatment.',
    date: v => !v ? 'Please pick a date.' : ''
  };
  Object.keys(rules).forEach(k => form[k].addEventListener('blur', () => setErr(form[k], rules[k](form[k].value))));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    Object.keys(rules).forEach(k => { if (!setErr(form[k], rules[k](form[k].value))) ok = false; });
    if (ok && !slot) { $('#slotErr').textContent = 'Please choose a time slot.'; ok = false; }
    if (!ok) { const f = $('.invalid', form) || $('#slotErr'); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    const rec = { name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), service: form.service.value, date: dateIn.value, slot, note: (planNote ? `[${planNote}] ` : '') + form.note.value.trim(), at: Date.now() };
    try { const all = store(); all.push(rec); localStorage.setItem('lumina-bookings', JSON.stringify(all)); } catch {}
    const nice = new Date(rec.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#mText').textContent = `Thank you, ${rec.name.split(' ')[0]}. We have noted ${rec.service.toLowerCase()} on ${nice} at ${rec.slot}. In a live clinic our team would confirm by phone shortly.`;
    $('#modal').hidden = false; $('#mClose').focus();
    form.reset(); slotsEl.innerHTML = '<p class="hint">Choose a date to see times.</p>'; slot = ''; planNote = '';
  });
  const close = () => { $('#modal').hidden = true; };
  $('#mClose').onclick = close;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
