import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

const expectedScripts = {
  dev: 'astro dev --host 0.0.0.0',
  'dev:loopback': 'astro dev --host 127.0.0.1',
};

for (const [name, expected] of Object.entries(expectedScripts)) {
  if (packageJson.scripts?.[name] !== expected) {
    throw new Error(`package.json script ${name} must be exactly: ${expected}`);
  }
}

const requiredPhrases = [
  'http://<LAN-IP>:4321/',
  'LAN IP address',
  'firewall',
  'do not expose it to the public Internet',
  'pnpm dev:loopback',
];

for (const phrase of requiredPhrases) {
  if (!readme.includes(phrase)) {
    throw new Error(`README.md is missing required LAN development guidance: ${phrase}`);
  }
}

process.stdout.write('Development host configuration check passed.\n');
