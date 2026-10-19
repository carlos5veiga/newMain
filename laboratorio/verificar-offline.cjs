// node laboratorio/verificar-offline.cjs
// Executa os handlers reais do worker com Cache Storage/rede simulados.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const BASE = 'https://example.test/laboratorio/';
const stores = new Map(), handlers = new Map();
let online = true, failPath = '', active = 0, maxActive = 0, claimed = false, skipped = false;
const progress = [];
const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const data = stores.get(name);
    return { async match(url) { return data.get(String(url))?.clone(); }, async put(url, response) { data.set(String(url), response.clone()); } };
  },
  async keys() { return [...stores.keys()]; },
  async delete(name) { return stores.delete(name); }
};
stores.set('other-application-cache', new Map());
stores.set('musicxml-lab:/other/:old', new Map());
stores.set('musicxml-lab:/laboratorio/:old', new Map());
const self = {
  registration: { scope: BASE },
  clients: { async claim() { claimed = true; }, async matchAll() { return [{ url: BASE, postMessage: message => progress.push(message) }, { url: 'https://example.test/', postMessage() { throw new Error('Não deve notificar páginas externas ao laboratório'); } }]; } },
  async skipWaiting() { skipped = true; },
  addEventListener: (type, handler) => handlers.set(type, handler)
};
async function fetchAsset(url) {
  assert(String(url).startsWith(BASE), 'Rede deve ficar dentro do laboratório');
  if (!online) throw new Error('offline');
  const relative = String(url).slice(BASE.length);
  if (relative === failPath) return new Response('Erro de teste', { status: 500 });
  maxActive = Math.max(maxActive, ++active);
  await new Promise(resolve => setImmediate(resolve));
  active--;
  const file = path.join(__dirname, relative);
  if (!fs.existsSync(file)) return new Response('Ausente', { status: 404 });
  return new Response(fs.readFileSync(file));
}
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8'), { self, caches, URL, Response, TextDecoder, AbortController, setTimeout, clearTimeout, fetch: fetchAsset });
async function lifecycle(type) { let task; handlers.get(type)({ waitUntil: promise => { task = promise; } }); await task; }
async function message(type) {
  let task, reply;
  handlers.get('message')({ data: { type }, source: { url: BASE }, ports: [{ postMessage: value => { reply = value; } }], waitUntil: promise => { task = promise; } });
  await task; return reply;
}
async function resource(relative, method = 'GET', verify = false) {
  let response;
  handlers.get('fetch')({ request: { url: new URL(relative, BASE).href, method, headers: new Headers(verify ? { 'X-Lab-Verify': '1' } : {}) }, respondWith: promise => { response = promise; } });
  return response;
}
(async () => {
  await lifecycle('install');
  assert(!skipped, 'Atualização não pode substituir a versão atual automaticamente');
  let state = await message('LAB_OFFLINE_STATUS');
  assert(state.core && state.defaultScore); assert.equal(state.samples, 0); assert(!state.ready);
  await lifecycle('activate'); assert(claimed);
  assert(stores.has('other-application-cache') && stores.has('musicxml-lab:/other/:old'));
  assert(!stores.has('musicxml-lab:/laboratorio/:old'));
  failPath = 'audio/piano/C1.mp3';
  let result = await message('LAB_PREPARE_OFFLINE'); assert.equal(result.ok, false);
  state = await message('LAB_OFFLINE_STATUS'); assert(!state.ready, 'Pacote parcial não pode aparecer como pronto');
  failPath = ''; result = await message('LAB_PREPARE_OFFLINE');
  assert(result.ok && result.ready && result.defaultScore); assert.equal(result.samples, 25); assert(maxActive <= 3);
  assert(progress.some(p => p.done === p.total));
  online = false;
  for (const url of ['', 'index.html', 'style.css', 'app.js', 'audio.js', 'offline.js', 'verificar.html', 'diagnostico.js', 'vendor/opensheetmusicdisplay-1.9.3.min.js', 'solfejo01.mxl', 'audio/piano/A6.mp3', 'audio/piano/CREDITOS.txt']) {
    const response = await resource(url); assert.equal(response.status, 200, `Offline: ${url}`);
    const actual = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(actual, fs.readFileSync(path.join(__dirname, url || 'index.html')));
  }
  assert.equal(await resource('../index.html'), undefined, 'Página principal não pode ser interceptada');
  assert.equal(await resource('outro.html'), undefined);
  assert.equal(await resource('app.js', 'POST'), undefined);
  assert.equal(await resource('app.js', 'GET', true), undefined, 'Verificação deve atingir o servidor, sem aprovação falsa pelo cache');
  const current = [...stores.entries()].find(([name]) => name.startsWith('musicxml-lab:/laboratorio/:'))[1];
  current.delete(new URL('audio/piano/C4.mp3', BASE).href);
  state = await message('LAB_OFFLINE_STATUS'); assert(!state.ready); assert.equal(state.samples, 24);
  assert.equal((await resource('audio/piano/C4.mp3')).status, 503);
  online = true; await message('LAB_PREPARE_OFFLINE'); assert((await message('LAB_OFFLINE_STATUS')).ready);
  await message('LAB_ACTIVATE_UPDATE'); assert(skipped);
  const oldName = [...stores.keys()].find(name => name.startsWith('musicxml-lab:/laboratorio/:'));
  const nextSource = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8').replace(/const VERSION = '[^']+';/, "const VERSION = 'test-upgrade';");
  vm.runInNewContext(nextSource, { self, caches, URL, Response, TextDecoder, AbortController, setTimeout, clearTimeout, fetch: fetchAsset });
  failPath = 'solfejo01.mxl';
  await lifecycle('install');
  const upgraded = await caches.open('musicxml-lab:/laboratorio/:test-upgrade');
  assert(await upgraded.match(new URL('solfejo01.xml', BASE).href), 'MXL bloqueado deve salvar a cópia XML para leitura offline');
  failPath = '';
  assert((await message('LAB_OFFLINE_STATUS')).ready, 'Atualização deve preservar as 25 amostras já salvas');
  await lifecycle('activate');
  assert(!stores.has(oldName)); assert(stores.has('other-application-cache'));
  console.log('OK offline: instalação sem piano automático; preparação completa e parcial; cache de 25 amostras; reabertura sem rede; partitura e créditos; recuperação de arquivo removido; atualização explícita; escopo e caches isolados.');
})().catch(error => { console.error(error); process.exitCode = 1; });
