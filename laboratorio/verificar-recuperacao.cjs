'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = 'https://example.test/laboratorio/';
const source = fs.readFileSync(path.join(__dirname, 'recuperar-cache.js'), 'utf8');
async function run(online = true, ancestor = false) {
  const stores = new Map([
    ['musicxml-lab:/laboratorio/:old', new Map([['index.html', 1], ['app.js', 2], ['audio/piano/C4.mp3', 3], ['solfejo01.xml', 4]].map(([file, value]) => [base + file, value]))],
    ['another-site', new Map([[base + 'app.js', 8]])],
    ['musicxml-lab:/other/:old', new Map([[base + 'app.js', 9]])]
  ]);
  let handler, redirected = '', updated = false;
  const button = { disabled: false, addEventListener(type, callback) { handler = callback; } }, status = { textContent: '' };
  const caches = {
    async keys() { return [...stores.keys()]; },
    async open(name) {
      const data = stores.get(name);
      return { async keys() { return [...data.keys()].map(url => ({ url })); }, async delete(request) { return data.delete(request.url); } };
    }
  };
  const context = vm.createContext({ URL, AbortController, setTimeout, clearTimeout, window: { caches }, caches,
    document: { currentScript: { src: base + 'recuperar-cache.js' }, getElementById: id => id === 'recover' ? button : status },
    location: { href: base + 'recuperar-cache.html', replace(url) { redirected = url; } },
    navigator: { serviceWorker: { async getRegistration() { return { scope: ancestor ? 'https://example.test/' : base, async update() { updated = true; } }; } } },
    fetch: async url => {
      assert(String(url).startsWith(base));
      if (!online) throw new Error('Sem conexão');
      return new Response(String(url).includes('recuperar-cache.js') ? source : 'const versaoAtual = true;');
    }
  });
  vm.runInContext(source, context); await handler();
  const data = stores.get('musicxml-lab:/laboratorio/:old');
  assert.equal(data.get(base + 'audio/piano/C4.mp3'), 3);
  assert.equal(data.get(base + 'solfejo01.xml'), 4);
  assert.equal(stores.get('another-site').get(base + 'app.js'), 8);
  assert.equal(stores.get('musicxml-lab:/other/:old').get(base + 'app.js'), 9);
  if (online) {
    assert(!data.has(base + 'app.js')); assert(!data.has(base + 'index.html'));
    assert(redirected.startsWith(base + '?atualizado='));
    assert.equal(updated, !ancestor);
  } else {
    assert(data.has(base + 'app.js')); assert.equal(redirected, ''); assert.equal(button.disabled, false);
  }
}
(async () => {
  await run(); await run(false); await run(true, true);
  console.log('OK recuperação: renova apenas o aplicativo; mantém piano, partituras e caches alheios; requer rede; não atualiza worker de outro escopo.');
})().catch(error => { console.error(error); process.exitCode = 1; });
