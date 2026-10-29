(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  /* ---------- display settings ---------- */
  let size = +(root.dataset.size || 0);
  const setSize = n => { size = Math.max(0, Math.min(2, n)); root.dataset.size = size; save('cw-size', size); $('#smaller').disabled = size === 0; $('#larger').disabled = size === 2; };
  $('#smaller').onclick = () => setSize(size - 1);
  $('#larger').onclick = () => setSize(size + 1);
  setSize(size);
  const cBtn = $('#contrast');
  const setContrast = on => { on ? root.dataset.contrast = 'high' : root.removeAttribute('data-contrast'); cBtn.setAttribute('aria-pressed', on); save('cw-contrast', on ? 'high' : 'normal'); };
  cBtn.onclick = () => setContrast(root.dataset.contrast !== 'high');
  cBtn.setAttribute('aria-pressed', root.dataset.contrast === 'high');

  /* ---------- data ---------- */
  const SYMPTOMS = [
    { k: 'Cold or hot sensitivity', urgent: false, when: 'Book this week', visit: 'Check-up',
      means: 'Often worn enamel, receding gums or early decay exposing the softer layer under the enamel.',
      meanwhile: 'Use a soft brush and a toothpaste for sensitive teeth, and avoid very cold or hot drinks for now.' },
    { k: 'Bleeding gums', urgent: false, when: 'Book within two weeks', visit: 'Scaling and polishing',
      means: 'Usually plaque along the gum line causing gingivitis, which is reversible with a professional clean and good daily cleaning.',
      meanwhile: 'Keep brushing gently twice a day and clean between teeth. Do not stop because it bleeds. Heavy bleeding, swelling or loose teeth need faster review.' },
    { k: 'Throbbing toothache', urgent: true, when: 'Be seen within 24 hours', visit: 'Emergency exam and X-ray',
      means: 'Pain that throbs or wakes you at night can mean deep decay or an infected nerve, which may need a root canal.',
      meanwhile: 'A standard over-the-counter pain reliever taken as directed on the pack can help. Do not place aspirin on the gum. Facial swelling or fever means call us now.' },
    { k: 'Chipped or broken tooth', urgent: true, when: 'Book this week, same day if painful', visit: 'Repair (bonding, filling or crown)',
      means: 'Small chips can be smoothed or bonded. Larger breaks may need a filling or a crown to protect the tooth.',
      meanwhile: 'Rinse gently, keep any fragment in milk, and cover a sharp edge with sugar-free gum or dental wax.' },
    { k: 'Bad breath', urgent: false, when: 'Book within a few weeks', visit: 'Check-up and cleaning',
      means: 'Most often plaque on teeth and the tongue, or gum disease. Dry mouth and some foods or medicines can also cause it.',
      meanwhile: 'Brush the tongue lightly, clean between teeth and drink water through the day.' },
    { k: 'Crooked or gapped teeth', urgent: false, when: 'Whenever you are ready', visit: 'Aligner or braces consultation',
      means: 'Teeth can be moved with clear aligners or braces, and small gaps or edges can sometimes be bonded.',
      meanwhile: 'Nothing is urgent. A consultation shows the options, timing and cost.' },
    { k: 'A missing tooth', urgent: false, when: 'Book within a month', visit: 'Implant or bridge consultation',
      means: 'Gaps let neighbouring teeth drift. Options include an implant, a bridge or a denture, depending on your bone and gums.',
      meanwhile: 'Keep the area clean. An X-ray at the consultation shows which option suits you.' }
  ];
  const CARE = [
    { k: 'Check-up and X-ray', d: 'A full look at teeth, gums, bite and soft tissues. X-rays only when they will change the plan.', t: '30 minutes', f: 'from 500' },
    { k: 'Scaling and polishing', d: 'Removes plaque and tartar that brushing cannot reach, to protect your gums.', t: '45 minutes', f: 'from 1,200' },
    { k: 'Fillings', d: 'Tooth-coloured composite repairs a cavity and matches the tooth around it.', t: '45 minutes', f: 'from 1,500' },
    { k: 'Root canal treatment', d: 'Clears infection from inside a tooth so it can be kept. Usually finished with a crown.', t: '1 to 2 visits', f: 'from 5,500' },
    { k: 'Crowns and bridges', d: 'Strong caps and fixed bridges that restore a damaged or missing tooth.', t: '2 visits', f: 'from 7,000' },
    { k: 'Dental implants', d: 'A titanium post replaces a missing root and carries a crown. Needs enough healthy bone.', t: '3 to 6 months', f: 'from 32,000' },
    { k: 'Aligners and braces', d: 'Straighten teeth gradually with removable aligners or fixed braces.', t: '6 to 18 months', f: 'from 45,000' },
    { k: 'Whitening', d: 'Supervised whitening after we check that your teeth and gums are healthy.', t: '60 minutes', f: 'from 6,000' },
    { k: "Children's dentistry", d: 'Gentle check-ups, fluoride varnish and sealants for ages two and up.', t: '30 minutes', f: 'from 600' }
  ];
  const REASONS = ['Check-up and cleaning', 'Toothache or pain', 'Broken or chipped tooth', 'Filling or repair', 'Whitening', 'Aligners or braces', 'Missing tooth', 'Child check-up', 'Not sure'];

  /* ---------- symptom guide ---------- */
  const chips = $('#chips'), result = $('#result');
  chips.innerHTML = SYMPTOMS.map((s, i) => `<button type="button" class="chip" aria-pressed="false" data-i="${i}">${s.k}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const s = SYMPTOMS[+b.dataset.i];
    $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', c === b));
    result.hidden = false;
    result.innerHTML = `<h3>${s.k}</h3><span class="tag ${s.urgent ? 'tag--urgent' : ''}">${s.when}</span>
      <dl><div><dt>What it often means</dt><dd>${s.means}</dd></div><div><dt>Until your visit</dt><dd>${s.meanwhile}</dd></div><div><dt>Suggested visit</dt><dd>${s.visit}</dd></div></dl>
      <a class="btn btn--primary" href="#book" data-reason="${s.urgent ? 'Toothache or pain' : 'Check-up and cleaning'}">Book this visit</a>`;
  });
  result.addEventListener('click', e => { const a = e.target.closest('[data-reason]'); if (a) { const r = $$('input[name=reason]').find(x => x.value === a.dataset.reason); if (r) r.checked = true; } });

  /* ---------- treatments ---------- */
  $('#acc').innerHTML = CARE.map(c => `<details><summary>${c.k}<svg class="ico" aria-hidden="true"><use href="#i-down"/></svg></summary><div class="body"><p>${c.d}</p><div class="meta"><span>Takes ${c.t}</span><span>Sample fee ${c.f} rupees</span></div></div></details>`).join('');
  $$('#acc details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('#acc details').forEach(o => o !== d && (o.open = false)); }));

  /* ---------- booking stepper ---------- */
  const form = $('#form'), errs = $('#errs'), stepsEl = $$('#steps li'), fsets = $$('fieldset[data-step]');
  const back = $('#back'), next = $('#next'), dateIn = $('#date'), times = $('#times');
  let step = 1, saved = false;
  $('#reasons').innerHTML = REASONS.map((r, i) => `<label class="opt"><input type="radio" name="reason" value="${r}" ${i === 0 ? 'checked' : ''}><span>${r}</span></label>`).join('');

  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const now = new Date(), far = new Date(); far.setDate(far.getDate() + 60);
  dateIn.min = iso(now); dateIn.max = iso(far);
  const store = () => { try { return JSON.parse(localStorage.getItem('clearwater-bookings') || '[]'); } catch { return []; } };
  const fmt = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const slots = () => {
    if (!dateIn.value) { times.innerHTML = '<p class="help">Choose a date first.</p>'; return; }
    const d = new Date(dateIn.value + 'T00:00'), day = d.getDay();
    if (day === 0) { times.innerHTML = '<p class="help">Closed on Sundays except for emergencies. Please call us, or pick another day.</p>'; return; }
    const end = day === 6 ? 14 * 60 : 18 * 60, taken = store().filter(b => b.date === dateIn.value).map(b => b.time);
    const isToday = iso(now) === dateIn.value, nowM = now.getHours() * 60 + now.getMinutes();
    let html = '';
    for (let m = 9 * 60; m < end; m += 30) {
      if (day !== 6 && m >= 13 * 60 && m < 14 * 60) continue;
      const t = fmt(m), off = taken.includes(t) || (isToday && m <= nowM + 60) || ((m / 30 + d.getDate()) % 7 === 0);
      html += `<label class="opt"><input type="radio" name="time" value="${t}" ${off ? 'disabled' : ''}><span>${t}</span></label>`;
    }
    times.innerHTML = html;
  };
  dateIn.addEventListener('change', () => { slots(); clearErr('date'); });

  const val = () => ({ reason: ($('input[name=reason]:checked') || {}).value, date: dateIn.value, time: ($('input[name=time]:checked') || {}).value, name: $('#name').value.trim(), phone: $('#phone').value.replace(/[\s+-]/g, ''), note: $('#note').value.trim() });
  const rules = {
    1: v => v.reason ? [] : [['reason', 'Please choose a reason for your visit.', 'reasons']],
    2: v => { const e = []; if (!v.date) e.push(['date', 'Please choose a date.', 'date']); else if (!v.time) e.push(['time', 'Please choose a time.', 'times']); return e; },
    3: v => { const e = []; if (v.name.length < 2) e.push(['name', 'Please enter your full name.', 'name']); if (!/^(91)?[6-9]\d{9}$/.test(v.phone)) e.push(['phone', 'Enter a 10-digit mobile number, for example 9000000000.', 'phone']); return e; }
  };
  const clearErr = k => { const p = $('#err-' + k); if (p) p.textContent = ''; const i = $('#' + k); if (i && i.removeAttribute) i.removeAttribute('aria-invalid'); };
  $('#name').addEventListener('input', () => clearErr('name'));
  $('#phone').addEventListener('input', () => clearErr('phone'));

  const show = n => {
    step = n;
    fsets.forEach(f => f.hidden = +f.dataset.step !== n);
    stepsEl.forEach((li, i) => { li.classList.toggle('done', i + 1 < n); i + 1 === n ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current'); });
    back.hidden = n === 1;
    next.textContent = n === 3 ? 'Save my appointment' : 'Next';
    errs.hidden = true;
    if (n === 3) { const v = val(); $('#review').innerHTML = `<div><dt>Reason</dt><dd>${v.reason}</dd></div><div><dt>When</dt><dd>${new Date(v.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, ${v.time}</dd></div>`; }
    const legend = $(`fieldset[data-step="${n}"] legend`); legend.tabIndex = -1; legend.focus({ preventScroll: false });
  };
  back.onclick = () => show(step - 1);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (saved) return;
    const v = val(), list = rules[step](v);
    $$('.field-err').forEach(p => p.textContent = '');
    $$('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
    if (list.length) {
      list.forEach(([k, msg]) => { const p = $('#err-' + k); if (p) p.textContent = msg; const i = $('#' + k); if (i && i.setAttribute) i.setAttribute('aria-invalid', 'true'); });
      errs.hidden = false;
      errs.innerHTML = `<h3>Please fix ${list.length === 1 ? 'this' : 'these'} before continuing</h3><ul>${list.map(([, msg, id]) => `<li><a href="#${id}">${msg}</a></li>`).join('')}</ul>`;
      errs.focus();
      return;
    }
    if (step < 3) return show(step + 1);
    try { const all = store(); all.push({ ...v }); localStorage.setItem('clearwater-bookings', JSON.stringify(all)); } catch {}
    saved = true;
    const nice = new Date(v.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    form.innerHTML = `<div class="done-box" tabindex="-1" id="doneBox" role="status"><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg><h3>Saved on this device</h3><p>${v.reason} on ${nice} at ${v.time}, for ${v.name}.</p><p class="note">This is a demo, so nothing has been sent to the clinic. A real clinic would confirm by phone.</p><button class="btn" type="button" onclick="location.reload()">Make another</button></div>`;
    $('#doneBox').focus();
  });
  $('#form').addEventListener('click', e => { const a = e.target.closest('.errs a'); if (!a) return; e.preventDefault(); const t = $(a.getAttribute('href')); if (t) (t.querySelector ? (t.querySelector('input') || t) : t).focus(); });

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1 });
  $$('.reveal').forEach(el => io.observe(el));
})();
