/* Laboratório independente: leitura local, sem uploads ou alteração do original. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const children = (node, name) => Array.from(node?.children || []).filter(el => el.localName === name);
  const child = (node, name) => children(node, name)[0];
  const value = (node, name, fallback = '') => child(node, name)?.textContent.trim() ?? fallback;
  const number = (node, name, fallback = 0) => Number(value(node, name, String(fallback)));
  const fmt = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
  const STEPS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const NAMES = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };
  const FIGURES = { maxima: 'Máxima', long: 'Longa', breve: 'Breve', whole: 'Semibreve', half: 'Mínima', quarter: 'Semínima', eighth: 'Colcheia', '16th': 'Semicolcheia', '32nd': 'Fusa', '64th': 'Semifusa', '128th': '1/128', '256th': '1/256' };
  const state = { score: null, osmd: null, scoreCursor: null, busy: false, generation: 0, rows: new Map(), highlighted: new Set() };
  // Degree -> semitones, before explicit MusicXML degree modifications.
  const CHORDS = {
    major: [0, 4, 7], minor: [0, 3, 7], augmented: [0, 4, 8], diminished: [0, 3, 6],
    dominant: [0, 4, 7, 10], 'major-seventh': [0, 4, 7, 11], 'minor-seventh': [0, 3, 7, 10],
    'diminished-seventh': [0, 3, 6, 9], 'half-diminished': [0, 3, 6, 10], 'major-minor': [0, 3, 7, 11],
    'major-sixth': [0, 4, 7, 9], 'minor-sixth': [0, 3, 7, 9],
    'dominant-ninth': [0, 4, 7, 10, 14], 'major-ninth': [0, 4, 7, 11, 14], 'minor-ninth': [0, 3, 7, 10, 14],
    'dominant-11th': [0, 4, 7, 10, 14, 17], 'major-11th': [0, 4, 7, 11, 14, 17], 'minor-11th': [0, 3, 7, 10, 14, 17],
    'dominant-13th': [0, 4, 7, 10, 14, 17, 21], 'major-13th': [0, 4, 7, 11, 14, 17, 21], 'minor-13th': [0, 3, 7, 10, 14, 17, 21],
    'suspended-second': [0, 2, 7], 'suspended-fourth': [0, 5, 7], 'power': [0, 7], other: [0]
  };
  const SUFFIXES = { major: '', minor: 'm', augmented: '+', diminished: 'dim', dominant: '7', 'major-seventh': 'maj7', 'minor-seventh': 'm7', 'diminished-seventh': 'dim7', 'half-diminished': 'm7♭5', 'major-minor': 'm(maj7)', 'major-sixth': '6', 'minor-sixth': 'm6', 'suspended-second': 'sus2', 'suspended-fourth': 'sus4', power: '5' };
  const accidentalName = alter => ({ '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' })[alter] ?? `(${fmt(alter)})`;
  const pitchClass = midi => ((midi % 12) + 12) % 12;

  function readHarmony(el, start, measure, offset, transpose) {
    const kind = value(el, 'kind'), root = child(el, 'root'), bass = child(el, 'bass');
    const step = value(root, 'root-step'), alter = number(root, 'root-alter');
    const harmony = { start, measure, offset, staff: value(el, 'staff'), pitches: [], label: 'Cifra não reconhecida', warning: '' };
    if (kind === 'none') { harmony.label = 'N.C. (sem acorde)'; return harmony; }
    const intervals = CHORDS[kind];
    harmony.label = `${step || '?'}${accidentalName(alter)}${SUFFIXES[kind] ?? ` (${kind || 'tipo ausente'})`}`;
    const unsupported = reason => { harmony.warning = reason; return harmony; };
    if (!intervals || STEPS[step] === undefined || !Number.isFinite(alter) || children(el, 'kind').length !== 1) return unsupported('Tipo de cifra ou análise harmônica ainda não suportado.');
    const degreeKeys = kind.includes('sixth') ? [1, 3, 5, 6] : kind === 'suspended-second' ? [1, 2, 5] : kind === 'suspended-fourth' ? [1, 4, 5] : kind === 'power' ? [1, 5] : [1, 3, 5, 7, 9, 11, 13];
    const degrees = new Map(intervals.map((interval, i) => [degreeKeys[i], interval]));
    for (const degree of children(el, 'degree')) {
      const n = number(degree, 'degree-value'), alteration = number(degree, 'degree-alter'), type = value(degree, 'degree-type');
      if (!Number.isInteger(n) || n < 1 || n > 13 || !Number.isFinite(alteration)) return unsupported('Grau de acorde não suportado.');
      if (type === 'subtract') degrees.delete(n);
      else if (type === 'add') degrees.set(n, [0, 2, 4, 5, 7, 9, 11][(n - 1) % 7] + 12 * Math.floor((n - 1) / 7) + alteration);
      else if (type === 'alter' && degrees.has(n)) degrees.set(n, degrees.get(n) + alteration);
      else return unsupported('Alteração de grau sem correspondência no acorde.');
      harmony.label += ` (${type === 'subtract' ? 'sem ' : type === 'add' ? 'add ' : ''}${accidentalName(alteration)}${n})`;
    }
    if (kind === 'other' && !children(el, 'degree').length) return unsupported('Acorde other sem graus explícitos.');
    const rootPitch = STEPS[step] + alter;
    const chordTones = [...degrees.values()].map(interval => rootPitch + interval);
    let bassPitch = rootPitch;
    if (bass) {
      const bassStep = value(bass, 'bass-step'), bassAlter = number(bass, 'bass-alter');
      if (STEPS[bassStep] === undefined || !Number.isFinite(bassAlter)) return unsupported('Baixo da cifra inválido.');
      bassPitch = STEPS[bassStep] + bassAlter;
      harmony.label += `/${bassStep}${accidentalName(bassAlter)}`;
    } else if (child(el, 'inversion')) {
      const inversion = number(el, 'inversion');
      if (!Number.isInteger(inversion) || inversion < 0 || inversion >= chordTones.length) return unsupported('Inversão de acorde não suportada.');
      bassPitch = chordTones[inversion];
      if (inversion) harmony.label += ` (inversão ${inversion})`;
    }
    // A deliberately simple realization: bass in octave 2, chord in octave 3.
    // The file specifies chord content, but does not specify a piano arrangement.
    harmony.pitches = [...new Set([36 + pitchClass(bassPitch), ...chordTones.map(p => 48 + pitchClass(p))])].sort((a, b) => a - b).map(p => p + transpose);
    return harmony;
  }

  function harmonyTimeline(part, staff) {
    const changes = part.harmonies.filter(h => !h.staff || h.staff === staff).sort((a, b) => a.start - b.start);
    // At the same instant, the last encoded chord replaces the earlier one.
    const unique = changes.filter((h, i) => changes[i + 1]?.start !== h.start);
    return unique.map((h, i) => ({ ...h, duration: Math.max(0, Math.min(part.duration, unique[i + 1]?.start ?? part.duration) - h.start) }));
  }

  function parseXML(text) {
    // DOMParser does not fetch the external Finale DTD; reject entity declarations.
    if (/<!ENTITY/i.test(text)) throw new Error('Declarações de entidades XML não são aceitas.');
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('XML malformado. Exporte novamente pelo Finale.');
    return doc;
  }

  async function readScore(blob, filename) {
    if (blob.size > 20 * 1024 * 1024) throw new Error('O arquivo excede o limite experimental de 20 MB.');
    if (!/\.mxl$/i.test(filename)) return blob.text();
    if (!window.JSZip) throw new Error('JSZip local ausente. Confira a pasta vendor.');
    const archive = await JSZip.loadAsync(await blob.arrayBuffer());
    const manifest = archive.file('META-INF/container.xml');
    if (!manifest) throw new Error('MXL sem META-INF/container.xml.');
    const container = parseXML(await manifest.async('string'));
    const roots = Array.from(container.getElementsByTagName('rootfile'));
    const root = roots.find(el => el.getAttribute('media-type') === 'application/vnd.recordare.musicxml+xml') || roots[0];
    const path = root?.getAttribute('full-path');
    const entry = path && archive.file(path);
    if (!entry) throw new Error('Partitura indicada no manifesto MXL não encontrada.');
    return entry.async('string');
  }

  function keyLabel(key) {
    if (!key) return 'Não informada';
    if (!child(key, 'fifths')) return 'Armadura não tradicional';
    const fifths = number(key, 'fifths');
    const major = ['Dó♭', 'Sol♭', 'Ré♭', 'Lá♭', 'Mi♭', 'Si♭', 'Fá', 'Dó', 'Sol', 'Ré', 'Lá', 'Mi', 'Si', 'Fá♯', 'Dó♯'];
    const minor = ['Lá♭', 'Mi♭', 'Si♭', 'Fá', 'Dó', 'Sol', 'Ré', 'Lá', 'Mi', 'Si', 'Fá♯', 'Dó♯', 'Sol♯', 'Ré♯', 'Lá♯'];
    const mode = value(key, 'mode');
    const tonal = mode === 'major' ? `${major[fifths + 7] || '?'} maior` : mode === 'minor' ? `${minor[fifths + 7] || '?'} menor` : `modo ${mode || 'não informado'}`;
    return `${tonal} · ${Math.abs(fifths)} ${fifths < 0 ? 'bemóis' : 'sustenidos'}`;
  }
  function timeLabel(time) {
    if (!time) return 'Não informada';
    if (child(time, 'senza-misura')) return 'Sem fórmula';
    const types = children(time, 'beat-type');
    return children(time, 'beats').map((b, i) => `${b.textContent}/${types[i]?.textContent || '?'}`).join(' + ');
  }

  function extractScore(doc) {
    const root = doc.documentElement;
    if (root.localName !== 'score-partwise') throw new Error('Este piloto aceita MusicXML score-partwise. Exporte nesse formato pelo Finale.');
    const tracks = new Map(), parts = [];
    let eventId = 0;
    for (const part of children(root, 'part')) {
      const id = part.getAttribute('id');
      const info = Array.from(root.getElementsByTagName('score-part')).find(p => p.getAttribute('id') === id);
      const name = value(info, 'part-name', id);
      let divisions = 1, absolute = 0, key = null, time = null;
      const transposes = new Map(), measures = [], harmonies = [];
      for (const [index, measure] of children(part, 'measure').entries()) {
        let position = 0, extent = 0, previousStart = 0;
        const changes = [], measureNumber = measure.getAttribute('number') || String(index + 1);
        for (const el of measure.children) {
          if (el.localName === 'attributes') {
            divisions = number(el, 'divisions', divisions);
            if (!(divisions > 0)) throw new Error('Valor divisions inválido.');
            key = child(el, 'key') || key; time = child(el, 'time') || time;
            if (child(el, 'key') || child(el, 'time')) changes.push(`${timeLabel(time)}; ${keyLabel(key)}`);
            for (const transpose of children(el, 'transpose')) transposes.set(transpose.getAttribute('number') || '*', number(transpose, 'chromatic') + 12 * number(transpose, 'octave-change'));
          } else if (el.localName === 'harmony') {
            const offset = position + number(el, 'offset') / divisions;
            const staff = value(el, 'staff', '1');
            if (!Number.isFinite(offset) || absolute + offset < 0) throw new Error(`Posição de cifra inválida no compasso ${measureNumber}.`);
            harmonies.push(readHarmony(el, absolute + offset, measureNumber, offset, transposes.get(staff) ?? transposes.get('*') ?? 0));
          } else if (el.localName === 'backup' || el.localName === 'forward') {
            position += (el.localName === 'backup' ? -1 : 1) * number(el, 'duration') / divisions;
            if (position < -0.00001) throw new Error(`Posição inválida no compasso ${measureNumber}.`);
            extent = Math.max(extent, position);
          } else if (el.localName === 'note') {
            const grace = !!child(el, 'grace');
            const duration = grace ? 0 : number(el, 'duration', NaN) / divisions;
            if (!Number.isFinite(duration) || duration < 0) throw new Error(`Duração inválida no compasso ${measureNumber}.`);
            const chord = !!child(el, 'chord'), onset = chord ? previousStart : position;
            if (!chord) { previousStart = onset; position += duration; }
            extent = Math.max(extent, onset + duration, position);
            const staff = value(el, 'staff', '1'), voice = value(el, 'voice', '1'), trackId = `${id}/${staff}/${voice}`;
            if (!tracks.has(trackId)) tracks.set(trackId, { id: trackId, part: id, staff, label: `${name} · pauta ${staff} · voz ${voice}`, events: [] });
            const pitch = child(el, 'pitch'), rest = !!child(el, 'rest');
            const step = value(pitch, 'step'), octave = number(pitch, 'octave', NaN), alter = number(pitch, 'alter');
            // pitch/alter is authoritative: never add the key signature twice.
            // Clef and ottava engraving do not alter the sounding pitch encoded here.
            const midi = pitch ? 12 * (octave + 1) + STEPS[step] + alter + (transposes.get(staff) ?? transposes.get('*') ?? 0) : null;
            if (pitch && !Number.isFinite(midi)) throw new Error(`Altura inválida no compasso ${measureNumber}.`);
            const accidental = ({ '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' })[alter] ?? ` (${fmt(alter)} semitons)`;
            const dots = children(el, 'dot').length, ties = children(el, 'tie').map(t => t.getAttribute('type'));
            tracks.get(trackId).events.push({ id: eventId++, measure: measureNumber, start: absolute + onset, duration, rest, grace, midi,
              frequency: midi === null ? null : 440 * 2 ** ((midi - 69) / 12),
              label: rest ? 'Pausa' : pitch ? `${NAMES[step]}${accidental}${octave}` : 'Percussão',
              figure: `${FIGURES[value(el, 'type')] || 'Duração do XML'}${dots ? ` · ${dots} ponto(s)` : ''}${grace ? ' · graça' : ''}${ties.length ? ' · ligada' : ''}`,
              tieStart: ties.includes('start'), tieStop: ties.includes('stop') });
          }
        }
        // Actual durations preserve pickups, tuplets, dots and incomplete measures.
        measures.push({ number: measureNumber, start: absolute, time: timeLabel(time), key: keyLabel(key), duration: extent, changes });
        absolute += extent;
      }
      parts.push({ id, name, measures, harmonies, duration: absolute });
    }
    if (!parts.length || !tracks.size) throw new Error('Nenhuma nota ou pausa encontrada.');
    const sound = Array.from(root.getElementsByTagName('sound')).find(el => Number(el.getAttribute('tempo')) > 0);
    return { title: value(root, 'movement-title') || value(child(root, 'work'), 'work-title', 'Partitura sem título'), tracks, parts, tempo: sound ? Number(sound.getAttribute('tempo')) : 120 };
  }

  // Index OSMD's written positions, without following repetitions. Convert whole
  // notes to quarter-note units, using each selected part's actual measure starts.
  class ScoreCursor {
    constructor(renderer) {
      this.renderer = renderer; this.cursor = renderer.cursor; this.positions = []; this.index = 0; this.target = null;
      const cursor = this.cursor;
      if (!cursor) return;
      cursor.hide(); cursor.reset();
      const limit = Array.from(state.score.tracks.values()).reduce((sum, track) => sum + track.events.length, 0) * 2 + 100;
      for (let i = 0; !cursor.Iterator.EndReached && i < limit; i++) {
        this.positions.push({ measure: cursor.Iterator.CurrentMeasureIndex, offset: cursor.Iterator.CurrentRelativeInMeasureTimestamp.RealValue * 4 });
        cursor.next(); // OSMD 1.9.3 uses moveToNextVisibleVoiceEntry(false).
      }
      cursor.reset(); cursor.hide();
    }
    hide() { this.target = null; this.cursor?.hide(); }
    seek(beat) {
      const part = state.score?.parts.find(p => p.id === selectedTrack()?.part);
      if (!this.cursor || !part || beat < 0) return;
      if (beat === this.target && !this.cursor.Hidden) return;
      let target = -1;
      for (let i = 0; i < this.positions.length; i++) {
        const position = this.positions[i], measure = part.measures[position.measure];
        if (!measure || measure.start + position.offset > beat + .00001) break;
        target = i;
      }
      if (target < 0) return;
      this.target = beat;
      if (target < this.index) { this.cursor.reset(); this.index = 0; }
      if (target === this.index && !this.cursor.Hidden) return;
      // Avoid automatic scrolling through intermediate notes on a seek.
      this.renderer.FollowCursor = false;
      while (this.index < target) { this.cursor.next(); this.index++; }
      this.cursor.show();
      if ($('followCursor').checked) this.follow();
    }
    follow() {
      const element = this.cursor?.cursorElement;
      if (!element?.getBoundingClientRect) return;
      const rect = element.getBoundingClientRect();
      const toolbar = $('transport')?.getBoundingClientRect?.();
      const score = $('score').getBoundingClientRect?.();
      const top = toolbar?.bottom || 0;
      // Scroll only when the active system leaves the usable viewport. Avoid a
      // new page animation on every eighth note, especially on a small screen.
      if (rect.top < top + 8 || rect.bottom > window.innerHeight - 16 || (score && (rect.left < score.left || rect.right > score.right))) {
        element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
    redraw() {
      const target = this.target;
      // OSMD 1.9.3 creates a new Cursor object on every render (including zoom).
      this.cursor = this.renderer.cursor;
      if (!this.cursor) return;
      this.cursor.reset(); this.index = 0; this.cursor.hide();
      if (target !== null) this.seek(target);
    }
  }

  class Player {
    constructor() { this.context = null; this.nodes = new Set(); this.timer = null; this.token = 0; this.engine = null; }
    async unlock() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Web Audio API indisponível neste navegador.');
      this.context ||= new AudioContext();
      if (!this.engine) this.engine = new window.LabAudio.Engine(this.context, () => ({
        timbre: $('timbre').value, brightness: Number($('brightness').value), volume: Number($('masterVolume').value)
      }), message => { if (this.preparingToken === this.token) $('playing').textContent = message; });
      await this.context.resume();
      if (this.context.state !== 'running') throw new Error('O navegador bloqueou o áudio. Clique novamente em Reproduzir.');
    }
    stop(natural = false) {
      this.token++; clearInterval(this.timer);
      if (!natural) {
        this.engine?.silence();
        for (const voice of this.nodes) voice.stop();
        this.nodes.clear();
      }
      $('stop').disabled = true; $('play').textContent = 'Reproduzir';
      state.scoreCursor?.hide();
      $('playing').textContent = 'Reprodução parada';
      for (const id of state.highlighted) state.rows.get(id)?.classList.remove('active');
      state.highlighted.clear();
      $('play').removeAttribute('aria-busy');
    }
    tone(frequency, when, duration, options = {}) {
      const voice = this.engine.play(frequency, when, duration, options);
      if (!voice) return;
      this.nodes.add(voice); voice.onended = () => this.nodes.delete(voice);
    }
    async play(events, total, isolated = false, scoreOffset = 0) {
      this.stop(); const token = this.token;
      await this.unlock(); if (token !== this.token) return;
      const seconds = 60 / Number($('tempo').value);
      const sounds = [], openTies = new Map();
      for (const event of [...events].sort((a, b) => a.start - b.start)) {
        if (event.rest || event.grace || event.midi === null) continue;
        const prior = openTies.get(event.midi);
        if (!isolated && event.tieStop && prior && Math.abs(prior.start + prior.duration - event.start) < .00001) {
          prior.duration += event.duration;
          if (!event.tieStart) openTies.delete(event.midi);
        } else {
          const sound = { ...event }; sounds.push(sound);
          if (!isolated && event.tieStart) openTies.set(event.midi, sound); else openTies.delete(event.midi);
        }
      }
      let harmonies = [];
      if (!isolated) {
        const mode = $('playbackMode').value, track = selectedTrack();
        const part = state.score?.parts.find(p => p.id === track?.part);
        if (mode === 'harmony') sounds.length = 0;
        if (mode !== 'melody' && part) {
          harmonies = harmonyTimeline(part, track.staff);
          const volume = Number($('harmonyVolume').value) / 100;
          for (const h of harmonies) {
            if (h.duration <= 0 || volume <= 0) continue;
            for (const midi of h.pitches) sounds.push({ start: h.start, duration: h.duration, frequency: 440 * 2 ** ((midi - 69) / 12), timbre: $('harmonyTimbre').value, accompaniment: true, levelScale: volume / Math.sqrt(h.pitches.length) });
          }
        }
      }
      sounds.sort((a, b) => a.start - b.start);
      this.preparingToken = token; $('stop').disabled = false; $('play').setAttribute('aria-busy', 'true');
      try { await this.engine.prepare(sounds, $('timbre').value); }
      catch (error) { if (token !== this.token) return; throw error; }
      if (token !== this.token) return;
      $('play').removeAttribute('aria-busy');
      this.engine.update();
      const origin = this.context.currentTime + .08;
      let next = 0;
      $('stop').disabled = false; $('play').textContent = 'Recomeçar';
      const tick = () => {
        if (token !== this.token) return;
        const now = this.context.currentTime;
        // Short lookahead avoids allocating an entire score's oscillators at once.
        while (next < sounds.length && origin + sounds[next].start * seconds < now + .18) {
          const e = sounds[next++], end = origin + (e.start + e.duration) * seconds;
          const start = Math.max(now, origin + e.start * seconds);
          if (end > start) this.tone(e.frequency, start, end - start, e);
        }
        const beat = (now - origin) / seconds;
        const active = events.filter(e => beat >= e.start && beat < e.start + e.duration);
        if (beat >= 0) state.scoreCursor?.seek(scoreOffset + (active[0]?.start ?? beat));
        const highlighted = new Set(active.map(e => e.id));
        for (const id of state.highlighted) if (!highlighted.has(id)) state.rows.get(id)?.classList.remove('active');
        for (const id of highlighted) if (!state.highlighted.has(id)) state.rows.get(id)?.classList.add('active');
        state.highlighted = highlighted;
        const currentHarmony = harmonies.find(h => beat >= h.start && beat < h.start + h.duration);
        const label = (active.length ? `Compasso ${active[0].measure} · ${active.map(e => e.label).join(' + ')}` : 'Preparando…') + (currentHarmony ? ` · Acorde: ${currentHarmony.label}${currentHarmony.warning ? ' (não sintetizado)' : ''}` : '');
        if ($('playing').textContent !== label) $('playing').textContent = label;
        if (beat >= total) { this.stop(true); $('playing').textContent = 'Reprodução concluída'; }
      };
      this.timer = setInterval(tick, 25); tick();
    }
  }
  const player = new Player();
  function status(message, error = false) { $('status').textContent = message; $('status').classList.toggle('error', error); }
  function row(values) {
    const tr = document.createElement('tr');
    for (const value of values) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
    return tr;
  }
  function selectedTrack() { return state.score?.tracks.get($('track').value); }
  function showTrack() {
    player.stop(); state.rows.clear(); $('notes').replaceChildren(); $('measures').replaceChildren(); $('harmonies').replaceChildren();
    const track = selectedTrack(); if (!track) return;
    const part = state.score.parts.find(p => p.id === track.part);
    const harmonies = harmonyTimeline(part, track.staff);
    const warnings = harmonies.filter(h => h.warning);
    $('harmonyInfo').textContent = harmonies.length ? `${harmonies.length} cifras encontradas. Acordes sustentados até a próxima cifra, com baixo indicado e timbre de acompanhamento selecionável.${warnings.length ? ` ${warnings.length} cifra(s) não serão sintetizadas; veja a tabela.` : ''}` : 'Nenhuma cifra codificada encontrada nesta parte e pauta. A harmonia não é deduzida da melodia.';
    for (const h of harmonies) $('harmonies').append(row([h.measure, fmt(h.offset + 1), h.label, fmt(h.duration), h.warning || (h.pitches.length ? 'Disponível' : 'Sem acorde')]));
    $('summary').textContent = `${state.score.title} · ${part.measures.length} compassos · ${track.events.filter(e => !e.rest).length} notas · ${track.events.filter(e => e.rest).length} pausas · ${fmt(part.duration)} semínimas`;
    for (const measure of part.measures) {
      const tr = row([measure.number, measure.time, measure.key, fmt(measure.duration)]);
      if (measure.changes.length > 1) tr.title = `Alterações internas: ${measure.changes.join(' → ')}`;
      $('measures').append(tr);
    }
    for (const [i, event] of track.events.entries()) {
      const tr = row([i + 1, event.measure, event.label, event.frequency ? fmt(event.frequency) : '—', event.figure, fmt(event.duration)]);
      const td = document.createElement('td'), button = document.createElement('button');
      button.type = 'button'; button.textContent = 'Ouvir'; button.disabled = event.rest || event.grace || event.midi === null;
      button.setAttribute('aria-label', `Ouvir ${event.label}, compasso ${event.measure}, nota ${i + 1}`);
      button.addEventListener('click', () => player.play([{ ...event, start: 0 }], event.duration, true, event.start).catch(audioError));
      td.append(button); tr.append(td); $('notes').append(tr); state.rows.set(event.id, tr);
    }
    const hasMelody = track.events.some(e => !e.rest && !e.grace && e.midi !== null);
    const hasHarmony = harmonies.some(h => h.pitches.length && h.duration > 0);
    $('play').disabled = $('playbackMode').value === 'harmony' ? !hasHarmony : $('playbackMode').value === 'melody' ? !hasMelody : !hasMelody && !hasHarmony;
    $('playing').textContent = 'Pronto para reproduzir';
  }
  function audioError(error) { player.stop(); $('playing').textContent = `Não foi possível reproduzir: ${error.message}`; }
  function zoom() {
    $('zoomOut').textContent = `${$('zoom').value}%`;
    if (!state.osmd || !state.score) return;
    try { state.osmd.Zoom = Number($('zoom').value) / 100; state.osmd.render(); state.scoreCursor?.redraw(); }
    catch (error) { status(`Não foi possível atualizar o zoom: ${error.message}`, true); }
  }
  async function load(file) {
    const generation = ++state.generation;
    player.stop(); state.busy = true; state.score = null; state.osmd = null; state.scoreCursor = null;
    for (const id of ['play', 'track', 'zoom', 'zoomMinus', 'zoomPlus', 'resetZoom']) $(id).disabled = true;
    for (const id of ['notes', 'measures', 'harmonies', 'track', 'score']) $(id).replaceChildren();
    $('harmonyInfo').textContent = 'Aguardando arquivo.';
    state.rows.clear(); $('summary').textContent = 'Aguardando arquivo.'; status('Lendo a partitura…');
    try {
      let blob = file, filename = file?.name;
      if (!file) {
        for (const name of ['solfejo01.mxl', 'solfejo01.musicxml']) {
          const response = await fetch(name, { cache: 'no-store' });
          if (response.ok) { blob = await response.blob(); filename = name; break; }
          if (response.status !== 404) throw new Error(`Falha HTTP ${response.status} ao buscar ${name}.`);
        }
        if (!blob) throw new Error('Arquivo ausente. Coloque solfejo01.mxl ou solfejo01.musicxml na pasta laboratorio, ou use Abrir arquivo.');
      }
      const xml = await readScore(blob, filename), score = extractScore(parseXML(xml));
      if (generation !== state.generation) return;
      state.score = score;
      for (const track of score.tracks.values()) { const option = document.createElement('option'); option.value = track.id; option.textContent = track.label; $('track').append(option); }
      $('track').disabled = false; $('tempo').value = Math.max(30, Math.min(240, Math.round(score.tempo)));
      $('tempoOut').textContent = `${$('tempo').value} BPM`; showTrack();
      if (!window.opensheetmusicdisplay) throw new Error('OpenSheetMusicDisplay local ausente. Confira vendor. Os dados e o áudio continuam disponíveis.');
      // Separate host prevents a stale asynchronous load from replacing a newer score.
      const host = document.createElement('div'); $('score').append(host);
      const renderer = new opensheetmusicdisplay.OpenSheetMusicDisplay(host, { backend: 'svg', autoResize: false, drawTitle: true,
        followCursor: false, cursorsOptions: [{ type: 0, color: '#df861c', alpha: .45, follow: true }] });
      state.osmd = renderer; await renderer.load(xml);
      if (generation !== state.generation) return;
      renderer.Zoom = Number($('zoom').value) / 100; renderer.render();
      state.scoreCursor = new ScoreCursor(renderer);
      for (const id of ['zoom', 'zoomMinus', 'zoomPlus', 'resetZoom']) $(id).disabled = false;
      status(`${filename} carregado. Original preservado. Andamento inicial: ${fmt(score.tempo)} BPM; reprodução manual entre 30 e 240 BPM.`);
    } catch (error) {
      if (generation !== state.generation) return;
      const hint = location.protocol === 'file:' ? ' Abra por um servidor HTTP estático ou use Abrir arquivo.' : '';
      status(`Não foi possível carregar ou renderizar a partitura: ${error.message}${hint}`, true);
    } finally { if (generation === state.generation) state.busy = false; }
  }
  $('file').addEventListener('change', event => { const file = event.target.files[0]; if (file) load(file); event.target.value = ''; });
  $('reload').addEventListener('click', () => load());
  $('track').addEventListener('change', showTrack);
  $('zoom').addEventListener('input', zoom);
  $('zoomMinus').addEventListener('click', () => { $('zoom').value = Math.max(50, Number($('zoom').value) - 10); zoom(); });
  $('zoomPlus').addEventListener('click', () => { $('zoom').value = Math.min(200, Number($('zoom').value) + 10); zoom(); });
  $('resetZoom').addEventListener('click', () => { $('zoom').value = 100; zoom(); });
  $('tempo').addEventListener('input', () => { player.stop(); $('tempoOut').textContent = `${$('tempo').value} BPM`; });
  $('timbre').addEventListener('change', () => player.stop());
  $('harmonyTimbre').addEventListener('change', () => player.stop());
  for (const [id, output] of [['brightness', 'brightnessOut'], ['masterVolume', 'masterVolumeOut']]) {
    $(id).addEventListener('input', () => { $(output).textContent = `${$(id).value}%`; player.engine?.update(); });
  }
  $('playbackMode').addEventListener('change', showTrack);
  $('harmonyVolume').addEventListener('input', () => { player.stop(); $('harmonyVolumeOut').textContent = `${$('harmonyVolume').value}%`; });
  $('followCursor').addEventListener('change', () => { if ($('followCursor').checked) state.scoreCursor?.follow(); });
  $('stop').addEventListener('click', () => player.stop());
  $('play').addEventListener('click', () => { const track = selectedTrack(); if (track) player.play(track.events, state.score.parts.find(p => p.id === track.part).duration).catch(audioError); });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (!state.busy) zoom(); }, 180); });
  window.addEventListener('pagehide', () => player.stop());
  window.addEventListener('lab:before-update', () => player.stop());
  document.addEventListener('visibilitychange', () => { if (document.hidden) player.stop(); });
  load();
})();
