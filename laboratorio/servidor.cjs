// Servidor estático local, sem dependências. Não faz parte do código do navegador.
// Na raiz do repositório: node .\laboratorio\servidor.cjs
'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = __dirname;
const port = Number(process.argv[2] || 8000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mxl': 'application/vnd.recordare.musicxml',
  '.musicxml': 'application/vnd.recordare.musicxml+xml',
  '.xml': 'application/xml; charset=utf-8'
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Informe uma porta entre 1 e 65535. Exemplo: node laboratorio/servidor.cjs 8001');
  process.exit(1);
}

const server = http.createServer(async (request, response) => {
  const reply = (code, text) => {
    response.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(text);
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return reply(405, 'Método não permitido.');
  }
  let filename;
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/laboratorio') {
      response.writeHead(308, { Location: '/laboratorio/' });
      return response.end();
    }
    if (pathname.startsWith('/laboratorio/')) pathname = pathname.slice('/laboratorio'.length);
    filename = path.resolve(root, '.' + pathname);
    if (filename === root) filename = path.join(root, 'index.html');
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.includes(':')) {
      return reply(403, 'Acesso permitido somente à pasta laboratorio.');
    }
  } catch {
    return reply(400, 'Endereço inválido.');
  }
  try {
    // Resolve symbolic links too, keeping the served content inside laboratorio.
    const real = await fs.realpath(filename);
    const relative = path.relative(root, real);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return reply(403, 'Acesso não permitido.');
    const data = await fs.readFile(real);
    response.writeHead(200, {
      'Content-Type': types[path.extname(real).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': path.extname(real).toLowerCase() === '.mp3' ? 'public, max-age=86400' : 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    reply(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500, 'Não foi possível abrir o arquivo solicitado.');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `A porta ${port} está ocupada. Tente: node laboratorio/servidor.cjs ${port + 1}`
    : `Não foi possível iniciar o servidor: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Laboratório disponível em http://127.0.0.1:${port}/laboratorio/`);
  console.log('Abra esse endereço no navegador. Para encerrar, pressione Ctrl+C.');
});
