#!/usr/bin/env node
/**
 * Local preview matching the GitHub Pages assembly.
 *
 * Run: npm run site
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');
const siteDir = path.resolve(root, 'site');
const publicDir = path.join(root, 'dist', 'public');
const zipPath = path.join(root, 'dist', 'omakase-skill.zip');
const port = Number(process.env.PORT) || 4173;

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.zip': 'application/zip',
};

function resolveFile(base, urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  let file = path.resolve(base, rel || '.');
  const baseRoot = base + path.sep;
  if (file !== base && !file.startsWith(baseRoot)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return null;
  return file;
}

function sendText(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function sendFile(req, res, file, contentType) {
  res.writeHead(200, {
    'Content-Length': fs.statSync(file).size,
    'Content-Type': contentType,
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(file).pipe(res);
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = url.pathname;

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }

    if (pathname === '/omakase-skill.zip') {
      if (!fs.existsSync(zipPath)) {
        sendText(res, 404, 'omakase-skill.zip not found — run npm run build first\n');
        return;
      }
      sendFile(req, res, zipPath, MIME['.zip']);
      return;
    }

    const file = resolveFile(publicDir, pathname) || resolveFile(siteDir, pathname);
    if (!file) {
      sendText(res, 404, 'Not found\n');
      return;
    }

    sendFile(
      req,
      res,
      file,
      MIME[path.extname(file)] || 'application/octet-stream'
    );
  });
}

if (require.main === module) {
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`Omakase site → http://127.0.0.1:${port}`);
    if (!fs.existsSync(zipPath)) {
      console.log('Note: dist/omakase-skill.zip missing — download link 404s until you run npm run build');
    }
  });
}

module.exports = { createServer };
