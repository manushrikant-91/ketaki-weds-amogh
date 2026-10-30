/* ==========================================================
   Ketaki & Amogh — v2 "Into the Jungle"
   ========================================================== */

const CONFIG = {
  // Paste the Google Apps Script web-app URL here (same one as the main site).
  rsvpEndpoint: window.RSVP_ENDPOINT || '',   // set in /config.js
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
  const W = Math.max(320, window.innerWidth);
  svg.setAttribute('viewBox', `0 0 ${W} 150`);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.random() * arr.length | 0];
  let out = '';

  /* ---- shared paint: shaded marigolds, two-tone leaves, soft shadows ---- */
  const ring = (n, rad, r, fill, rot = 0) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI + rot, x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${fill}" stroke="rgba(120,50,0,.28)" stroke-width=".35"/>`;
  }).join('');
  const marigold = (id, g) =>   // a ruffled pom-pom: three rings of petals around a deep centre
    `<symbol id="${id}" viewBox="-10 -10 20 20" overflow="visible">
       <circle r="9.2" fill="url(#${g}-edge)"/>
       ${ring(16, 6.4, 3.3, `url(#${g})`)}${ring(11, 3.9, 2.9, `url(#${g})`, .3)}${ring(6, 1.9, 2.4, `url(#${g}-hi)`, .6)}
       <circle r="1.4" fill="#8A3C00" opacity=".75"/>
     </symbol>`;
  out += `<defs>
    <radialGradient id="mo"><stop offset="0" stop-color="#FFC45C"/><stop offset=".55" stop-color="#EE8A0E"/><stop offset="1" stop-color="#B85200"/></radialGradient>
    <radialGradient id="mo-hi"><stop offset="0" stop-color="#FFD98A"/><stop offset="1" stop-color="#F39A1C"/></radialGradient>
    <radialGradient id="mo-edge"><stop offset=".6" stop-color="#C45F00"/><stop offset="1" stop-color="#7A3500"/></radialGradient>
    <radialGradient id="my"><stop offset="0" stop-color="#FFE899"/><stop offset=".55" stop-color="#F2B518"/><stop offset="1" stop-color="#B98000"/></radialGradient>
    <radialGradient id="my-hi"><stop offset="0" stop-color="#FFF2BF"/><stop offset="1" stop-color="#F6C53A"/></radialGradient>
    <radialGradient id="my-edge"><stop offset=".6" stop-color="#C98E00"/><stop offset="1" stop-color="#7E5800"/></radialGradient>
    ${[['#143A22', '#2F6E42'], ['#18432A', '#3B7D4C'], ['#10301C', '#295F3A'], ['#1E4A2C', '#4A8656']].map((c, i) =>
      `<linearGradient id="lf${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c[0]}"/><stop offset=".48" stop-color="${c[1]}"/><stop offset=".52" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>`).join('')}
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7A5418"/><stop offset=".3" stop-color="#E9C978"/><stop offset=".45" stop-color="#FFF0C4"/><stop offset=".7" stop-color="#C79A42"/><stop offset="1" stop-color="#6E4A12"/>
    </linearGradient>
    <filter id="shade" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#000" flood-opacity=".55"/></filter>
    <filter id="far" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter>
    ${marigold('mari-o', 'mo')}${marigold('mari-y', 'my')}
  </defs>`;

  /* ---- mango leaves: a darker, softer back layer and a crisp front layer ---- */
  const leaf = (x, len, wid, rot, grad, dur, delay) => {
    const bend = rnd(-4, 4);
    return `<g transform="translate(${x.toFixed(1)},5) rotate(${rot.toFixed(1)})"><g class="sway" style="animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s">
      <path d="M0 0C${wid * 1.15} ${len * .22} ${wid * .95} ${len * .68} ${bend} ${len}C${-wid * .85} ${len * .68} ${-wid * 1.1} ${len * .22} 0 0Z" fill="url(#${grad})"/>
      <path d="M0 1Q${(bend * .4 + wid * .12).toFixed(1)} ${len * .5} ${bend} ${len - 2}" fill="none" stroke="#9CC59A" stroke-opacity=".35" stroke-width=".8"/></g></g>`;
  };
  out += '<g filter="url(#far)" opacity=".75">';
  for (let x = 4; x < W; x += 15) out += leaf(x, rnd(50, 66), rnd(8, 10), rnd(-14, 14), 'lf2', rnd(7, 10), rnd(-9, 0));
  out += '</g><g filter="url(#shade)">';
  for (let x = 12; x < W; x += 21) out += leaf(x, rnd(40, 54), rnd(8.5, 11), rnd(-9, 9), pick(['lf0', 'lf1', 'lf3']), rnd(6, 9), rnd(-9, 0));
  out += '</g>';

  /* ---- cord ---- */
  out += `<rect x="0" y="0" width="${W}" height="7" fill="#4A3210"/>
          <line x1="0" y1="3.5" x2="${W}" y2="3.5" stroke="#B88A3E" stroke-width="2.4" stroke-dasharray="3 2.2" opacity=".7"/>
          <rect x="0" y="6.5" width="${W}" height="1.2" fill="#C9A24D" opacity=".8"/>`;

  /* ---- marigold swags ---- */
  const span = W < 600 ? 96 : 130, n = Math.max(2, Math.round(W / span)), step = W / n;
  out += '<g filter="url(#shade)">';
  for (let i = 0; i < n; i++) {
    const x0 = i * step, sag = step * .26, count = Math.round(step / 8.5);
    for (let k = 0; k <= count; k++) {
      const t = k / count, x = x0 + step * t + rnd(-.8, .8), y = 9 + 4 * sag * t * (1 - t) + rnd(-.8, .8);
      const s = rnd(13.5, 16.5);
      out += `<use href="#${Math.random() < .6 ? 'mari-o' : 'mari-y'}" x="${(x - s / 2).toFixed(1)}" y="${(y - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${rnd(0, 360).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  }
  out += '</g>';

  /* ---- brass bells on every hanging point ---- */
  out += '<g filter="url(#shade)">';
  for (let i = 1; i < n; i++) {
    const x = i * step, th = (i % 2 ? 44 : 30) + rnd(-3, 3);
    out += `<g transform="translate(${x.toFixed(1)},8)"><g class="sway bell" role="button" aria-label="Ring the bell" data-pitch="${[880, 988, 1046, 1175, 1318][i % 5]}" style="animation-delay:${rnd(-6, 0).toFixed(1)}s">
      <line x1="0" y1="0" x2="0" y2="${th}" stroke="#8A6420" stroke-width="1.2"/>
      <use href="#mari-o" x="-6.5" y="${(th * .42 - 6.5).toFixed(1)}" width="13" height="13"/>
      <circle cx="0" cy="${th + 1}" r="2.5" fill="none" stroke="#9A7228" stroke-width="1.3"/>
      <path d="M0 ${th + 3}c7 0 10 7 10 15l3 5h-26l3-5c0-8 3-15 10-15z" fill="url(#brass)"/>
      <path d="M-4 ${th + 7}c-2 3-2.6 8-2.6 12" stroke="#FFF6D8" stroke-opacity=".55" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <rect x="-13" y="${th + 22}" width="26" height="2.6" rx="1.3" fill="#6E4A12"/>
      <circle cx="0" cy="${th + 27}" r="3" fill="#7A5418"/>
      <rect x="-15" y="-2" width="30" height="${th + 34}" fill="transparent"/></g></g>`;
  }
  out += '</g>';

  svg.innerHTML = out;
  $$('.bell', svg).forEach(b => b.addEventListener('pointerdown', () => ringBell(b)));
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
  const list = $('#days-list');
  list.innerHTML = DAYS.map((d, di) => `
    <article class="day-card" data-theme="${d.theme}" id="day-${di}" aria-label="${d.title}">
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

  $$('[data-petals]', list).forEach(b => b.addEventListener('click', () => Petals.shower()));
}

const DayNav = (() => {
  let idx = 0;
  function set(i) {
    idx = i;
    $$('#day-bar a').forEach((a, k) => a.setAttribute('aria-current', String(k === i)));
    if (Mood.inDays) Mood.set(DAYS[i].theme);
  }
  function init() {
    set(0);
    if (!('IntersectionObserver' in window)) { $$('.day-card').forEach(c => c.classList.add('shown')); return; }
    // which day is under the reading line (just below the sticky bar)
    let raf;
    const spy = () => {
      const line = innerHeight * 0.4;
      let i = 0;
      $$('.day-card').forEach((c, k) => { if (c.getBoundingClientRect().top <= line) i = k; });
      if (i !== idx) set(i);
    };
    addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(spy); }, { passive: true });
    // reveal each day's timeline as it scrolls in
    const show = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('shown'); show.unobserve(e.target); } }),
      { rootMargin: '0px 0px -15% 0px' });
    $$('.day-card').forEach(c => show.observe(c));
  }
  return { init, get idx() { return idx; } };
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
        if (en.target.id === 'days') { Mood.inDays = true; Mood.set(DAYS[DayNav.idx].theme); }
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
  banner.onclick = () => (nowLi || nextLi || card).scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
  banner.style.cursor = 'pointer';
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
      if (e.target.value === 'Yes') { const r = e.target.getBoundingClientRect(); Petals.drift(r.left + r.width / 2, r.top, 10); }
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
      console.warn('Set RSVP_ENDPOINT in config.js (see README.md).'); return;
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
      if (isYes) { Petals.shower(); Bell.chime(1046); Bell.chime(1318, .18); Bell.chime(1568, .36); }
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
  return { play, pause, ready };
})();

/* ======================================================
   Petals — marigold, rose & jasmine that drift, sway and tumble
   ====================================================== */
const Petals = (() => {
  const cv = $('#petals'), ctx = cv.getContext('2d'), DPR = Math.min(devicePixelRatio || 1, 2);
  // [tip colour, base colour, length range, width ratio, tip notch, how common]
  const KINDS = [
    { c: ['#FFC24A', '#E07B00'], len: [12, 17], wr: .46, notch: .1, n: 5 },   // orange marigold
    { c: ['#FFE48A', '#EFAE00'], len: [11, 16], wr: .46, notch: .1, n: 3 },    // yellow marigold
    { c: ['#F27A92', '#A3153A'], len: [15, 21], wr: .78, notch: .16, n: 2 },  // rose
    { c: ['#FFFFFF', '#E9DFC9'], len: [11, 14], wr: .5, notch: -.06, n: 2 }    // jasmine
  ];
  const sprites = [];
  KINDS.forEach(k => {
    for (let v = 0; v < 4; v++) {
      const L = k.len[0] + Math.random() * (k.len[1] - k.len[0]), W = L * k.wr * (0.85 + Math.random() * .3);
      const c = document.createElement('canvas'), s = 3;               // draw at 3× for crispness
      c.width = Math.ceil((W + 4) * s); c.height = Math.ceil((L + 4) * s);
      const g = c.getContext('2d'); g.scale(s, s); g.translate((W + 4) / 2, (L + 4) / 2);
      g.beginPath();
      g.moveTo(0, -L / 2);
      g.bezierCurveTo(W * .62, -L * .32, W * .58, L * .32, W * .24, L / 2);
      g.quadraticCurveTo(0, L / 2 - L * k.notch, -W * .24, L / 2);
      g.bezierCurveTo(-W * .58, L * .32, -W * .62, -L * .32, 0, -L / 2);
      const gr = g.createLinearGradient(0, -L / 2, 0, L / 2);
      gr.addColorStop(0, k.c[1]); gr.addColorStop(.55, k.c[0]); gr.addColorStop(1, k.c[0]);
      g.fillStyle = gr; g.fill();
      g.globalAlpha = .18; g.strokeStyle = k.c[1]; g.lineWidth = .5;                  // soft vein
      g.beginPath(); g.moveTo(0, -L / 2 + 1); g.quadraticCurveTo(W * .08, 0, 0, L * .3); g.stroke();
      g.globalAlpha = .25; g.fillStyle = '#fff';                                        // sheen
      g.beginPath(); g.ellipse(-W * .14, -L * .05, W * .1, L * .22, -.2, 0, 6.283); g.fill();
      for (let i = 0; i < k.n; i++) sprites.push({ img: c, w: W + 4, h: L + 4 });
    }
  });

  let W, H, live = [], queue = [], raf = 0, last = 0;
  function size() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener('resize', size);

  function make(x, y, at) {
    const z = .55 + Math.random() * .6;                                // depth: small = far away
    queue.push({ at, x, y, z, sp: sprites[Math.random() * sprites.length | 0],
      vy: .35 + z * .55, swayA: .5 + Math.random() * 1.1, swayF: .010 + Math.random() * .016, ph: Math.random() * 6.283,
      flipF: .015 + Math.random() * .035, fl: Math.random() * 6.283, rot: Math.random() * 6.283, vr: (Math.random() - .5) * .012,
      a: 0, maxA: .55 + z * .4 });
  }
  function frame(t) {
    const k = Math.min(3, (t - (last || t)) / 16.7 || 1); last = t;
    while (queue.length && queue[0].at <= t) live.push(queue.shift());
    ctx.clearRect(0, 0, W, H);
    const wind = Math.sin(t * .00035) * .35 + Math.sin(t * .0011) * .12;
    live = live.filter(p => p.y < H + 40);
    for (const p of live) {
      p.ph += p.swayF * k; p.fl += p.flipF * k; p.rot += p.vr * k;
      p.x += (Math.cos(p.ph) * p.swayA * .55 + wind) * p.z * k;
      p.y += p.vy * k * (.7 + .3 * Math.abs(Math.sin(p.ph)));          // slows at each end of the swing, like a real petal
      p.a = Math.min(p.maxA, p.a + .03 * k);
      const flip = Math.cos(p.fl), sx = (Math.abs(flip) < .12 ? .12 * Math.sign(flip || 1) : flip) * p.z;
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.ph) * .6); ctx.scale(sx, p.z);
      ctx.drawImage(p.sp.img, -p.sp.w / 2, -p.sp.h / 2, p.sp.w, p.sp.h);
      ctx.restore();
    }
    if (live.length || queue.length) raf = requestAnimationFrame(frame);
    else { raf = 0; last = 0; ctx.clearRect(0, 0, W, H); }
  }
  function go() { queue.sort((a, b) => a.at - b.at); if (!raf) raf = requestAnimationFrame(frame); }
  return {
    // a gentle fall across the whole screen, spread over a few seconds
    shower(n = innerWidth < 640 ? 34 : 56, spread = 3200) {
      if (REDUCED) return; const t0 = performance.now();
      for (let i = 0; i < n; i++) make(Math.random() * W * 1.1 - W * .05, -20 - Math.random() * 30, t0 + Math.random() * spread);
      go();
    },
    // a handful of petals let go just above a spot
    drift(x, y, n = 10) {
      if (REDUCED) return; const t0 = performance.now();
      for (let i = 0; i < n; i++) make(x + (Math.random() - .5) * 120, y - 30 - Math.random() * 60, t0 + Math.random() * 700);
      go();
    }
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
  const reveal = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in'); io.unobserve(e.target);
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
  const gate = $('#gate'), body = document.body, root = document.documentElement;
  let opening = false;

  // Always start from the top: no remembered scroll position, no jump to a #section
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  const toTop = () => {
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => requestAnimationFrame(() => { root.style.scrollBehavior = ''; }));
  };

  const show = () => {
    opening = false;
    toTop();
    gate.classList.remove('opening'); gate.hidden = false;
    body.classList.remove('open', 'scrolled'); body.classList.add('locked');
    $('#gate-open').focus({ preventScroll: true });
  };
  const go = async () => {
    if (opening) return; opening = true;
    toTop();
    Bell.ensure();
    Bell.chime(880); Bell.chime(1175, .22); Bell.chime(1568, .44, .07);
    gate.classList.add('opening');
    await Music.ready; Music.play();
    setTimeout(() => {
      body.classList.add('open');
      Petals.shower();
      $$('#toran .bell').forEach((b, i) => setTimeout(() => b.classList.add('ring'), i * 110));
      setTimeout(() => $$('#toran .bell').forEach(b => b.classList.remove('ring')), 2800);
    }, 500);
    setTimeout(() => { gate.hidden = true; body.classList.remove('locked'); toTop(); Trail.reset(); }, 1700);
  };
  $('#gate-open').addEventListener('click', go);
  addEventListener('keydown', e => { if (!gate.hidden && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) go(); });

  // "Open the invitation again"
  $('#replay').addEventListener('click', () => { Music.pause(); show(); });

  // Coming back with the Back button / reopening a cached tab: start over at the seal
  addEventListener('pageshow', e => { if (e.persisted) { Music.pause(); show(); } });
  // Some browsers restore scroll after load — reset once more when everything has loaded
  addEventListener('load', () => { if (!gate.hidden) toTop(); });

  show();
}

/* ======================================================
   Tiger trail — one winding line of pugmarks down the page,
   revealed step by step as you scroll
   ====================================================== */
const Trail = (() => {
  const svg = $('#tiger-trail'), main = $('main');
  let prints = [], shown = 0, raf;
  function build() {
    const Wd = main.clientWidth, Ht = main.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`);
    const cx = Wd / 2, amp = Math.min(Wd * .38, 300), period = Math.max(900, Ht / 7);
    const X = y => cx + amp * Math.sin(2 * Math.PI * y / period + .6) * (0.85 + .15 * Math.sin(y / 370));
    const STRIDE = 46, SIZE = Wd < 600 ? 19 : 22;
    // the tiger steps around headings and loose text instead of over them
    const m = main.getBoundingClientRect(), PAD = 18;
    const avoid = $$('.eyebrow, .section-title, .gtk-title, .venue-sub, .fine, .thanks > *:not(.replay)').map(el => {
      const r = el.getBoundingClientRect();
      return [r.left - m.left - PAD, r.top - m.top - PAD - 30, r.right - m.left + PAD, r.bottom - m.top + PAD + 30];
    });
    const blocked = (x, y) => avoid.some(([l, t, r, b]) => x > l && x < r && y > t && y < b);
    let html = '', acc = 0, side = 1, px = X(0), py = 0;
    for (let y = 2; y < Ht - 40; y += 2) {
      const x = X(y), dx = x - px, dy = y - py, d = Math.hypot(dx, dy);
      acc += d; px = x; py = y;
      if (acc < STRIDE) continue;
      acc = 0; side = -side;
      const ux = dx / d, uy = dy / d, ox = -uy * 9 * side, oy = ux * 9 * side;   // alternate left / right foot
      const ang = 180 - Math.atan2(ux, uy) * 180 / Math.PI + side * 6;
      if (blocked(x + ox, y + oy)) continue;
      html += `<use href="#paw" width="${SIZE}" height="${SIZE}" data-y="${Math.round(y)}" ` +
              `transform="translate(${(x + ox - SIZE / 2).toFixed(1)} ${(y + oy - SIZE / 2).toFixed(1)}) rotate(${ang.toFixed(1)} ${SIZE / 2} ${SIZE / 2})"/>`;
    }
    svg.innerHTML = html;
    prints = [...svg.children]; shown = 0;
    update();
  }
  function update() {
    if (!prints.length) return;
    const top = main.getBoundingClientRect().top + scrollY;
    const edge = scrollY + innerHeight * .78 - top;          // reveal up to just below the middle of the screen
    while (shown < prints.length && +prints[shown].dataset.y < edge) prints[shown++].classList.add('on');      // walking forward
    while (shown > 0 && +prints[shown - 1].dataset.y >= edge) prints[--shown].classList.remove('on');          // scrolling back: steps fade away
  }
  function reset() { prints.forEach(p => p.classList.remove('on')); shown = 0; update(); }
  function init() {
    build();
    addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    let t;
    const rebuild = () => { clearTimeout(t); t = setTimeout(build, 250); };
    if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(main); else addEventListener('resize', rebuild);
  }
  return { init, reset };
})();

/* ======================================================
   Boot
   ====================================================== */
buildToran();
let lastW = innerWidth;
addEventListener('resize', () => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; buildToran(); } });
renderDays();
DayNav.init();
Mood.init();
initScroll();
startCountdown();
initCalendar();
initRsvp();
updateLive(); setInterval(updateLive, 60000);
initGate();
Trail.init();
