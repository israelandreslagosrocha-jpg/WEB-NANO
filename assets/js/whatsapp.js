const phone = "56992627252";
const defaultMessage = "Hola, quiero asesoría técnica y normativa sobre mi propiedad.";

document.addEventListener('DOMContentLoaded', () => {
  // Manejo de botones estáticos de WhatsApp
  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    const customPhone = btn.dataset.phone || phone;
    const message = btn.dataset.message || defaultMessage;
    const url = `https://wa.me/${customPhone}?text=${encodeURIComponent(message)}`;

    btn.href = url;
    btn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "whatsapp_click",
        whatsapp_message: message,
      });
    }, { once: true });
  });

  // Manejo del formulario de evaluación en el Hero Section
  const form = document.getElementById('hero-evaluation-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const clientPhone = document.getElementById('form-phone').value.trim();
      const project = document.getElementById('form-project').value;

      // Construcción del mensaje para WhatsApp
      const text = `*NUEVA SOLICITUD DE EVALUACIÓN* 🚀\n\n` +
                   `*Nombre:* ${name}\n` +
                   `*Email:* ${email}\n` +
                   `*Teléfono:* ${clientPhone}\n` +
                   `*Tipo de proyecto:* ${project}\n\n` +
                   `Por favor, contáctenme para coordinar la evaluación gratuita.`;

      // Se usa el mismo número principal (phone) y se codifica el texto
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      
      // Enviar evento a dataLayer (opcional)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_whatsapp_submit",
        project_type: project
      });

      // Abrir WhatsApp en nueva pestaña
      window.open(whatsappUrl, '_blank');
    });
  }
});
