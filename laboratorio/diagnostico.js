/* Diagnóstico voluntário, exclusivamente no próprio endereço do laboratório. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), base = new URL('./', location.href);
  function line(list, ok, message) {
    const li = document.createElement('li'); li.className = ok ? 'pass' : 'fail';
    li.textContent = `${ok ? 'OK' : 'Atenção'} · ${message}`; $(list).append(li);
  }
  line('capabilities', window.isSecureContext, window.isSecureContext ? 'Conexão segura para uso offline.' : 'Este endereço não é seguro. Publique com HTTPS para habilitar o modo offline.');
  line('capabilities', !!(window.AudioContext || window.webkitAudioContext), 'Web Audio API para reprodução musical.');
  line('capabilities', 'serviceWorker' in navigator, 'Suporte a service worker.');
  line('capabilities', 'caches' in window, 'Suporte ao armazenamento dos arquivos offline.');
  line('capabilities', true, `Pasta em teste: ${base.pathname}`);
  line('capabilities', true, `Área de exibição: ${window.innerWidth} × ${window.innerHeight} pixels CSS.`);

  async function offlineStatus() {
    try {
      if (!navigator.serviceWorker || !window.isSecureContext) throw new Error('O uso offline requer HTTPS e suporte do navegador.');
      const registration = await navigator.serviceWorker.getRegistration(base.href);
      if (registration?.scope !== base.href || !registration.active) throw new Error('Abra primeiro o laboratório e prepare o uso offline neste endereço.');
      const result = await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Não houve resposta do armazenamento offline.')); }, 10000);
        channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
        registration.active.postMessage({ type: 'LAB_OFFLINE_STATUS' }, [channel.port2]);
      });
      if (!result.ok) throw new Error(result.error);
      $('offlineCheck').textContent = `Versão ${result.version}. ${result.samples}/${result.total} amostras salvas. ${result.ready ? 'Aplicativo e piano disponíveis offline.' : 'Pacote offline incompleto.'} ${result.defaultScore ? 'Partitura padrão salva.' : 'Partitura padrão não salva.'}`;
    } catch (error) { $('offlineCheck').textContent = error.message; }
  }
  offlineStatus();
  window.addEventListener('online', offlineStatus); window.addEventListener('offline', offlineStatus);

  const assets = [
    ['index.html', 'html'], ['style.css', 'css'], ['audio.js', 'js'], ['app.js', 'js'], ['offline.js', 'js'], ['sw.js', 'js'],
    ['verificar.html', 'html'], ['diagnostico.js', 'js'], ['vendor/jszip-3.10.1.min.js', 'js'], ['vendor/opensheetmusicdisplay-1.9.3.min.js', 'js'],
    ['vendor/OSMD-LICENSE.txt', 'text'], ['vendor/JSZip-LICENSE.txt', 'text'], ['audio/piano/CREDITOS.txt', 'text'], ['audio/piano/LICENCA-ORIGEM.txt', 'text'], ['audio/piano/REVISAO.txt', 'text'],
    ...window.LabAudio.bank.map(sample => [sample.file, 'mp3'])
  ];
  async function inspect(file, kind) {
    const abort = new AbortController(), timeout = setTimeout(() => abort.abort(), 20000);
    try {
      const response = await fetch(new URL(file, base), { cache: 'no-store', headers: { 'X-Lab-Verify': '1' }, signal: abort.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer()), mime = response.headers.get('Content-Type') || '';
      const text = new TextDecoder().decode(bytes.subarray(0, 256));
      if (!bytes.length) throw new Error('Arquivo vazio.');
      if (kind !== 'html' && /<!doctype html|<html[\s>]/i.test(text)) throw new Error('O servidor devolveu uma página HTML no lugar deste arquivo.');
      if (kind === 'js' && !/javascript|ecmascript/i.test(mime)) throw new Error(`Tipo incorreto para JavaScript: ${mime || 'não informado'}.`);
      if (kind === 'css' && !/text\/css/i.test(mime)) throw new Error(`Tipo incorreto para CSS: ${mime || 'não informado'}.`);
      if (kind === 'mp3' && !(text.startsWith('ID3') || bytes[0] === 255)) throw new Error('Não é uma amostra MP3 válida.');
      if (kind === 'mxl' && !(bytes[0] === 80 && bytes[1] === 75)) throw new Error('Não é um MXL compactado válido.');
      if (kind === 'xml' && !/score-partwise/.test(new TextDecoder().decode(bytes))) throw new Error('MusicXML score-partwise não encontrado.');
      return bytes.length;
    } finally { clearTimeout(timeout); }
  }
  $('checkFiles').addEventListener('click', async () => {
    $('checkFiles').disabled = true; $('fileChecks').replaceChildren();
    let done = 0, errors = 0, totalBytes = 0, next = 0;
    const total = assets.length + 1;
    await Promise.all(Array.from({ length: 3 }, async () => {
      while (next < assets.length) {
        const [file, kind] = assets[next++];
        try { totalBytes += await inspect(file, kind); line('fileChecks', true, file); }
        catch (error) { errors++; line('fileChecks', false, `${file}: ${error.message}`); }
        $('fileResult').textContent = `Verificando arquivos: ${++done}/${total}…`;
      }
    }));
    try { totalBytes += await inspect('solfejo01.mxl', 'mxl'); line('fileChecks', true, 'solfejo01.mxl'); }
    catch {
      let found = false;
      for (const file of ['solfejo01.xml', 'solfejo01.musicxml']) {
        try { totalBytes += await inspect(file, 'xml'); line('fileChecks', true, file); found = true; break; } catch { /* Try the next supported extension. */ }
      }
      if (!found) { errors++; line('fileChecks', false, 'Nenhuma partitura padrão válida. Envie solfejo01.xml para a mesma pasta de index.html.'); }
    }
    $('fileResult').textContent = errors ? `${errors} problema(s) encontrados. Confira os arquivos indicados. Se estiver sem rede, execute a verificação novamente com conexão.` : `Arquivos conferidos diretamente no servidor: ${(totalBytes / 1000000).toFixed(2).replace('.', ',')} MB. Agora teste o piano e o modo offline.`;
    $('checkFiles').disabled = false;
  });

  let context, engine, token = 0, timer;
  function stop() { token++; clearTimeout(timer); engine?.silence(); $('stopPiano').disabled = true; $('testPiano').disabled = false; }
  $('testPiano').addEventListener('click', async () => {
    stop(); const run = token; $('testPiano').disabled = true; $('stopPiano').disabled = false;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Web Audio API indisponível.');
      context ||= new AudioContext(); await context.resume();
      if (context.state !== 'running') throw new Error('O navegador não liberou o áudio. Toque novamente no botão.');
      engine ||= new window.LabAudio.Engine(context, () => ({ timbre: 'piano', volume: 70, brightness: 65 }), message => { if (run === token) $('audioResult').textContent = message; });
      engine.progress = message => { if (run === token) $('audioResult').textContent = message; };
      const phrase = [60, 64, 67, 72].map((midi, i) => ({ frequency: 440 * 2 ** ((midi - 69) / 12), start: .9 + i * .4 }));
      const chord = [48, 52, 55].map(midi => ({ frequency: 440 * 2 ** ((midi - 69) / 12), start: 0 }));
      await engine.prepare([...chord, ...phrase], 'piano'); if (run !== token) return;
      engine.update(); const origin = context.currentTime + .08;
      for (const note of chord) engine.play(note.frequency, origin, .7, { accompaniment: true, levelScale: .35 });
      for (const note of phrase) engine.play(note.frequency, origin + note.start, .35);
      $('audioResult').textContent = 'Reproduzindo piano neste aparelho…';
      timer = setTimeout(() => { $('audioResult').textContent = 'Teste concluído. Confira também a melodia, o andamento e o cursor no laboratório.'; $('testPiano').disabled = false; $('stopPiano').disabled = true; }, 2900);
    } catch (error) { if (run !== token) return; stop(); $('audioResult').textContent = `Não foi possível tocar: ${error.message}`; }
  });
  $('stopPiano').addEventListener('click', () => { stop(); $('audioResult').textContent = 'Teste interrompido.'; });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
