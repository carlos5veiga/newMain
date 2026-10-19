/* Controle de disponibilidade e atualização, sem interferir no restante do site. */
(() => {
  'use strict';
  const status = document.getElementById('offlineStatus');
  const prepare = document.getElementById('prepareOffline');
  const update = document.getElementById('updateApp');
  let registration, busy = false, hadController = !!navigator.serviceWorker?.controller;
  const render = result => {
    if (busy) return;
    prepare.disabled = false;
    prepare.textContent = result.ready ? 'Conferir arquivos offline' : 'Preparar uso offline';
    status.textContent = result.ready
      ? `Disponível offline: aplicativo e 25 amostras de piano.${result.defaultScore ? ' Partitura padrão salva.' : ' Abra uma partitura pelo seletor de arquivos.'}`
      : `Uso offline incompleto: ${result.samples}/${result.total} amostras de piano salvas. Prepare os arquivos com conexão.`;
  };
  function request(worker, type) {
    return new Promise((resolve, reject) => {
      if (!worker) { reject(new Error('O modo offline ainda está iniciando. Tente novamente.')); return; }
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error('A preparação demorou mais que o esperado. Confira a conexão e tente novamente.')); }, type === 'LAB_PREPARE_OFFLINE' ? 180000 : 10000);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        if (event.data.ok) resolve(event.data); else reject(new Error(event.data.error));
      };
      worker.postMessage({ type }, [channel.port2]);
    });
  }
  async function check() {
    if (!registration?.active || busy) return;
    try { render(await request(registration.active, 'LAB_OFFLINE_STATUS')); }
    catch (error) { status.textContent = error.message; prepare.disabled = false; }
  }
  function showUpdate() {
    if (registration.waiting) {
      update.hidden = false;
      update.textContent = 'Nova versão: atualizar laboratório';
    }
  }
  prepare.addEventListener('click', async () => {
    if (busy) return;
    busy = true; prepare.disabled = true; prepare.textContent = 'Preparando…';
    status.textContent = 'Preparando arquivos para uso offline…';
    try {
      const result = await request(registration?.active, 'LAB_PREPARE_OFFLINE');
      busy = false; render(result);
    } catch (error) {
      busy = false; prepare.disabled = false; prepare.textContent = 'Tentar preparar novamente'; status.textContent = error.message;
    }
  });
  update.addEventListener('click', () => {
    if (!registration?.waiting) return;
    window.dispatchEvent(new Event('lab:before-update'));
    update.disabled = true; status.textContent = 'Atualizando laboratório…';
    registration.waiting.postMessage({ type: 'LAB_ACTIVATE_UPDATE' });
  });
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    status.textContent = 'Modo offline indisponível neste endereço ou navegador. Use HTTPS ou localhost. A reprodução normal continua disponível.';
    return;
  }
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.source?.scriptURL !== new URL('sw.js', location.href).href) return;
    if (busy && event.data?.type === 'LAB_OFFLINE_PROGRESS') status.textContent = `Preparando arquivos offline: ${event.data.done}/${event.data.total}…`;
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) { location.reload(); return; }
    hadController = true; check();
  });
  window.addEventListener('online', check);
  window.addEventListener('offline', check);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  (async () => {
    try {
      registration = await navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' });
      showUpdate();
      registration.addEventListener('updatefound', () => {
        registration.installing?.addEventListener('statechange', showUpdate);
      });
      // Wait for this registration, not an ancestor worker from the main site.
      if (!registration.active) {
        status.textContent = 'Preparando o aplicativo para uso offline…';
        await new Promise((resolve, reject) => {
          const worker = registration.installing || registration.waiting;
          if (!worker) { reject(new Error('Não foi possível iniciar o modo offline. Reabra a página com conexão.')); return; }
          const changed = () => {
            if (worker.state === 'activated') resolve();
            else if (worker.state === 'redundant') reject(new Error('Não foi possível salvar o aplicativo. Reabra a página com conexão.'));
          };
          worker.addEventListener('statechange', changed); changed();
        });
      }
      await check();
    } catch (error) {
      status.textContent = `Modo offline indisponível: ${error.message} A reprodução normal continua disponível.`;
      prepare.disabled = true;
    }
  })();
})();
