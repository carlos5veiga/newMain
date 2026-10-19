// node laboratorio/verificar-publicacao.cjs
// Confere o servidor HTTP real na raiz e em /laboratorio/, e o diagnóstico.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const port = 8879;
const child = spawn(process.execPath, [path.join(__dirname, 'servidor.cjs'), String(port)], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
const ready = new Promise((resolve, reject) => {
  child.once('error', reject); child.stdout.once('data', resolve);
  child.stderr.once('data', data => reject(new Error(String(data))));
});
function element() {
  return { textContent: '', children: [], disabled: false, handlers: {}, append(item) { this.children.push(item); }, replaceChildren() { this.children = []; }, addEventListener(type, handler) { this.handlers[type] = handler; } };
}
(async () => {
  try {
    await ready;
    const redirect = await fetch(`http://127.0.0.1:${port}/laboratorio`, { redirect: 'manual' });
    assert.equal(redirect.status, 308); assert.equal(redirect.headers.get('location'), '/laboratorio/');
    for (const mount of ['/', '/laboratorio/']) {
      const base = `http://127.0.0.1:${port}${mount}`;
      for (const page of ['index.html', 'verificar.html']) {
        const html = await (await fetch(base + page)).text();
        for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
          const url = new URL(match[1], base);
          assert(url.href.startsWith(base), 'Referência fora da pasta');
          assert.equal((await fetch(url)).status, 200, `${mount}${match[1]}`);
        }
      }
      const elements = Object.fromEntries(['capabilities', 'offlineCheck', 'checkFiles', 'fileResult', 'fileChecks', 'testPiano', 'stopPiano', 'audioResult'].map(id => [id, element()]));
      let failure = '';
      const context = vm.createContext({ console, URL, TextDecoder, Uint8Array, AbortController, setTimeout, clearTimeout,
        location: { href: base + 'verificar.html' }, navigator: {},
        document: { getElementById: id => elements[id], createElement: element, addEventListener() {} },
        window: { isSecureContext: true, innerWidth: 375, innerHeight: 812, AudioContext: class {}, addEventListener() {} },
        fetch: async (url, options) => {
          assert.equal(options.headers['X-Lab-Verify'], '1');
          if (failure === 'html' && String(url).endsWith('app.js')) return new Response('<!doctype html><html>Fallback incorreto</html>', { headers: { 'Content-Type': 'text/html' } });
          if (failure === 'mime' && String(url).endsWith('app.js')) return new Response('const a=1;', { headers: { 'Content-Type': 'text/plain' } });
          return fetch(url, options);
        }
      });
      vm.runInContext(fs.readFileSync(path.join(__dirname, 'audio.js'), 'utf8'), context);
      const source = fs.readFileSync(path.join(__dirname, 'diagnostico.js'), 'utf8').replace(/\n\}\)\(\);\s*$/, '\n  globalThis.publicationTest = { inspect, assets };\n})();');
      vm.runInContext(source, context);
      assert.equal(elements.capabilities.children.length, 6);
      await elements.checkFiles.handlers.click();
      assert(elements.fileResult.textContent.startsWith('Arquivos conferidos diretamente no servidor'), elements.fileResult.textContent);
      assert.equal(elements.fileChecks.children.length, 41);
      assert(elements.fileChecks.children.every(item => item.className === 'pass'));
      failure = 'html'; await assert.rejects(() => context.publicationTest.inspect('app.js', 'js'), /HTML/);
      failure = 'mime'; await assert.rejects(() => context.publicationTest.inspect('app.js', 'js'), /Tipo incorreto/);
      const worker = await fetch(base + 'sw.js');
      assert(worker.headers.get('content-type').includes('javascript')); assert.equal(worker.headers.get('cache-control'), 'no-cache');
      const sample = await fetch(base + 'audio/piano/C4.mp3'); assert.equal(sample.headers.get('content-type'), 'audio/mpeg');
    }
    console.log('OK publicação: caminhos na raiz e em /laboratorio/; referências HTML; diagnóstico de 41 arquivos com rede real; erro de HTML/MIME; MIME de worker/MP3 e atualização sem cache imutável.');
  } finally { child.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
