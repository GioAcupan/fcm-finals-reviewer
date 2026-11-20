import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { QUESTIONS } from '../questions.js';
import { validateBank } from '../engine.js';

const errors = validateBank(QUESTIONS);
if (errors.length) throw new Error(errors.join('\n'));
const files = ['index.html','app.js','engine.js','questions.js','cheats.js','tokens.css','styles.css','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png'];
await mkdir('dist/icons', { recursive: true });
const hash = createHash('sha256');
for (const file of files) {
  const content = await readFile(file);
  hash.update(content);
  await copyFile(file, `dist/${file}`);
}
const version = hash.digest('hex').slice(0,12);
const assets = ['./', ...files.map(f => `./${f}`)];
await writeFile('dist/sw.js', `// Generated from the complete app content; do not edit the built file.
const CACHE = 'fcm-reviewer-${version}';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('fcm-reviewer-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    if (request.mode === 'navigate') return (await cache.match('./index.html')) || fetch(request);
    return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
  }));
});
`);
console.log(`Built ${QUESTIONS.length} questions, 10 cheat sheets, and offline cache ${version} → dist/`);
