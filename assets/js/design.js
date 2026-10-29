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

// Native horizontal scrolling works without JavaScript; buttons enhance it.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.testimonials').forEach(section => {
    const track = section.querySelector('.testimonials-track');
    const slides = [...track.querySelectorAll('.testimonial-slide')];
    const controls = section.querySelector('.testimonials-controls');
    const status = section.querySelector('[data-testimonial-status]');
    if (slides.length < 2) return;
    controls.hidden = false;
    const current = () => Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    const move = direction => {
      const index = (current() + direction + slides.length) % slides.length;
      slides.forEach(slide => slide.querySelectorAll('details[open]').forEach(detail => { detail.open = false; }));
      track.scrollTo({ left: index * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    section.querySelector('[data-testimonial-prev]').addEventListener('click', () => move(-1));
    section.querySelector('[data-testimonial-next]').addEventListener('click', () => move(1));
    track.addEventListener('scroll', () => { status.textContent = `${current() + 1} de ${slides.length}`; }, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    });
  });
});
