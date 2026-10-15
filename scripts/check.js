const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const ids = new Map(pages.map(file => [file, new Set([...read(file).matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))]));
for (const file of pages) {
  const source = read(file);
  assert(!source.includes('GTM-XXXXXXX'), `${file}: GTM de ejemplo`);
  assert(!source.includes('Espacio Fotográfico SEO'), `${file}: instrucciones internas visibles`);
  assert(!source.includes('/admin/dashboard/'), `${file}: enlace administrativo`);
  assert(!/https:\/\/[^"'\s]+\.png/.test(source), `${file}: imagen PNG antigua`);
  assert.equal([...source.matchAll(/<h1\b/g)].length, 1, `${file}: debe existir un H1`);
  const canonical = source.match(/rel="canonical" href="([^"]+)"/);
  assert(canonical && canonical[1] === `https://logosarquitectura.cl/${file === 'index.html' ? '' : file}`, `${file}: canonical`);
  for (const schema of source.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(schema[1]);
  for (const link of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = link[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [relative, fragment] = url.split('#');
    const target = relative.replace(/^\.\//, '') || file;
    assert(fs.existsSync(path.join(root, target)), `${file}: archivo ausente ${url}`);
    if (fragment && target.endsWith('.html')) assert(ids.get(target)?.has(fragment), `${file}: ancla ausente ${url}`);
  }
  for (const form of source.matchAll(/<form\b.*?<\/form>/gs)) {
    assert(/method="post"/.test(form[0]) && /<fieldset disabled data-whatsapp-fields/.test(form[0]), `${file}: formulario no protegido sin JS`);
    for (const label of form[0].matchAll(/<label\b[^>]*>/g)) assert(/for="[^"]+"/.test(label[0]), `${file}: label sin asociación`);
  }
}

// Exercise the actual form handler without opening WhatsApp or contacting third parties.
const handlers = {};
const events = [];
let assigned;
const fields = { disabled: true };
const form = {
  id: 'test-form', dataset: { title: 'Prueba' },
  querySelector: selector => selector === '[data-whatsapp-fields]' ? fields : { textContent: '' },
  addEventListener: (name, handler) => { handlers[name] = handler; },
  reportValidity: () => true,
};
const context = {
  document: {
    body: { dataset: { service: 'educacional' } },
    addEventListener: (name, handler) => handler(),
    querySelectorAll: selector => selector === '.whatsapp-form' ? [form] : [],
  },
  window: { logosTrack: (name, data) => events.push({ name, ...data }), location: { assign: url => { assigned = url; } } },
  FormData: class { entries() { return [['nombre', 'Prueba & dato'], ['email', 'prueba@example.invalid']][Symbol.iterator](); } },
};
vm.runInNewContext(read('assets/js/whatsapp.js'), context);
assert.equal(fields.disabled, false);
let prevented = false;
handlers.submit({ preventDefault() { prevented = true; } });
assert(prevented, 'Debe impedir el envío HTTP del formulario');
assert(assigned.startsWith('https://wa.me/56971346301?text='));
assert(decodeURIComponent(assigned).includes('Prueba & dato'));
assert.equal(events[0].name, 'whatsapp_handoff');
assert(!JSON.stringify(events).includes('prueba@example.invalid'), 'No enviar datos personales a medición');
assigned = undefined;
form.reportValidity = () => false;
handlers.submit({ preventDefault() {} });
assert.equal(assigned, undefined, 'Formulario inválido no debe abrir WhatsApp');
console.log(`${pages.length} páginas verificadas: enlaces, anclas, SEO y formulario sin filtración a analytics.`);

// Menu state must remain synchronized for keyboard and assistive technology.
const menuEvents = {}, documentEvents = {};
const attributes = { 'aria-expanded': 'false' };
let hidden = true, focused = false;
const button = {
  setAttribute: (key, value) => { attributes[key] = value; },
  getAttribute: key => attributes[key],
  addEventListener: (key, handler) => { menuEvents[key] = handler; },
  contains: () => false,
  focus: () => { focused = true; },
};
const menu = { classList: { toggle: (key, value) => { hidden = value; } }, querySelectorAll: () => [], contains: () => false };
vm.runInNewContext(read('assets/js/menu.js'), {
  document: {
    getElementById: id => id === 'mobile-menu-btn' ? button : menu,
    addEventListener: (key, handler) => key === 'DOMContentLoaded' ? handler() : documentEvents[key] = handler,
  },
  window: { matchMedia: () => ({ addEventListener() {} }) },
});
menuEvents.click();
assert.equal(hidden, false);
assert.equal(attributes['aria-expanded'], 'true');
documentEvents.keydown({ key: 'Escape' });
assert.equal(hidden, true);
assert.equal(attributes['aria-expanded'], 'false');
assert.equal(focused, true);

// Verify both scheduling paths and early contact without making network requests.
for (const hostname of ['127.0.0.1', 'logosarquitectura.cl']) {
  for (const supportsIdle of [true, false]) {
    const loadedScripts = [], listeners = {}, scheduled = [];
    const window = {
      location: { hostname },
      addEventListener: (name, callback) => { listeners[name] = callback; },
      setTimeout: callback => scheduled.push(callback),
    };
    if (supportsIdle) window.requestIdleCallback = (callback, options) => {
      assert.equal(options.timeout, 1500);
      scheduled.push(callback);
    };
    vm.runInNewContext(read('assets/js/analytics.js'), {
      window,
      document: {
        readyState: 'loading',
        body: { dataset: { service: 'educacional' } },
        createElement: () => ({}),
        head: { appendChild: node => loadedScripts.push(node.src) },
        addEventListener() {},
      },
    });
    assert.equal(loadedScripts.length, 0, 'No cargar Ads durante los recursos críticos');
    if (hostname === 'logosarquitectura.cl') {
      assert.equal(window.dataLayer[1][0], 'config');
      assert.equal(window.dataLayer[1][1], 'AW-18053973183');
      listeners.load();
      assert.equal(loadedScripts.length, 0, 'Esperar el turno programado');
      scheduled[0]();
      assert.equal(loadedScripts.length, 1);
      scheduled[0]();
      assert.equal(loadedScripts.length, 1, 'No duplicar la etiqueta');
    }
    window.logosTrack('contact_click', { channel: 'whatsapp', email: 'private@example.invalid', message: 'private' });
    const last = window.dataLayer.at(-1);
    assert.equal(last.event, 'contact_click');
    assert(!('email' in last) && !('message' in last));
    assert.equal(loadedScripts.length, hostname === '127.0.0.1' ? 0 : 1);
  }
}
// A contact action before window.load must start the tag immediately, only once.
const earlyScripts = [];
const earlyWindow = { location: { hostname: 'logosarquitectura.cl' }, addEventListener() {} };
vm.runInNewContext(read('assets/js/analytics.js'), {
  window: earlyWindow,
  document: {
    readyState: 'loading', body: { dataset: { service: 'educacional' } },
    createElement: () => ({}), head: { appendChild: node => earlyScripts.push(node.src) },
    addEventListener() {},
  },
});
earlyWindow.logosTrack('contact_click', { channel: 'whatsapp' });
earlyWindow.logosTrack('contact_click', { channel: 'whatsapp' });
assert.equal(earlyScripts.length, 1);
console.log('Medición: carga tras load/idle, alternativa sin idle, contacto temprano y etiqueta única verificados.');
