import { currentRelease } from '../src/data/releases.ts';

const releaseBase = 'https://github.com/Zuixi/oh-my-md/releases/download/v0.0.1';
const display = {
  fileLabel: { en: 'File', zh: '文件' },
  architectureLabel: { en: 'Architecture', zh: '架构' },
  typeLabel: { en: 'Type', zh: '类型' },
  signatureLabel: { en: 'Signature', zh: '签名' },
  signedLabel: { en: 'Signed', zh: '已签名' },
  unsignedLabel: { en: 'Unsigned', zh: '未签名' },
};
const expectedPackages = [
  {
    platform: 'macOS',
    architecture: 'Universal',
    fileType: 'DMG',
    filename: 'oh-my-md_0.0.1_universal.dmg',
    url: `${releaseBase}/oh-my-md_0.0.1_universal.dmg`,
    signed: false,
    availability: 'current',
    downloadLabel: { en: 'Download DMG', zh: '下载 DMG' },
    availabilityLabel: { en: '', zh: '' },
    display,
  },
  {
    platform: 'Windows',
    architecture: 'x64',
    fileType: 'NSIS installer',
    filename: 'oh-my-md_0.0.1_x64-setup.exe',
    url: `${releaseBase}/oh-my-md_0.0.1_x64-setup.exe`,
    signed: false,
    availability: 'recommended',
    downloadLabel: { en: 'Download EXE', zh: '下载 EXE' },
    availabilityLabel: { en: 'Recommended', zh: '推荐' },
    display,
  },
  {
    platform: 'Windows',
    architecture: 'x64',
    fileType: 'MSI installer',
    filename: 'oh-my-md_0.0.1_x64_en-US.msi',
    url: `${releaseBase}/oh-my-md_0.0.1_x64_en-US.msi`,
    signed: false,
    availability: 'manual',
    downloadLabel: { en: 'Download MSI', zh: '下载 MSI' },
    availabilityLabel: { en: 'Managed / manual', zh: '受管理 / 手动' },
    display,
  },
  {
    platform: 'Linux',
    architecture: 'x64',
    fileType: 'AppImage',
    filename: 'oh-my-md_0.0.1_amd64.AppImage',
    url: `${releaseBase}/oh-my-md_0.0.1_amd64.AppImage`,
    signed: false,
    availability: 'current',
    downloadLabel: { en: 'Download AppImage', zh: '下载 AppImage' },
    availabilityLabel: { en: '', zh: '' },
    display,
  },
  {
    platform: 'Linux',
    architecture: 'x64',
    fileType: 'deb',
    filename: 'oh-my-md_0.0.1_amd64.deb',
    url: `${releaseBase}/oh-my-md_0.0.1_amd64.deb`,
    signed: false,
    availability: 'current',
    downloadLabel: { en: 'Download deb', zh: '下载 deb' },
    availabilityLabel: { en: '', zh: '' },
    display,
  },
];

const expected = {
  version: '0.0.1',
  releasedAt: '2026-09-04T16:59:36Z',
  releasePage: 'https://github.com/Zuixi/oh-my-md/releases/tag/v0.0.1',
  checksumUrl: `${releaseBase}/SHA256SUMS.txt`,
  packages: expectedPackages,
};

const actual = JSON.parse(JSON.stringify(currentRelease));
const stringify = (value) => JSON.stringify(value, null, 2);
if (stringify(actual) !== stringify(expected)) {
  throw new Error(`Manifest does not match the exact v0.0.1 release records.\nExpected:\n${stringify(expected)}\nActual:\n${stringify(actual)}`);
}
if (actual.packages.length !== 5) throw new Error('Manifest must contain exactly five install packages');

const urls = [actual.releasePage, actual.checksumUrl, ...actual.packages.map((item) => item.url)];
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !['github.com', 'downloads.ohmd.us'].includes(parsed.hostname)) {
    throw new Error(`Disallowed manifest URL: ${url}`);
  }
}
for (const item of actual.packages) {
  if (item.signed !== false) throw new Error(`Package is not explicitly unsigned: ${item.filename}`);
  if (!item.url.endsWith(`/${item.filename}`)) throw new Error(`URL and filename disagree: ${item.filename}`);
  if (!item.url.includes(`/v${actual.version}/`)) throw new Error(`Package URL is not versioned: ${item.url}`);
  if (!item.filename.includes(actual.version)) throw new Error(`Filename is not versioned: ${item.filename}`);
}
if (!actual.releasePage.endsWith(`/v${actual.version}`)) throw new Error('Release page and version disagree');
if (!actual.checksumUrl.endsWith(`/v${actual.version}/SHA256SUMS.txt`)) throw new Error('Checksum URL and version disagree');

process.stdout.write('Release manifest check passed: typed v0.0.1 data matches all exact package records and URL constraints.\n');
