/* Motor local Web Audio. Amostras Salamander: Alexander Holm, CC BY 3.0.
   Não usa Tone.js, serviços de áudio, microfone ou dependências adicionais. */
(() => {
  'use strict';
  const BANK = [];
  for (let octave = 1; octave <= 6; octave++) {
    for (const [name, semitone] of [['C', 0], ['Ds', 3], ['Fs', 6], ['A', 9]]) BANK.push({ midi: 12 * (octave + 1) + semitone, file: `audio/piano/${name}${octave}.mp3` });
  }
  BANK.push({ midi: 96, file: 'audio/piano/C7.mp3' });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const closest = frequency => {
    const midi = 69 + 12 * Math.log2(frequency / 440);
    return BANK.reduce((best, sample) => Math.abs(sample.midi - midi) < Math.abs(best.midi - midi) ? sample : best);
  };
  class Engine {
    constructor(context, settings, progress = () => {}) {
      this.context = context; this.settings = settings; this.progress = progress;
      this.samples = new Map(); this.pending = new Map(); this.voices = new Set();
      this.input = context.createGain();
      this.body = context.createBiquadFilter(); this.body.type = 'lowshelf'; this.body.frequency.value = 220; this.body.gain.value = -1.5;
      this.presence = context.createBiquadFilter(); this.presence.type = 'peaking'; this.presence.frequency.value = 2400; this.presence.Q.value = .7; this.presence.gain.value = 2;
      this.brightness = context.createBiquadFilter(); this.brightness.type = 'highshelf'; this.brightness.frequency.value = 3200;
      this.compressor = context.createDynamicsCompressor();
      for (const [key, val] of Object.entries({ threshold: -16, knee: 15, ratio: 3, attack: .006, release: .16 })) this.compressor[key].value = val;
      this.output = context.createGain(); this.output.gain.value = 0;
      this.input.connect(this.body); this.body.connect(this.presence); this.presence.connect(this.brightness);
      this.brightness.connect(this.compressor);
      this.compressor.connect(this.output); this.output.connect(context.destination);
    }
    update() {
      const now = this.context.currentTime, settings = this.settings();
      this.brightness.gain.setTargetAtTime(-3 + clamp(settings.brightness, 0, 100) * .09, now, .025);
      this.output.gain.setTargetAtTime(clamp(settings.volume, 0, 100) / 100, now, .02);
    }
    async prepare(sounds, melodyTimbre) {
      const required = new Map();
      for (const sound of sounds) if ((sound.timbre || melodyTimbre) === 'piano' && sound.frequency > 0) {
        const sample = closest(sound.frequency); if (!this.samples.has(sample.midi)) required.set(sample.midi, sample);
      }
      let done = 0;
      const entries = [...required.values()];
      if (entries.length) this.progress(`Preparando piano acústico: 0/${entries.length} amostras locais…`);
      const load = async sample => {
        if (!this.pending.has(sample.midi)) {
          const task = (async () => {
            const response = await fetch(sample.file);
            if (!response.ok) throw new Error(`Amostra ${sample.file} indisponível (HTTP ${response.status}).`);
            const buffer = await this.context.decodeAudioData(await response.arrayBuffer());
            if (!(buffer.duration > 0)) throw new Error(`Amostra ${sample.file} sem áudio decodificável.`);
            this.samples.set(sample.midi, buffer);
          })();
          this.pending.set(sample.midi, task);
        }
        try { await this.pending.get(sample.midi); }
        finally { this.pending.delete(sample.midi); }
        this.progress(`Preparando piano acústico: ${++done}/${entries.length} amostras locais…`);
      };
      let next = 0;
      await Promise.all(Array.from({ length: Math.min(4, entries.length) }, async () => { while (next < entries.length) await load(entries[next++]); }));
    }
    silence() {
      const now = this.context.currentTime;
      this.output.gain.cancelScheduledValues(now); this.output.gain.setTargetAtTime(0, now, .008);
      for (const voice of this.voices) voice.stop();
    }
    play(frequency, when, duration, options = {}) {
      const context = this.context, timbre = options.timbre || this.settings().timbre;
      if (!(frequency > 0) || frequency >= context.sampleRate / 2 || !(duration > 0)) return null;
      const scale = options.levelScale ?? 1;
      if (scale <= 0) return null;
      const sources = [], graph = [], envelope = context.createGain(), pan = context.createStereoPanner();
      const release = timbre === 'piano' ? .16 : timbre === 'electric' ? .12 : .07;
      const end = when + duration, stopAt = end + release;
      const midi = 69 + 12 * Math.log2(frequency / 440);
      pan.pan.value = options.accompaniment ? clamp((midi - 54) / 65, -.35, .25) : .06;
      envelope.connect(pan); pan.connect(this.input); graph.push(envelope, pan);
      let stopped = false, remaining = 0;
      const voice = {
        onended: null,
        stop: () => {
          if (stopped) return; stopped = true;
          const now = context.currentTime;
          envelope.gain.cancelScheduledValues(now); envelope.gain.setTargetAtTime(0, now, .006);
          for (const source of sources) { try { source.stop(now + .035); } catch { /* already ended */ } }
        }
      };
      const source = node => {
        sources.push(node); remaining++;
        node.onended = () => {
          node.disconnect();
          if (--remaining === 0) {
            graph.forEach(n => n.disconnect()); this.voices.delete(voice); voice.onended?.();
          }
        };
        return node;
      };
      let level = .28 * scale;
      const attack = Math.min(timbre === 'flute' ? .026 : .004, duration / 4);
      if (timbre === 'piano') {
        const sample = closest(frequency), buffer = this.samples.get(sample.midi);
        if (!buffer) throw new Error('Piano ainda não preparado. Clique novamente em Reproduzir.');
        const piano = source(context.createBufferSource()); piano.buffer = buffer;
        piano.playbackRate.value = frequency / (440 * 2 ** ((sample.midi - 69) / 12));
        piano.connect(envelope); level = .85 * scale;
        // The recorded hammer, strings and decay supply the evolving spectrum.
      } else if (timbre === 'electric') {
        const carrier = source(context.createOscillator()), modulator = source(context.createOscillator()), tine = source(context.createOscillator());
        const modulation = context.createGain(), tineGain = context.createGain(); graph.push(modulation, tineGain);
        carrier.frequency.value = frequency; modulator.frequency.value = frequency * 2; tine.frequency.value = frequency * 4;
        modulation.gain.setValueAtTime(frequency * 1.8, when);
        modulation.gain.exponentialRampToValueAtTime(frequency * .08, when + Math.min(.65, duration));
        modulator.connect(modulation); modulation.connect(carrier.frequency); carrier.connect(envelope);
        tineGain.gain.setValueAtTime(.15, when); tineGain.gain.exponentialRampToValueAtTime(.001, when + Math.min(.22, duration));
        tine.connect(tineGain); tineGain.connect(envelope);
      } else if (timbre === 'flute') {
        const oscillator = source(context.createOscillator()), vibrato = source(context.createOscillator());
        const vibratoGain = context.createGain(), filter = context.createBiquadFilter(); graph.push(vibratoGain, filter);
        oscillator.frequency.value = frequency;
        oscillator.setPeriodicWave(context.createPeriodicWave(new Float32Array(9), new Float32Array([0, 1, .23, .32, .10, .12, .045, .035, .02])));
        filter.type = 'lowpass'; filter.Q.value = .55; filter.frequency.setValueAtTime(Math.min(11000, frequency * 14), when);
        filter.frequency.exponentialRampToValueAtTime(Math.min(8500, frequency * 9), when + Math.min(.16, duration));
        vibrato.frequency.value = 5.1; vibratoGain.gain.setValueAtTime(0, when);
        vibratoGain.gain.linearRampToValueAtTime(3.5, when + Math.min(.38, duration));
        vibrato.connect(vibratoGain); vibratoGain.connect(oscillator.detune);
        oscillator.connect(filter); filter.connect(envelope); level = .23 * scale;
      } else {
        const oscillator = source(context.createOscillator()); oscillator.frequency.value = frequency; oscillator.connect(envelope); level = .18 * scale;
      }
      envelope.gain.setValueAtTime(0, when); envelope.gain.linearRampToValueAtTime(level, when + attack);
      if (timbre === 'electric') envelope.gain.exponentialRampToValueAtTime(level * Math.max(.12, Math.exp(-duration / 2)), end);
      else envelope.gain.setValueAtTime(level, end);
      envelope.gain.exponentialRampToValueAtTime(.0001, stopAt);
      this.voices.add(voice);
      for (const node of sources) { node.start(when); node.stop(stopAt + .01); }
      return voice;
    }
  }
  window.LabAudio = Object.freeze({ Engine, bank: BANK, closest });
})();
