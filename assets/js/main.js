// main.js - General scripts, animations, observers
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Content remains readable without JavaScript or animation observers.

  // Avoid covering form fields with the floating contact link on small screens.
  const floatingContact = document.querySelector('a.whatsapp-btn.fixed');
  if (floatingContact && 'IntersectionObserver' in window) {
    const visibleForms = new Set();
    const contactObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting
        ? visibleForms.add(entry.target) : visibleForms.delete(entry.target));
      floatingContact.classList.toggle('hidden', visibleForms.size > 0);
    });
    document.querySelectorAll('.whatsapp-form').forEach(form => contactObserver.observe(form));
  }

  // Interactive specialty cards
  if (!prefersReducedMotion) {
    const specialtyCards = document.querySelectorAll('.specialty-card');
    specialtyCards.forEach(card => {
      const handleMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -6;
        const rotateY = ((x / rect.width) - 0.5) * 6;

        card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.classList.add('is-active');
      };

      const resetCard = () => {
        card.style.transform = '';
        card.classList.remove('is-active');
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', resetCard);
      card.addEventListener('focusin', () => card.classList.add('is-active'));
      card.addEventListener('focusout', resetCard);
    });
  }

  // Interactive content cards
  if (!prefersReducedMotion) {
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
      const handleMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -4;
        const rotateY = ((x / rect.width) - 0.5) * 4;

        card.style.transform = `translateY(-3px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };

      const resetCard = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', resetCard);
      card.addEventListener('focusin', () => {
        card.style.transform = 'translateY(-3px)';
      });
      card.addEventListener('focusout', resetCard);
    });
  }

  // Navbar scroll effect for elegant transparency
  const navbar = document.getElementById('navbar');
  const navLinks = navbar?.querySelectorAll('.nav-link');
  const logoText = document.getElementById('logo-text');
  const heroCtaSecondary = document.querySelector('.hero-cta-secondary');

  const setHeroNavState = (isHero) => {
    if (!navbar) return;
    navbar.classList.toggle('nav-hero', isHero);
  };

  navLinks?.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (navbar?.classList.contains('nav-hero')) {
        link.classList.add('is-hovered');
      }
    });
    link.addEventListener('mouseleave', () => {
      link.classList.remove('is-hovered');
    });
    link.addEventListener('focusin', () => {
      if (navbar?.classList.contains('nav-hero')) {
        link.classList.add('is-hovered');
      }
    });
    link.addEventListener('focusout', () => {
      link.classList.remove('is-hovered');
    });
  });

  if (heroCtaSecondary) {
    heroCtaSecondary.addEventListener('mouseenter', () => {
      if (navbar?.classList.contains('nav-hero')) {
        heroCtaSecondary.classList.add('is-hovered');
      }
    });
    heroCtaSecondary.addEventListener('mouseleave', () => {
      heroCtaSecondary.classList.remove('is-hovered');
    });
    heroCtaSecondary.addEventListener('focusin', () => {
      if (navbar?.classList.contains('nav-hero')) {
        heroCtaSecondary.classList.add('is-hovered');
      }
    });
    heroCtaSecondary.addEventListener('focusout', () => {
      heroCtaSecondary.classList.remove('is-hovered');
    });
  }

  // The hero uses a single static image to avoid automatic motion and extra downloads.

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      setHeroNavState(false);
      navbar?.classList.add('bg-white', 'shadow-sm');
      navbar?.classList.remove('bg-transparent', 'border-transparent');
      navLinks?.forEach(link => {
        link.classList.add('text-gray-800');
        link.classList.remove('text-white');
      });
      if(logoText) {
        logoText.classList.add('text-brand-dark');
        logoText.classList.remove('text-white');
      }
    } else {
      setHeroNavState(true);
      navbar?.classList.add('bg-transparent', 'border-transparent');
      navbar?.classList.remove('bg-white', 'shadow-sm');
      navLinks?.forEach(link => {
        link.classList.remove('text-gray-800');
        link.classList.add('text-white');
      });
      if(logoText) {
        logoText.classList.remove('text-brand-dark');
        logoText.classList.add('text-white');
      }
    }
  });

  setHeroNavState(window.scrollY <= 50);

  // Botón Volver Arriba
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      Volver arriba
    </span>
  `;
  backToTopBtn.className = 'fixed bottom-28 right-6 z-40 bg-brand-dark text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] opacity-0 translate-y-4 pointer-events-none transition-all duration-300 hover:bg-brand-accent hover:-translate-y-1 font-bold text-sm border border-white/20 flex items-center justify-center';
  document.body.appendChild(backToTopBtn);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', () => {
    // Mostrar cuando el usuario haya bajado 400px o más
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
  });
});
