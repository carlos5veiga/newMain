// LAB_RECOVERY_V1 — deliberately absent from service-worker cache lists.
(() => {
  'use strict';
  const script = new URL(document.currentScript?.src || 'recuperar-cache.js', location.href);
  const base = new URL('./', script);
  const prefix = `musicxml-lab:${base.pathname}:`;
  const shell = new Set(['', 'index.html', 'app.js', 'audio.js', 'offline.js', 'style.css', 'verificar.html', 'diagnostico.js'].map(name => new URL(name || './', base).href));
  const button = document.getElementById('recover'), status = document.getElementById('recoveryStatus');
  async function onlineFile(url) {
    const abort = new AbortController(), timeout = setTimeout(() => abort.abort(), 15000);
    try {
      const response = await fetch(url, { cache: 'reload', headers: { 'X-Lab-Verify': '1' }, signal: abort.signal });
      if (!response.ok) throw new Error(`O servidor respondeu HTTP ${response.status}.`);
      return response;
    } finally { clearTimeout(timeout); }
  }
  button.addEventListener('click', async () => {
    button.disabled = true; status.textContent = 'Conferindo a conexão com a hospedagem…';
    try {
      // This new script path is never intercepted by any laboratory worker,
      // including old releases that ignore the diagnostic request header.
      const probe = new URL(script); probe.searchParams.set('conferir', Date.now());
      if (!(await (await onlineFile(probe)).text()).includes('LAB_RECOVERY_V1')) throw new Error('A hospedagem não entregou o arquivo de recuperação.');
      status.textContent = 'Renovando somente os arquivos do laboratório…';
      if ('caches' in window) {
        for (const name of await caches.keys()) {
          if (!name.startsWith(prefix)) continue;
          const cache = await caches.open(name);
          for (const request of await cache.keys()) {
            const url = new URL(request.url); url.search = ''; url.hash = '';
            if (shell.has(url.href)) await cache.delete(request);
          }
        }
      }
      const app = await onlineFile(new URL('app.js', base));
      if (/<!doctype html|<html[\s>]/i.test((await app.text()).slice(0, 200))) throw new Error('A hospedagem devolveu HTML no lugar de app.js.');
      // Ask only for this folder's worker update; never unregister site workers.
      if (navigator.serviceWorker) {
        const registration = await navigator.serviceWorker.getRegistration(base.href);
        if (registration?.scope === base.href) {
          try { await registration.update(); } catch { /* Fresh app can still load. */ }
        }
      }
      status.textContent = 'Abrindo os arquivos atualizados…';
      const target = new URL('./', base); target.searchParams.set('atualizado', Date.now());
      location.replace(target.href);
    } catch (error) {
      status.textContent = `Não foi possível concluir: ${error.message} Confira a conexão e tente novamente.`;
      button.disabled = false;
    }
  });
})();
