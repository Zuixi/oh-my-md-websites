import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);
const requiredFiles = ['index.html', 'zh/index.html', 'logo.png', 'hero.png', 'favicon.svg'];
const forbiddenHosts = [
  'pagead2.googlesyndication.com',
  'static.cloudflareinsights.com',
  'fonts.googleapis.com',
];

for (const relativePath of requiredFiles) {
  const path = join(dist.pathname, relativePath);
  if (!existsSync(path)) {
    throw new Error(`Missing generated site file: dist/${relativePath}`);
  }
}

const html = [readFileSync(join(dist.pathname, 'index.html'), 'utf8'), readFileSync(join(dist.pathname, 'zh/index.html'), 'utf8')].join('\n');
for (const forbiddenHost of forbiddenHosts) {
  if (html.includes(forbiddenHost)) {
    throw new Error(`Forbidden third-party host found in generated HTML: ${forbiddenHost}`);
  }
}

process.stdout.write(`Site check passed: ${requiredFiles.length} files present; no forbidden hosts found.\n`);
