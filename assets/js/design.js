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

// Native scrolling and manual controls remain available alongside automatic rotation.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.testimonials').forEach(section => {
    const track = section.querySelector('.testimonials-track');
    const slides = [...track.querySelectorAll('.testimonial-slide')];
    const controls = section.querySelector('.testimonials-controls');
    const status = section.querySelector('[data-testimonial-status]');
    const toggle = section.querySelector('[data-testimonial-toggle]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (slides.length < 2) return;
    controls.hidden = false;
    let paused = motion.matches, hovering = false, visible = false, timer;
    const current = () => Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    const blocked = () => paused || hovering || !visible || document.hidden || section.contains(document.activeElement) || !!section.querySelector('details[open]');
    const schedule = () => {
      window.clearTimeout(timer);
      status.setAttribute('aria-live', blocked() ? 'polite' : 'off');
      if (!blocked()) timer = window.setTimeout(() => { move(1); schedule(); }, 8000);
    };
    const updateToggle = () => {
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', paused ? 'Activar cambio automático de testimonios' : 'Pausar cambio automático de testimonios');
    };
    const move = direction => {
      const index = (current() + direction + slides.length) % slides.length;
      slides.forEach(slide => slide.querySelectorAll('details[open]').forEach(detail => { detail.open = false; }));
      track.scrollTo({ left: index * track.clientWidth, behavior: motion.matches ? 'auto' : 'smooth' });
    };
    section.querySelector('[data-testimonial-prev]').addEventListener('click', () => { move(-1); schedule(); });
    section.querySelector('[data-testimonial-next]').addEventListener('click', () => { move(1); schedule(); });
    toggle.addEventListener('click', () => { paused = !paused; updateToggle(); schedule(); });
    section.addEventListener('mouseenter', () => { hovering = true; schedule(); });
    section.addEventListener('mouseleave', () => { hovering = false; schedule(); });
    section.addEventListener('focusin', schedule);
    section.addEventListener('focusout', () => window.setTimeout(schedule, 0));
    section.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', schedule));
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { paused = motion.matches; updateToggle(); schedule(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(section);
    } else { visible = true; }
    track.addEventListener('scroll', () => { status.textContent = `${current() + 1} de ${slides.length}`; }, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); schedule();
    });
    updateToggle(); schedule();
  });
});
