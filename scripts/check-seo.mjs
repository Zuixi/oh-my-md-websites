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
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  if (canonical.length !== 1) throw new Error(`${page} must contain exactly one canonical URL`);
  if (!canonical[0][1].startsWith(siteOrigin + '/')) throw new Error(`${page} has an off-site canonical URL`);
  if (!/<title>[^<][\s\S]*<\/title>/.test(html)) throw new Error(`${page} is missing a title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) throw new Error(`${page} is missing a description`);
  const lang = html.match(/<html lang="([^"]+)"/);
  if (!lang || !['en', 'zh-CN'].includes(lang[1])) throw new Error(`${page} has invalid locale metadata`);
  for (const hreflang of ['en', 'zh-CN', 'x-default']) {
    if (!new RegExp(`hreflang="${hreflang}"`).test(html)) throw new Error(`${page} is missing ${hreflang} alternate`);
  }
  if (!html.includes('application/ld+json') || !html.includes('SoftwareApplication')) throw new Error(`${page} is missing SoftwareApplication JSON-LD`);
}
for (const required of ['robots.txt', 'security.txt', '.well-known/security.txt']) {
  if (!existsSync(join(dist, required))) throw new Error(`Missing generated ${required}`);
}
process.stdout.write(`SEO check passed: ${pages.length} pages have canonical, title, description, locale, alternates, and application metadata.\n`);
