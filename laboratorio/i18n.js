/* Traduções locais do Solf. Não traduz nem modifica a partitura original. */
(() => {
  'use strict';
  const base = new URL('./', document.currentScript?.src || location.href);
  const key = `solf:${base.pathname}:language`;
  const languages = ['pt-BR', 'en', 'es'];
  const normalize = value => /^pt(?:-|$)/i.test(value || '') ? 'pt-BR' : /^es(?:-|$)/i.test(value || '') ? 'es' : /^en(?:-|$)/i.test(value || '') ? 'en' : null;
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Preferência opcional. */ }
  let language = languages.includes(saved) ? saved :
    [...(navigator.languages || []), navigator.language].map(normalize).find(Boolean) || 'en';
  const strings = {
    exercise: ['Solfejo', 'Exercise', 'Ejercicio'],
    choose: ['Escolher solfejo', 'Choose an exercise', 'Elegir ejercicio'],
    score: ['Partitura musical', 'Sheet music', 'Partitura musical'],
    play: ['Tocar solfejo', 'Play exercise', 'Tocar ejercicio'],
    stop: ['Parar reprodução', 'Stop playback', 'Detener reproducción'],
    settings: ['Ajustes', 'Settings', 'Ajustes'],
    tempo: ['Andamento', 'Tempo', 'Tempo'],
    volume: ['Volume', 'Volume', 'Volumen'],
    reset: ['Restaurar', 'Reset', 'Restablecer'],
    zoomOut: ['Reduzir partitura', 'Zoom out', 'Reducir partitura'],
    zoomIn: ['Ampliar partitura', 'Zoom in', 'Ampliar partitura'],
    options: ['Som e opções de reprodução', 'Sound and playback options', 'Sonido y opciones de reproducción'],
    playback: ['Reproduzir', 'Playback', 'Reproducir'],
    both: ['Melodia e harmonia', 'Melody and harmony', 'Melodía y armonía'],
    melodyOnly: ['Somente melodia', 'Melody only', 'Solo melodía'],
    harmonyOnly: ['Somente harmonia', 'Harmony only', 'Solo armonía'],
    melody: ['Melodia', 'Melody', 'Melodía'],
    melodySound: ['Som da melodia', 'Melody sound', 'Sonido de la melodía'],
    harmonySound: ['Som da harmonia', 'Harmony sound', 'Sonido de la armonía'],
    piano: ['Piano acústico · Salamander', 'Acoustic piano · Salamander', 'Piano acústico · Salamander'],
    electric: ['Piano elétrico · cristalino', 'Electric piano · clear', 'Piano eléctrico · cristalino'],
    flute: ['Flauta · expressiva', 'Flute · expressive', 'Flauta · expresiva'],
    sine: ['Senoidal · referência simples', 'Sine wave · reference', 'Onda sinusoidal · referencia'],
    brightness: ['Brilho', 'Brightness', 'Brillo'],
    harmonyVolume: ['Volume da harmonia', 'Harmony volume', 'Volumen de la armonía'],
    follow: ['Acompanhar cursor com rolagem', 'Scroll with the cursor', 'Seguir el cursor al desplazarse'],
    language: ['Idioma', 'Language', 'Idioma'],
    update: ['Atualizar Solf', 'Update Solf', 'Actualizar Solf'],
    updateAvailable: ['Nova versão: atualizar Solf', 'New version: update Solf', 'Nueva versión: actualizar Solf'],
    credits: ['Créditos e licença CC BY 3.0', 'Credits and CC BY 3.0 license', 'Créditos y licencia CC BY 3.0'],
    loading: ['Carregando…', 'Loading…', 'Cargando…']
  };
  const messages = [
    ['Carregando partitura…', 'Loading sheet music…', 'Cargando partitura…'],
    ['Carregando solfejos…', 'Loading exercises…', 'Cargando ejercicios…'],
    ['Carregando automaticamente a partitura desta página…', 'Loading sheet music…', 'Cargando partitura…'],
    ['Lendo o arquivo selecionado…', 'Reading the selected file…', 'Leyendo el archivo seleccionado…'],
    ['Pronto para tocar', 'Ready to play', 'Listo para tocar'],
    ['Pronto para reproduzir', 'Ready to play', 'Listo para tocar'],
    ['Reprodução parada', 'Playback stopped', 'Reproducción detenida'],
    ['Reprodução concluída', 'Playback finished', 'Reproducción finalizada'],
    ['Preparando áudio…', 'Preparing audio…', 'Preparando audio…'],
    ['Preparando…', 'Preparing…', 'Preparando…'],
    ['Piano não carregado. Toque em Play para tentar novamente.', 'Piano could not load. Press Play to try again.', 'No se pudo cargar el piano. Pulsa Play para volver a intentar.'],
    ['Web Audio API indisponível neste navegador.', 'Audio is not supported by this browser.', 'Este navegador no admite audio.'],
    ['O navegador bloqueou o áudio. Clique novamente em Play.', 'The browser blocked audio. Press Play again.', 'El navegador bloqueó el audio. Pulsa Play de nuevo.'],
    ['Piano ainda não preparado. Clique novamente em Reproduzir.', 'Piano is not ready. Press Play again.', 'El piano no está listo. Pulsa Play de nuevo.'],
    ['Declarações de entidades XML não são aceitas.', 'XML entity declarations are not supported.', 'No se admiten declaraciones de entidades XML.'],
    ['XML malformado. Exporte novamente pelo Finale.', 'Invalid XML. Export the score again from Finale.', 'XML no válido. Exporta la partitura de nuevo desde Finale.'],
    ['O arquivo excede o limite experimental de 20 MB.', 'The file exceeds the 20 MB limit.', 'El archivo supera el límite de 20 MB.'],
    ['JSZip local ausente. Confira a pasta vendor.', 'JSZip is missing. Check the vendor folder.', 'Falta JSZip. Revisa la carpeta vendor.'],
    ['MXL sem META-INF/container.xml.', 'The MXL file has no META-INF/container.xml.', 'El MXL no contiene META-INF/container.xml.'],
    ['Partitura indicada no manifesto MXL não encontrada.', 'The score listed in the MXL manifest was not found.', 'No se encontró la partitura indicada en el manifiesto MXL.'],
    ['Este piloto aceita MusicXML score-partwise. Exporte nesse formato pelo Finale.', 'Use MusicXML score-partwise exported from Finale.', 'Utiliza MusicXML score-partwise exportado desde Finale.'],
    ['Valor divisions inválido.', 'Invalid MusicXML divisions value.', 'Valor divisions de MusicXML no válido.'],
    ['Nenhuma nota ou pausa encontrada.', 'No notes or rests were found.', 'No se encontraron notas ni silencios.'],
    ['OpenSheetMusicDisplay local ausente. Confira vendor. Os dados e o áudio continuam disponíveis.', 'The sheet music renderer is missing. Check the vendor folder. Audio is still available.', 'Falta el visor de partituras. Revisa la carpeta vendor. El audio sigue disponible.'],
    ['Catálogo vazio.', 'The exercise catalog is empty.', 'El catálogo de ejercicios está vacío.'],
    ['Entrada inválida no catálogo.', 'Invalid exercise catalog entry.', 'Entrada del catálogo no válida.'],
    ['Atualizando laboratório…', 'Updating Solf…', 'Actualizando Solf…'],
    [' Abra por um servidor HTTP estático ou use Abrir arquivo.', ' Open this page using a static HTTP server.', ' Abre esta página mediante un servidor HTTP estático.']
  ];
  const index = () => languages.indexOf(language);
  const t = name => strings[name]?.[index()] || name;
  function translate(text) {
    if (!text || language === 'pt-BR') return text;
    const exact = messages.find(row => row[0] === text);
    if (exact) return exact[index()];
    const en = language === 'en';
    const rules = [
      [/^Carregando piano: (\d+)\/(\d+)…$/, m => en ? `Loading piano: ${m[1]}/${m[2]}…` : `Cargando piano: ${m[1]}/${m[2]}…`],
      [/^Preparando piano acústico: (\d+)\/(\d+) amostras locais…$/, m => en ? `Preparing piano: ${m[1]}/${m[2]} samples…` : `Preparando piano: ${m[1]}/${m[2]} muestras…`],
      [/^Compasso (.+?) · (.*?)(?: · Acorde: (.*))?$/, m => {
        const notes = m[2].split(' + ').map(noteLabel).join(' + ');
        const chord = m[3]?.replace(' (não sintetizado)', en ? ' (not synthesized)' : ' (no sintetizado)').replace('N.C. (sem acorde)', en ? 'N.C. (no chord)' : 'N.C. (sin acorde)');
        return `${en ? 'Measure' : 'Compás'} ${m[1]} · ${notes}${chord ? ` · ${en ? 'Chord' : 'Acorde'}: ${chord}` : ''}`;
      }],
      [/^Não foi possível carregar ou renderizar a partitura: ([\s\S]*)$/, m => (en ? 'Could not load the sheet music: ' : 'No se pudo cargar la partitura: ') + translate(m[1])],
      [/^Não foi possível reproduzir: ([\s\S]*)$/, m => (en ? 'Could not play audio: ' : 'No se pudo reproducir el audio: ') + translate(m[1])],
      [/^Não foi possível atualizar o zoom: ([\s\S]*)$/, m => (en ? 'Could not change zoom: ' : 'No se pudo cambiar el zoom: ') + translate(m[1])],
      [/^Arquivo ausente ou bloqueado na hospedagem\.[\s\S]*$/, () => en ? 'The exercise file is missing or blocked by the server. Please try another exercise.' : 'El archivo del ejercicio no está disponible o está bloqueado por el servidor. Prueba otro ejercicio.'],
      [/^Não foi possível retomar o solfejo anterior\. ([\s\S]*) carregado\.$/, m => en ? `Could not restore the previous exercise. ${exerciseTitle(m[1])} loaded.` : `No se pudo recuperar el ejercicio anterior. ${exerciseTitle(m[1])} cargado.`],
      [/^Solfejo 1 disponível\. Não foi possível carregar a lista de solfejos: ([\s\S]*)$/, m => en ? `Exercise 1 is available. Could not load the exercise list: ${translate(m[1])}` : `Ejercicio 1 disponible. No se pudo cargar la lista de ejercicios: ${translate(m[1])}`],
      [/^(Posição de cifra|Posição|Duração|Altura) inválida no compasso (.+)\.$/, m => en ? `Invalid musical data in measure ${m[2]}.` : `Datos musicales no válidos en el compás ${m[2]}.`],
      [/^Amostra (.+) indisponível \(HTTP (\d+)\)\.$/, m => en ? `Piano sample ${m[1]} is unavailable (HTTP ${m[2]}).` : `Muestra de piano ${m[1]} no disponible (HTTP ${m[2]}).`],
      [/^Amostra (.+) (?:vazia|sem áudio decodificável)\.$/, m => en ? `Piano sample ${m[1]} could not be decoded.` : `No se pudo decodificar la muestra de piano ${m[1]}.`]
    ];
    for (const [pattern, render] of rules) { const match = pattern.exec(text); if (match) return render(match); }
    return text;
  }
  function exerciseTitle(title) { return title.replace(/^Solfejo (\d+)$/, (_, number) => `${t('exercise')} ${number}`); }
  function trackLabel(label) { return label.replace(/ · pauta (.+) · voz (.+)$/, (_, staff, voice) => language === 'en' ? ` · staff ${staff} · voice ${voice}` : language === 'es' ? ` · pentagrama ${staff} · voz ${voice}` : ` · pauta ${staff} · voz ${voice}`); }
  function noteLabel(label) {
    if (language === 'pt-BR') return label;
    if (language === 'es') {
      if (label === 'Pausa') return 'Silencio'; if (label === 'Percussão') return 'Percusión';
      return label.replace(/^(Dó|Ré|Fá|Lá)/, note => ({ Dó: 'Do', Ré: 'Re', Fá: 'Fa', Lá: 'La' })[note]);
    }
    if (label === 'Pausa') return 'Rest'; if (label === 'Percussão') return 'Percussion';
    return label.replace(/^(Dó|Ré|Mi|Fá|Sol|Lá|Si)/, note => ({ Dó: 'C', Ré: 'D', Mi: 'E', Fá: 'F', Sol: 'G', Lá: 'A', Si: 'B' })[note]);
  }
  function apply() {
    document.documentElement.lang = language; document.title = 'Solf';
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
    const select = document.getElementById('language'); if (select) select.value = language;
    for (const id of ['status', 'playing']) {
      const el = document.getElementById(id); if (el) el.textContent = translate(el.textContent);
    }
  }
  function setLanguage(value) {
    if (!languages.includes(value)) return;
    language = value;
    try { localStorage.setItem(key, value); } catch { /* Navegação continua sem armazenamento. */ }
    apply(); window.dispatchEvent(new Event('solf:languagechange'));
  }
  window.SolfI18n = Object.freeze({ t, translate, exerciseTitle, trackLabel, noteLabel, setLanguage, get language() { return language; } });
  apply(); document.getElementById('language')?.addEventListener('change', event => setLanguage(event.target.value));
})();
