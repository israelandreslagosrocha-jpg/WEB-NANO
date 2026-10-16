// Preserve each property-specific WhatsApp message; record only contact dimensions.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => window.logosTrack?.('contact_click', {
      channel: 'whatsapp', placement: link.closest('nav') ? 'navigation' : 'content',
    }));
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => { link.closest('details').open = false; });
  });
});
