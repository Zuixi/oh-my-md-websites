# oh-my-md 官网设计

## 目标

为 `oh-my-md` 建立一个独立、静态优先、可部署到 Cloudflare Pages 的产品官网，正式域名为 `ohmd.us`。官网承担产品理解、可信下载、基础文档、隐私说明和支持入口，不承担桌面应用逻辑或用户数据服务。

## 产品定位

> 一个面向大型 Markdown 文档的开源、快速、原生桌面编辑器。

官网应突出已经交付且可验证的能力：

- 真正的 Live Preview 与 Source 模式切换；
- CommonMark + GFM；
- KaTeX、Mermaid、代码高亮和表格等富内容块；
- 文件树、全局搜索、大纲、多标签页；
- 本地图片、冲突安全保存、崩溃与会话恢复；
- macOS、Windows、Linux 桌面支持；
- Apache-2.0 开源、本地文件、无需账号。

性能数字只能引用 README 中的 advisory benchmark，并说明测试方法与硬件背景。未交付的 AI、插件、同步和应用内更新不可作为当前功能承诺。当前 `0.0.1` 安装包未完成代码签名，页面必须如实提示。

## 用户和成功标准

主要用户是寻找轻量、开源、无云锁定 Markdown 编辑器的写作者、开发者和技术文档维护者。用户打开首页后应能在 30 秒内理解产品、看到真实截图、选择平台并找到下载入口。

成功标准：

1. 首页明确回答“这是什么、为什么值得使用、如何下载”；
2. 下载页展示准确的版本、架构、文件类型、校验和入口和签名状态；
3. 英文和简体中文页面均可用；
4. 关键内容不依赖 JavaScript 或运行时 API；
5. 网站不收集官网自建遥测、不提供账号、不接收用户上传、不加载广告；
6. 网站源码可以公开，生产密钥和写权限不进入仓库；
7. 可由 Cloudflare Pages 直接构建部署到 `ohmd.us`。

## 信息架构

- `/`、`/zh/`：双语首页；
- `/download`、`/zh/download`：平台下载、版本、架构、文件类型、校验和、未签名说明和安装指引；
- `/docs`、`/zh/docs`：快速开始、编辑模式、Markdown 能力、平台说明和 FAQ；
- `/privacy`、`/zh/privacy`：本地优先、无账号、官网无自建遥测、下载/更新访问行为；
- `/support`、`/zh/support`：GitHub Issues、Discussions、贡献和安全报告；
- `/changelog`、`/zh/changelog`：当前版本 `0.0.1` 的发布说明并链接 GitHub Release。

## 技术和部署

- 独立 GitHub repository：`Zuixi/oh-my-md-website`；
- Astro + TypeScript，静态输出；
- Cloudflare Pages 托管官网；
- 当前下载按钮指向版本化 GitHub Release 资产；
- 未来下载资产可迁移到 `https://downloads.ohmd.us/<platform>/<arch>/<version>/<file>`，页面组件不应绑定具体存储厂商；
- 第一版不创建 Cloudflare Pages Function、D1、R2 上传工作流或数据库；
- 不在官网中复制桌面应用的 React/Tauri 代码。

## 视觉方向

网站采用安静、专业、工具感的视觉：深色 Hero、明亮内容区、深色性能/代码区、明亮下载区，低饱和蓝紫或青绿色强调色。Hero 使用主仓库 `docs/images/logo.png` 和 `docs/images/hero.png` 的真实产品素材。使用原生 CSS tokens 和系统字体，不引入 Tailwind、组件库、Google Fonts、AdSense、外部 analytics 或非必要 CDN。

页面必须响应式、可键盘导航、具有清晰焦点态，遵守 `prefers-reduced-motion`，并为图片提供尺寸和替代文本。

## 数据边界

建立一个单一 release manifest 数据模块，当前记录：

- 版本 `0.0.1`；
- macOS Universal `.dmg`；
- Windows x64 NSIS `-setup.exe`；
- Windows x64 MSI；
- Linux x64 `.AppImage`；
- Linux x64 `.deb`；
- `SHA256SUMS.txt`；
- 发布页、版本化资产 URL、可用性、签名状态和校验和入口。

目前资产在 GitHub Release，官网不得声称 GitHub URL 是 Microsoft Store 无重定向直链。所有已发布 URL 必须是 HTTPS 和版本化路径。版本信息、文件名和按钮文案必须从 manifest 生成，不能在多个页面手工重复。

## 安全和隐私

- 网站源码公开；
- GitHub Actions PR 构建不使用生产 secrets；
- 生产部署只从受保护的 `main` 分支进行；
- 所有外链使用适当的 `rel` 属性；
- 不渲染远程 Markdown 或通过 `innerHTML` 生成用户可控内容；
- manifest 数据只允许 HTTPS 且只允许已知下载主机；
- 不提交 Cloudflare token、R2 key、GitHub PAT、签名私钥或真实用户数据；
- 隐私页面明确当前官网无自建遥测、无账号和无用户文档上传。

## 明确不做

- `/api/stats`、`/api/track`、`/api/admin`；
- 在线编辑、在线分享、评论、订阅、登录和后台；
- 广告和第三方行为分析；
- R2 上传和下载域名切换；
- 十几种语言；
- 未交付 AI、插件、同步或稳定应用内更新的宣传。
