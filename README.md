# LOGOS Arquitectura — WEB NANO

Sitio estático de asesoría educacional, habitacional e inmobiliaria.

- Dominio: https://logosarquitectura.cl/
- Repositorio: https://github.com/israelandreslagosrocha-jpg/WEB-NANO
- Contacto público: contacto@logosarquitectura.cl

## Desarrollo y verificación

Requiere Node.js 22 o posterior y npm.

```sh
npm ci
npm run check
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

El CSS fuente está en `styles/input.css`; editar la hoja generada directamente se perderá en la siguiente compilación. `npm run dev` observa cambios de CSS. `npm run build` genera CSS minificado y copia una lista explícita de archivos a `dist/`. No publicar la raíz del repositorio.

`npm run check` comprueba enlaces y anclas locales, canonical, JSON-LD, etiquetas de formularios, ausencia de placeholders y el comportamiento del envío a WhatsApp sin compartir valores con analytics. No reemplaza revisión visual ni auditoría de accesibilidad completa.

## Publicación

GitHub Actions compila y verifica en cada push a `main` o ejecución manual. El trabajo de despliegue usa el ambiente `github-pages` y publica exclusivamente `dist/`. Confirmar en GitHub que Pages usa GitHub Actions y que las reglas del ambiente permiten el despliegue. El archivo `CNAME` mantiene el dominio conocido. No se ha realizado push ni despliegue desde esta revisión.

## Formularios y atención

Los formularios NO guardan leads en un servidor. Abren WhatsApp con un borrador; el visitante debe enviarlo. Los campos permanecen deshabilitados hasta registrar el manejador JS. Sin JS hay un enlace directo de contacto. No convertir estos formularios en GET: expondría datos en URLs.

- Educacional y habitacional: +56 9 7134 6301.
- Inmobiliaria: +56 9 6199 6576.

La integración de CRM, recepción confirmada, agenda o automatización necesita un servicio de recepción seguro y decisiones operativas del negocio. Nunca introducir credenciales o expedientes en HTML/JS público.

## Medición

`assets/js/analytics.js` centraliza la etiqueta Google Ads ya existente y reserva `ga4Id` vacío. GA4 no está activo: falta un ID real autorizado. El código no carga etiquetas de Google en localhost o dominios de previsualización para no contaminar campañas.

Eventos preparados: `contact_click`, `form_start` y `whatsapp_handoff`. Parámetros permitidos: servicio, canal, ubicación y ID del formulario. No registrar texto libre, mensajes, nombres, correos, teléfonos ni valores de campos. Un handoff NO equivale a lead recibido o venta. No inventar un evento de conversión confirmado.

Cuando se confirme GA4: introducir su ID, validar en Tag Assistant/DebugView y configurar conversiones reales en Ads. El ID Ads existente no incluye etiquetas de conversión verificadas. Si se elige GTM, sustituir la instalación directa deliberadamente para evitar pageviews/eventos duplicados. Actualizar la información de privacidad al cambiar proveedores o medición. No se verificaron cuentas de Ads, Analytics o Search Console.

## Pendientes de información del negocio

- Nombre completo de la persona responsable y plazo real de conservación de consultas para completar `privacidad.html`. El correo ya fue confirmado. La página explica el flujo técnico actual y señala expresamente los datos pendientes; no se presenta como validación legal completa.
- Confirmar horarios y compromisos de respuesta, cobertura geográfica, servicios y responsabilidades del asesor inmobiliario.
- Credenciales, equipo y casos/testimonios con permiso: no inventar resultados ni clientes.
- Revisión profesional del contenido normativo y de las afirmaciones históricas de las guías y FAQ. Se moderó el hero, pero no se ha certificado la exactitud legal de todos los textos.
- Revisar requisitos de consentimiento según jurisdicción/campañas y proveedores antes del lanzamiento de nuevas etiquetas. No se implementó una CMP ni se afirma cumplimiento legal por disponer de una página informativa.

## Seguridad y mantenimiento

La dependencia vulnerable `source-map-js` se actualizó mediante lockfile. Ejecutar `npm audit` periódicamente y revisar las actualizaciones; cero advisories conocidos no equivale a garantía de seguridad.

`dist/` no debe incluir fuentes, package.json, notas, archivos privados, node_modules ni credenciales. `.env*` está ignorado, con excepción de un eventual `.env.example` sin secretos. Un archivo ya versionado no se elimina por añadirlo a gitignore.

GitHub Pages no permite definir aquí todas las cabeceras HTTP de seguridad. CSP/HSTS/otras cabeceras requieren revisar la plataforma o un proxy/CDN. No añadir un archivo `_headers` y asumir que Pages lo aplicará. Pendientes privados: protección de rama, 2FA, colaboradores, secretos históricos, DNS y correo SPF/DKIM/DMARC.

Las imágenes activas usan las URLs WebP proporcionadas. Algunas siguen superando 1 MB: formato WebP no garantiza un presupuesto de transferencia suficiente. Las imágenes adicionales reservadas por el usuario no se utilizan.
