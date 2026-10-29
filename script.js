/* ==========================================================
   Ketaki & Amogh — site behaviour
   ========================================================== */

const CONFIG = {
  // Paste your Google Apps Script web-app URL here (ends in /exec). See README.md.
  rsvpEndpoint: '',

  // Muhurat: Saturday 12 Dec 2026, 12:07 PM India time
  muhurat: '2026-12-12T12:07:00+05:30',

  calendar: {
    title: 'Ketaki & Amogh — Wedding Celebrations',
    start: '20261211',          // all-day, inclusive
    endExclusive: '20261214',   // day after the last day
    location: 'Olive Resort, Turia Gate, Pench, Madhya Pradesh 480881',
    details:
      '11 Dec – Haldi & Sangeet\n' +
      '12 Dec – Wedding (muhurat 12:07 PM IST)\n' +
      '13 Dec – Vidai & check-out by 11:30 AM\n\n' +
      'Schedule & RSVP: ' + location.href.split('#')[0]
  }
};

document.documentElement.classList.add('js');

/* ---------- Floating nav: show after the first screen ---------- */
(() => {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Reveal sections as they scroll in ---------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach(e => io.observe(e));
})();

/* ---------- Countdown ---------- */
(() => {
  const target = new Date(CONFIG.muhurat).getTime();
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, '0');
  let timer;
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => $(id).textContent = '00');
      $('cd-note').textContent = 'The celebrations have begun! ✨';
      clearInterval(timer);
      return;
    }
    $('cd-days').textContent = pad(Math.floor(diff / 864e5));
    $('cd-hours').textContent = pad(Math.floor(diff / 36e5) % 24);
    $('cd-mins').textContent = pad(Math.floor(diff / 6e4) % 60);
    $('cd-secs').textContent = pad(Math.floor(diff / 1e3) % 60);
  }
  tick();
  timer = setInterval(tick, 1000);
})();

/* ---------- Add to calendar (Google link or .ics file) ---------- */
(() => {
  const c = CONFIG.calendar;
  const dlg = document.getElementById('cal-dialog');
  const google = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(c.title) +
    '&dates=' + c.start + '/' + c.endExclusive +
    '&ctz=Asia/Kolkata' +
    '&location=' + encodeURIComponent(c.location) +
    '&details=' + encodeURIComponent(c.details);
  document.getElementById('cal-google').href = google;

  document.querySelectorAll('[data-open-cal]').forEach(b => b.addEventListener('click', () => {
    if (dlg.showModal) dlg.showModal(); else window.open(google, '_blank');
  }));

  document.getElementById('cal-ics').addEventListener('click', () => {
    const esc = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ketaki & Amogh//Wedding//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:ketaki-amogh-wedding-2026@invite',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + c.start,
      'DTEND;VALUE=DATE:' + c.endExclusive,
      'SUMMARY:' + esc(c.title),
      'LOCATION:' + esc(c.location),
      'DESCRIPTION:' + esc(c.details),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'Ketaki-Amogh-Wedding.ics' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    dlg.close();
  });
})();

/* ---------- RSVP ---------- */
(() => {
  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('form-status');
  const yesBlock = form.querySelector('.if-yes');
  const btn = form.querySelector('button[type=submit]');

  form.addEventListener('change', e => {
    if (e.target.name === 'attending') yesBlock.hidden = e.target.value !== 'Yes';
    const f = e.target.closest('.field'); if (f) f.classList.remove('invalid');
  });

  function setStatus(msg, kind) { status.textContent = msg; status.className = 'form-status ' + (kind || ''); }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const attending = fd.get('attending');

    let bad = null;
    if (!name) bad = form.elements.name;
    else if (!attending) bad = form.querySelector('input[name=attending]');
    if (bad) {
      bad.closest('.field').classList.add('invalid');
      setStatus(!name ? 'Please tell us your name.' : 'Please let us know if you can come.', 'err');
      bad.focus();
      return;
    }

    if (!CONFIG.rsvpEndpoint) {
      setStatus('RSVPs aren’t switched on yet — please reply to the family on WhatsApp for now.', 'err');
      console.warn('Set CONFIG.rsvpEndpoint in script.js (see README.md).');
      return;
    }

    const isYes = attending === 'Yes';
    const payload = new URLSearchParams({
      name,
      phone: (fd.get('phone') || '').trim(),
      attending,
      guests: isYes ? fd.get('guests') : '0',
      days: isYes ? fd.getAll('days').join(', ') : '',
      pickup: isYes ? (fd.get('pickup') || '') : '',
      message: (fd.get('message') || '').trim()
    });

    btn.disabled = true;
    setStatus('Sending…');
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 20000);

    try {
      // A plain form-encoded POST is a "simple" request, so Apps Script's JSON reply is readable.
      const res = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body: payload, signal: ctrl.signal });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);

      form.innerHTML =
        '<div class="rsvp-done">' +
        '<p class="day-title">' + (isYes ? 'See you in Pench!' : 'You’ll be missed') + '</p>' +
        '<p class="lead">' + (isYes
          ? 'Thank you, ' + escapeHtml(name) + '. Your RSVP is saved and we can’t wait to celebrate with you.'
          : 'Thank you for letting us know, ' + escapeHtml(name) + '. We’ll carry your blessings with us.') +
        '</p></div>';
      document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('RSVP failed:', err);
      setStatus(err.name === 'AbortError'
        ? 'This is taking too long — please check your connection and try again.'
        : 'Sorry, your RSVP didn’t go through. Please try again in a moment.', 'err');
      btn.disabled = false;
    } finally {
      clearTimeout(timeout);
    }
  });

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
})();

/* ---------- Fireflies ---------- */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.getElementById('fireflies');
  const ctx = cv.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, flies = [], raf;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = W < 640 ? 26 : 48;
    flies = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1.2 + Math.random() * 1.8,
      a: Math.random() * Math.PI * 2,          // heading
      s: 0.15 + Math.random() * 0.35,          // speed
      p: Math.random() * Math.PI * 2,          // glow phase
      ps: 0.01 + Math.random() * 0.025         // glow speed
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const f of flies) {
      f.a += (Math.random() - 0.5) * 0.25;
      f.x += Math.cos(f.a) * f.s; f.y += Math.sin(f.a) * f.s - 0.05;
      if (f.x < -10) f.x = W + 10; if (f.x > W + 10) f.x = -10;
      if (f.y < -10) f.y = H + 10; if (f.y > H + 10) f.y = -10;
      f.p += f.ps;
      const glow = Math.max(0, Math.sin(f.p));       // blink on and off
      if (glow < 0.02) continue;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      g.addColorStop(0, `rgba(255, 244, 170, ${0.9 * glow})`);
      g.addColorStop(0.25, `rgba(220, 230, 120, ${0.35 * glow})`);
      g.addColorStop(1, 'rgba(200, 220, 100, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame);
  });
  raf = requestAnimationFrame(frame);
})();
