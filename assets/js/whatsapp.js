document.addEventListener('DOMContentLoaded', () => {
  const service = document.body.dataset.service || 'educacional';
  const phone = service === 'inmobiliaria' ? '56961996576' : '56971346301';
  const messages = {
    educacional: 'Hola, quiero solicitar una revisión inicial de mi proyecto educacional.',
    habitacional: 'Hola, necesito asesoría para regularizar mi propiedad.',
    inmobiliaria: 'Hola, necesito asesoría inmobiliaria.',
  };
  const track = (event, dimensions) => window.logosTrack?.(event, dimensions);
  const placement = element => element.closest('nav') ? 'navigation'
    : element.closest('footer') ? 'footer'
    : element.classList.contains('fixed') ? 'floating' : 'content';

  document.querySelectorAll('.whatsapp-btn').forEach(button => {
    const target = button.dataset.phone || phone;
    const message = button.dataset.message || messages[service] || messages.educacional;
    button.href = `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
    button.addEventListener('click', () => track('contact_click', {
      channel: 'whatsapp', placement: placement(button),
    }));
  });

  document.querySelectorAll('.whatsapp-form').forEach(form => {
    const status = form.querySelector('[data-form-status]');
    const fields = form.querySelector('[data-whatsapp-fields]');
    form.addEventListener('input', () => track('form_start', { form_id: form.id }), { once: true });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      let message = `SOLICITUD: ${form.dataset.title || 'Revisión inicial'}\n\n`;
      for (const [key, value] of data.entries()) {
        const text = String(value).trim().slice(0, 160);
        if (text) message += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${text}\n`;
      }
      message += '\nQuiero coordinar los siguientes pasos.';
      const url = `https://wa.me/${form.dataset.phone || phone}?text=${encodeURIComponent(message)}`;
      // Same-tab navigation avoids popup blocking; no request is stored by this site.
      track('whatsapp_handoff', { channel: 'whatsapp', form_id: form.id });
      if (status) status.textContent = 'Se abrirá WhatsApp. Envía el mensaje allí para completar tu consulta.';
      window.location.assign(url);
    });
    // Enable only after the submit handler exists. Without JS no GET can leak fields.
    if (fields) fields.disabled = false;
  });
});
