// Preserve each property-specific WhatsApp message; record only contact dimensions.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => window.logosTrack?.('contact_click', {
      channel: 'whatsapp', placement: link.closest('nav') ? 'navigation' : 'content',
    }));
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.mobile-menu[open]').forEach(menu => {
      menu.open = false;
      menu.querySelector('summary').focus();
    });
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.mobile-menu[open]').forEach(menu => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => { link.closest('details').open = false; });
  });
});
