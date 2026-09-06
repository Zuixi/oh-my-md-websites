export type ReleasePlatform = 'macOS' | 'Windows' | 'Linux';
export type ReleaseArchitecture = 'Universal' | 'x64';
export type ReleaseFileType = 'DMG' | 'NSIS installer' | 'MSI installer' | 'AppImage' | 'deb';
export type ReleaseAvailability = 'current' | 'manual' | 'recommended';
export type LocalizedText = { en: string; zh: string };

export interface ReleaseDisplay {
  downloadLabels: Record<ReleaseFileType, LocalizedText>;
  availabilityLabels: Record<ReleaseAvailability, LocalizedText>;
  metadataLabels: {
    file: LocalizedText;
    architecture: LocalizedText;
    type: LocalizedText;
    signature: LocalizedText;
    signed: LocalizedText;
    unsigned: LocalizedText;
  };
  allReleases: LocalizedText;
  copyCommand: LocalizedText;
  copiedCommand: LocalizedText;
  copyUnavailable: LocalizedText;
  changelogDescription: (version: string) => LocalizedText;
  updateNotice: (version: string) => LocalizedText;
  supportReleaseLabel: (version: string) => LocalizedText;
  releasePageDescription: (version: string) => LocalizedText;
}

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

const version = '0.0.1';
const releaseBase = `https://github.com/Zuixi/oh-my-md/releases/download/v${version}`;

export const releaseDisplay = {
  downloadLabels: {
    DMG: { en: 'Download DMG', zh: '下载 DMG' },
    'NSIS installer': { en: 'Download EXE', zh: '下载 EXE' },
    'MSI installer': { en: 'Download MSI', zh: '下载 MSI' },
    AppImage: { en: 'Download AppImage', zh: '下载 AppImage' },
    deb: { en: 'Download deb', zh: '下载 deb' },
  },
  availabilityLabels: {
    current: { en: '', zh: '' },
    recommended: { en: 'Recommended', zh: '推荐' },
    manual: { en: 'Managed / manual', zh: '受管理 / 手动' },
  },
  metadataLabels: {
    file: { en: 'File', zh: '文件' },
    architecture: { en: 'Architecture', zh: '架构' },
    type: { en: 'Type', zh: '类型' },
    signature: { en: 'Signature', zh: '签名' },
    signed: { en: 'Signed', zh: '已签名' },
    unsigned: { en: 'Unsigned', zh: '未签名' },
  },
  allReleases: { en: 'Open all releases on GitHub', zh: '在 GitHub 查看全部版本' },
  copyCommand: { en: 'Copy command', zh: '复制命令' },
  copiedCommand: { en: 'Copied', zh: '已复制' },
  copyUnavailable: { en: 'Copy unavailable; select the command below', zh: '无法复制，请选择下方命令' },
  changelogDescription: (releaseVersion) => ({
    en: `Release notes for oh-my-md version ${releaseVersion}.`,
    zh: `oh-my-md ${releaseVersion} 版本更新说明。`,
  }),
  updateNotice: (releaseVersion) => ({
    en: `This ${releaseVersion} release does not claim a working in-app updater.`,
    zh: `首个 ${releaseVersion} 版本不声称提供可用的应用内更新器。`,
  }),
  supportReleaseLabel: (releaseVersion) => ({
    en: `current v${releaseVersion} release`,
    zh: `当前 v${releaseVersion} 发布版本`,
  }),
  releasePageDescription: (releaseVersion) => ({
    en: `The current public release is v${releaseVersion}.`,
    zh: `当前公开版本为 v${releaseVersion}。`,
  }),
} satisfies ReleaseDisplay;

const packageRecord = (
  platform: ReleasePlatform,
  architecture: ReleaseArchitecture,
  fileType: ReleaseFileType,
  filename: string,
  availability: ReleaseAvailability,
): ReleasePackage => ({
  platform,
  architecture,
  fileType,
  filename,
  url: `${releaseBase}/${filename}`,
  signed: false,
  availability,
});

export const currentRelease = {
  version,
  releasedAt: '2026-09-04T16:59:36Z',
  releasePage: `https://github.com/Zuixi/oh-my-md/releases/tag/v${version}`,
  checksumUrl: `${releaseBase}/SHA256SUMS.txt`,
  packages: [
    packageRecord('macOS', 'Universal', 'DMG', `oh-my-md_${version}_universal.dmg`, 'current'),
    packageRecord('Windows', 'x64', 'NSIS installer', `oh-my-md_${version}_x64-setup.exe`, 'recommended'),
    packageRecord('Windows', 'x64', 'MSI installer', `oh-my-md_${version}_x64_en-US.msi`, 'manual'),
    packageRecord('Linux', 'x64', 'AppImage', `oh-my-md_${version}_amd64.AppImage`, 'current'),
    packageRecord('Linux', 'x64', 'deb', `oh-my-md_${version}_amd64.deb`, 'current'),
  ],
} satisfies ReleaseManifest;

export const releasePackagesByPlatform: Record<ReleasePlatform, readonly ReleasePackage[]> = {
  macOS: currentRelease.packages.filter((item) => item.platform === 'macOS'),
  Windows: currentRelease.packages.filter((item) => item.platform === 'Windows'),
  Linux: currentRelease.packages.filter((item) => item.platform === 'Linux'),
};
