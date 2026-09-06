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
const supportPages = [
  { path: 'support/index.html', label: 'current v0.0.1 release', ariaLabel: 'Switch language' },
  { path: 'zh/support/index.html', label: '当前 v0.0.1 发布版本', ariaLabel: '切换语言' },
];
for (const page of supportPages) {
  const supportHtml = readFileSync(join(dist.pathname, page.path), 'utf8');
  if (!supportHtml.includes(`href="https://github.com/Zuixi/oh-my-md/releases/tag/v0.0.1"`)) {
    throw new Error(`${page.path} must link the current release label to the immutable release page`);
  }
  if (supportHtml.includes('releases/latest')) {
    throw new Error(`${page.path} must not use the mutable latest-release URL for the current release label`);
  }
  if (!supportHtml.includes(`class="footer-lang" aria-label="${page.ariaLabel}"`)) {
    throw new Error(`${page.path} is missing the localized language switcher label: ${page.ariaLabel}`);
  }
  if (!supportHtml.includes(page.label)) {
    throw new Error(`${page.path} is missing the localized current release label: ${page.label}`);
  }
}
for (const forbiddenHost of forbiddenHosts) {
  if (html.includes(forbiddenHost)) {
    throw new Error(`Forbidden third-party host found in generated HTML: ${forbiddenHost}`);
  }
}

process.stdout.write(`Site check passed: ${requiredFiles.length} files present; no forbidden hosts found.\n`);
