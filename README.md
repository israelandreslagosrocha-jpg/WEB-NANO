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

## Revisión comercial — 15 de octubre de 2026

Las cuatro páginas principales explican ahora qué aportar en la primera consulta y qué acordar antes de contratar. Los formularios no solicitan el teléfono, porque el contacto continúa en WhatsApp; el correo de portada es opcional. Se retiraron la promesa de respuesta en 24 horas y la aprobación a la primera. Esto no certifica todos los textos normativos históricos: sigue pendiente su revisión profesional, además de perfiles y casos reales autorizados.

## Imágenes responsivas y revisión móvil — 15 de octubre de 2026

Las imágenes usan variantes Cloudinary `f_webp,q_auto:good,c_limit,w_...`; `srcset`/`sizes` permiten elegir según ancho y densidad de pantalla. Las dimensiones originales se consultaron en los metadatos del proveedor. Solo los heroes tienen prioridad alta; las fotografías interiores usan carga diferida. Logo y máscara comparten la variante de 460 px. Los originales no se modificaron.

Muestras de transferencia medidas con curl, respuesta 200 (bytes de archivo, no carga total ni Core Web Vitals):

| Recurso | Original | Variante |
| --- | ---: | ---: |
| Infraestructura educacional | 1.714.876 B | 63.472 B a 1280 px |
| Propiedad de lujo | 2.518.744 B | 161.030 B a 1280 px |
| Footer | 1.256.574 B | 45.578 B a 1280 px |
| Logo actual | 357.804 B | 5.332 B a 460 px |

Verificación visual en escritorio y a 320 px; las seis páginas no mostraron desborde horizontal a 320 px tras corregir las tarjetas educacionales. Portada comprobada a 768 px con menú móvil. El navegador eligió una variante de 480 px para el hero en la prueba de 320 px. Las imágenes visibles cargaron correctamente en las comprobaciones. Esto no sustituye una medición Lighthouse ni datos de campo; revisar calidad fotográfica en pantallas de alta densidad antes de publicar.

## Lighthouse móvil — 15 de octubre de 2026

Se ejecutó Lighthouse 13.5.0 con Chrome headless y el perfil móvil predeterminado, con cuatro mediciones locales iniciales y repetición tras los ajustes. Se corrigieron contraste de CTAs y textos de acento, jerarquía de títulos, favicon 404 y la carga de la fuente. Outfit se sirve localmente con licencia SIL OFL en `assets/fonts/OFL.txt`. Cada ejecución es una muestra de laboratorio, no datos de campo ni una garantía de puntuación futura. La validación final en producción incluye Google Ads, ausente de las previsualizaciones locales.

## Programación de Google Ads — 15 de octubre de 2026

La configuración de la etiqueta se encola al inicio. La librería se solicita tras `window.load`, usando `requestIdleCallback` con timeout de 1500 ms o una tarea posterior si el navegador no ofrece esa API. Una acción de contacto inicia la carga inmediatamente; un guard evita duplicados. No se cambian el ID Ads, cookies ni parámetros de consentimiento.

El retraso puede reducir medición de visitas muy breves o abandonos antes de cargar la etiqueta. Iniciar la carga ante un clic no garantiza enviar datos antes de una navegación inmediata. Los eventos de intención siguen en dataLayer; no representan solicitudes recibidas. La validación de conversiones necesita la configuración real y Tag Assistant/cuenta de Ads. La optimización cambia el momento de carga, no elimina el trabajo que ejecuta Google.

Referencias: https://web.dev/articles/efficiently-load-third-party-javascript y https://developers.google.com/tag-platform/gtagjs. La colocación temprana recomendada por Google favorece cobertura de medición; aquí se adopta un compromiso explícito con el primer renderizado.

## Revisión de guías y FAQ

La portada presenta seis preguntas directas sin acordeones anidados. Las guías de portada, habitacional e inmobiliaria se centraron en preparar la consulta y acordar el alcance. Los textos retirados y los puntos de validación están en `docs/REVISION-CONTENIDO.md`, excluido del artefacto público por la lista permitida de compilación. Esta revisión no certifica otras afirmaciones normativas del sitio.

## Revisión visual y propuesta de portada

Se revisaron las cuatro páginas principales en escritorio y móvil, sin desborde horizontal en las muestras de 1280 y 375 px. La cabecera se sincroniza también en load/pageshow para enlaces directos y restauración de navegación. Se retiró la mezcla de color del botón móvil que reducía su contraste.

La propuesta visual independiente está en `prototipo/` y se sirve localmente en el puerto 8766. Está excluida de la lista de publicación y no reemplaza index.html. Es una propuesta editorial con fotografías referenciales, sin métricas de negocio, clientes o perfiles inventados. El menú móvil y los enlaces internos se comprobaron en navegador.

### Rediseño publicado — 16 de octubre de 2026
Portada y tres landings comparten el diseño editorial, con navegación móvil nativa y contactos directos por servicio. Se conservan canonical, metadatos sociales, etiqueta de Google Ads y eventos de contacto sin mensajes personales. Las anclas principales anteriores siguen disponibles.

La sección inmobiliaria presenta a Andrés Lagos como agente de Grupo Premium Propiedades y contacto profesional de LOGOS, con enlace al directorio oficial y formación descrita según el diploma aportado. El diploma no se incluye en los archivos públicos. La cartera incluye ocho fichas proporcionadas por el agente; los precios y disponibilidad requieren mantenimiento manual. Las fotos están optimizadas en `assets/properties/` como WebP (11–53 KB por foto). Para actualizar una propiedad, editar su tarjeta en `gestion-inmobiliaria.html` y la fecha de revisión. Las consultas conservan el código del inmueble en WhatsApp.

### Apoyo técnico-pedagógico — 16 de octubre de 2026
La landing educacional incorpora una sección complementaria después de los servicios de infraestructura, con tres desplegables y consulta específica por WhatsApp. La disponibilidad, profesional responsable y alcance se confirman antes de contratar; no se publican perfiles pendientes ni promesas de aprobación.

### Landing técnico-pedagógica independiente
`asesoria-tecnico-pedagogica.html` desarrolla consultas sobre documentos institucionales, evaluación/JEC, personal, recursos y observaciones. Se enlaza desde infraestructura educacional y el catálogo de servicios, y se incluye en sitemap y build. Conserva medición de contactos y el criterio de confirmar disponibilidad, responsable y alcance. La sección anterior mantiene su ancla como acceso a la nueva landing.
