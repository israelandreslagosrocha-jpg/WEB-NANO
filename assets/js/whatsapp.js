const phone = "56992627252";
const defaultMessage = "Hola, quiero asesoría técnica y normativa sobre mi propiedad.";

document.addEventListener('DOMContentLoaded', () => {
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
});
