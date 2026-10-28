/* Cache exclusivo do laboratório. Incremente VERSION quando publicar arquivos
   novos; uma versão instalada só substitui a atual após ação do usuário. */
'use strict';
const VERSION = '2026-10-23-solf-1';
const BASE = self.registration.scope;
const PREFIX = `musicxml-lab:${new URL(BASE).pathname}:`;
const CACHE = PREFIX + VERSION;
const CORE = ['index.html', 'style.css', 'i18n.js', 'audio.js', 'app.js', 'offline.js', 'verificar.html', 'diagnostico.js', 'solfejos/catalogo.json',
  'vendor/jszip-3.10.1.min.js', 'vendor/opensheetmusicdisplay-1.9.3.min.js',
  'vendor/OSMD-LICENSE.txt', 'vendor/JSZip-LICENSE.txt', 'audio/piano/CREDITOS.txt',
  'audio/piano/LICENCA-ORIGEM.txt', 'audio/piano/REVISAO.txt'];
const PIANO = [];
for (let octave = 1; octave <= 6; octave++) for (const note of ['C', 'Ds', 'Fs', 'A']) PIANO.push(`audio/piano/${note}${octave}.mp3`);
PIANO.push('audio/piano/C7.mp3');
const SCORES = ['solfejo01.mxl', 'solfejo01.xml', 'solfejo01.musicxml'];
const allowed = new Set([...CORE, ...PIANO, ...SCORES].map(path => new URL(path, BASE).href));
let preparing = null;

async function download(cache, path, timeout = 20000) {
  const url = new URL(path, BASE).href;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { cache: 'reload', signal: controller.signal });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    const score = SCORES.find(name => new URL(name, BASE).href === url) || (/\/solfejos\/\d{3}-\d{3}\/[a-z0-9_-]+\.(mxl|xml|musicxml)$/i.test(new URL(url).pathname) ? new URL(url).pathname : null);
    if (score) {
      const bytes = new Uint8Array(await response.clone().arrayBuffer());
      const valid = /\.mxl$/i.test(score) ? bytes[0] === 80 && bytes[1] === 75 : /<(?:[\w-]+:)?score-partwise[\s>]/.test(new TextDecoder().decode(bytes));
      if (!valid) throw new Error(`${score}: o servidor não entregou uma partitura válida.`);
    }
    await cache.put(url, response.clone());
    return response;
  } finally { clearTimeout(timer); }
}

async function saveDefaultScore(cache) {
  for (const path of SCORES) {
    try { await download(cache, path); return true; } catch { /* XML alternative or cached copy below. */ }
  }
  for (const path of SCORES) if (await cache.match(new URL(path, BASE).href)) return true;
  return false;
}

async function status() {
  const cache = await caches.open(CACHE);
  const has = async path => !!(await cache.match(new URL(path, BASE).href));
  const core = (await Promise.all(CORE.map(has))).every(Boolean);
  const samples = (await Promise.all(PIANO.map(has))).filter(Boolean).length;
  const defaultScore = (await Promise.all(SCORES.map(has))).some(Boolean);
  return { core, samples, total: PIANO.length, defaultScore, ready: core && samples === PIANO.length, version: VERSION };
}

async function notify(message) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) if (client.url.startsWith(BASE)) client.postMessage(message);
}

async function prepare() {
  const cache = await caches.open(CACHE), paths = [...CORE, ...PIANO];
  let done = 0, next = 0, failure = null;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (next < paths.length && !failure) {
      const path = paths[next++];
      try {
        if (!(await cache.match(new URL(path, BASE).href))) await download(cache, path);
        await notify({ type: 'LAB_OFFLINE_PROGRESS', done: ++done, total: paths.length + 1 });
      } catch (error) { failure = error; }
    }
  }));
  if (failure) throw failure;
  await saveDefaultScore(cache);
  await notify({ type: 'LAB_OFFLINE_PROGRESS', done: paths.length + 1, total: paths.length + 1 });
  return status();
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // The pinned MP3 bank is unchanged across app releases. Keep downloaded
    // samples when upgrading. Rename asset paths if the recordings ever change.
    for (const name of await caches.keys()) {
      if (!name.startsWith(PREFIX) || name === CACHE) continue;
      const previous = await caches.open(name);
      for (const path of PIANO) {
        const key = new URL(path, BASE).href;
        if (await cache.match(key)) continue;
        const sample = await previous.match(key);
        if (sample) await cache.put(key, sample);
      }
    }
    // Only the shell is automatic; the user chooses to save the full piano.
    for (const path of CORE) await download(cache, path);
    await saveDefaultScore(cache);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (!event.source?.url?.startsWith(BASE)) return;
  const reply = message => event.ports[0]?.postMessage(message);
  if (event.data?.type === 'LAB_ACTIVATE_UPDATE') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data?.type === 'LAB_OFFLINE_STATUS') {
    event.waitUntil(status().then(data => reply({ ok: true, ...data })).catch(() => reply({ ok: false, error: 'Armazenamento indisponível.' })));
  }
  if (event.data?.type === 'LAB_PREPARE_OFFLINE') {
    if (!preparing) preparing = prepare().finally(() => { preparing = null; });
    event.waitUntil(preparing.then(data => reply({ ok: true, ...data })).catch(() => reply({ ok: false, error: 'Não foi possível salvar todos os arquivos. Verifique a conexão e o espaço disponível e tente novamente.' })));
  }
});

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== new URL(BASE).origin) return;
  // Publication checks must inspect the host, not pass thanks to cached files.
  if (request.headers?.get('X-Lab-Verify') === '1') return;
  url.search = ''; url.hash = '';
  // Navigation fallback is restricted to the laboratory home, never other routes.
  const home = url.href === BASE || url.href === new URL('index.html', BASE).href;
  const key = home ? new URL('index.html', BASE).href : url.href;
  const collectionPath = key.startsWith(new URL('solfejos/', BASE).href) ? key.slice(new URL('solfejos/', BASE).href.length) : '';
  const collectionScore = /^\d{3}-\d{3}\/[a-z0-9_-]+\.(mxl|xml|musicxml)$/i.test(collectionPath);
  if (!allowed.has(key) && !collectionScore) return;
  const isScore = collectionScore || SCORES.some(path => new URL(path, BASE).href === key);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isScore || key === new URL('solfejos/catalogo.json', BASE).href) {
      try { return await download(cache, key, 3000); }
      catch { return (await cache.match(key)) || new Response('Partitura não disponível offline.', { status: 404 }); }
    }
    const saved = await cache.match(key);
    if (saved) return saved;
    try { return await download(cache, key); }
    catch { return new Response('Arquivo não disponível offline. Prepare novamente com conexão.', { status: 503 }); }
  })());
});
