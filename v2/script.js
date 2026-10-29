/* ==========================================================
   Ketaki & Amogh — v2 "Into the Jungle"
   ========================================================== */

const CONFIG = {
  // Paste the Google Apps Script web-app URL here (same one as the main site).
  rsvpEndpoint: '',
  muhurat: '2026-12-12T12:07:00+05:30',
  location: 'Olive Resort, Turia Gate, Pench, Madhya Pradesh 480881'
};

/* The whole schedule lives here; the day cards are drawn from it. Times are IST. */
const DAYS = [
  {
    date: '2026-12-11', weekday: 'Friday', title: 'Haldi & Sangeet', theme: 'haldi', icon: 'marigold',
    tagline: 'Flowers, turmeric and an evening of music',
    items: [
      { s: '12:00', e: '13:00', t: '12 PM +', title: 'Arrive at Pench', note: 'Buses and cars take you to Olive Resort for welcome drinks, room allotment and snacks.' },
      { s: '13:00', e: '14:00', t: '1 – 2 PM', title: 'Lunch' },
      { s: '14:00', e: '15:00', t: '2 – 3 PM', title: 'Phoolon ki Holi', note: 'Radha–Krishna dance<br>Turmeric, marigolds and a mehfil of flowers',
        dress: 'Multicolour, multiprint', sw: ['#E8452C', '#F2B705', '#2E9CCA', '#8BC34A', '#D63AAF'], petals: true },
      { s: '15:00', e: '16:00', t: '3 – 4 PM', title: 'Rest & wind down' },
      { s: '16:00', e: '17:00', t: '4 PM', title: 'High tea' },
      { s: '17:00', e: '19:00', t: '5 – 7 PM', title: 'Shrimanti Pujan' },
      { s: '19:00', e: '20:00', t: '7 – 8 PM', title: 'Ring ceremony' },
      { s: '20:00', e: '22:00', t: '8 – 10 PM', title: 'Sangeet & dinner', note: 'An evening of music & promises',
        dress: 'Glitz and glam', sw: ['#D4AF37', '#C0C0C0', '#1A1A1A'] }
    ]
  },
  {
    date: '2026-12-12', weekday: 'Saturday', title: 'The Big Day', theme: 'shaadi', icon: 'kalash',
    tagline: 'Muhurat, Saptapadi and a winter night of music',
    items: [
      { s: '07:00', e: '09:00', t: '7:00 AM', title: 'Tea & coffee' },
      { s: '09:00', e: '10:30', t: '9:00 AM', title: 'Breakfast' },
      { s: '12:07', e: '13:00', t: '12:07 PM', title: 'The wedding muhurat', note: 'The ceremony we’ve been dreaming of',
        dress: 'Best foot forward in traditional attire', sw: ['#A3262B', '#C9A24D', '#F3E3C3'], key: true },
      { s: '13:00', e: '15:00', t: '1 – 3 PM', title: 'Lunch', note: 'with the Saptapadi rituals meanwhile' },
      { s: '15:00', e: '16:00', t: '3:00 PM', title: 'Vihanchi Pangat' },
      { s: '16:00', e: '17:00', t: '4 – 5 PM', title: 'Tea & coffee' },
      { s: '18:00', e: '19:00', t: '6:00 PM', title: 'Sunmukh & Baraat' },
      { s: '19:00', e: '23:00', t: '7 PM +', title: 'Sugam Sangeet & dinner', note: 'A relaxed night of music and togetherness under the winter sky',
        dress: 'Cozy winter night vibe', sw: ['#7A4B2A', '#C89B6D', '#EADBC8'] }
    ]
  },
  {
    date: '2026-12-13', weekday: 'Sunday', title: 'Vidai', theme: 'dawn', icon: 'sunrise',
    tagline: 'Blessings, farewells and one last breakfast together',
    items: [
      { s: '07:00', e: '07:30', t: '7:00 AM', title: 'Tea & coffee' },
      { s: '07:30', e: '10:00', t: '7:30 – 10 AM', title: 'Breakfast' },
      { s: '11:00', e: '12:00', t: '11:00 AM', title: 'Vidai & check-out', note: 'Please check out by 11:30 AM' }
    ]
  }
];

const ICONS = {
  marigold: '<svg viewBox="0 0 60 60" class="day-icon" aria-hidden="true">' +
    Array.from({ length: 12 }, (_, i) => {
      const a = i * 30 * Math.PI / 180, x = 30 + Math.cos(a) * 13, y = 30 + Math.sin(a) * 13;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#FFE29A" stroke="#FFF6D8" stroke-width="1"/>`;
    }).join('') +
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * 45 + 22) * Math.PI / 180, x = 30 + Math.cos(a) * 7, y = 30 + Math.sin(a) * 7;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#FFC94D"/>`;
    }).join('') + '<circle cx="30" cy="30" r="6" fill="#C46A00"/></svg>',
  kalash: '<svg viewBox="0 0 60 60" class="day-icon" aria-hidden="true" fill="none" stroke="#FFF3D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M19 30c-6 4-7 13-2 18 3 3 8 5 13 5s10-2 13-5c5-5 4-14-2-18"/><path d="M19 30h22M22 26h16l-3 4H25z"/>' +
    '<ellipse cx="30" cy="18" rx="7" ry="8" fill="#FFF3D6" fill-opacity=".25"/><path d="M23 25c-6-2-9-6-9-10 4 1 8 4 9 10zM37 25c6-2 9-6 9-10-4 1-8 4-9 10z"/>' +
    '<path d="M24 41h12M30 36v10"/></svg>',
  sunrise: '<svg viewBox="0 0 60 60" class="day-icon" aria-hidden="true" fill="none" stroke="#FFF3D6" stroke-width="2" stroke-linecap="round">' +
    '<path d="M14 40a16 16 0 0 1 32 0" fill="#FFE2B8" fill-opacity=".35"/><path d="M8 40h44M14 47h32M22 53h16"/>' +
    '<path d="M30 14v6M12 22l4 4M48 22l-4 4M6 33h5M49 33h5"/></svg>'
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

/* "Now" can be faked for previews: add ?now=2026-12-11T14:30+05:30 to the URL */
const NOW = () => {
  const q = new URLSearchParams(location.search).get('now');
  const t = q ? Date.parse(q.replace(' ', '+')) : NaN;
  return isNaN(t) ? Date.now() : t + (performance.now() - PAGE_T0);
};
const PAGE_T0 = performance.now();
const ist = (date, hm) => Date.parse(`${date}T${hm}:00+05:30`);

/* ======================================================
   Sound: temple-bell chime, synthesised (no audio files)
   ====================================================== */
const Bell = (() => {
  let ctx;
  function ensure() {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function chime(base = 1046, when = 0, gain = 0.09) {
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + when;
    const master = c.createGain(); master.gain.value = gain; master.connect(c.destination);
    [[1, 1, 2.6], [2.02, .5, 1.8], [2.76, .32, 1.4], [4.07, .18, 1], [5.4, .1, .7]].forEach(([m, a, d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = base * m;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(a, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + d + 0.05);
    });
  }
  return { ensure, chime };
})();

/* ======================================================
   Toran: mango leaves, marigold swags and brass bells
   ====================================================== */
function buildToran() {
  const svg = $('#toran'); if (!svg) return;
  const W = Math.max(320, window.innerWidth), NS = 'http://www.w3.org/2000/svg';
  svg.setAttribute('viewBox', `0 0 ${W} 150`);
  svg.innerHTML = '';
  const add = (parent, html) => { parent.insertAdjacentHTML('beforeend', html); return parent.lastElementChild; };
  const rnd = (a, b) => a + Math.random() * (b - a);

  // cord
  add(svg, `<rect x="0" y="0" width="${W}" height="7" fill="#7A5420"/><rect x="0" y="6" width="${W}" height="2" fill="#C9A24D"/>`);

  // mango leaves hanging from the cord
  const leaves = add(svg, '<g></g>');
  for (let x = 10; x < W; x += 21) {
    const len = rnd(38, 52), rot = rnd(-8, 8), d = rnd(-4.5, 0).toFixed(2);
    add(leaves, `<g transform="translate(${x.toFixed(1)},6) rotate(${rot.toFixed(1)})"><g class="sway" style="animation-delay:${d}s;animation-duration:${rnd(3.8, 5.6).toFixed(2)}s">
      <path d="M0 0C9 ${len * .28} 9 ${len * .74} 0 ${len}C-9 ${len * .74} -9 ${len * .28} 0 0Z" fill="url(#g-leaf)"/>
      <path d="M0 2V${len - 4}" stroke="#7DB38A" stroke-width=".8" opacity=".6"/></g></g>`);
  }

  // marigold swags between hanging points
  const span = W < 600 ? 96 : 130, n = Math.max(2, Math.round(W / span)), step = W / n;
  const garland = add(svg, '<g></g>');
  const flower = (x, y, r, c1, c2) =>
    `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="${r}" fill="${c1}"/>` +
    [0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * r * .55).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * r * .55).toFixed(1)}" r="${(r * .55).toFixed(1)}" fill="${c2}"/>`).join('') +
    `<circle r="${(r * .35).toFixed(1)}" fill="#B85C00"/></g>`;
  for (let i = 0; i < n; i++) {
    const x0 = i * step, x1 = x0 + step, sag = step * 0.26;
    for (let t = 0; t <= 1.0001; t += 1 / Math.round(step / 10)) {
      const x = x0 + (x1 - x0) * t, y = 9 + 4 * sag * t * (1 - t);
      const orange = Math.random() < .55;
      add(garland, flower(x, y, 6.2, orange ? '#F08A00' : '#F6B800', orange ? '#FFA41B' : '#FFD54A'));
    }
  }

  // brass bells at every hanging point
  const bells = add(svg, '<g></g>');
  for (let i = 1; i < n; i++) {
    const x = i * step, thread = (i % 2 ? 44 : 30) + rnd(-3, 3);
    const g = add(bells, `<g transform="translate(${x.toFixed(1)},8)"><g class="sway bell" role="button" aria-label="Ring the bell" data-pitch="${[880, 988, 1046, 1175, 1318][i % 5]}" style="animation-delay:${rnd(-4, 0).toFixed(2)}s">
      <line x1="0" y1="0" x2="0" y2="${thread}" stroke="#B8862F" stroke-width="1.3"/>
      ${flower(0, thread * .45, 5.5, '#F08A00', '#FFA41B')}
      <circle cx="0" cy="${thread + 1}" r="2.6" fill="none" stroke="#B8862F" stroke-width="1.4"/>
      <path d="M0 ${thread + 3}c7 0 10 7 10 15l3 5h-26l3-5c0-8 3-15 10-15z" fill="url(#g-brass)" stroke="#8A6420" stroke-width=".8"/>
      <rect x="-13" y="${thread + 22}" width="26" height="2.5" rx="1.2" fill="#9A6E22"/>
      <circle cx="0" cy="${thread + 27}" r="3" fill="#9A6E22"/>
      <rect x="-15" y="-2" width="30" height="${thread + 34}" fill="transparent"/></g></g>`);
    const b = g.firstElementChild;
    b.addEventListener('pointerdown', () => ringBell(b));
  }
}
function ringBell(b) {
  b.classList.remove('ring'); void b.getBBox(); b.classList.add('ring');
  Bell.chime(+b.dataset.pitch || 1046);
  setTimeout(() => b.classList.remove('ring'), 1700);
}

/* ======================================================
   Day cards
   ====================================================== */
function renderDays() {
  const track = $('#days-track');
  track.innerHTML = DAYS.map((d, di) => `
    <article class="day-card" data-theme="${d.theme}" id="day-${di}" role="tabpanel" aria-label="${d.title}">
      <header class="day-head">
        ${ICONS[d.icon]}
        <div class="day-num">${d.weekday} · ${+d.date.slice(8)} December</div>
        <h3 class="day-title">${d.title}</h3>
        <p class="day-tagline">${d.tagline}</p>
      </header>
      <ol class="tl">
        ${d.items.map((it, i) => `
          <li style="--i:${i}" class="${it.key ? 'key' : ''}" data-s="${ist(d.date, it.s)}" data-e="${ist(d.date, it.e)}">
            <time>${it.t}</time>
            <div>
              <h3>${it.title}<span class="chip" hidden></span></h3>
              ${it.note ? `<p class="note">${it.note}</p>` : ''}
              ${it.dress ? `<p class="dress"><span class="sw">${it.sw.map(c => `<i style="background:${c}"></i>`).join('')}</span>Dress code: ${it.dress}</p>` : ''}
              ${it.petals ? `<button class="tap" type="button" data-petals>Tap for a shower of flowers</button>` : ''}
            </div>
          </li>`).join('')}
      </ol>
    </article>`).join('');

  $$('[data-petals]', track).forEach(b => b.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    Petals.burst(r.left + r.width / 2, r.top, 90);
  }));
}

const DaySwitch = (() => {
  let idx = 0, raf;
  const track = () => $('#days-track');
  function set(i, scroll) {
    idx = Math.max(0, Math.min(DAYS.length - 1, i));
    $$('.day-switch [role=tab]').forEach((b, j) => b.setAttribute('aria-selected', String(j === idx)));
    $('.switch-pill').style.transform = `translateX(${idx * 100}%)`;
    const cards = $$('.day-card');
    cards.forEach((c, j) => c.classList.toggle('shown', j === idx));
    sizeTrack();
    if (scroll) track().scrollTo({ left: idx * track().clientWidth, behavior: REDUCED ? 'auto' : 'smooth' });
    if (Mood.inDays) Mood.set(DAYS[idx].theme);
  }
  function sizeTrack() {
    const card = $$('.day-card')[idx];
    if (card) track().style.height = card.offsetHeight + 'px';
  }
  function init() {
    $$('.day-switch [role=tab]').forEach(b => b.addEventListener('click', () => set(+b.dataset.day, true)));
    track().addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(track().scrollLeft / track().clientWidth);
        if (i !== idx) set(i, false);
      });
    }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(sizeTrack).observe(track());
    window.addEventListener('resize', () => { track().scrollLeft = idx * track().clientWidth; sizeTrack(); });
    set(0, false);
  }
  return { init, set, sizeTrack, get idx() { return idx; } };
})();

/* ======================================================
   Mood (background tint follows the section you're in)
   ====================================================== */
const Mood = {
  inDays: false,
  set(m) { $('#mood').dataset.mood = m; },
  init() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        if (en.target.id === 'days') { Mood.inDays = true; Mood.set(DAYS[DaySwitch.idx].theme); }
        else { Mood.inDays = false; Mood.set(en.target.dataset.mood || 'forest'); }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    ['#home', '#countdown', '#days', '#venue', '#rsvp', '.thanks'].forEach(s => { const el = $(s); if (el) io.observe(el); });
    $('#home').dataset.mood = 'forest';
  }
};

/* ======================================================
   Live mode — highlights what's happening during 11–13 Dec
   ====================================================== */
function updateLive() {
  const now = NOW();
  const start = ist(DAYS[0].date, '00:00'), end = ist(DAYS[2].date, '23:59');
  const banner = $('#live');
  $$('.tl li').forEach(li => { li.classList.remove('now', 'next', 'past'); const c = $('.chip', li); c.hidden = true; });
  if (now < start || now > end) { banner.hidden = true; return; }

  const di = DAYS.findIndex(d => now < ist(d.date, '23:59'));
  const card = $$('.day-card')[di];
  const items = $$('.tl li', card);
  let nowLi = null, nextLi = null;
  items.forEach(li => {
    const s = +li.dataset.s, e = +li.dataset.e;
    if (now >= e) li.classList.add('past');
    else if (now >= s && !nowLi) nowLi = li;
    else if (now < s && !nextLi) nextLi = li;
  });
  if (nowLi) { nowLi.classList.add('now'); const c = $('.chip', nowLi); c.textContent = 'Now'; c.hidden = false; }
  if (nextLi) { nextLi.classList.add('next'); const c = $('.chip', nextLi); c.textContent = 'Next'; c.hidden = false; }

  const name = li => li && $('h3', li).firstChild.textContent;
  const time = li => li && $('time', li).textContent;
  banner.hidden = false;
  $('#live-text').textContent = nowLi
    ? `Happening now: ${name(nowLi)}` + (nextLi ? ` · Next: ${name(nextLi)} at ${time(nextLi)}` : '')
    : nextLi ? `Coming up at ${time(nextLi)}: ${name(nextLi)}` : `That’s a wrap for ${DAYS[di].title.toLowerCase()} — see you tomorrow!`;
  if (!updateLive.done) { DaySwitch.set(di, true); updateLive.done = true; }
}

/* ======================================================
   Countdown rings
   ====================================================== */
function startCountdown() {
  const target = Date.parse(CONFIG.muhurat), C = 2 * Math.PI * 44;
  const setArc = (id, f) => { $('#' + id).style.strokeDashoffset = (C * (1 - Math.max(0, Math.min(1, f)))).toFixed(1); };
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const diff = target - NOW();
    if (diff <= 0) {
      ['days', 'hours', 'mins', 'secs'].forEach(k => { $('#cd-' + k).textContent = '00'; setArc('arc-' + k, 1); });
      $('#cd-note').textContent = 'The celebrations have begun ✨';
      return;
    }
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    $('#cd-days').textContent = pad(d); $('#cd-hours').textContent = pad(h); $('#cd-mins').textContent = pad(m); $('#cd-secs').textContent = pad(s);
    setArc('arc-days', d / 60); setArc('arc-hours', h / 24); setArc('arc-mins', m / 60); setArc('arc-secs', s / 60);
  }
  tick(); setInterval(tick, 1000);
}

/* ======================================================
   Calendar
   ====================================================== */
function initCalendar() {
  const dlg = $('#cal-dialog');
  const details = '11 Dec – Haldi & Sangeet\n12 Dec – Wedding (muhurat 12:07 PM IST)\n13 Dec – Vidai & check-out by 11:30 AM\n\n' + location.href.split(/[?#]/)[0];
  const g = (text, dates, det) => 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(text) +
    '&dates=' + dates + '&ctz=Asia/Kolkata&location=' + encodeURIComponent(CONFIG.location) + '&details=' + encodeURIComponent(det);
  $('#cal-google-all').href = g('Ketaki & Amogh — Wedding Celebrations', '20261211/20261214', details);
  $('#cal-google-muhurat').href = g('Ketaki & Amogh — Wedding Muhurat', '20261212T063700Z/20261212T073000Z', 'The wedding muhurat at 12:07 PM IST.\n\n' + details);
  $$('[data-open-cal]').forEach(b => b.addEventListener('click', () => dlg.showModal ? dlg.showModal() : window.open($('#cal-google-all').href)));
  $('#cal-ics').addEventListener('click', () => {
    const esc = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ketaki & Amogh//Wedding//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT', 'UID:ketaki-amogh-wedding-2026@invite', 'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:20261211', 'DTEND;VALUE=DATE:20261214',
      'SUMMARY:' + esc('Ketaki & Amogh — Wedding Celebrations'), 'LOCATION:' + esc(CONFIG.location), 'DESCRIPTION:' + esc(details),
      'END:VEVENT',
      'BEGIN:VEVENT', 'UID:ketaki-amogh-muhurat-2026@invite', 'DTSTAMP:' + stamp,
      'DTSTART:20261212T063700Z', 'DTEND:20261212T073000Z',
      'SUMMARY:' + esc('Ketaki & Amogh — Wedding Muhurat'), 'LOCATION:' + esc(CONFIG.location),
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Muhurat in 1 hour', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'Ketaki-Amogh-Wedding.ics' });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    dlg.close();
  });
}

/* ======================================================
   RSVP
   ====================================================== */
function initRsvp() {
  const form = $('#rsvp-form'), status = $('#form-status'), yes = $('.if-yes', form), btn = $('button[type=submit]', form);
  const out = $('#guest-out'), guests = form.elements.guests;
  $$('.stepper button', form).forEach(b => b.addEventListener('click', () => {
    const v = Math.max(1, Math.min(10, (+guests.value) + (+b.dataset.step)));
    guests.value = v; out.textContent = v === 10 ? '10+' : v;
  }));
  form.addEventListener('change', e => {
    if (e.target.name === 'attending') {
      yes.hidden = e.target.value !== 'Yes';
      if (e.target.value === 'Yes') { const r = e.target.getBoundingClientRect(); Petals.burst(r.left + r.width / 2, r.top, 40); }
    }
    const f = e.target.closest('.field'); if (f) f.classList.remove('invalid');
  });
  const setStatus = (m, k) => { status.textContent = m; status.className = 'form-status ' + (k || ''); };
  const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form), name = (fd.get('name') || '').trim(), attending = fd.get('attending');
    const bad = !name ? form.elements.name : !attending ? $('input[name=attending]', form) : null;
    if (bad) {
      bad.closest('.field').classList.add('invalid');
      setStatus(!name ? 'Please tell us your name.' : 'Please let us know if you can come.', 'err');
      bad.focus(); return;
    }
    if (!CONFIG.rsvpEndpoint) {
      setStatus('RSVPs aren’t switched on yet — please reply to the family on WhatsApp for now.', 'err');
      console.warn('Set CONFIG.rsvpEndpoint in v2/script.js'); return;
    }
    const isYes = attending === 'Yes';
    const payload = new URLSearchParams({
      name, phone: (fd.get('phone') || '').trim(), attending,
      guests: isYes ? fd.get('guests') : '0',
      days: isYes ? fd.getAll('days').join(', ') : '',
      pickup: isYes ? (fd.get('pickup') || '') : '',
      message: (fd.get('message') || '').trim()
    });
    btn.disabled = true; setStatus('Sending…');
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body: payload, signal: ctrl.signal });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);
      form.innerHTML = `<div class="rsvp-done"><p class="paper-title">${isYes ? 'See you in Pench!' : 'You’ll be missed'}</p>
        <p class="paper-lead">${isYes ? `Thank you, ${escapeHtml(name)}. Your RSVP is saved and we can’t wait to celebrate with you.`
                                      : `Thank you for letting us know, ${escapeHtml(name)}. We’ll carry your blessings with us.`}</p></div>`;
      $('#rsvp').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      if (isYes) { Petals.shower(160); Bell.chime(1046); Bell.chime(1318, .18); Bell.chime(1568, .36); }
    } catch (err) {
      console.error('RSVP failed:', err);
      setStatus(err.name === 'AbortError' ? 'This is taking too long — please check your connection and try again.'
                                          : 'Sorry, your RSVP didn’t go through. Please try again in a moment.', 'err');
      btn.disabled = false;
    } finally { clearTimeout(timer); }
  });
}

/* ======================================================
   Music (shared file at ../assets/music.mp3)
   ====================================================== */
const Music = (() => {
  const audio = $('#bg-music'), btn = $('#music-btn'), MAX = 0.45;
  let available = false, want = false, fade;
  const ready = fetch(audio.getAttribute('src'), { method: 'HEAD' })
    .then(r => { available = r.ok; btn.hidden = !r.ok; }).catch(() => {});
  function fadeTo(v, ms, done) {
    clearInterval(fade); const s = audio.volume, n = Math.max(1, Math.round(ms / 50)); let i = 0;
    fade = setInterval(() => { i++; audio.volume = Math.min(1, Math.max(0, s + (v - s) * i / n)); if (i >= n) { clearInterval(fade); done && done(); } }, 50);
  }
  function ui(p) { btn.classList.toggle('playing', p); btn.setAttribute('aria-pressed', String(p)); btn.setAttribute('aria-label', p ? 'Pause music' : 'Play music'); }
  async function play() {
    if (!available) return; want = true; audio.volume = 0;
    try { await audio.play(); ui(true); fadeTo(MAX, 2000); } catch { want = false; ui(false); }
  }
  function pause(remember = true) { if (remember) want = false; ui(false); fadeTo(0, 700, () => audio.pause()); }
  btn.addEventListener('click', () => (audio.paused ? play() : pause()));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) pause(false);
    else if (!document.hidden && want && audio.paused) play();
  });
  return { play, ready };
})();

/* ======================================================
   Petals (marigold, rose & jasmine)
   ====================================================== */
const Petals = (() => {
  const cv = $('#petals'), ctx = cv.getContext('2d'), DPR = Math.min(devicePixelRatio || 1, 2);
  const COLORS = ['#F08A00', '#FFA41B', '#F6B800', '#FFD54A', '#C2185B', '#E53950', '#FFF8EC'];
  let ps = [], running = false, W, H;
  function size() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener('resize', size);
  function spawn(x, y, vx, vy) {
    ps.push({ x, y, vx, vy, r: Math.random() * 6.28, vr: (Math.random() - .5) * .2, w: 5 + Math.random() * 5, h: 3 + Math.random() * 3,
      c: COLORS[Math.random() * COLORS.length | 0], ph: Math.random() * 6.28, life: 0 });
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    ps = ps.filter(p => p.y < H + 30 && p.life < 900);
    for (const p of ps) {
      p.life++; p.ph += .05; p.vy = Math.min(p.vy + .045, 1.6); p.vx *= .985;
      p.x += p.vx + Math.sin(p.ph) * .7; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.abs(Math.cos(p.ph)) * .7 + .3);
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.w, p.h, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    if (ps.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  function go() { if (!running) { running = true; requestAnimationFrame(loop); } }
  return {
    burst(x, y, n = 60) { if (REDUCED) return; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 2.4, s = 3 + Math.random() * 6; spawn(x, y, Math.cos(a) * s, Math.sin(a) * s); } go(); },
    shower(n = 120) { if (REDUCED) return; for (let i = 0; i < n; i++) spawn(Math.random() * W, -20 - Math.random() * H * .8, (Math.random() - .5) * 1.2, .5 + Math.random()); go(); }
  };
})();

/* ======================================================
   Fireflies
   ====================================================== */
(() => {
  if (REDUCED) return;
  const cv = $('#fireflies'), ctx = cv.getContext('2d'), DPR = Math.min(devicePixelRatio || 1, 2);
  let W, H, flies = [], raf;
  function size() {
    W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    flies = Array.from({ length: W < 640 ? 24 : 44 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1.2 + Math.random() * 1.8,
      a: Math.random() * 6.28, s: .15 + Math.random() * .35, p: Math.random() * 6.28, ps: .01 + Math.random() * .025 }));
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const f of flies) {
      f.a += (Math.random() - .5) * .25; f.x += Math.cos(f.a) * f.s; f.y += Math.sin(f.a) * f.s - .05;
      if (f.x < -10) f.x = W + 10; if (f.x > W + 10) f.x = -10; if (f.y < -10) f.y = H + 10; if (f.y > H + 10) f.y = -10;
      f.p += f.ps; const g = Math.max(0, Math.sin(f.p)); if (g < .02) continue;
      const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      gr.addColorStop(0, `rgba(255,244,170,${.9 * g})`); gr.addColorStop(.25, `rgba(220,230,120,${.35 * g})`); gr.addColorStop(1, 'rgba(200,220,100,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 7, 0, 6.283); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame); });
  raf = requestAnimationFrame(frame);
})();

/* ======================================================
   Scroll: reveals, pugmark trails, dock highlight, parallax
   ====================================================== */
function initScroll() {
  // pugmark trails
  $$('.trail').forEach((t, ti) => {
    t.innerHTML = Array.from({ length: 6 }, (_, i) => {
      const left = 45 + (i % 2 ? 22 : -22) + (ti % 2 ? -10 : 10) * Math.sin(i), top = i * 24;
      return `<svg style="left:${left}px;top:${top}px;transform-origin:center;transition-delay:${i * 180}ms" viewBox="0 0 40 40"><g transform="rotate(${170 + (i % 2 ? 10 : -10)} 20 20)"><use href="#paw"/></g></svg>`;
    }).join('');
  });

  const reveal = $$('.reveal, .trail');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in'); io.unobserve(e.target);
        if (e.target.id === 'days') $$('.day-card')[DaySwitch.idx].classList.add('shown');
      }
    }), { rootMargin: '0px 0px -10% 0px', threshold: .05 });
    reveal.forEach(el => io.observe(el));

    const links = $$('.dock a');
    const io2 = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-50% 0px -50% 0px' });
    ['#home', '#days', '#venue', '#rsvp'].forEach(s => io2.observe($(s)));
  } else reveal.forEach(el => el.classList.add('in'));

  // dock appears once guests start scrolling
  const onScroll = () => document.body.classList.toggle('scrolled', scrollY > innerHeight * 0.35);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // gentle parallax on the jungle photo
  const bg = $('.jungle-bg'); let tick = false;
  addEventListener('scroll', () => {
    if (tick || REDUCED) return; tick = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight || 1;
      bg.style.transform = `translateY(${(-scrollY / max * 4).toFixed(2)}vh) scale(1.04)`;
      tick = false;
    });
  }, { passive: true });
}

/* ======================================================
   Opening gate
   ====================================================== */
function initGate() {
  const gate = $('#gate'), body = document.body;
  let seen = false;
  try { seen = sessionStorage.getItem('ka-opened') === '1'; } catch {}
  const open = () => body.classList.add('open');
  if (seen || REDUCED) { open(); return; }

  gate.hidden = false; body.classList.add('locked');
  const go = async () => {
    if (gate.classList.contains('opening')) return;
    try { sessionStorage.setItem('ka-opened', '1'); } catch {}
    Bell.ensure();
    Bell.chime(880); Bell.chime(1175, .22); Bell.chime(1568, .44, .07);
    gate.classList.add('opening');
    await Music.ready; Music.play();
    setTimeout(() => {
      open(); Petals.shower(110);
      $$('#toran .bell').forEach((b, i) => setTimeout(() => b.classList.add('ring'), i * 90));
      setTimeout(() => $$('#toran .bell').forEach(b => b.classList.remove('ring')), 2600);
    }, 500);
    setTimeout(() => { gate.hidden = true; body.classList.remove('locked'); }, 1700);
  };
  $('#gate-open').addEventListener('click', go);
  addEventListener('keydown', e => { if (!gate.hidden && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) go(); });
  $('#gate-open').focus({ preventScroll: true });
}

/* ======================================================
   Boot
   ====================================================== */
buildToran();
let lastW = innerWidth;
addEventListener('resize', () => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; buildToran(); } });
renderDays();
DaySwitch.init();
Mood.init();
initScroll();
startCountdown();
initCalendar();
initRsvp();
updateLive(); setInterval(updateLive, 60000);
initGate();
if (document.fonts) document.fonts.ready.then(() => DaySwitch.sizeTrack());
