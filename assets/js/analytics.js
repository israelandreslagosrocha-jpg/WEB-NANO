// Public measurement identifiers. Add GA4 only after confirming the property owner.
window.LOGOS_ANALYTICS = {
  adsId: 'AW-18053973183',
  ga4Id: '',
};
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
const isProduction = ['logosarquitectura.cl', 'www.logosarquitectura.cl'].includes(window.location.hostname);
let googleTagStarted = false;
const loadGoogleTag = () => {
  if (!isProduction || googleTagStarted) return;
  googleTagStarted = true;
  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${window.LOGOS_ANALYTICS.adsId}`;
  document.head.appendChild(googleTag);
};

if (isProduction) {
  // Queue configuration immediately; load the library after critical page resources.
  window.gtag('js', new Date());
  window.gtag('config', window.LOGOS_ANALYTICS.adsId);
  if (/^G-[A-Z0-9]+$/.test(window.LOGOS_ANALYTICS.ga4Id)) {
    window.gtag('config', window.LOGOS_ANALYTICS.ga4Id);
  }
  const scheduleGoogleTag = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGoogleTag, { timeout: 1500 });
    } else {
      window.setTimeout(loadGoogleTag, 0);
    }
  };
  if (document.readyState === 'complete') scheduleGoogleTag();
  else window.addEventListener('load', scheduleGoogleTag, { once: true });
}

// Only accept controlled dimensions, never form values, messages or personal data.
window.logosTrack = (eventName, dimensions = {}) => {
  const allowed = ['contact_click', 'form_start', 'whatsapp_handoff'];
  if (!allowed.includes(eventName)) return;
  // Start loading immediately for an early contact action; do not wait for idle.
  loadGoogleTag();
  const event = { event: eventName, service: document.body.dataset.service || 'general' };
  for (const key of ['channel', 'placement', 'form_id']) {
    if (typeof dimensions[key] === 'string') event[key] = dimensions[key];
  }
  window.dataLayer.push(event);
  if (isProduction && /^G-[A-Z0-9]+$/.test(window.LOGOS_ANALYTICS.ga4Id)) {
    const { event: name, ...parameters } = event;
    window.gtag('event', name, { ...parameters, send_to: window.LOGOS_ANALYTICS.ga4Id });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => window.logosTrack('contact_click', {
      channel: link.href.startsWith('mailto:') ? 'email' : 'phone',
      placement: link.closest('footer') ? 'footer' : 'content',
    }));
  });
});
