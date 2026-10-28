// Teste do grafo e do ciclo de vida: node laboratorio/verificar-audio.cjs
// Usa nós simulados; a avaliação sonora deve ser feita no navegador.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
class Param {
  constructor() { this.value = 0; this.events = []; }
  setValueAtTime(value, time) { this.events.push(['set', value, time]); }
  linearRampToValueAtTime(value, time) { this.events.push(['linear', value, time]); }
  exponentialRampToValueAtTime(value, time) { assert(value > 0); this.events.push(['exponential', value, time]); }
  setTargetAtTime(value, time, constant) { this.events.push(['target', value, time, constant]); }
  cancelScheduledValues(time) { this.events.push(['cancel', time]); }
}
class Context {
  constructor() { this.sampleRate = 44100; this.currentTime = 0; this.destination = {}; this.sources = []; this.nodes = []; }
  node(type) {
    const node = { kind: type, connections: [], disconnected: false, connect(target) { this.connections.push(target); }, disconnect() { this.disconnected = true; } };
    for (const param of ['gain', 'frequency', 'detune', 'playbackRate', 'pan', 'Q', 'threshold', 'knee', 'ratio', 'attack', 'release']) node[param] = new Param();
    this.nodes.push(node); return node;
  }
  createGain() { return this.node('gain'); }
  createBiquadFilter() { return this.node('filter'); }
  createDynamicsCompressor() { return this.node('compressor'); }
  createConvolver() { throw new Error('O motor não deve criar reverberação'); }
  createStereoPanner() { return this.node('pan'); }
  createBuffer(channels, length, sampleRate) { const arrays = Array.from({ length: channels }, () => new Float32Array(length)); return { length, sampleRate, duration: length / sampleRate, numberOfChannels: channels, getChannelData: channel => arrays[channel] }; }
  createPeriodicWave(real, imaginary) { return { real, imaginary }; }
  async decodeAudioData(bytes) { assert(bytes.byteLength > 1000); return this.createBuffer(2, 44100 * 4, 44100); }
  source(type) { const node = this.node(type); node.start = time => { node.startAt = time; }; node.stop = time => { node.stopAt = time; }; node.setPeriodicWave = wave => { node.wave = wave; }; this.sources.push(node); return node; }
  createBufferSource() { return this.source('sample'); }
  createOscillator() { return this.source('oscillator'); }
}
let requests = 0, active = 0, maxActive = 0, fail = false;
const sandbox = { window: {}, console, AbortController, setTimeout, clearTimeout, fetch: async file => {
  assert(file.startsWith('audio/piano/'), 'O áudio deve ser local');
  requests++; maxActive = Math.max(maxActive, ++active);
  await new Promise(resolve => setImmediate(resolve)); active--;
  if (fail) return { ok: false, status: 404 };
  const bytes = fs.readFileSync(path.join(__dirname, file));
  return { ok: true, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'audio.js'), 'utf8'), sandbox);
const { Engine, bank, closest, preload } = sandbox.window.LabAudio;
(async () => {
  assert.equal(bank.length, 25);
  for (const sample of bank) { const data = fs.readFileSync(path.join(__dirname, sample.file)); assert(data.length > 1000); assert(data.subarray(0, 3).toString() === 'ID3' || data[0] === 255, sample.file); }
  const ctx = new Context(), settings = { timbre: 'piano', volume: 80, brightness: 65 };
  const engine = new Engine(ctx, () => settings);
  assert.equal(ctx.sources.length, 0, 'Criar o motor não pode iniciar som');
  assert.equal(engine.output.gain.value, 0);
  assert(!ctx.nodes.some(node => node.kind === 'convolver'), 'Não deve existir processamento de ambiência');
  const sounds = bank.map(sample => ({ frequency: 440 * 2 ** ((sample.midi - 69) / 12) }));
  const progress = [];
  await Promise.all([preload(sounds, 'piano', (done, total) => progress.push([done, total])), preload(sounds, 'piano')]);
  assert.equal(requests, 25, 'Pré-carga simultânea deve compartilhar os downloads');
  assert.equal(engine.samples.size, 0, 'Pré-carga não deve decodificar áudio');
  assert.equal(ctx.sources.length, 0, 'Pré-carga não deve emitir som');
  assert.deepEqual(progress.at(-1), [25, 25]);
  await engine.prepare(sounds, 'piano');
  assert.equal(requests, 25); assert(maxActive <= 4);
  await engine.prepare(sounds, 'piano'); assert.equal(requests, 25, 'Reprodução seguinte deve reutilizar buffers');
  engine.update(); assert.equal(engine.output.gain.events.at(-1)[1], .8);
  settings.brightness = 100; settings.volume = 0; engine.update();
  assert.equal(engine.output.gain.events.at(-1)[1], 0);
  assert.equal(engine.brightness.gain.events.at(-1)[1], 6);
  const frequency = 440 * 2 ** ((61 - 69) / 12), nearest = closest(frequency);
  assert.equal(nearest.midi, 60);
  const voice = engine.play(frequency, 1, .5);
  const piano = ctx.sources.at(-1);
  assert.equal(piano.kind, 'sample'); assert.equal(piano.startAt, 1);
  assert(Math.abs(piano.playbackRate.value - 2 ** (1 / 12)) < 1e-10, 'Transposição deve manter a altura');
  assert.equal(piano.stopAt, 1.67, 'Soltura natural após a duração musical');
  let ended = false; voice.onended = () => { ended = true; }; piano.onended();
  assert.equal(engine.voices.size, 0); assert(ended);
  const before = ctx.sources.length;
  engine.play(440, 2, 1, { timbre: 'electric' }); assert.equal(ctx.sources.length - before, 3);
  const fluteStart = ctx.sources.length;
  engine.play(440, 2, 1, { timbre: 'flute' }); assert.equal(ctx.sources.length - fluteStart, 2);
  const flute = ctx.sources[fluteStart]; assert.equal(flute.frequency.value, 440); assert.equal(flute.wave.imaginary.length, 9);
  assert.equal(engine.play(440, 0, 1, { levelScale: 0 }), null);
  assert.equal(engine.play(30000, 0, 1), null);
  ctx.currentTime = 2.2; engine.silence();
  for (const source of ctx.sources.slice(before)) { assert.equal(source.stopAt, 2.2350000000000003); source.onended(); }
  assert.equal(engine.voices.size, 0, 'Parar deve liberar todas as vozes');
  // A fresh page has an empty encoded cache, so network failure is observable.
  const retrySandbox = { ...sandbox, window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'audio.js'), 'utf8'), retrySandbox);
  const failed = new retrySandbox.window.LabAudio.Engine(new Context(), () => settings); fail = true;
  await assert.rejects(() => failed.prepare([sounds[0]], 'piano'), /HTTP 404/);
  assert.equal(failed.pending.size, 0); fail = false;
  await failed.prepare([sounds[0]], 'piano'); assert.equal(failed.samples.size, 1, 'Falha deve permitir nova tentativa');
  console.log('OK áudio: 25 MP3 locais; cache e concorrência; transposição; ataques e soltura; FM e flauta; EQ/volume; sem reverberação; limpeza de vozes; erro de amostra e nova tentativa.');
})().catch(error => { console.error(error); process.exitCode = 1; });
