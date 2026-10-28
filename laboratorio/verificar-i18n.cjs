'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, 'i18n.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
function boot({ locales = ['pt-BR'], stored = null, blocked = false } = {}) {
  const listeners = {}, store = new Map(), writes = [];
  if (stored) store.set('solf:/laboratorio/:language', stored);
  const language = { value: '', addEventListener(type, callback) { listeners[type] = callback; } };
  const nodes = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => ({ dataset: { i18n: m[1] }, textContent: '' }));
  const aria = [...html.matchAll(/data-i18n-aria="([^"]+)"/g)].map(m => ({ dataset: { i18nAria: m[1] }, setAttribute(name, value) { this[name] = value; } }));
  const elements = { language, status: { textContent: 'Carregando partitura…' }, playing: { textContent: 'Carregando solfejos…' } };
  let changed = 0;
  const sandbox = { URL, Event, navigator: { languages: locales }, location: { href: 'https://example.test/laboratorio/' },
    localStorage: { getItem(key) { if (blocked) throw Error('Blocked'); return store.get(key); }, setItem(key, value) { if (blocked) throw Error('Blocked'); store.set(key, value); writes.push(key); } },
    document: { currentScript: { src: 'https://example.test/laboratorio/i18n.js' }, documentElement: {}, title: '',
      querySelectorAll(selector) { return selector === '[data-i18n]' ? nodes : aria; }, getElementById(id) { return elements[id]; } },
    window: { dispatchEvent(event) { assert.equal(event.type, 'solf:languagechange'); changed++; } }
  };
  vm.runInNewContext(source, sandbox);
  return { api: sandbox.window.SolfI18n, doc: sandbox.document, nodes, aria, store, writes, language, listeners, get changed() { return changed; } };
}
const pt = boot();
assert.equal(pt.api.language, 'pt-BR'); assert.equal(pt.doc.title, 'Solf');
assert.equal(pt.api.translate('Pronto para tocar'), 'Pronto para tocar');
assert.equal(boot({ locales: ['en-US'] }).api.language, 'en');
assert.equal(boot({ locales: ['es-MX'] }).api.language, 'es');
assert.equal(boot({ locales: ['fr-FR'] }).api.language, 'en');
assert.equal(boot({ locales: ['fr-FR', 'pt-PT'] }).api.language, 'pt-BR');
assert.equal(boot({ locales: ['en-US'], stored: 'es' }).api.language, 'es');
assert.equal(boot({ locales: ['pt-BR'], stored: 'invalid' }).api.language, 'pt-BR');
const english = boot({ locales: ['en-US'] });
assert.equal(english.doc.documentElement.lang, 'en');
assert.equal(english.api.t('settings'), 'Settings');
assert.equal(english.api.exerciseTitle('Solfejo 29'), 'Exercise 29');
assert.equal(english.api.exerciseTitle('Minha canção'), 'Minha canção', 'Preservar títulos autorais');
assert.equal(english.api.trackLabel('Voz · pauta 1 · voz 2'), 'Voz · staff 1 · voice 2');
assert.equal(english.api.translate('Carregando piano: 2/5…'), 'Loading piano: 2/5…');
assert.equal(english.api.translate('Compasso 3 · Dó4 + Mi4 · Acorde: C'), 'Measure 3 · C4 + E4 · Chord: C');
assert.equal(english.api.translate('Compasso 3 · Pausa'), 'Measure 3 · Rest');
assert.equal(english.api.translate('Não foi possível reproduzir: Web Audio API indisponível neste navegador.'), 'Could not play audio: Audio is not supported by this browser.');
assert(english.api.translate('Não foi possível carregar ou renderizar a partitura: Arquivo ausente ou bloqueado na hospedagem. /score.mxl: HTTP 404').includes('file is missing'));
assert.equal(english.api.translate('Amostra audio/piano/C4.mp3 indisponível (HTTP 404).'), 'Piano sample audio/piano/C4.mp3 is unavailable (HTTP 404).');
english.listeners.change({ target: { value: 'es' } });
assert.equal(english.changed, 1); assert.equal(english.doc.documentElement.lang, 'es');
assert.equal(english.api.t('settings'), 'Ajustes');
assert.equal(english.api.exerciseTitle('Solfejo 70'), 'Ejercicio 70');
assert.equal(english.api.translate('Compasso 3 · Ré4 · Acorde: D'), 'Compás 3 · Re4 · Acorde: D');
assert.equal(english.store.get('solf:/laboratorio/:language'), 'es');
assert(english.writes.every(key => key === 'solf:/laboratorio/:language'));
assert.equal(english.language.value, 'es');
const blocked = boot({ locales: ['en-GB'], blocked: true });
blocked.api.setLanguage('pt-BR'); assert.equal(blocked.api.language, 'pt-BR');
blocked.api.setLanguage('invalid'); assert.equal(blocked.api.language, 'pt-BR');
for (const lang of ['pt-BR', 'en', 'es']) {
  english.api.setLanguage(lang);
  for (const node of english.nodes) assert(node.textContent && node.textContent !== node.dataset.i18n, `Chave sem tradução: ${node.dataset.i18n}`);
  for (const node of english.aria) assert(node['aria-label'] && node['aria-label'] !== node.dataset.i18nAria);
}
assert(html.includes('<title>Solf</title>'));
assert(html.indexOf('src="i18n.js"') < html.indexOf('src="app.js"'));
console.log('OK Solf: PT/EN/ES; detecção e idioma salvo; armazenamento bloqueado; controles e acessibilidade; notas, cifras, mensagens e erros; títulos autorais preservados.');
