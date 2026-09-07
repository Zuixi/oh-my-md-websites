import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const forbiddenHosts = ['googlesyndication.com', 'google-analytics.com', 'googletagmanager.com', 'static.cloudflareinsights.com', 'fonts.googleapis.com'];
const forbiddenSchemes = /(?:^|["'(\s])(javascript|data|vbscript):/i;
const secretAssignment = /(?:AWS_SECRET|CLOUDFLARE_API_TOKEN|CF_API_TOKEN|GITHUB_TOKEN|PRIVATE_KEY|SIGNING_KEY)\s*[:=]\s*[^\s#`]+/i;
const unsignedClaims = /signed\s*(?:and|&)\s*notarized|signed\/notarized|code[- ]signed and notarized/i;

function files(directory, predicate) {
  const result = [];
  if (!existsSync(directory)) return result;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.astro') continue;
    if (entry.isDirectory()) result.push(...files(path, predicate));
    else if (predicate(path)) result.push(path);
  }
  return result;
}

const htmlFiles = files(dist, (path) => path.endsWith('.html'));
for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  for (const host of forbiddenHosts) if (html.includes(host)) throw new Error(`Forbidden third-party host in ${path}: ${host}`);
  if (forbiddenSchemes.test(html)) throw new Error(`Unsafe URL scheme in ${path}`);
  if (unsignedClaims.test(html)) throw new Error(`Unsupported signed/notarized claim in ${path}`);
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = match[1];
    const targetBlank = /\btarget\s*=\s*["']_blank["']/i.test(attrs);
    if (targetBlank) {
      const rel = attrs.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1].toLowerCase().split(/\s+/) ?? [];
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) throw new Error(`New-tab link must include noopener and noreferrer in ${path}`);
    }
  }
}
const sourceFiles = files(root, (path) => /\.(astro|mjs|ts|json|yml|yaml|md|txt)$/.test(path));
for (const path of sourceFiles) {
  const text = readFileSync(path, 'utf8');
  if (secretAssignment.test(text) || /BEGIN (?:RSA |EC )?PRIVATE KEY/i.test(text)) throw new Error(`Secret-like material found in ${path}`);
}
const releases = readFileSync(join(root, 'src/data/releases.ts'), 'utf8');
for (const url of releases.matchAll(/https?:\/\/[^'"`\s]+/g)) {
  const parsed = new URL(url[0]);
  if (parsed.protocol !== 'https:' || !['github.com', 'downloads.ohmd.us'].includes(parsed.hostname)) throw new Error(`Unallowlisted release URL: ${url[0]}`);
}
const workflow = join(root, '.github/workflows/validate.yml');
if (existsSync(workflow)) {
  for (const line of readFileSync(workflow, 'utf8').split('\n')) {
    if (/uses:\s*[^#\s]+@/.test(line) && !/@[0-9a-f]{40}\s*(?:#.*)?$/i.test(line)) throw new Error(`Workflow action is not pinned to a full SHA: ${line.trim()}`);
  }
}

const headersFile = join(root, 'public/_headers');
if (!existsSync(headersFile)) {
  throw new Error('Missing public/_headers — required for Cloudflare Pages security headers');
}
const headersText = readFileSync(headersFile, 'utf8');
const requiredHeaderDirectives = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Content-Security-Policy',
  'Permissions-Policy',
];
for (const directive of requiredHeaderDirectives) {
  const matches = headersText.match(new RegExp(`^${directive}:`, 'gmi')) || [];
  if (matches.length < 1) {
    throw new Error(`public/_headers is missing required directive: ${directive}:`);
  }
}
if (/frame-ancestors\s+(?:'[^']*'|"[^"]*"|[^;"\s]+)\s*\*\s*[;\s]?$/im.test(headersText)) {
  throw new Error('public/_headers permits frame-ancestors * (clickjacking risk)');
}
if (/default-src\s+(?:'[^']*'|"[^"]*"|[^;"\s]+)\s*\*\s*[;\s]?$/im.test(headersText)) {
  throw new Error('public/_headers permits default-src * (CSP too permissive)');
}
if (/script-src\s+(?:'[^']*'|"[^"]*"|[^;"\s]+)\s*\*\s*[;\s]?$/im.test(headersText)) {
  throw new Error('public/_headers permits script-src * (CSP too permissive)');
}
process.stdout.write(`Security check passed: ${htmlFiles.length} generated pages and repository safety rules verified.\n`);
