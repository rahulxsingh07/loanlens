// Local preview server: serves dist/ with the SAME headers that render.yaml gives Render.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve('dist'), port = process.env.PORT || 8080;
const rules = YAML.parse(fs.readFileSync('render.yaml', 'utf8')).services[0].headers || [];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const match = (pat, url) => (pat.endsWith('/*') ? url.startsWith(pat.slice(0, -1)) : pat === url);

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(root, url === '/' ? 'index.html' : url);
  let status = 200;
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(root, '404.html'); status = 404; }
  const h = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' };
  for (const r of rules) if (match(r.path, url)) h[r.name] = r.value;
  res.writeHead(status, h);
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
