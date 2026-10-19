// Verificação local no Windows: node laboratorio/verificar.cjs
// Node é usado somente neste teste, nunca pela aplicação no navegador.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const JSZip = require('./vendor/jszip-3.10.1.min.js');
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  assert(!/^https?:/.test(match[1]), 'Referência externa');
  assert(fs.existsSync(path.join(root, match[1])), `Referência ausente: ${match[1]}`);
}

// .NET supplies a real XML parser for these Windows-only tests.
function parse(text) {
  const script = `$ErrorActionPreference='Stop'; [Console]::InputEncoding=[Text.Encoding]::UTF8; [Console]::OutputEncoding=[Text.Encoding]::UTF8; $doc=New-Object Xml.XmlDocument; $doc.XmlResolver=$null; $doc.LoadXml([Console]::In.ReadToEnd()); function Convert-Element($el) { $attrs=@{}; foreach($a in $el.Attributes){$attrs[$a.Name]=$a.Value}; $kids=@(foreach($c in $el.ChildNodes){if($c.NodeType -eq 'Element'){Convert-Element $c}}); return @{name=$el.LocalName; text=$el.InnerText; attrs=$attrs; children=$kids} }; Convert-Element $doc.DocumentElement | ConvertTo-Json -Depth 100 -Compress`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', script], { input: text, encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr);
  function wrap(raw) {
    const node = { localName: raw.name, textContent: raw.text, children: (raw.children || []).map(wrap), getAttribute: key => raw.attrs[key] ?? null };
    node.getElementsByTagName = name => node.children.flatMap(c => [...(c.localName === name ? [c] : []), ...c.getElementsByTagName(name)]);
    return node;
  }
  const element = wrap(JSON.parse(result.stdout.replace(/^\uFEFF/, '')));
  return { documentElement: element, getElementsByTagName: name => [...(element.localName === name ? [element] : []), ...element.getElementsByTagName(name)] };
}
function element() {
  return { value: '', children: [], textContent: '', disabled: false, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {}, setAttribute() {}, removeAttribute() {}, append(...nodes) { this.children.push(...nodes); if (!this.value && nodes[0]?.value) this.value = nodes[0].value; }, replaceChildren() { this.children = []; this.value = ''; } };
}
const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m => [m[1], element()]));
elements.tempo.value = '120'; elements.zoom.value = '100'; elements.timbre.value = 'piano'; elements.followCursor.checked = true;
elements.playbackMode.value = 'melody'; elements.harmonyVolume.value = '45';
elements.harmonyTimbre.value = 'piano';
let scheduled = [], audioContexts = 0, intervalTick;
class AudioContext {
  constructor() { audioContexts++; this.currentTime = 0; this.sampleRate = 48000; this.state = 'running'; this.destination = {}; }
  async resume() {}
  createPeriodicWave(real, imaginary) { return { real: [...real], imaginary: [...imaginary] }; }
  createOscillator() { const event = {}; return { set type(v) { event.type = v; }, setPeriodicWave(wave) { event.wave = wave; }, frequency: { set value(v) { event.frequency = v; } }, connect() {}, disconnect() {}, start(t) { event.start = t; scheduled.push(event); }, stop(t) { event.end = t; } }; }
  createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
}
// The score/scheduler suite observes note events; audio graph tests are separate.
class TestEngine {
  constructor(context, settings) { this.context = context; this.settings = settings; }
  async prepare() {}
  update() {}
  silence() {}
  play(frequency, when, duration, options = {}) {
    scheduled.push({ frequency, start: when, end: when + duration + .005, timbre: options.timbre || this.settings().timbre });
    return { stop() {} };
  }
}
const context = vm.createContext({ console, URL, JSZip, Blob, fetch, setTimeout, clearTimeout, setInterval: callback => { intervalTick = callback; return 1; }, clearInterval() {},
  document: { currentScript: { src: 'https://carlosveigafilho.com.br/laboratorio/app.js' }, getElementById: id => elements[id], createElement: element, addEventListener() {} },
  window: { AudioContext, JSZip, LabAudio: { Engine: TestEngine }, matchMedia: () => ({ matches: false }), addEventListener() {} }, location: { protocol: 'https:', href: 'https://carlosveigafilho.com.br/outro-endereco?teste=1' },
  DOMParser: class { parseFromString(text) { return parse(text); } } });
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\n  load\(\);\n\}\)\(\);\s*$/, '\n  globalThis.testAPI = { extractScore, parseXML, readScore, readHarmony, harmonyTimeline, Player, ScoreCursor, load, state };\n})();');
assert(source.includes('globalThis.testAPI'), 'Ponto de entrada do teste não encontrado');
vm.runInContext(source, context);
assert.equal(elements.zoom.value, 80, 'Zoom inicial no desktop');
context.window.matchMedia = () => ({ matches: true });
vm.runInContext(source, context);
assert.equal(elements.zoom.value, 60, 'Zoom inicial no celular');
context.window.matchMedia = () => ({ matches: false });
vm.runInContext(source, context);
const { extractScore, parseXML, readScore, readHarmony, harmonyTimeline, Player, ScoreCursor, state } = context.testAPI;
const scoreXML = body => `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Teste</part-name></score-part></part-list><part id="P1">${body}</part></score-partwise>`;
const note = (pitch, duration, extra = '') => `<note>${pitch ? `<pitch><step>${pitch[0]}</step><alter>${pitch[1]}</alter><octave>${pitch[2]}</octave></pitch>` : '<rest/>'}<duration>${duration}</duration>${extra}</note>`;
(async () => {
  assert.equal(audioContexts, 0, 'Áudio criado sem interação');
  const original = fs.readFileSync(path.join(root, 'solfejo01.mxl'));
  const xml = await readScore(new Blob([original]), 'solfejo01.mxl');
  const actual = extractScore(parseXML(xml));
  const track = [...actual.tracks.values()][0];
  assert.equal(actual.parts[0].measures.length, 9);
  assert.equal(actual.parts[0].duration, 36);
  assert.equal(track.events.length, 39);
  assert.equal(actual.tempo, 120);
  assert.equal(track.events[0].midi, 60);
  assert(Math.abs(track.events[0].frequency - 261.625565) < .00001);
  assert.equal(track.events.at(-2).label, 'Si3');
  assert.equal(actual.parts[0].measures[0].time, '4/4');
  assert(actual.parts[0].measures[0].key.includes('Dó maior'));
  const harmony = harmonyTimeline(actual.parts[0], '1');
  assert.equal(harmony.length, 11);
  assert.deepEqual(Array.from(harmony, h => h.label), ['C', 'G/B', 'Dm7', 'C/G', 'G', 'Am7', 'Em7', 'F', 'C/G', 'G', 'C']);
  assert.deepEqual(Array.from(harmony, h => h.start), [0, 4, 8, 12, 14, 16, 20, 24, 28, 30, 32]);
  assert.equal(harmony.reduce((sum, h) => sum + h.duration, 0), 36);
  assert.deepEqual(Array.from(harmony[1].pitches), [47, 50, 55, 59], 'G/B deve ter Si2 no baixo');
  assert.deepEqual(Array.from(harmony[2].pitches), [38, 48, 50, 53, 57], 'Dm7 deve incluir a sétima menor');
  assert.deepEqual(Array.from(harmony[3].pitches), [43, 48, 52, 55], 'C/G deve ter Sol2 no baixo');
  const makeHarmony = (kind, extra = '', root = '<root-step>C</root-step>') => `<harmony><root>${root}</root><kind>${kind}</kind>${extra}</harmony>`;
  const interpret = (text, transposition = 0) => readHarmony(parseXML(text).documentElement, 0, '1', 0, transposition);
  assert.deepEqual(Array.from(interpret(makeHarmony('major', '<inversion>1</inversion>')).pitches), [40, 48, 52, 55]);
  assert.deepEqual(Array.from(interpret(makeHarmony('major', '', '<root-step>F</root-step><root-alter>1</root-alter>'), -2).pitches), [40, 47, 52, 56]);
  const degree = (n, alter, type) => `<degree><degree-value>${n}</degree-value><degree-alter>${alter}</degree-alter><degree-type>${type}</degree-type></degree>`;
  const changedChord = interpret(makeHarmony('dominant', degree(9, -1, 'add') + degree(5, 0, 'subtract')));
  assert.deepEqual(Array.from(changedChord.pitches), [36, 48, 49, 52, 58], 'C7 add b9 sem quinta');
  assert.deepEqual(Array.from(interpret(makeHarmony('minor-seventh', degree(7, 1, 'alter'))).pitches), [36, 48, 51, 55, 59], 'alter deve modificar o grau do tipo original');
  assert.equal(interpret(makeHarmony('unsupported')).pitches.length, 0);
  assert(interpret(makeHarmony('unsupported')).warning);
  assert.equal(interpret('<harmony><kind>none</kind></harmony>').warning, '');
  const harmonyXML = scoreXML(`<measure number="1"><attributes><divisions>2</divisions></attributes>${makeHarmony('major')}${note(['C', 0, 4], 2)}${makeHarmony('minor', '<offset>1</offset><staff>1</staff>')}${note(['C', 0, 4], 2)}<harmony><kind>none</kind></harmony>${note(null, 4)}</measure>`);
  const harmonyPart = extractScore(parseXML(harmonyXML)).parts[0];
  assert.deepEqual(Array.from(harmonyTimeline(harmonyPart, '1'), h => h.duration), [1.5, .5, 2], 'Offsets e N.C. devem delimitar a harmonia');
  assert.equal(harmonyTimeline(harmonyPart, '2').length, 2, 'Cifras de outra pauta não devem tocar');
  assert.equal(await readScore(new Blob([xml]), 'solfejo01.musicxml'), xml);
  assert.deepEqual(fs.readFileSync(path.join(root, 'solfejo01.musicxml')), Buffer.from(xml), 'XML alternativo deve ser idêntico ao XML interno do MXL');
  assert.deepEqual(fs.readFileSync(path.join(root, 'solfejo01.xml')), Buffer.from(xml), 'XML de extensão padrão deve ser idêntico ao original');
  const synthetic = extractScore(parseXML(scoreXML(`<measure number="0"><attributes><divisions>6</divisions><key><fifths>2</fifths><mode>major</mode></key><time><beats>6</beats><beat-type>8</beat-type></time><transpose><chromatic>-2</chromatic><octave-change>-1</octave-change></transpose></attributes>${note(['F', 1, 5], 9, '<type>quarter</type><dot/><tie type="start"/>')}${note(['A', -1, 5], 9, '<chord/>')}${note(null, 3)}<backup><duration>12</duration></backup>${note(['C', 0, 4], 12, '<voice>2</voice>')}</measure><measure number="1"><attributes><divisions>3</divisions><time><beats>3</beats><beat-type>4</beat-type></time><key><fifths>-2</fifths><mode>minor</mode></key></attributes>${note(['F', 0, 4], 1, '<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>')}<forward><duration>3</duration></forward>${note(['C', 2, 6], 3)}</measure>`)));
  const events = [...synthetic.tracks.values()][0].events;
  assert.equal(events[0].midi, 64); // F#5 transposed down 14 semitones.
  assert.equal(events[0].duration, 1.5);
  assert.equal(events[1].start, 0); // Chord does not advance time.
  assert.equal(events[2].rest, true);
  assert.equal(events[2].duration, .5);
  assert.equal(events[3].duration, 1 / 3); // Tuplet uses duration/divisions.
  assert.equal(events[3].midi, 51); // Natural F is not sharpened by key again.
  assert(Math.abs(events[4].start - (2 + 1 / 3 + 1)) < 1e-9);
  assert.equal(synthetic.tracks.size, 2);
  assert.equal(synthetic.parts[0].measures[1].time, '3/4');
  assert(synthetic.parts[0].measures[1].key.includes('Sol menor'));
  assert.throws(() => extractScore(parseXML('<score-timewise/>')), /score-partwise/);
  assert.throws(() => parseXML('<!ENTITY bad "x">'), /entidades/);
  assert.throws(() => parseXML('<score-partwise>'), /./, 'XML malformado deve falhar');
  await assert.rejects(() => readScore(new Blob(['not a zip']), 'broken.mxl'));
  const emptyArchive = await new JSZip().generateAsync({ type: 'uint8array' });
  await assert.rejects(() => readScore(new Blob([emptyArchive]), 'empty.mxl'), /container.xml/);
  // Exercise visible failure states and the .musicxml fallback without a browser.
  context.fetch = async () => ({ ok: false, status: 404 });
  await context.testAPI.load();
  assert(elements.status.textContent.includes('Arquivo ausente'));
  assert.equal(elements.play.disabled, true);
  let renders = 0;
  context.opensheetmusicdisplay = context.window.opensheetmusicdisplay = {
    OpenSheetMusicDisplay: class { async load(text) { assert.equal(text, xml); } render() { renders++; } }
  };
  let scoreRequests = [];
  context.fetch = async name => {
    scoreRequests.push(name);
    assert(name.startsWith('https://carlosveigafilho.com.br/laboratorio/'), 'Partitura deve vir da pasta publicada, não do endereço alternativo da página');
    return name.endsWith('.mxl') ? { ok: false, status: 403 } : { ok: true, blob: async () => new Blob([xml]) };
  };
  await context.testAPI.load();
  assert.equal(elements.status.textContent, '');
  assert.equal(elements.zoom.value, 80);
  assert.equal(elements.play.disabled, false);
  assert.equal(renders, 1);
  assert.equal(audioContexts, 0, 'Carregar partitura não pode iniciar áudio');
  assert.deepEqual(scoreRequests, ['https://carlosveigafilho.com.br/laboratorio/solfejo01.mxl', 'https://carlosveigafilho.com.br/laboratorio/solfejo01.xml']);
  context.fetch = async name => ({ ok: true, blob: async () => new Blob([name.endsWith('.mxl') ? '<html>Fallback indevido da hospedagem</html>' : xml]) });
  await context.testAPI.load();
  assert.equal(elements.status.textContent, '', 'MXL devolvido como HTML deve usar o XML alternativo');
  context.fetch = async name => name.endsWith('.musicxml') ? { ok: true, blob: async () => new Blob([xml]) } : { ok: false, status: 404 };
  await context.testAPI.load();
  assert.equal(elements.status.textContent, '', 'A extensão MusicXML também continua aceita');
  const p = new Player();
  const base = { id: 1, midi: 69, frequency: 440, start: 0, duration: 1, label: 'Lá4', measure: '1' };
  await p.play([ { ...base, tieStart: true }, { ...base, start: 1, tieStop: true } ], 2);
  assert.equal(scheduled.length, 1, 'Ligadura não pode reatacar');
  assert.equal(scheduled[0].timbre, 'piano');
  assert(Math.abs(scheduled[0].end - 1.085) < 1e-9);
  p.stop(); scheduled = [];
  await p.play([{ ...base, rest: true }], 1);
  assert.equal(scheduled.length, 0, 'Pausa não deve gerar som');
  p.stop(); elements.tempo.value = '60';
  await p.play([base], 1, true);
  assert(Math.abs(scheduled[0].end - 1.085) < 1e-9, '60 BPM deve durar 1 segundo');
  p.stop();
  scheduled = []; elements.timbre.value = 'flute';
  await p.play([base], 1, true);
  assert.equal(scheduled[0].timbre, 'flute');
  p.stop(); scheduled = []; elements.timbre.value = 'sine';
  await p.play([base], 1, true);
  assert.equal(scheduled[0].timbre, 'sine');
  p.stop();
  // Cursor adapter with the same public iterator API as the pinned OSMD.
  const positions = track.events.map(e => { const measure = Number(e.measure) - 1; return { measure, offset: (e.start - actual.parts[0].measures[measure].start) / 4 }; });
  class FakeCursor {
    constructor() { this.position = 0; this.Hidden = true; }
    get Iterator() { const p = positions[this.position]; return { EndReached: !p, CurrentMeasureIndex: p?.measure, CurrentRelativeInMeasureTimestamp: { RealValue: p?.offset } }; }
    reset() { this.position = 0; }
    next() { this.position++; }
    hide() { this.Hidden = true; }
    show() { this.Hidden = false; }
  }
  const renderer = { cursor: new FakeCursor() };
  state.scoreCursor = new ScoreCursor(renderer);
  assert.equal(state.scoreCursor.positions.length, 39);
  state.scoreCursor.seek(2);
  assert.equal(renderer.cursor.position, 1);
  assert.equal(renderer.cursor.Hidden, false);
  assert.equal(renderer.FollowCursor, false, 'OSMD não deve animar a página em cada nota');
  let scrolls = 0;
  renderer.cursor.cursorElement = { getBoundingClientRect: () => ({ top: 200, bottom: 300, left: 20, right: 40 }), scrollIntoView() { scrolls++; } };
  context.window.innerHeight = 700;
  state.scoreCursor.follow(); assert.equal(scrolls, 0, 'Sistema visível não deve causar rolagem');
  renderer.cursor.cursorElement.getBoundingClientRect = () => ({ top: 800, bottom: 900, left: 20, right: 40 });
  state.scoreCursor.follow(); assert.equal(scrolls, 1, 'Sistema fora da tela deve ser acompanhado');
  state.scoreCursor.seek(0);
  assert.equal(renderer.cursor.position, 0, 'Recomeço deve retornar ao início');
  state.scoreCursor.seek(32);
  renderer.cursor = new FakeCursor(); // OSMD replaces its cursor after rendering.
  state.scoreCursor.redraw();
  assert.equal(renderer.cursor.position, 38, 'Zoom deve preservar a posição');
  elements.tempo.value = '120';
  await p.play(track.events, 36);
  p.context.currentTime = .081; intervalTick();
  assert.equal(renderer.cursor.position, 0);
  p.context.currentTime = 1.081; intervalTick();
  assert.equal(renderer.cursor.position, 1, 'Cursor deve acompanhar o relógio do áudio');
  p.context.currentTime = 18.081; intervalTick();
  assert.equal(renderer.cursor.Hidden, true, 'Conclusão deve ocultar o cursor');
  p.context.currentTime = 0;
  await p.play([{ ...track.events[5], start: 0 }], 2, true, track.events[5].start);
  p.context.currentTime = .081; intervalTick();
  assert.equal(renderer.cursor.position, 5, 'Nota isolada deve apontar para o compasso original');
  p.stop(); assert.equal(renderer.cursor.Hidden, true);
  // Both layers share the same clock; isolated notes always bypass harmony.
  p.context.currentTime = 0; scheduled = []; elements.playbackMode.value = 'both';
  await p.play(track.events, 36);
  assert.equal(scheduled.length, 5, 'Primeiro ataque: melodia + baixo e tríade de C');
  assert(scheduled.every(e => e.start === .08), 'Camadas devem começar juntas');
  p.stop(); scheduled = []; elements.playbackMode.value = 'harmony';
  await p.play(track.events, 36);
  assert.equal(scheduled.length, 4, 'Somente harmonia não deve tocar a nota melódica');
  assert(scheduled.every(e => e.timbre === 'piano'), 'Acompanhamento deve usar piano mesmo com melodia senoidal');
  p.context.currentTime = 2.081; intervalTick();
  const bassB = scheduled.find(e => Math.abs(e.frequency - 123.470825) < .00001);
  assert(bassB, 'O segundo acorde deve tocar Si2 no baixo');
  assert.equal(bassB.start, 2.081);
  p.stop(); p.context.currentTime = 0; scheduled = [];
  await p.play([base], 1, true);
  assert.equal(scheduled.length, 1, 'Ouvir nota deve ignorar modo harmonia');
  p.stop(); scheduled = []; elements.harmonyVolume.value = '0';
  await p.play(track.events, 36);
  assert.equal(scheduled.length, 0, 'Volume zero deve silenciar a harmonia');
  p.stop(); elements.harmonyVolume.value = '45'; elements.playbackMode.value = 'melody';
  console.log('OK: 11 cifras reais; posições e baixos G/B e C/G; sétimas, acidentes, transposição, inversão, graus, offset, N.C., pautas, tipos desconhecidos; modos de reprodução, sincronização e volume zero.');
  console.log('OK: timbres piano/flauta/senoidal; cursor sincronizado, retorno, conclusão, nota isolada e preservação após zoom.');
  const baseURL = process.env.LAB_URL;
  if (baseURL) {
    for (const name of ['index.html', 'style.css', 'app.js', 'audio.js', 'solfejo01.mxl', 'vendor/jszip-3.10.1.min.js', 'vendor/opensheetmusicdisplay-1.9.3.min.js', 'audio/piano/C4.mp3']) {
      const response = await fetch(new URL(name, baseURL));
      assert.equal(response.status, 200, name);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), fs.readFileSync(path.join(root, name)), name);
    }
  }
  console.log('OK: referências locais; MXL original; 9 compassos, 39 notas, 36 semínimas, 120 BPM; acidentes, oitavas, transposição, pausas, acordes, vozes, pontuação, quiálteras, mudanças de divisions/compasso/tonalidade; ligaduras e andamento no áudio; erros de XML/MXL.' + (baseURL ? ' HTTP estático OK.' : ''));
})().catch(error => { console.error(error); process.exitCode = 1; });
