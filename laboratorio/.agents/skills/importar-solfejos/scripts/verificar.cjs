'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { importCollection, LAB } = require('./importar.cjs');
const JSZip = require(path.join(LAB, 'vendor/jszip-3.10.1.min.js'));
const xml = title => `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE score-partwise SYSTEM "http://invalid.example/never-fetch.dtd"><score-partwise version="4.0"><work><work-title>${title}</work-title></work><part-list><score-part id="P1"><part-name>Voz</part-name></score-part></part-list><part id="P1"><measure number="1"><note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration></note></measure></part></score-partwise>`;
async function mxl(file, content, main = 'score.musicxml') {
  const zip = new JSZip();
  // Different rootfile order and escaped path verify real manifest parsing.
  zip.file('META-INF/container.xml', `<container><rootfiles><rootfile full-path="ignore.txt" media-type="text/plain"/><rootfile full-path="${main.replace(/&/g, '&amp;')}" media-type="application/vnd.recordare.musicxml+xml"/></rootfiles></container>`);
  zip.file('ignore.txt', 'not a score'); zip.file(main, content);
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer' }));
}
(async () => {
  const lab = fs.mkdtempSync(path.join(LAB, '.teste-importador-'));
  assert(path.relative(LAB, lab).startsWith('.teste-importador-'));
  try {
    const collection = path.join(lab, 'solfejos');
    const group = path.join(collection, '001-010');
    fs.mkdirSync(group, { recursive: true });
    const catalog = path.join(collection, 'catalogo.json');
    const initial = JSON.stringify({ versao: 1, grupos: [{ id: '001-010', titulo: 'Solfejos 1 a 10' }], solfejos: [] }, null, 2) + '\n';
    fs.writeFileSync(catalog, initial);
    const one = path.join(group, 'solfejo001.mxl'), two = path.join(group, 'Solfejo02.mxl'), four = path.join(group, 'Solfejo004.mxl');
    await mxl(one, xml('Um'), 'score & piano.musicxml');
    await mxl(two, xml('Dois')); await mxl(four, xml('Quatro'));
    const originals = [one, two, four].map(file => [file, fs.readFileSync(file)]);
    let result = await importCollection({ lab, check: true });
    assert.deepEqual(result.adicionados, [1, 2, 4]); assert.deepEqual(result.lacunas, [3]);
    assert.equal(fs.readFileSync(catalog, 'utf8'), initial);
    assert(!fs.existsSync(one.replace('.mxl', '.xml')));
    result = await importCollection({ lab });
    assert.equal(result.mxlValidados, 3); assert.equal(result.total, 3);
    assert.equal(fs.readFileSync(one.replace('.mxl', '.xml'), 'utf8'), xml('Um'));
    assert(result.publicar.includes('solfejos/001-010/Solfejo02.mxl'));
    for (const [file, bytes] of originals) assert.deepEqual(fs.readFileSync(file), bytes);
    const catalogData = JSON.parse(fs.readFileSync(catalog, 'utf8'));
    catalogData.solfejos[1].titulo = 'Meu título'; catalogData.solfejos[1].categoria = 'Teste';
    fs.writeFileSync(catalog, JSON.stringify(catalogData, null, 2) + '\n');
    result = await importCollection({ lab });
    assert.equal(result.mxlValidados, 0); assert.equal(result.semReprocessar, 3);
    assert.deepEqual(result.publicar, []);
    assert.equal(JSON.parse(fs.readFileSync(catalog, 'utf8')).solfejos[1].categoria, 'Teste');
    await mxl(two, xml('Dois atualizado'));
    result = await importCollection({ lab });
    assert.deepEqual(result.atualizados, [2]); assert.equal(result.mxlValidados, 1);
    fs.unlinkSync(four.replace('.mxl', '.xml'));
    result = await importCollection({ lab });
    assert.equal(result.mxlValidados, 1); assert(fs.existsSync(four.replace('.mxl', '.xml')));
    fs.writeFileSync(one.replace('.mxl', '.xml'), 'damaged derived XML');
    result = await importCollection({ lab });
    assert.equal(result.mxlValidados, 1); assert.equal(fs.readFileSync(one.replace('.mxl', '.xml'), 'utf8'), xml('Um'));
    const beforeFailure = fs.readFileSync(catalog);
    const invalid = path.join(group, 'Solfejo005.mxl');
    await mxl(invalid, '<score-partwise><broken></score-partwise>');
    await assert.rejects(() => importCollection({ lab }), /Solfejo005/);
    assert.deepEqual(fs.readFileSync(catalog), beforeFailure);
    assert(!fs.existsSync(invalid.replace('.mxl', '.xml')));
    fs.unlinkSync(invalid);
    const duplicate = path.join(group, 'Solfejo1.mxl'); fs.copyFileSync(one, duplicate);
    await assert.rejects(() => importCollection({ lab }), /duplicado|divergente/); fs.unlinkSync(duplicate);
    const misplaced = path.join(group, 'Solfejo011.mxl'); fs.copyFileSync(one, misplaced);
    await assert.rejects(() => importCollection({ lab }), /fora do bloco/); fs.unlinkSync(misplaced);
    const stored = fs.readFileSync(two); fs.unlinkSync(two);
    await assert.rejects(() => importCollection({ lab }), /catalogado ausente/); fs.writeFileSync(two, stored);
    result = await importCollection({ lab, all: true, check: true });
    assert.equal(result.mxlValidados, 3);
    assert.deepEqual(fs.readFileSync(catalog), beforeFailure);
    // The skill is intentionally short and has valid, non-scaffold frontmatter.
    const instructions = fs.readFileSync(path.resolve(__dirname, '../SKILL.md'), 'utf8');
    const frontmatter = /^---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\n---\n/.exec(instructions);
    assert(frontmatter); assert.equal(frontmatter[1], 'importar-solfejos');
    assert(frontmatter[2].length < 1024); assert(!instructions.includes('TODO'));
    console.log('OK: skill e importador; prévia sem gravação; MXL intactos; extração pelo manifesto; incremental sem reprocessamento; alterações e XML ausente; metadados preservados; lacunas; erros sem atualizar catálogo; duplicidade e pasta incorreta; revisão completa.');
  } finally {
    const relative = path.relative(LAB, lab);
    if (!relative.startsWith('.teste-importador-') || relative.includes(path.sep) || !fs.realpathSync(lab).startsWith(fs.realpathSync(LAB) + path.sep)) throw new Error('Limpeza fora da pasta de teste bloqueada.');
    fs.rmSync(lab, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
