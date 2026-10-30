const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
// Railway (y cualquier hosting) inyecta el puerto por variable de entorno.
const PORT = process.env.PORT || 3100;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.ico': 'image/x-icon',
};

const AUDIO_EXT = ['.mp3', '.m4a', '.aac', '.wav', '.ogg'];
const VIDEO_EXT = ['.mp4', '.mov', '.webm'];

// Busca en la carpeta el primer archivo de audio / video disponible,
// para que agregar la canción sea solo soltarla aquí.
function findMedia() {
  let files = [];
  try { files = fs.readdirSync(ROOT); } catch (_) {}
  const pick = (exts) =>
    files
      .filter((f) => !f.startsWith('.') && exts.includes(path.extname(f).toLowerCase()))
      .sort()[0] || null;
  return {
    audio: pick(AUDIO_EXT),
    video: pick(VIDEO_EXT),
  };
}

// Sirve archivos con soporte de Range (necesario para video/audio en Safari e iOS).
function sendFile(req, res, filePath) {
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (_) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('No encontrado');
  }
  if (!stat.isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('No encontrado');
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  // El HTML nunca se cachea: así cada recarga trae los cambios.
  const cache = ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600';
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        return res.end();
      }
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': cache,
      });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': cache,
  });
  fs.createReadStream(filePath).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/api/media') {
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify(findMedia()));
    }

    if (pathname === '/') pathname = '/index.html';

    // Evita salir de la carpeta del proyecto.
    const filePath = path.join(ROOT, path.normalize(pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Prohibido');
    }

    sendFile(req, res, filePath);
  })
  .listen(PORT, '0.0.0.0', () => {
    const media = findMedia();
    console.log(`Tarjeta lista en el puerto ${PORT}`);
    console.log(`  video: ${media.video || '(ninguno)'}`);
    console.log(`  musica: ${media.audio || '(pendiente: suelta el mp3 en esta carpeta)'}`);
  });
