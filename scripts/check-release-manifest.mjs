import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/data/releases.ts', import.meta.url), 'utf8');
const required = [
  'oh-my-md_0.0.1_universal.dmg',
  'oh-my-md_0.0.1_x64-setup.exe',
  'oh-my-md_0.0.1_x64_en-US.msi',
  'oh-my-md_0.0.1_amd64.AppImage',
  'oh-my-md_0.0.1_amd64.deb',
  'SHA256SUMS.txt',
];
if (!source.includes("version: '0.0.1'")) throw new Error('Manifest version is not 0.0.1');
for (const filename of required) {
  if (!source.includes(filename)) throw new Error(`Manifest is missing ${filename}`);
}
const urls = [...source.matchAll(/https:\/\/[^'`]+/g)].map(([url]) => url.replace(/\$\{[^}]+\}/g, ''));
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !['github.com', 'downloads.ohmd.us'].includes(parsed.hostname)) throw new Error(`Disallowed manifest URL: ${url}`);
}
if ((source.match(/signed: false/g) ?? []).length < 5 || source.includes('signed: true')) throw new Error('Every package must be marked unsigned');
if (!source.includes('satisfies ReleaseManifest')) throw new Error('Manifest must use the typed ReleaseManifest shape');
process.stdout.write('Release manifest check passed: v0.0.1 has six expected versioned GitHub assets and unsigned package metadata.\n');
