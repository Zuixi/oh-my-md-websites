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
  commandLabels: {
    unix: LocalizedText;
    windows: LocalizedText;
  };
  copyOnlyNotice: LocalizedText;
  changelogDescription: (version: string) => LocalizedText;
  changelogIntro: (version: string, releasedAt: string) => LocalizedText;
  changelogFeatures: readonly LocalizedText[];
  changelogReleaseLinkLabel: (version: string) => LocalizedText;
  updateNotice: (version: string) => LocalizedText;
  supportReleaseLabel: (version: string) => LocalizedText;
  platformHero: {
    title: LocalizedText;
    statement: LocalizedText;
    trustFacts: {
      openSource: LocalizedText;
      localFiles: LocalizedText;
      noAccount: LocalizedText;
      unsignedHonesty: LocalizedText;
    };
    platformCards: Record<ReleasePlatform, {
      title: LocalizedText;
      actionText: LocalizedText;
      description: LocalizedText;
    }>;
  };
  installGuidance: {
    heading: LocalizedText;
    macOS: {
      title: LocalizedText;
      description: LocalizedText;
      note: LocalizedText;
    };
    windows: {
      title: LocalizedText;
      description: LocalizedText;
      warning: LocalizedText;
    };
    linux: {
      title: LocalizedText;
      description: LocalizedText;
      appImageLabel: LocalizedText;
      debLabel: LocalizedText;
    };
  };
  verification: {
    heading: LocalizedText;
    description: LocalizedText;
    commandLabels: {
      linuxSha: LocalizedText;
      macSha: LocalizedText;
      windowsSha: LocalizedText;
    };
    immutableReleaseLabel: (version: string) => LocalizedText;
    viewAllReleasesLabel: LocalizedText;
    changelogLinkLabel: (version: string) => LocalizedText;
  };
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
  changelogFeatures: [
    { en: 'Initial public desktop release for macOS, Windows, and Linux.', zh: '面向 macOS、Windows 和 Linux 的首个公开桌面版本。' },
    { en: 'Live Preview and Source modes for local Markdown writing.', zh: '用于本地 Markdown 写作的 Live Preview 与 Source 模式。' },
    { en: 'CommonMark and GFM support with math, diagrams, and syntax-highlighted code.', zh: '支持 CommonMark 与 GFM，并提供数学公式、图表和代码高亮。' },
    { en: 'Local workspace tools including files, search, outline, and tabs.', zh: '提供本地工作区文件、搜索、大纲和标签页工具。' },
  ],
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
  platformHero: {
    title: {
      en: 'Download oh-my-md for desktop',
      zh: '下载 oh-my-md 桌面端',
    },
    statement: {
      en: 'A fast, native-feeling Markdown editor for local files. Choose your platform below.',
      zh: '专为本地文件打造的快速、原生质感 Markdown 编辑器。在下方选择你的平台。',
    },
    trustFacts: {
      openSource: {
        en: 'Apache-2.0 open source',
        zh: 'Apache-2.0 开源协议',
      },
      localFiles: {
        en: '100% local files',
        zh: '100% 本地文件',
      },
      noAccount: {
        en: 'No account required',
        zh: '无需注册账号',
      },
      unsignedHonesty: {
        en: 'Unsigned community builds',
        zh: '未签名社区构建',
      },
    },
    platformCards: {
      macOS: {
        title: { en: 'macOS', zh: 'macOS' },
        actionText: { en: 'Download DMG (Universal)', zh: '下载 DMG（Universal）' },
        description: {
          en: 'Apple Silicon and Intel Macs (macOS 11+)',
          zh: '适用于 Apple Silicon 与 Intel Mac（macOS 11+）',
        },
      },
      Windows: {
        title: { en: 'Windows', zh: 'Windows' },
        actionText: { en: 'Download EXE (x64 NSIS)', zh: '下载 EXE（x64 NSIS）' },
        description: {
          en: '64-bit Windows 10 and 11 installer',
          zh: '适用于 64 位 Windows 10 与 11 安装包',
        },
      },
      Linux: {
        title: { en: 'Linux', zh: 'Linux' },
        actionText: { en: 'Download AppImage (x64)', zh: '下载 AppImage（x64）' },
        description: {
          en: 'Portable executable for 64-bit Linux distributions',
          zh: '适用于主流 64 位 Linux 发行版的便携执行文件',
        },
      },
    },
  },
  installGuidance: {
    heading: {
      en: 'Installation & First-Run Notes',
      zh: '安装与首次运行说明',
    },
    macOS: {
      title: { en: 'macOS installation', zh: 'macOS 安装说明' },
      description: {
        en: 'Open the DMG and drag oh-my-md to Applications.',
        zh: '打开 DMG 镜像并将 oh-my-md 拖入 Applications（应用程序）文件夹。',
      },
      note: {
        en: 'Because these initial community builds are unsigned, macOS Gatekeeper may block the first launch. Right-click (or Control-click) oh-my-md in Applications and select "Open", or run xattr -cr /Applications/oh-my-md.app if prompted.',
        zh: '由于首个社区版本尚未进行 Apple 开发者公证，macOS Gatekeeper 可能会阻止首次打开。请在“应用程序”中右键（或按住 Control 点击）oh-my-md 并选择“打开”，或在终端执行 xattr -cr /Applications/oh-my-md.app。',
      },
    },
    windows: {
      title: { en: 'Windows installation', zh: 'Windows 安装说明' },
      description: {
        en: 'Run the setup installer. NSIS is recommended for personal desktops; MSI is available for enterprise or managed policies.',
        zh: '运行安装程序。个人电脑推荐使用 NSIS 安装包；受管理或企业环境可选用 MSI 安装包。',
      },
      warning: {
        en: 'Microsoft Defender SmartScreen may display "Windows protected your PC" because the installer is not yet code-signed. Click "More info" followed by "Run anyway" after verifying the checksum.',
        zh: '由于安装包尚未进行代码签名，Windows Defender SmartScreen 可能会提示“已保护你的电脑”。在核对校验和确认无误后，点击“更多信息”并选择“仍要运行”。',
      },
    },
    linux: {
      title: { en: 'Linux installation', zh: 'Linux 安装说明' },
      description: {
        en: 'Download the AppImage or Debian package according to your distribution.',
        zh: '根据你的 Linux 发行版选择下载 AppImage 或 Debian 安装包。',
      },
      appImageLabel: {
        en: 'Make AppImage executable and run',
        zh: '赋予 AppImage 执行权限并运行',
      },
      debLabel: {
        en: 'Install Debian / Ubuntu package',
        zh: '安装 Debian / Ubuntu 软件包',
      },
    },
  },
  verification: {
    heading: {
      en: 'Verify Checksums & Authoritative Release',
      zh: '校验和与官方发布页',
    },
    description: {
      en: 'Every release artifact is published with an authoritative SHA256 checksum in SHA256SUMS.txt. Verify your download against the official digest before execution.',
      zh: '每次发布的所有安装包均在 SHA256SUMS.txt 中提供权威的 SHA256 校验和。请在运行前校验安装包散列值。',
    },
    commandLabels: {
      linuxSha: {
        en: 'Linux (sha256sum)',
        zh: 'Linux（sha256sum）',
      },
      macSha: {
        en: 'macOS (shasum)',
        zh: 'macOS（shasum）',
      },
      windowsSha: {
        en: 'Windows PowerShell (Get-FileHash)',
        zh: 'Windows PowerShell（Get-FileHash）',
      },
    },
    immutableReleaseLabel: (releaseVersion) => ({
      en: `View immutable v${releaseVersion} release on GitHub`,
      zh: `在 GitHub 查看不可变的 v${releaseVersion} 发布记录`,
    }),
    viewAllReleasesLabel: {
      en: 'All GitHub releases',
      zh: '查看所有 GitHub 发布版本',
    },
    changelogLinkLabel: (releaseVersion) => ({
      en: `Read v${releaseVersion} changelog notes`,
      zh: `阅读 v${releaseVersion} 更新说明`,
    }),
  },
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
