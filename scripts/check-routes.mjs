import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { currentRelease } from '../src/data/releases.ts';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);
const routes = ['download', 'docs', 'privacy', 'support', 'changelog'];
const forbidden = ['AI providers', 'plugin marketplace', 'signed & notarized', 'working updater', '插件市场', 'AI 提供商', '微软商店'];
const expectedAssets = currentRelease.packages.map((item) => item.filename);
const expectedUrls = currentRelease.packages.map((item) => item.url);

for (const route of routes) {
  for (const path of [`${route}/index.html`, `zh/${route}/index.html`]) {
    const file = join(dist.pathname, path);
    if (!existsSync(file)) throw new Error(`Missing generated route: ${path}`);
    const html = readFileSync(file, 'utf8');
    for (const term of forbidden) {
      if (html.toLowerCase().includes(term.toLowerCase())) throw new Error(`${path} contains unsupported claim: ${term}`);
    }
  }
}

const downloadPages = [
  {
    path: 'download/index.html',
    platformHeadings: ['macOS', 'Windows', 'Linux'],
    unsigned: 'Unsigned release',
    recommended: 'Recommended',
    managed: 'Managed / manual',
    checksum: 'SHA256SUMS.txt',
    release: `v${currentRelease.version} release page`,
    installHeading: 'Installation & First-Run Notes',
    layoutMarker: 'download-layout',
    heroMarker: 'platform-chooser',
    sha256Marker: 'sha256sum <downloaded-file>',
  },
  {
    path: 'zh/download/index.html',
    platformHeadings: ['macOS', 'Windows', 'Linux'],
    unsigned: '未签名版本',
    recommended: '推荐',
    managed: '受管理 / 手动',
    checksum: 'SHA256SUMS.txt',
    release: `v${currentRelease.version} 发布页`,
    installHeading: '安装与首次运行说明',
    layoutMarker: 'download-layout',
    heroMarker: 'platform-chooser',
    sha256Marker: 'sha256sum <downloaded-file>',
  },
];

for (const page of downloadPages) {
  const html = readFileSync(join(dist.pathname, page.path), 'utf8');
  const lower = html.toLowerCase();
  for (const heading of page.platformHeadings) {
    if (!html.includes(heading)) throw new Error(`${page.path} is missing platform heading: ${heading}`);
  }
  for (const asset of expectedAssets) {
    if (!html.includes(asset)) throw new Error(`${page.path} is missing expected asset: ${asset}`);
  }
  for (const url of expectedUrls) {
    if (!html.includes(url)) throw new Error(`${page.path} is missing versioned package URL: ${url}`);
  }
  for (const label of [page.unsigned, page.recommended, page.managed, page.checksum, page.release, page.installHeading, page.layoutMarker, page.heroMarker, page.sha256Marker]) {
    const escaped = label.replace(/&/g, '&amp;');
    if (!html.includes(label) && !html.includes(escaped)) throw new Error(`${page.path} is missing download disclosure, layout marker, or label: ${label}`);
  }
  if (!lower.includes(`v${currentRelease.version}`)) throw new Error(`${page.path} is missing the current version`);
  if (!html.includes(currentRelease.checksumUrl) || !html.includes(currentRelease.releasePage)) {
    throw new Error(`${page.path} is missing exact checksum or release link`);
  }
  if (lower.includes('microsoft store') || lower.includes('no-redirect')) {
    throw new Error(`${page.path} makes an unsupported store-link claim`);
  }
}

process.stdout.write(`Route check passed: ${routes.length * 2} bilingual information routes and both download pages contain exact release data.\n`);
