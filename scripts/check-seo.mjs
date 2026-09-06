import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name === 'index.html') pages.push(path);
  }
}
if (!existsSync(dist)) throw new Error('Build dist/ before running SEO checks');
collect(dist);
if (pages.length === 0) throw new Error('No generated HTML pages found');
const siteOrigin = 'https://ohmd.us';
const releaseSource = readFileSync(new URL('../src/data/releases.ts', import.meta.url), 'utf8');
const expectedVersion = releaseSource.match(/const version = '([^']+)'/)?.[1];
if (!expectedVersion) throw new Error('Unable to determine current release version');
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const is404 = page.endsWith('/404.html');
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  if (is404) {
    if (canonical.length !== 0) throw new Error('404 must not emit a canonical URL');
    if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) throw new Error('404 must be noindex');
    if (/hreflang=/.test(html)) throw new Error('404 must not emit hreflang alternates');
    if (html.includes('application/ld+json')) throw new Error('404 must not emit application JSON-LD');
    continue;
  }
  if (canonical.length !== 1) throw new Error(`${page} must contain exactly one canonical URL`);
  if (!canonical[0][1].startsWith(siteOrigin + '/')) throw new Error(`${page} has an off-site canonical URL`);
  if (canonical[0][1] !== siteOrigin + '/' && !canonical[0][1].endsWith('/')) throw new Error(`${page} canonical must use trailing slash policy`);
  if (!/<title>[^<][\s\S]*<\/title>/.test(html)) throw new Error(`${page} is missing a title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) throw new Error(`${page} is missing a description`);
  const lang = html.match(/<html lang="([^"]+)"/);
  if (!lang || !['en', 'zh-CN'].includes(lang[1])) throw new Error(`${page} has invalid locale metadata`);
  const ogLocale = html.match(/property="og:locale" content="([^"]+)"/);
  if (!ogLocale || !['en_US', 'zh_CN'].includes(ogLocale[1])) throw new Error(`${page} has invalid OG locale`);
  for (const hreflang of ['en', 'zh-CN', 'x-default']) {
    if (!new RegExp(`hreflang="${hreflang}"`).test(html)) throw new Error(`${page} is missing ${hreflang} alternate`);
  }
  if (!html.includes('application/ld+json') || !html.includes('SoftwareApplication')) throw new Error(`${page} is missing SoftwareApplication JSON-LD`);
  if (!html.includes(`"softwareVersion":"${expectedVersion}"`)) throw new Error(`${page} has stale SoftwareApplication version`);
}
for (const required of ['robots.txt', 'security.txt', '.well-known/security.txt']) {
  if (!existsSync(join(dist, required))) throw new Error(`Missing generated ${required}`);
}
process.stdout.write(`SEO check passed: ${pages.length} pages have canonical, title, description, locale, alternates, and application metadata.\n`);
