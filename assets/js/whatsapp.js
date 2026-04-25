const phone = "56971346301";
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

  // Manejo genérico de formularios que envían a WhatsApp
  document.querySelectorAll('.whatsapp-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const customPhone = form.dataset.phone || phone;
      const formTitle = form.dataset.title || "SOLICITUD DE EVALUACIÓN";

      // Construcción del mensaje dinámico basado en los campos del formulario
      let text = `*NUEVA ${formTitle.toUpperCase()}* 🚀\n\n`;
      
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          // Capitalizar la primera letra de la clave para el mensaje
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          text += `*${label}:* ${value}\n`;
        }
      }
      
      text += `\nPor favor, contáctenme para coordinar los siguientes pasos.`;

      const whatsappUrl = `https://wa.me/${customPhone}?text=${encodeURIComponent(text)}`;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_whatsapp_submit",
        form_id: form.id || 'unnamed_form'
      });

      window.open(whatsappUrl, '_blank');
    });
  });
});

