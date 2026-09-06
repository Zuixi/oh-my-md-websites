export type Language = 'en' | 'zh';

export interface TrustItem {
  label: string;
  value: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  details?: readonly string[];
}

export interface FeatureSectionCopy {
  eyebrow: string;
  title: string;
  intro: string;
  cards: readonly FeatureCard[];
}

export interface PerformanceRow {
  document: string;
  typing: string;
  open: string;
  safeMode?: boolean;
}

export interface PerformanceCopy {
  eyebrow: string;
  title: string;
  intro: string;
  promise: string;
  headers: {
    document: string;
    typing: string;
    open: string;
  };
  rows: readonly PerformanceRow[];
  safeModeMarker: string;
  safeModeFootnote: string;
  methodology: string;
  command: string;
}

export interface CtaCopy {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
}

export interface LocaleCopy {
  title: string;
  description: string;
  hero: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    downloadLabel: string;
    githubLabel: string;
    screenshotAlt: string;
    screenshotCaption: string;
  };
  trust: readonly TrustItem[];
  livePreview: FeatureSectionCopy;
  performance: PerformanceCopy;
  markdown: FeatureSectionCopy;
  localFiles: FeatureSectionCopy;
  platform: FeatureSectionCopy;
  cta: CtaCopy;
  trustAriaLabel: string;
  license: string;
}

export interface SiteCopy {
  en: LocaleCopy;
  zh: LocaleCopy;
}

export const siteUrls = {
  repository: 'https://github.com/Zuixi/oh-my-md',
  release: 'https://github.com/Zuixi/oh-my-md/releases/latest',
  issues: 'https://github.com/Zuixi/oh-my-md/issues',
  discussions: 'https://github.com/Zuixi/oh-my-md/discussions',
  security: 'https://github.com/Zuixi/oh-my-md/security/advisories/new',
  contributing: 'https://github.com/Zuixi/oh-my-md/blob/main/CONTRIBUTING.md',
  readme: 'https://github.com/Zuixi/oh-my-md#readme',
  manual: 'https://github.com/Zuixi/oh-my-md/blob/main/docs/manual-qa.md',
} as const;

export const siteCopy: SiteCopy = {
  en: {
    title: 'oh-my-md — Fast, open-source Markdown editor',
    description: 'A fast, native Markdown editor for large documents, with true Live Preview and Source modes.',
    hero: {
      eyebrow: 'Open source · local-first · built for large documents',
      headline: 'Markdown, without the cloud lock-in.',
      subtitle: 'A fast, native desktop editor with true Live Preview and Source modes. Keep your writing in local files and work at your own pace.',
      downloadLabel: 'Download oh-my-md',
      githubLabel: 'View on GitHub',
      screenshotAlt: 'oh-my-md showing a dark Markdown document with a file tree, outline, rendered KaTeX math, and an inline Mermaid diagram',
      screenshotCaption: 'A real screenshot from the desktop app',
    },
    trust: [
      { label: 'License', value: 'Apache-2.0' },
      { label: 'Platforms', value: 'macOS · Windows · Linux' },
      { label: 'Data', value: 'Local files' },
      { label: 'Account', value: 'Not required' },
    ],
    livePreview: {
      eyebrow: '01 · Editing modes',
      title: 'Write in the document, not beside it.',
      intro: 'Live Preview fades Markdown marks into rendered content as you type. Switch to Source mode whenever you want a plain, precise view of the text.',
      cards: [
        { title: 'True Live Preview', description: 'A readable rendered document without a permanent split pane.' },
        { title: 'Source mode', description: 'Use the familiar Markdown source view when syntax needs your full attention.' },
        { title: 'Focused writing', description: 'Typewriter and Focus modes keep the active line and your ideas in view.' },
      ],
    },
    performance: {
      eyebrow: '02 · Performance',
      title: 'Made for documents that keep growing.',
      intro: 'The editing engine is designed for large Markdown documents, so a long note does not have to become a reason to split your work up.',
      promise: 'Advisory measurements on an M-series machine show typing latency inside the 16 ms frame budget in the benchmarked documents.',
      headers: { document: 'Document', typing: 'Typing p95 (live / source)', open: 'Main-thread open' },
      rows: [
        { document: '10k lines', typing: '5.5 / 2 ms', open: '32 ms' },
        { document: '10 MB · 380k lines', typing: '2.5 / 2 ms', open: '~15 ms', safeMode: true },
        { document: '20 MB · 750k lines', typing: '— / 2 ms', open: '~30 ms' },
      ],
      safeModeMarker: '²',
      safeModeFootnote: 'Safe mode: live rendering is viewport-windowed.',
      methodology: 'Figures come from the built-in advisory benchmark on an M-series machine — run it yourself with',
      command: 'pnpm --filter @omd/engine bench',
    },
    markdown: {
      eyebrow: '03 · Markdown that travels well',
      title: 'From plain text to rich blocks.',
      intro: 'Use familiar Markdown syntax and keep the richer parts of technical writing close at hand.',
      cards: [
        { title: 'CommonMark + GFM', description: 'Tables, task lists, footnotes, and strikethrough work where you expect them.' },
        { title: 'Math and diagrams', description: 'Render KaTeX formulas and Mermaid diagrams in the live document.' },
        { title: 'Code and details', description: 'Shiki syntax highlighting, highlights, and gemoji add clarity without leaving the file.' },
      ],
    },
    localFiles: {
      eyebrow: '04 · Local workspace',
      title: 'Your files stay yours.',
      intro: 'Open a Markdown file or mount a folder workspace. Work with local assets and the tools that make a growing notes folder manageable.',
      cards: [
        { title: 'File tree, search, and outline', description: 'Navigate a folder, find text across Markdown files, and move through headings.' },
        { title: 'Images beside the document', description: 'Paste, drag, or pick an image and keep it in a local assets/ folder beside the file.' },
        { title: 'Recovery and safe saves', description: 'Conflict-safe saving, external-change detection, crash recovery, and session recovery help protect work in progress.' },
      ],
    },
    platform: {
      eyebrow: '05 · One editor, three desktops',
      title: 'A native home for Markdown.',
      intro: 'oh-my-md is built as a lightweight desktop app for macOS, Windows, and Linux, with light and dark themes for the environment you prefer.',
      cards: [
        { title: 'macOS', description: 'Universal package for Apple Silicon and Intel Macs.' },
        { title: 'Windows', description: 'Windows x64 packages include an NSIS installer and MSI option.' },
        { title: 'Linux', description: 'Linux x64 packages include AppImage and deb options.' },
      ],
    },
    cta: {
      eyebrow: 'Open by default',
      title: 'A Markdown editor you can keep simple.',
      description: 'Download the current release, or inspect the source and build it yourself. Apache-2.0 licensed.',
      buttonLabel: 'Choose your platform',
    },
    trustAriaLabel: 'Product facts',
    license: 'Apache-2.0',
  },
  zh: {
    title: 'oh-my-md — 快速、开源的 Markdown 编辑器',
    description: '面向大型文档的快速原生 Markdown 编辑器，支持真正的 Live Preview 与 Source 模式。',
    hero: {
      eyebrow: '开源 · 本地优先 · 为大型文档而生',
      headline: 'Markdown，不被云端锁定。',
      subtitle: '快速的原生桌面编辑器，支持真正的 Live Preview 与 Source 模式。写作保存在本地文件中，按自己的节奏工作。',
      downloadLabel: '下载 oh-my-md',
      githubLabel: '在 GitHub 查看',
      screenshotAlt: 'oh-my-md 深色编辑器界面，展示文件树、大纲、KaTeX 数学公式和 Mermaid 图表',
      screenshotCaption: '真实应用截图',
    },
    trust: [
      { label: '协议', value: 'Apache-2.0' },
      { label: '平台', value: 'macOS · Windows · Linux' },
      { label: '数据', value: '本地文件' },
      { label: '账号', value: '无需账号' },
    ],
    livePreview: {
      eyebrow: '01 · 编辑模式',
      title: '直接在文档中写作，而不是在旁边。',
      intro: 'Live Preview 会在输入时将 Markdown 标记淡化为渲染内容。需要查看纯文本时，随时切换到 Source 模式。',
      cards: [
        { title: '真正的 Live Preview', description: '可读的渲染文档，无需永久分栏。' },
        { title: 'Source 模式', description: '需要专注语法时，使用熟悉、精准的 Markdown 源码视图。' },
        { title: '专注写作', description: '打字机与 Focus 模式让当前行和你的想法保持在视线中。' },
      ],
    },
    performance: {
      eyebrow: '02 · 性能',
      title: '为不断增长的文档而设计。',
      intro: '编辑引擎面向大型 Markdown 文档设计，长篇笔记不必成为拆分工作的理由。',
      promise: 'M 系列机器上的 advisory 测量显示，在参与测试的文档中，输入延迟保持在 16 ms 帧预算以内。',
      headers: { document: '文档', typing: '输入 p95（Live / Source）', open: '主线程打开' },
      rows: [
        { document: '1 万行', typing: '5.5 / 2 ms', open: '32 ms' },
        { document: '10 MB · 38 万行', typing: '2.5 / 2 ms', open: '~15 ms', safeMode: true },
        { document: '20 MB · 75 万行', typing: '— / 2 ms', open: '~30 ms' },
      ],
      safeModeMarker: '²',
      safeModeFootnote: '安全模式：Live 渲染使用视口窗口化。',
      methodology: '数据来自 M 系列机器上的内置 advisory benchmark — 你也可以自行运行',
      command: 'pnpm --filter @omd/engine bench',
    },
    markdown: {
      eyebrow: '03 · 可靠的 Markdown',
      title: '从纯文本到丰富内容块。',
      intro: '使用熟悉的 Markdown 语法，让技术写作需要的丰富内容始终在手边。',
      cards: [
        { title: 'CommonMark + GFM', description: '表格、任务列表、脚注和删除线都在熟悉的位置工作。' },
        { title: '数学公式与图表', description: '在实时文档中渲染 KaTeX 公式和 Mermaid 图表。' },
        { title: '代码与细节', description: 'Shiki 代码高亮、高亮标记和 gemoji 让内容更清晰。' },
      ],
    },
    localFiles: {
      eyebrow: '04 · 本地工作区',
      title: '你的文件始终属于你。',
      intro: '打开 Markdown 文件或挂载文件夹工作区。使用本地资源，以及管理不断增长的笔记文件夹所需的工具。',
      cards: [
        { title: '文件树、搜索与大纲', description: '浏览文件夹、跨 Markdown 文件搜索文本，并通过标题快速移动。' },
        { title: '图片与文档放在一起', description: '粘贴、拖拽或选择图片，将其保存到文档旁的本地 assets/ 文件夹。' },
        { title: '恢复与安全保存', description: '冲突安全保存、外部变更检测、崩溃恢复和会话恢复帮助保护进行中的工作。' },
      ],
    },
    platform: {
      eyebrow: '05 · 三个平台，一个编辑器',
      title: 'Markdown 的原生归处。',
      intro: 'oh-my-md 是面向 macOS、Windows 和 Linux 的轻量桌面应用，并提供适合你工作环境的浅色与深色主题。',
      cards: [
        { title: 'macOS', description: '为 Apple Silicon 和 Intel Mac 提供通用安装包。' },
        { title: 'Windows', description: 'Windows x64 提供 NSIS 安装程序和 MSI 选项。' },
        { title: 'Linux', description: 'Linux x64 提供 AppImage 和 deb 选项。' },
      ],
    },
    cta: {
      eyebrow: '默认开放',
      title: '保持简单的 Markdown 编辑器。',
      description: '下载当前版本，或查看源码并自行构建。采用 Apache-2.0 协议。',
      buttonLabel: '选择你的平台',
    },
    trustAriaLabel: '产品信息',
    license: 'Apache-2.0',
  },
};
