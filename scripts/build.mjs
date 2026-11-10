// Production build: compiles Tailwind, bundles + minifies JS, hashes file names, writes dist/
import { execSync } from 'node:child_process';
import { build } from 'esbuild';
import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const dist = 'dist', assets = `${dist}/assets`;
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(assets, { recursive: true });
fs.mkdirSync('.build', { recursive: true });
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 10);
const sizes = [];
const note = (name, buf) => sizes.push([name, buf.length, zlib.brotliCompressSync(buf).length]);

// 1) self-hosted font (hashed name)
const fontBuf = fs.readFileSync('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const fontName = `inter-${hash(fontBuf)}.woff2`;
fs.writeFileSync(`${assets}/${fontName}`, fontBuf);

// 2) Tailwind -> one minified CSS file
fs.writeFileSync('.build/styles.in.css', fs.readFileSync('src/styles.css', 'utf8').replaceAll('__FONT__', `/assets/${fontName}`));
execSync('node_modules/.bin/tailwindcss -c tailwind.config.js -i .build/styles.in.css -o .build/styles.css --minify', { stdio: 'inherit' });
const css = fs.readFileSync('.build/styles.css');
const cssName = `styles-${hash(css)}.css`;
fs.writeFileSync(`${assets}/${cssName}`, css);

// 3) JS: app (with GSAP + Motion bundled) and data (separate file so it caches independently)
const r = await build({
  entryPoints: { app: 'src/main.js', data: 'src/data.js' },
  bundle: true, minify: true, format: 'iife', target: ['es2020'], legalComments: 'none',
  outdir: assets, entryNames: '[name]-[hash]', metafile: true, logLevel: 'warning',
});
const out = Object.keys(r.metafile.outputs).map((p) => p.split('/').pop());
const appName = out.find((n) => n.startsWith('app-')), dataName = out.find((n) => n.startsWith('data-'));

// 4) HTML with the hashed file names
const html = fs.readFileSync('src/index.html', 'utf8')
  .replace('<!--CSS-->', `<link rel="preload" href="/assets/${fontName}" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="/assets/${cssName}">`)
  .replace('<!--JS-->', `<script defer src="/assets/${dataName}"></script>\n<script defer src="/assets/${appName}"></script>`);
fs.writeFileSync(`${dist}/index.html`, html);

// 5) static files (404 page, favicon, robots)
for (const f of fs.readdirSync('public')) fs.copyFileSync(`public/${f}`, `${dist}/${f}`);

for (const n of [fontName, cssName, appName, dataName]) note(n, fs.readFileSync(`${assets}/${n}`));
note('index.html', Buffer.from(html));
console.log('\nBuild OK  (size on disk -> brotli-compressed over the network)');
for (const [n, a, b] of sizes) console.log(`  ${n.padEnd(28)} ${(a / 1024).toFixed(1).padStart(7)} KB -> ${(b / 1024).toFixed(1).padStart(6)} KB`);
const tot = sizes.reduce((s, x) => [s[0] + x[1], s[1] + x[2]], [0, 0]);
console.log(`  ${'TOTAL'.padEnd(28)} ${(tot[0] / 1024).toFixed(1).padStart(7)} KB -> ${(tot[1] / 1024).toFixed(1).padStart(6)} KB`);
