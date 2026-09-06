import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);
const pages = [
  {
    path: 'index.html',
    headline: 'A fast Markdown editor that keeps your files on your disk.',
    headlineNeedle: 'A fast Markdown editor that keeps your files on your disk',
    download: '/download',
  },
  {
    path: 'zh/index.html',
    headline: '一款快到让你忘掉的 Markdown 编辑器，文件始终留在你的硬盘上。',
    headlineNeedle: '一款快到让你忘掉的 Markdown 编辑器',
    download: '/zh/download',
  },
];
const github = 'https://github.com/Zuixi/oh-my-md';
const forbidden = ['AI providers', 'plugin marketplace', 'signed & notarized', 'working updater', '插件市场', 'AI 提供商'];

for (const page of pages) {
  const html = readFileSync(join(dist.pathname, page.path), 'utf8');
  const checks = [
    [page.headlineNeedle, 'headline'],
    ['/hero.png', 'hero screenshot asset'],
    [page.download, 'download link'],
    [github, 'GitHub repository link'],
    ['Apache-2.0', 'Apache-2.0 license'],
    [page.path === 'index.html' ? 'local' : '本地', 'local-first/local files language'],
    [page.path === 'index.html' ? 'account' : '账号', 'no-account language'],
  ];
  for (const [needle, label] of checks) {
    if (!html.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`${page.path} is missing ${label}: ${needle}`);
    }
  }
  for (const term of forbidden) {
    if (html.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`${page.path} contains unshipped claim: ${term}`);
    }
  }
  const normalized = html.toLowerCase();
  if (!normalized.includes('advisory') || (!html.includes('M-series') && !html.includes('M 系列'))) {
    throw new Error(`${page.path} is missing the advisory M-series benchmark caveat`);
  }
}

process.stdout.write(`Homepage check passed: ${pages.length} bilingual pages contain required product facts and no unshipped claims.\n`);
