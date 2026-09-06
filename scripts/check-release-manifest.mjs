import { currentRelease } from '../src/data/releases.ts';

const EXPECTED_VERSION = '0.0.1';
if (currentRelease.version !== EXPECTED_VERSION) {
  throw new Error(`Expected manifest version ${EXPECTED_VERSION}, received ${currentRelease.version}`);
}
const expectedVersion = EXPECTED_VERSION;
const expectedReleaseBase = `https://github.com/Zuixi/oh-my-md/releases/download/v${expectedVersion}`;
const expectedPackages = [
  ['macOS', 'Universal', 'DMG', 'universal.dmg', 'current'],
  ['Windows', 'x64', 'NSIS installer', 'x64-setup.exe', 'recommended'],
  ['Windows', 'x64', 'MSI installer', 'x64_en-US.msi', 'manual'],
  ['Linux', 'x64', 'AppImage', 'amd64.AppImage', 'current'],
  ['Linux', 'x64', 'deb', 'amd64.deb', 'current'],
].map(([platform, architecture, fileType, suffix, availability]) => {
  const filename = `oh-my-md_${expectedVersion}_${suffix}`;
  return { platform, architecture, fileType, filename, url: `${expectedReleaseBase}/${filename}`, signed: false, availability };
});

const actualPackages = currentRelease.packages.map(({ platform, architecture, fileType, filename, url, signed, availability }) => ({
  platform,
  architecture,
  fileType,
  filename,
  url,
  signed,
  availability,
}));
const stringify = (value) => JSON.stringify(value, null, 2);
const expected = {
  version: expectedVersion,
  releasedAt: '2026-09-04T16:59:36Z',
  releasePage: `https://github.com/Zuixi/oh-my-md/releases/tag/v${expectedVersion}`,
  checksumUrl: `${expectedReleaseBase}/SHA256SUMS.txt`,
  packages: expectedPackages,
};
const actual = {
  version: currentRelease.version,
  releasedAt: currentRelease.releasedAt,
  releasePage: currentRelease.releasePage,
  checksumUrl: currentRelease.checksumUrl,
  packages: actualPackages,
};
if (stringify(actual) !== stringify(expected)) {
  throw new Error(`Manifest does not match the exact v${expectedVersion} release records.\nExpected:\n${stringify(expected)}\nActual:\n${stringify(actual)}`);
}

const urls = [currentRelease.releasePage, currentRelease.checksumUrl, ...currentRelease.packages.map((item) => item.url)];
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !['github.com', 'downloads.ohmd.us'].includes(parsed.hostname)) {
    throw new Error(`Disallowed manifest URL: ${url}`);
  }
}
for (const item of currentRelease.packages) {
  if (item.signed !== false) throw new Error(`Package is not explicitly unsigned: ${item.filename}`);
  if (!item.url.endsWith(`/${item.filename}`)) throw new Error(`URL and filename disagree: ${item.filename}`);
  if (!item.url.includes(`/v${currentRelease.version}/`)) throw new Error(`Package URL is not versioned: ${item.url}`);
  if (!item.filename.includes(currentRelease.version)) throw new Error(`Filename is not versioned: ${item.filename}`);
}
if (!currentRelease.releasePage.endsWith(`/v${currentRelease.version}`)) throw new Error('Release page and version disagree');
if (!currentRelease.checksumUrl.endsWith(`/v${currentRelease.version}/SHA256SUMS.txt`)) throw new Error('Checksum URL and version disagree');

process.stdout.write(`Release manifest check passed: typed v${currentRelease.version} data matches exact package records and URL constraints.\n`);
