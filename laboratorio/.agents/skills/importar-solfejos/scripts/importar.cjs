'use strict';
// Ferramenta local Windows/Node; não é carregada pelo site.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const LAB = path.resolve(__dirname, '../../../..');
const JSZip = require(path.join(LAB, 'vendor/jszip-3.10.1.min.js'));
const REVISION = 1;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
function inside(base, file) {
  const relative = path.relative(base, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Caminho fora do laboratório: ${file}`);
  return file;
}
function regular(base, file) {
  inside(base, file);
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) throw new Error(`Link não aceito: ${file}`);
  inside(fs.realpathSync(base), fs.realpathSync(file));
  return stat;
}
function xmlBatch(entries, mode) {
  if (!entries.length) return [];
  const script = `
$ErrorActionPreference='Stop'
[Console]::InputEncoding=[Text.Encoding]::UTF8
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
$items=ConvertFrom-Json -InputObject ([Console]::In.ReadToEnd())
$results=@(foreach($item in $items){
  try {
    $settings=New-Object Xml.XmlReaderSettings
    $settings.DtdProcessing=[Xml.DtdProcessing]::Ignore
    $settings.XmlResolver=$null
    $settings.MaxCharactersInDocument=20971520
    $reader=[Xml.XmlReader]::Create((New-Object IO.StringReader($item.xml)),$settings)
    $doc=New-Object Xml.XmlDocument
    $doc.XmlResolver=$null
    try { $doc.Load($reader) } finally { $reader.Dispose() }
    if('${mode}' -eq 'manifest') {
      if($doc.DocumentElement.LocalName -ne 'container'){ throw 'Manifesto sem container' }
      $roots=@($doc.SelectNodes('//*[local-name()="rootfile"]'))
      $root=$roots | Where-Object { $_.GetAttribute('media-type') -eq 'application/vnd.recordare.musicxml+xml' } | Select-Object -First 1
      if($null -eq $root -and $roots.Count -gt 0){ $root=$roots[0] }
      if($null -eq $root){ throw 'Manifesto sem rootfile' }
      @{arquivo=$item.arquivo;root=$root.GetAttribute('full-path')}
    } else {
      if($doc.DocumentElement.LocalName -ne 'score-partwise'){ throw 'Formato MusicXML não suportado: esperado score-partwise' }
      $parts=@($doc.SelectNodes('/*/*[local-name()="part"]'))
      $measures=@($doc.SelectNodes('/*/*[local-name()="part"]/*[local-name()="measure"]'))
      if($parts.Count -eq 0 -or $measures.Count -eq 0){ throw 'Partitura sem partes ou compassos' }
      @{arquivo=$item.arquivo;partes=$parts.Count;compassos=$measures.Count}
    }
  } catch { @{arquivo=$item.arquivo;erro=$_.Exception.Message} }
})
ConvertTo-Json -InputObject $results -Depth 6 -Compress
`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
    input: JSON.stringify(entries), encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024,
    timeout: 120000
  });
  if (result.error || result.status !== 0) throw new Error(`Validação XML indisponível: ${result.error?.message || result.stderr.trim()}`);
  const reports = JSON.parse(result.stdout.replace(/^\uFEFF/, ''));
  const failures = reports.filter(item => item.erro);
  if (failures.length) throw new Error(failures.map(item => `${item.arquivo}: ${item.erro}`).join('\n'));
  return reports;
}
async function importCollection({ lab = LAB, check = false, all = false } = {}) {
  lab = inside(LAB, path.resolve(lab));
  regular(LAB, lab);
  const base = path.join(lab, 'solfejos');
  regular(lab, base);
  const catalogFile = path.join(base, 'catalogo.json');
  regular(lab, catalogFile);
  const catalog = readJSON(catalogFile);
  if (!Array.isArray(catalog.grupos) || !Array.isArray(catalog.solfejos)) throw new Error('Catálogo sem grupos ou solfejos.');
  const stateFile = inside(lab, path.join(lab, '.agents/skills/importar-solfejos/estado.json'));
  let previous = {};
  if (fs.existsSync(stateFile)) {
    regular(lab, stateFile);
    try { const state = readJSON(stateFile); if (state.versao === REVISION) previous = state.arquivos || {}; }
    catch { /* Estado descartável: revalidar quando estiver corrompido. */ }
  }
  const known = new Map(), ids = new Set(), groups = new Set();
  for (const entry of catalog.solfejos) {
    if (!Number.isInteger(entry.numero) || entry.numero < 1 || entry.numero > 999 || entry.id !== `solfejo${String(entry.numero).padStart(3, '0')}` || known.has(entry.numero) || ids.has(entry.id)) throw new Error('ID ou número inválido/duplicado no catálogo.');
    known.set(entry.numero, entry); ids.add(entry.id);
  }
  const scanned = [], numbers = new Set();
  for (const group of catalog.grupos) {
    const match = /^(\d{3})-(\d{3})$/.exec(group.id);
    if (!match || groups.has(group.id)) throw new Error(`Grupo inválido/duplicado: ${group.id}`);
    groups.add(group.id);
    const first = Number(match[1]), last = Number(match[2]);
    if (first < 1 || first % 10 !== 1 || last !== first + 9) throw new Error(`Bloco deve conter dez números: ${group.id}`);
    const directory = path.join(base, group.id);
    if (!regular(lab, directory).isDirectory()) throw new Error(`Pasta de grupo ausente: ${group.id}`);
    for (const filename of fs.readdirSync(directory).sort()) {
      if (!/\.mxl$/i.test(filename)) continue;
      const name = /^solfejo(\d{1,3})\.mxl$/i.exec(filename);
      if (!name) throw new Error(`Nome MXL não reconhecido: ${group.id}/${filename}`);
      const number = Number(name[1]);
      if (number < first || number > last || numbers.has(number)) throw new Error(`Número duplicado ou fora do bloco: ${group.id}/${filename}`);
      numbers.add(number);
      const relative = `${group.id}/${filename}`, file = path.join(base, relative);
      const stat = regular(lab, file);
      if (!stat.isFile() || stat.size > 20 * 1024 * 1024) throw new Error(`MXL inválido ou maior que 20 MB: ${relative}`);
      const bytes = fs.readFileSync(file), mxlHash = hash(bytes), xmlFile = file.replace(/\.mxl$/i, '.xml');
      let xmlHash = null;
      if (fs.existsSync(xmlFile)) { regular(lab, xmlFile); xmlHash = hash(fs.readFileSync(xmlFile)); }
      const prior = previous[relative], existing = known.get(number);
      if (existing && (existing.arquivo !== relative || existing.grupo !== group.id)) throw new Error(`Caminho divergente no catálogo para ${number}: ${relative}`);
      scanned.push({ number, relative, file, bytes, mxlHash, xmlFile, xmlHash,
        needsValidation: all || !prior || prior.mxl !== mxlHash || prior.xml !== xmlHash || !xmlHash,
        existing, group: group.id });
    }
  }
  for (const [number, entry] of known) if (!numbers.has(number)) throw new Error(`Arquivo catalogado ausente: ${entry.arquivo}`);
  scanned.sort((a, b) => a.number - b.number);
  const changed = scanned.filter(item => item.needsValidation);
  const manifests = [];
  for (const item of changed) {
    try {
      item.zip = await JSZip.loadAsync(item.bytes, { checkCRC32: true });
      const manifest = item.zip.file('META-INF/container.xml');
      if (!manifest) throw new Error('META-INF/container.xml ausente');
      manifests.push({ arquivo: item.relative, xml: await manifest.async('string') });
    } catch (error) { throw new Error(`${item.relative}: ${error.message}`); }
  }
  const roots = new Map(xmlBatch(manifests, 'manifest').map(item => [item.arquivo, item.root]));
  const scores = [];
  for (const item of changed) {
    const root = roots.get(item.relative), entry = root && item.zip.file(root);
    if (!entry) throw new Error(`${item.relative}: documento principal não encontrado no MXL.`);
    item.xml = await entry.async('nodebuffer');
    if (item.xml.length > 20 * 1024 * 1024) throw new Error(`${item.relative}: XML maior que 20 MB.`);
    scores.push({ arquivo: item.relative, xml: item.xml.toString('utf8') });
  }
  xmlBatch(scores, 'score');
  const added = [], updated = [], outputs = [], nextState = {};
  for (const item of scanned) {
    const id = `solfejo${String(item.number).padStart(3, '0')}`;
    if (!item.existing) {
      catalog.solfejos.push({ id, numero: item.number, titulo: `Solfejo ${item.number}`, grupo: item.group, arquivo: item.relative });
      added.push(item.number);
    }
    const finalXmlHash = item.xml ? hash(item.xml) : item.xmlHash;
    if (item.xml && finalXmlHash !== item.xmlHash) outputs.push([item.xmlFile, item.xml]);
    if (item.existing && item.needsValidation && ((previous[item.relative] && previous[item.relative].mxl !== item.mxlHash) || finalXmlHash !== item.xmlHash)) updated.push(item.number);
    nextState[item.relative] = { mxl: item.mxlHash, xml: finalXmlHash };
  }
  catalog.solfejos.sort((a, b) => a.numero - b.numero);
  const catalogText = JSON.stringify(catalog, null, 2) + '\n';
  const catalogChanged = fs.readFileSync(catalogFile, 'utf8') !== catalogText;
  const gaps = [];
  const maximum = scanned.at(-1)?.number || 0;
  for (let number = 1; number <= maximum; number++) if (!numbers.has(number)) gaps.push(number);
  const publish = new Set(outputs.map(([file]) => path.relative(lab, file).split(path.sep).join('/')));
  for (const item of scanned) if (added.includes(item.number) || updated.includes(item.number)) {
    publish.add(`solfejos/${item.relative}`);
    publish.add(`solfejos/${item.relative.replace(/\.mxl$/i, '.xml')}`);
  }
  if (catalogChanged) publish.add('solfejos/catalogo.json');
  // Finish validation of the entire batch before changing derived files.
  for (const item of scanned) if (hash(fs.readFileSync(item.file)) !== item.mxlHash) throw new Error(`MXL mudou durante a importação: ${item.relative}. Execute novamente.`);
  if (!check) {
    for (const [file, bytes] of outputs) fs.writeFileSync(file, bytes);
    if (catalogChanged) fs.writeFileSync(catalogFile, catalogText);
    // This state is disposable and is never sent to the site.
    for (const segment of ['.agents', '.agents/skills', '.agents/skills/importar-solfejos']) {
      const directory = path.join(lab, segment);
      if (fs.existsSync(directory)) regular(lab, directory);
      else fs.mkdirSync(directory);
    }
    fs.writeFileSync(stateFile, JSON.stringify({ versao: REVISION, arquivos: nextState }, null, 2) + '\n');
  }
  return { modo: check ? 'conferência sem gravação' : 'importação', adicionados: added, atualizados: updated,
    total: scanned.length, mxlValidados: changed.length, semReprocessar: scanned.length - changed.length,
    lacunas: gaps, publicar: [...publish].sort() };
}
if (require.main === module) {
  const flags = process.argv.slice(2);
  if (flags.some(flag => !['--check', '--all'].includes(flag))) {
    console.error('Uso: node importar.cjs [--check] [--all]'); process.exitCode = 1;
  } else importCollection({ check: flags.includes('--check'), all: flags.includes('--all') })
    .then(report => console.log(JSON.stringify(report, null, 2)))
    .catch(error => { console.error(`Importação interrompida: ${error.message}`); process.exitCode = 1; });
}
module.exports = { importCollection, xmlBatch, LAB };
