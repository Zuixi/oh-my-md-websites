export type ReleasePlatform = 'macOS' | 'Windows' | 'Linux';
export type ReleaseArchitecture = 'Universal' | 'x64';
export type ReleaseFileType = 'DMG' | 'NSIS installer' | 'MSI installer' | 'AppImage' | 'deb';
export type ReleaseAvailability = 'current' | 'manual' | 'recommended';
export type LocalizedText = { en: string; zh: string };

export interface ReleasePackage {
  platform: ReleasePlatform;
  architecture: ReleaseArchitecture;
  fileType: ReleaseFileType;
  filename: string;
  url: string;
  signed: false;
  availability: ReleaseAvailability;
  downloadLabel: LocalizedText;
  availabilityLabel: LocalizedText;
  display: {
    fileLabel: LocalizedText;
    architectureLabel: LocalizedText;
    typeLabel: LocalizedText;
    signatureLabel: LocalizedText;
    signedLabel: LocalizedText;
    unsignedLabel: LocalizedText;
  };
  optional?: LocalizedText;
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
const packageDisplay = {
  fileLabel: { en: 'File', zh: '文件' },
  architectureLabel: { en: 'Architecture', zh: '架构' },
  typeLabel: { en: 'Type', zh: '类型' },
  signatureLabel: { en: 'Signature', zh: '签名' },
  signedLabel: { en: 'Signed', zh: '已签名' },
  unsignedLabel: { en: 'Unsigned', zh: '未签名' },
} satisfies ReleasePackage['display'];

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
      downloadLabel: { en: 'Download DMG', zh: '下载 DMG' },
      availabilityLabel: { en: '', zh: '' },
      display: packageDisplay,
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
      display: packageDisplay,
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
      display: packageDisplay,
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
      display: packageDisplay,
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
      display: packageDisplay,
    },
  ],
} satisfies ReleaseManifest;

export const releasePackagesByPlatform: Record<ReleasePlatform, readonly ReleasePackage[]> = {
  macOS: currentRelease.packages.filter((item) => item.platform === 'macOS'),
  Windows: currentRelease.packages.filter((item) => item.platform === 'Windows'),
  Linux: currentRelease.packages.filter((item) => item.platform === 'Linux'),
};
