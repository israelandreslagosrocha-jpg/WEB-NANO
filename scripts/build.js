const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, '..', 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const publicFiles = [
  'index.html', 'asesoria-tecnico-pedagogica.html', 'asesoria-infraestructura-educacional.html',
  'asesoria-arquitectura-habitacional.html', 'gestion-inmobiliaria.html',
  'servicios.html', 'privacidad.html', 'robots.txt', 'sitemap.xml', 'CNAME',
  'assets/favicon.svg', 'assets/images/arquitectura-vida-escolar-640.webp', 'assets/images/arquitectura-vida-escolar-1000.webp', 'assets/images/arquitectura-vida-escolar-1600.webp', 'assets/testimonios/growing-up.webp', 'assets/testimonios/mackenzie-garden.webp', 'assets/testimonios/mis-patroncitos.webp', 'assets/properties/77478.webp', 'assets/properties/77555.webp', 'assets/properties/78215.webp', 'assets/properties/78218.webp', 'assets/properties/78690.webp', 'assets/properties/79155.webp', 'assets/properties/79156.webp', 'assets/properties/79157.webp', 'assets/fonts/outfit-latin.woff2', 'assets/fonts/OFL.txt',
  'styles/tailwind.css', 'styles/design.css', 'assets/js/design.js', 'assets/js/main.js', 'assets/js/menu.js',
  'assets/js/whatsapp.js', 'assets/js/analytics.js',
];
for (const file of publicFiles) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(__dirname, '..', file), target);
}
console.log(`Publicación preparada: ${publicFiles.length} archivos permitidos en dist/.`);
