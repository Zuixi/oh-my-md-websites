import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);
const routes = ['download', 'docs', 'privacy', 'support', 'changelog'];
const forbidden = ['AI providers', 'plugin marketplace', 'signed & notarized', 'working updater', '插件市场', 'AI 提供商', '微软商店'];
for (const route of routes) {
  for (const path of [`${route}/index.html`, `zh/${route}/index.html`]) {
    const file = join(dist.pathname, path);
    if (!existsSync(file)) throw new Error(`Missing generated route: ${path}`);
    const html = readFileSync(file, 'utf8').toLowerCase();
    for (const term of forbidden) {
      if (html.includes(term.toLowerCase())) throw new Error(`${path} contains unsupported claim: ${term}`);
    }
  }
}
const download = readFileSync(join(dist.pathname, 'download/index.html'), 'utf8');
for (const filename of ['oh-my-md_0.0.1_universal.dmg', 'oh-my-md_0.0.1_x64-setup.exe', 'oh-my-md_0.0.1_x64_en-US.msi', 'oh-my-md_0.0.1_amd64.AppImage', 'oh-my-md_0.0.1_amd64.deb', 'SHA256SUMS.txt']) {
  if (!download.includes(filename)) throw new Error(`Download page is missing ${filename}`);
}
if (!download.includes('Unsigned release') || !download.includes('v0.0.1')) throw new Error('Download page is missing unsigned/version disclosure');
if (download.includes('microsoft store') || download.includes('no-redirect')) throw new Error('Download page makes an unsupported store-link claim');
process.stdout.write(`Route check passed: ${routes.length * 2} bilingual information routes are generated and content-safe.\n`);
