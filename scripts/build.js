const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, '..', 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const publicFiles = [
  'index.html', 'asesoria-infraestructura-educacional.html',
  'asesoria-arquitectura-habitacional.html', 'gestion-inmobiliaria.html',
  'servicios.html', 'privacidad.html', 'robots.txt', 'sitemap.xml', 'CNAME',
  'styles/tailwind.css', 'assets/js/main.js', 'assets/js/menu.js',
  'assets/js/whatsapp.js', 'assets/js/analytics.js',
];
for (const file of publicFiles) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(__dirname, '..', file), target);
}
console.log(`Publicación preparada: ${publicFiles.length} archivos permitidos en dist/.`);
