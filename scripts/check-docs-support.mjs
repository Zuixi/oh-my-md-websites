import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);

const pagesToCheck = [
  {
    path: 'docs/index.html',
    lang: 'en',
    required: ['quick-start', 'modes', 'syntax', 'shortcuts', 'performance', 'troubleshooting', 'docs-toc', 'shortcut-table', '⌘ E'],
  },
  {
    path: 'zh/docs/index.html',
    lang: 'zh',
    required: ['quick-start', 'modes', 'syntax', 'shortcuts', 'performance', 'troubleshooting', 'docs-toc', 'shortcut-table', '切换 Live 预览'],
  },
  {
    path: 'support/index.html',
    lang: 'en',
    required: ['support-channels-grid', 'support-checklist-card', 'support-resources-bar', 'Open GitHub Issues', 'Join Discussions'],
  },
  {
    path: 'zh/support/index.html',
    lang: 'zh',
    required: ['support-channels-grid', 'support-checklist-card', 'support-resources-bar', '前往 GitHub Issues', '进入 Discussions'],
  },
];

for (const page of pagesToCheck) {
  const filePath = join(dist.pathname, page.path);
  if (!existsSync(filePath)) {
    throw new Error(`Missing generated file: ${page.path}`);
  }
  const html = readFileSync(filePath, 'utf8');
  for (const marker of page.required) {
    if (!html.includes(marker)) {
      throw new Error(`${page.path} is missing expected marker or term: ${marker}`);
    }
  }
}

process.stdout.write('Docs and Support hub layout checks passed across all languages.\n');
