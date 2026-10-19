// node laboratorio/verificar-interface.cjs
// Estados da interface offline, sem simular um navegador visual.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Hub {
  constructor() { this.handlers = new Map(); }
  addEventListener(type, handler) { if (!this.handlers.has(type)) this.handlers.set(type, []); this.handlers.get(type).push(handler); }
  async emit(type, event = {}) { for (const handler of this.handlers.get(type) || []) await handler(event); }
}
const source = fs.readFileSync(require('node:path').join(__dirname, 'offline.js'), 'utf8').replace('(async () => {', 'globalThis.initialized = (async () => {');
async function setup({ secure = true, waiting = false, controlled = false } = {}) {
  const elements = Object.fromEntries(['offlineStatus', 'prepareOffline', 'updateApp'].map(id => [id, Object.assign(new Hub(), { textContent: '', disabled: id === 'prepareOffline', hidden: id === 'updateApp' })]));
  const serviceWorker = new Hub(), window = new Hub(), document = new Hub();
  window.isSecureContext = secure;
  const events = []; window.dispatchEvent = event => { events.push(event.type); };
  document.getElementById = id => elements[id];
  let current = { ok: true, core: true, ready: false, samples: 4, total: 25, defaultScore: true }, fail = false, reloads = 0, activated = false;
  const worker = { scriptURL: 'https://example.test/laboratorio/sw.js', postMessage(message, ports) {
    if (message.type === 'LAB_ACTIVATE_UPDATE') { activated = true; return; }
    if (message.type === 'LAB_PREPARE_OFFLINE') {
      serviceWorker.emit('message', { source: worker, data: { type: 'LAB_OFFLINE_PROGRESS', done: 5, total: 38 } });
      current = { ...current, ready: true, samples: 25 };
    }
    queueMicrotask(() => ports[0].postMessage(fail ? { ok: false, error: 'Falha de armazenamento de teste' } : current));
  } };
  const registration = Object.assign(new Hub(), { active: worker, waiting: waiting ? worker : null });
  serviceWorker.controller = controlled ? worker : null;
  serviceWorker.register = async (url, options) => { assert.equal(url, 'sw.js'); assert.equal(options.scope, './'); return registration; };
  class Channel {
    constructor() { this.port1 = { close() {}, onmessage: null }; this.port2 = { postMessage: data => queueMicrotask(() => this.port1.onmessage({ data })) }; }
  }
  const context = vm.createContext({ navigator: { serviceWorker }, document, window, Event: class { constructor(type) { this.type = type; } }, URL,
    location: { href: 'https://example.test/laboratorio/', reload() { reloads++; } }, MessageChannel: Channel, setTimeout, clearTimeout });
  vm.runInContext(source, context); await context.initialized;
  return { elements, serviceWorker, window, events, registration, setFail: value => { fail = value; }, setCurrent: value => { current = value; }, reloads: () => reloads, activated: () => activated };
}
(async () => {
  let app = await setup();
  assert(app.elements.offlineStatus.textContent.includes('4/25'));
  assert(!app.elements.prepareOffline.disabled);
  await app.elements.prepareOffline.emit('click');
  assert(app.elements.offlineStatus.textContent.includes('Disponível offline'));
  assert(app.elements.offlineStatus.textContent.includes('Partitura padrão salva'));
  assert(!app.elements.prepareOffline.disabled);
  app.setFail(true); await app.elements.prepareOffline.emit('click');
  assert(app.elements.offlineStatus.textContent.includes('Falha de armazenamento'));
  assert.equal(app.elements.prepareOffline.textContent, 'Tentar preparar novamente');
  app.setFail(false); app.setCurrent({ ok: true, ready: false, samples: 24, total: 25 }); await app.window.emit('offline');
  assert(app.elements.offlineStatus.textContent.includes('24/25'));
  await app.serviceWorker.emit('controllerchange'); assert.equal(app.reloads(), 0, 'Primeiro controle não deve recarregar');
  app = await setup({ waiting: true, controlled: true });
  assert(!app.elements.updateApp.hidden);
  await app.elements.updateApp.emit('click'); assert(app.activated()); assert(app.events.includes('lab:before-update'));
  await app.serviceWorker.emit('controllerchange'); assert.equal(app.reloads(), 1);
  app = await setup({ secure: false });
  assert(app.elements.offlineStatus.textContent.includes('HTTPS ou localhost'));
  assert(app.elements.prepareOffline.disabled);
  console.log('OK interface: preparação, estado pronto/parcial, falha e nova tentativa, mudança de conexão, atualização explícita e endereço sem suporte.');
})().catch(error => { console.error(error); process.exitCode = 1; });
