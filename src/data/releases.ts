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
  downloadDescription: (version: string) => LocalizedText;
  currentReleaseLabel: (version: string) => LocalizedText;
  authoritativeSource: LocalizedText;
  unsignedNotice: (version: string) => LocalizedText;
  unsignedLabel: LocalizedText;
  unsignedAriaLabel: LocalizedText;
  windowsGuidance: LocalizedText;
  msiNote: LocalizedText;
  verifyHeading: LocalizedText;
  verificationInstructions: LocalizedText;
  checksumLinkLabel: LocalizedText;
  releasePageLinkLabel: (version: string) => LocalizedText;
  releasePageLabel: LocalizedText;
  commandLabels: {
    unix: LocalizedText;
    windows: LocalizedText;
  };
  copyOnlyNotice: LocalizedText;
  changelogDescription: (version: string) => LocalizedText;
  changelogIntro: (version: string, releasedAt: string) => LocalizedText;
  changelogReleaseLinkLabel: (version: string) => LocalizedText;
  updateNotice: (version: string) => LocalizedText;
  supportReleaseLabel: (version: string) => LocalizedText;
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
  downloadDescription: (releaseVersion) => ({
    en: `Download the current oh-my-md ${releaseVersion} desktop release for macOS, Windows, or Linux.`,
    zh: `下载适用于 macOS、Windows 或 Linux 的当前 oh-my-md ${releaseVersion} 桌面版本。`,
  }),
  currentReleaseLabel: (releaseVersion) => ({
    en: `Current release · ${releaseVersion}`,
    zh: `当前版本 · ${releaseVersion}`,
  }),
  authoritativeSource: {
    en: 'The release page is the authoritative source for this version and its files.',
    zh: '当前版本及其文件以发布页为准。',
  },
  unsignedNotice: (releaseVersion) => ({
    en: `These ${releaseVersion} packages are not code-signed or notarized. Your operating system may show a warning; verify the checksum and review the source before installing.`,
    zh: `${releaseVersion} 安装包尚未完成代码签名或公证。操作系统可能显示警告；请在安装前核对校验和并查看源码。`,
  }),
  unsignedAriaLabel: { en: 'Unsigned release warning', zh: '未签名版本提示' },
  windowsGuidance: {
    en: 'NSIS is the recommended option for most users. MSI is provided for managed environments and manual installation.',
    zh: 'NSIS 适合大多数用户，推荐优先选择。MSI 适用于受管理环境和手动安装。',
  },
  msiNote: {
    en: 'Use this package when your environment requires MSI.',
    zh: '当你的环境要求 MSI 时选择此安装包。',
  },
  verifyHeading: { en: 'Verify and install', zh: '校验与安装' },
  verificationInstructions: {
    en: 'and compare the package checksum before opening it. You can also inspect the',
    zh: '，打开安装包前比对校验和。你也可以查看',
  },
  checksumLinkLabel: { en: 'SHA256SUMS.txt', zh: 'SHA256SUMS.txt' },
  unsignedLabel: { en: 'Unsigned release:', zh: '未签名版本：' },
  releasePageLinkLabel: (releaseVersion) => ({
    en: `v${releaseVersion} release page`,
    zh: `v${releaseVersion} 发布页`,
  }),
  releasePageLabel: { en: 'release page', zh: '发布页' },
  commandLabels: {
    unix: { en: 'Optional macOS / Linux convenience command', zh: '可选的 macOS / Linux 便捷命令' },
    windows: { en: 'Optional Windows PowerShell convenience command', zh: '可选的 Windows PowerShell 便捷命令' },
  },
  copyOnlyNotice: {
    en: 'These are copy-only checksum commands. They are not remote installers and this website never executes them.',
    zh: '这些是仅供复制的校验和命令，不是远程安装程序；本网站不会执行它们。',
  },
  changelogDescription: (releaseVersion) => ({
    en: `Release notes for oh-my-md version ${releaseVersion}.`,
    zh: `oh-my-md ${releaseVersion} 版本更新说明。`,
  }),
  changelogIntro: (releaseVersion, releasedAt) => ({
    en: `The current public release is v${releaseVersion}, published on ${releasedAt}.`,
    zh: `当前公开版本为 v${releaseVersion}，发布日期为 ${releasedAt}。`,
  }),
  changelogReleaseLinkLabel: (releaseVersion) => ({
    en: `Read the v${releaseVersion} release on GitHub`,
    zh: `在 GitHub 阅读 v${releaseVersion} 发布说明`,
  }),
  updateNotice: (releaseVersion) => ({
    en: `This ${releaseVersion} release does not claim a working in-app updater.`,
    zh: `首个 ${releaseVersion} 版本不声称提供可用的应用内更新器。`,
  }),
  supportReleaseLabel: (releaseVersion) => ({
    en: `current v${releaseVersion} release`,
    zh: `当前 v${releaseVersion} 发布版本`,
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
