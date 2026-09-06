export type ReleasePlatform = 'macOS' | 'Windows' | 'Linux';
export type ReleaseArchitecture = 'Universal' | 'x64';
export type ReleaseFileType = 'DMG' | 'NSIS installer' | 'MSI installer' | 'AppImage' | 'deb';
export type ReleaseAvailability = 'current' | 'manual' | 'recommended';

export interface ReleasePackage {
  platform: ReleasePlatform;
  architecture: ReleaseArchitecture;
  fileType: ReleaseFileType;
  filename: string;
  url: string;
  signed: false;
  availability: ReleaseAvailability;
  size?: string;
}

export interface ReleaseManifest {
  version: string;
  releasedAt: string;
  releasePage: string;
  checksumUrl: string;
  packages: readonly ReleasePackage[];
}

const releaseBase = 'https://github.com/Zuixi/oh-my-md/releases/download/v0.0.1';

export const currentRelease = {
  version: '0.0.1',
  releasedAt: '2026-09-04T16:59:36Z',
  releasePage: 'https://github.com/Zuixi/oh-my-md/releases/tag/v0.0.1',
  checksumUrl: `${releaseBase}/SHA256SUMS.txt`,
  packages: [
    {
      platform: 'macOS',
      architecture: 'Universal',
      fileType: 'DMG',
      filename: 'oh-my-md_0.0.1_universal.dmg',
      url: `${releaseBase}/oh-my-md_0.0.1_universal.dmg`,
      signed: false,
      availability: 'current',
    },
    {
      platform: 'Windows',
      architecture: 'x64',
      fileType: 'NSIS installer',
      filename: 'oh-my-md_0.0.1_x64-setup.exe',
      url: `${releaseBase}/oh-my-md_0.0.1_x64-setup.exe`,
      signed: false,
      availability: 'recommended',
    },
    {
      platform: 'Windows',
      architecture: 'x64',
      fileType: 'MSI installer',
      filename: 'oh-my-md_0.0.1_x64_en-US.msi',
      url: `${releaseBase}/oh-my-md_0.0.1_x64_en-US.msi`,
      signed: false,
      availability: 'manual',
    },
    {
      platform: 'Linux',
      architecture: 'x64',
      fileType: 'AppImage',
      filename: 'oh-my-md_0.0.1_amd64.AppImage',
      url: `${releaseBase}/oh-my-md_0.0.1_amd64.AppImage`,
      signed: false,
      availability: 'current',
    },
    {
      platform: 'Linux',
      architecture: 'x64',
      fileType: 'deb',
      filename: 'oh-my-md_0.0.1_amd64.deb',
      url: `${releaseBase}/oh-my-md_0.0.1_amd64.deb`,
      signed: false,
      availability: 'current',
    },
  ],
} satisfies ReleaseManifest;

export const releasePackagesByPlatform: Record<ReleasePlatform, readonly ReleasePackage[]> = {
  macOS: currentRelease.packages.filter((item) => item.platform === 'macOS'),
  Windows: currentRelease.packages.filter((item) => item.platform === 'Windows'),
  Linux: currentRelease.packages.filter((item) => item.platform === 'Linux'),
};
