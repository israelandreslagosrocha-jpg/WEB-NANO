const phone = "56992627252";
const message = "Hola, quiero asesoría técnica y normativa sobre mi propiedad.";

const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.href = url;
  });
});
