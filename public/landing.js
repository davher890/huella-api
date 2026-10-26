// ---------- Nav toggle (mobile) ----------
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// ---------- Sector tabs ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    trackEvent('sector_tab_view', { sector: btn.dataset.tab });
  });
});

// ---------- Fake live coordinate readout ----------
const coordsEl = document.getElementById('hero-coords');
let baseLat = 41.1968, baseLon = -3.5742;
setInterval(() => {
  const lat = (baseLat + (Math.random() - 0.5) * 0.0006).toFixed(4);
  const lon = (baseLon + (Math.random() - 0.5) * 0.0006).toFixed(4);
  coordsEl.textContent = `${lat}, ${lon}`;
}, 2500);

// ---------- Lead form ----------
// Sends straight to FormSubmit.co (https://formsubmit.co), a free
// form-to-email relay: no backend needed. IMPORTANT: the first submission
// to a new destination address triggers a one-time confirmation email
// that must be clicked before further leads are delivered.
const LEAD_ENDPOINT = 'https://formsubmit.co/ajax/huellagps@gmail.com';

const form = document.getElementById('lead-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data._subject = 'Nuevo lead - Huella GPS';
  data._template = 'table';
  data._captcha = 'false';
  status.className = '';
  status.textContent = 'Enviando...';
  status.style.display = 'block';
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('bad status');
    status.textContent = 'Solicitud enviada. Te contactamos en menos de 24h.';
    status.className = 'ok';
    form.reset();
    trackEvent('lead_form_submit', { sector: data.sector });
  } catch (err) {
    status.textContent = 'No hemos podido enviarlo. Escríbenos directamente a huellagps@gmail.com';
    status.className = 'err';
  }
});

// ---------- CTA click tracking ----------
document.querySelectorAll('[data-track]').forEach(el => {
  el.addEventListener('click', () => trackEvent(el.dataset.track, {}));
});

// Pushes to the dataLayer so any GTM tag (GA4 config, Ads conversion,
// etc.) can pick it up via a Custom Event trigger — works even before
// the container script below has loaded, since dataLayer is just a queue.
function trackEvent(name, params) {
  window.dataLayer.push({ event: name, ...params });
}

// ---------- Cookie consent + Google Tag Manager (gated) ----------
// GA4 itself isn't loaded directly here: add it as a "Google tag" inside
// this GTM container (tagmanager.google.com), firing on the built-in "All
// Pages" trigger. That keeps a single source of truth instead of
// double-counting hits from two separate scripts.
// Must match the id used in the noscript fallback in app/layout.tsx.
const GTM_CONTAINER_ID = 'GTM-NN4MCZ9M';

function loadGTM() {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(s);
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
}

const banner = document.getElementById('cookie-banner');
const consent = localStorage.getItem('cookie-consent');
if (consent === 'accepted') {
  loadGTM();
} else if (consent === null) {
  banner.style.display = 'flex';
}
document.getElementById('cookie-accept').addEventListener('click', () => {
  localStorage.setItem('cookie-consent', 'accepted');
  banner.style.display = 'none';
  loadGTM();
});
document.getElementById('cookie-reject').addEventListener('click', () => {
  localStorage.setItem('cookie-consent', 'rejected');
  banner.style.display = 'none';
});
