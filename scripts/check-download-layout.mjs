import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { currentRelease, releaseDisplay, releasePackagesByPlatform } from '../src/data/releases.ts';

const root = new URL('..', import.meta.url);
const dist = new URL('./dist/', root);

const pages = [
  {
    path: 'download/index.html',
    lang: 'en',
    title: `Download oh-my-md ${currentRelease.version}`,
    heroTitle: releaseDisplay.platformHero.title.en,
    installHeading: releaseDisplay.installGuidance.heading.en,
    verifyHeading: releaseDisplay.verifyHeading.en,
    unsignedAria: releaseDisplay.unsignedAriaLabel.en,
    recommendedBadge: releaseDisplay.availabilityLabels.recommended.en,
    trustFact: releaseDisplay.platformHero.trustFacts.openSource.en,
    appImageCmd: `chmod +x ${releasePackagesByPlatform.Linux[0].filename} && ./${releasePackagesByPlatform.Linux[0].filename}`,
    debCmd: `sudo apt install ./${releasePackagesByPlatform.Linux[1].filename}`,
  },
  {
    path: 'zh/download/index.html',
    lang: 'zh',
    title: `下载 oh-my-md ${currentRelease.version}`,
    heroTitle: releaseDisplay.platformHero.title.zh,
    installHeading: releaseDisplay.installGuidance.heading.zh,
    verifyHeading: releaseDisplay.verifyHeading.zh,
    unsignedAria: releaseDisplay.unsignedAriaLabel.zh,
    recommendedBadge: releaseDisplay.availabilityLabels.recommended.zh,
    trustFact: releaseDisplay.platformHero.trustFacts.openSource.zh,
    appImageCmd: `chmod +x ${releasePackagesByPlatform.Linux[0].filename} && ./${releasePackagesByPlatform.Linux[0].filename}`,
    debCmd: `sudo apt install ./${releasePackagesByPlatform.Linux[1].filename}`,
  },
];

for (const page of pages) {
  const filePath = join(dist.pathname, page.path);
  const html = readFileSync(filePath, 'utf8');

  // Structural checks
  const structuralMarkers = [
    ['content-page-wide', 'wide page layout wrapper'],
    ['class="container download-layout"', 'wide container wrapper'],
    ['class="download-hero"', 'hero section'],
    ['class="platform-chooser"', 'platform action card chooser'],
    ['class="platform-panels"', 'secondary/platform package panels'],
    ['class="install-guidance-section"', 'installation guidance section'],
    ['class="verification-section"', 'checksum verification section'],
  ];

  for (const [marker, desc] of structuralMarkers) {
    if (!html.includes(marker)) {
      throw new Error(`${page.path} is missing ${desc} marker: ${marker}`);
    }
  }

  // Required release facts & labels
  const requiredLabels = [
    page.title,
    page.heroTitle,
    page.installHeading,
    page.verifyHeading,
    page.unsignedAria,
    page.recommendedBadge,
    page.trustFact,
    page.appImageCmd,
    page.debCmd,
    currentRelease.checksumUrl,
    currentRelease.releasePage,
  ];

  for (const label of requiredLabels) {
    const escaped = label.replace(/&/g, '&amp;');
    if (!html.includes(label) && !html.includes(escaped)) {
      throw new Error(`${page.path} is missing expected label or fact: ${label}`);
    }
  }

  // Verify all 5 package URLs and filenames appear
  for (const pkg of currentRelease.packages) {
    if (!html.includes(pkg.filename)) {
      throw new Error(`${page.path} is missing package filename: ${pkg.filename}`);
    }
    if (!html.includes(pkg.url)) {
      throw new Error(`${page.path} is missing package URL: ${pkg.url}`);
    }
  }

  // Verify non-download pages remain narrow (by checking docs/index.html)
  const docsPath = page.lang === 'zh' ? 'zh/docs/index.html' : 'docs/index.html';
  const docsHtml = readFileSync(join(dist.pathname, docsPath), 'utf8');
  if (docsHtml.includes('content-page-wide') || docsHtml.includes('download-layout')) {
    throw new Error(`${docsPath} should not have wide layout markers!`);
  }
  if (!docsHtml.includes('content-column')) {
    throw new Error(`${docsPath} must keep narrow content-column`);
  }
}

process.stdout.write(`Download layout check passed: both bilingual download pages contain wide hierarchy, platform chooser, install notes, and verification markers without affecting documentation pages.\n`);
