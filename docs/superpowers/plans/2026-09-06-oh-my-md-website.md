# oh-my-md Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent Astro website for `ohmd.us` that explains oh-my-md, provides accurate bilingual download/documentation pages, and is ready for Cloudflare Pages without introducing runtime data services.

**Architecture:** The website is a separate public repository at `/Users/wqz/Developer/my_tools/oh-my-md-website`. Astro statically renders English and Simplified Chinese routes from shared components and a single typed release manifest. Cloudflare Pages hosts the generated `dist/`; current downloads point to immutable GitHub Release assets, while the manifest shape leaves room for future `downloads.ohmd.us` R2 URLs.

**Tech Stack:** Astro 5, TypeScript with strict checking, native CSS, system fonts, `@astrojs/sitemap`, Node/pnpm, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-06-oh-my-md-website-design.md`

## Global Constraints

- The website is a separate repository and must not modify `/Users/wqz/Developer/my_tools/oh-my-md`.
- Use Astro + TypeScript static output; do not add Tailwind, a UI component library, or a client-side application framework.
- First release content is English + Simplified Chinese only.
- Current version is `0.0.1`; current downloads are versioned GitHub Release URLs under `https://github.com/Zuixi/oh-my-md/releases/download/v0.0.1/`.
- Current Windows packages are x64 NSIS `oh-my-md_0.0.1_x64-setup.exe` and x64 MSI `oh-my-md_0.0.1_x64_en-US.msi`.
- The current packages are unsigned; never claim Authenticode signing, Apple notarization, or working in-app updates.
- Use the existing source assets `docs/images/logo.png` and `docs/images/hero.png` copied from the main repository, with a source note.
- Use only shipped product claims from the main README; do not advertise roadmap AI, plugins, sync, or other unshipped features.
- Do not implement accounts, database, telemetry, ads, online editor/share, comments, uploads, or runtime API endpoints.
- Critical content must render without JavaScript; client JavaScript may only support nonessential navigation/copy affordances.
- Do not commit Cloudflare credentials, GitHub PATs, R2 keys, code-signing private keys, or user data.
- Production deployment is documented for Cloudflare Pages and must be safe for a public repository: PR builds have no production secrets, workflow permissions are minimal, and third-party actions are pinned to complete commit SHAs.
- Download data must be defined once and consumed by all download UI; future R2 URL migration must require changing data, not page components.

---

### Task 1: Scaffold the Astro repository and design system

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `src/env.d.ts`
- Create: `src/layouts/SiteLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`
- Create: `src/pages/zh/index.astro`
- Create: `public/logo.png`
- Create: `public/hero.png`
- Create: `public/favicon.svg`
- Create: `README.md`
- Create: `SECURITY.md`
- Create: `.gitignore`
- Create: `.npmrc`
- Test: `scripts/check-site.mjs`

**Interfaces:**
- Produces `SiteLayout` props `{ title: string; description: string; lang: 'en' | 'zh'; canonicalPath: string; }` for all later pages.
- Produces shared header/footer components that accept `lang` and use stable route links.
- Produces `npm run build`/`pnpm build` and `pnpm check` scripts.

- [ ] **Step 1: Create the package and Astro configuration.** Set package name to `oh-my-md-website`, `private: true`, scripts `dev`, `build`, `preview`, `check`, and dependencies `astro` and `@astrojs/sitemap`. Configure `site: 'https://ohmd.us'`, sitemap integration, strict TypeScript, and static output.
- [ ] **Step 2: Copy the logo and hero screenshot from the main repository.** Preserve the original PNG bytes and add a README note naming the source paths and repository URL.
- [ ] **Step 3: Build the layout shell.** Add document metadata slots, skip link, header, main slot, footer, canonical link, and language alternate links. Keep all navigation usable without JavaScript.
- [ ] **Step 4: Build the CSS foundation.** Define color, spacing, type, content-width, focus, button, card, grid, code, and responsive tokens. Add dark hero sections, light content sections, reduced-motion behavior, and mobile breakpoints.
- [ ] **Step 5: Add placeholder English and Chinese home routes.** Each route must build, expose the correct `lang`, and render a heading plus navigation links; later tasks replace the page body without changing the layout contract.
- [ ] **Step 6: Add a deterministic site check.** The check script must run after build, assert that `dist/index.html`, `dist/zh/index.html`, and copied assets exist, and fail if generated HTML contains `pagead2.googlesyndication.com`, `static.cloudflareinsights.com`, or `fonts.googleapis.com`.
- [ ] **Step 7: Run checks and commit.** Run `pnpm install`, `pnpm check`, and `pnpm build`; commit with `feat: scaffold oh-my-md website`.

### Task 2: Implement the bilingual homepage

**Files:**
- Create: `src/data/site.ts`
- Create: `src/components/Hero.astro`
- Create: `src/components/FeatureSection.astro`
- Create: `src/components/PerformanceSection.astro`
- Create: `src/components/TrustStrip.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/zh/index.astro`
- Modify: `src/styles/global.css`
- Test: `scripts/check-homepage.mjs`

**Interfaces:**
- `src/data/site.ts` exports a typed `SiteCopy` structure for English and Chinese content, plus the GitHub repository and current release page URLs.
- `Hero.astro` consumes `{ lang: 'en' | 'zh'; copy: SiteCopy; }` and renders the primary download and GitHub links.
- Feature/performance components consume explicit typed copy and do not fetch remote data.

- [ ] **Step 1: Define safe product copy.** Use only shipped claims from the main README: Live Preview/Source mode, CommonMark/GFM, KaTeX/Mermaid/Shiki, file tree/search/outline/tabs, local files/assets, recovery, themes, platform support, and Apache-2.0. Include benchmark caveats exactly as advisory M-series measurements rather than universal promises.
- [ ] **Step 2: Implement the hero.** Render an eyebrow, product positioning, concise subtitle, primary download CTA, GitHub CTA, trust strip, and the real hero screenshot with width/height/alt text. The primary CTA should point to `/download` (or the language equivalent), not a GitHub redirect.
- [ ] **Step 3: Implement feature sections.** Add Live Preview, large-document performance, Markdown/rich blocks, local-first files, and platform support sections. Use one reusable component with different visual variants instead of duplicated markup.
- [ ] **Step 4: Add the performance evidence panel.** Show the README benchmark table and its methodology footnote; do not claim cold-open performance for arbitrary file sizes or use roadmap/internal spec text.
- [ ] **Step 5: Add responsive screenshot presentation and reduced motion.** Ensure the hero screenshot cannot overflow narrow screens, preserves aspect ratio, and has no mandatory animation.
- [ ] **Step 6: Add homepage assertions.** Check both generated homepages for the headline, screenshot asset, `/download` link, GitHub link, Apache-2.0, no account/local-first language, and absence of unshipped terms such as `AI providers`, `plugin marketplace`, and `signed & notarized`.
- [ ] **Step 7: Run checks and commit.** Run `pnpm check`, `pnpm build`, and `node scripts/check-homepage.mjs`; commit with `feat: add bilingual product homepage`.

### Task 3: Add release manifest and user-facing information pages

**Files:**
- Create: `src/data/releases.ts`
- Create: `src/components/DownloadCard.astro`
- Create: `src/components/InstallCommand.astro`
- Create: `src/components/ContentPage.astro`
- Create: `src/pages/download.astro`
- Create: `src/pages/zh/download.astro`
- Create: `src/pages/docs.astro`
- Create: `src/pages/zh/docs.astro`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/zh/privacy.astro`
- Create: `src/pages/support.astro`
- Create: `src/pages/zh/support.astro`
- Create: `src/pages/changelog.astro`
- Create: `src/pages/zh/changelog.astro`
- Modify: `src/data/site.ts`
- Modify: `src/styles/global.css`
- Test: `scripts/check-release-manifest.mjs`
- Test: `scripts/check-routes.mjs`

**Interfaces:**
- `src/data/releases.ts` exports `currentRelease` with `version`, `releasedAt`, `releasePage`, `checksumUrl`, and typed platform packages. Each package has `platform`, `architecture`, `fileType`, `filename`, `url`, `signed`, `availability`, and optional `size`.
- `DownloadCard.astro` consumes one package and renders its metadata without inventing URLs.
- `InstallCommand.astro` consumes `{ command: string; shell: 'bash' | 'powershell'; }` and renders a copy button with `data-copy`, not executable remote code.
- `ContentPage.astro` consumes page title/description/lang and a content slot.

- [ ] **Step 1: Define the `0.0.1` manifest.** Add exact current GitHub Release asset URLs for Universal DMG, Windows x64 NSIS EXE, Windows x64 MSI, Linux x64 AppImage, Linux x64 deb, and `SHA256SUMS.txt`. Mark all current packages `signed: false`; link the release page as the authoritative source. Keep the shape storage-agnostic for future R2 URL replacement.
- [ ] **Step 2: Implement download cards and download pages.** Group packages by macOS, Windows, and Linux; label NSIS as recommended and MSI as managed-environment/manual; show current unsigned warning, checksum link, architecture, file type, and release page fallback. Do not present GitHub URLs as Microsoft Store no-redirect URLs.
- [ ] **Step 3: Implement copy-only install commands.** Show optional macOS/Linux and Windows commands only as clearly labeled convenience instructions; JavaScript copies text and never executes it. Do not make remote script execution the primary CTA.
- [ ] **Step 4: Implement docs pages.** Cover quick start, Live/Source mode, supported Markdown features, platform availability, export limitations, and troubleshooting links back to README/manual docs. Exclude internal architecture and roadmap promises.
- [ ] **Step 5: Implement privacy pages.** State that the website has no accounts, no website-owned telemetry, no document upload, and no advertising/analytics scripts; explain that download links and GitHub may receive normal request metadata, and that app update behavior is documented separately and not claimed as available for `0.0.1`.
- [ ] **Step 6: Implement support and changelog pages.** Link to GitHub Issues, Discussions, security reporting, contributing guide, current `v0.0.1` release, and the main README. Do not add a fake contact form or advertise the 404 updater endpoint.
- [ ] **Step 7: Add route/manifest assertions.** Verify every required bilingual route exists, manifest URLs are HTTPS and use only `github.com` or future `downloads.ohmd.us`, version/file names agree, all packages are unsigned, and no page contains unsupported claims.
- [ ] **Step 8: Run checks and commit.** Run `pnpm check`, `pnpm build`, `node scripts/check-release-manifest.mjs`, and `node scripts/check-routes.mjs`; commit with `feat: add downloads and product information pages`.

### Task 4: Add SEO, security baseline, and Cloudflare delivery documentation

**Files:**
- Create: `public/robots.txt`
- Create: `src/pages/404.astro`
- Create: `public/security.txt`
- Create: `.github/workflows/validate.yml`
- Create: `.github/CODEOWNERS`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `README.md`
- Modify: `SECURITY.md`
- Modify: `src/styles/global.css`
- Test: `scripts/check-seo.mjs`
- Test: `scripts/check-security.mjs`

**Interfaces:**
- `SiteLayout` emits canonical, Open Graph, Twitter, JSON-LD `SoftwareApplication`, and language alternate metadata for every route.
- `validate.yml` runs only checkout/install/check/build on pull requests and main pushes; it does not contain Cloudflare/R2/signing secrets or production deployment permissions.
- `check-security.mjs` audits generated HTML and repository files for forbidden third-party scripts, secret-like names, non-HTTPS release URLs, and unsafe external-link patterns.

- [ ] **Step 1: Configure sitemap and metadata.** Set the production site URL to `https://ohmd.us`, generate sitemap entries, add canonical paths, `hreflang` alternates for English/Chinese, favicon, OG/Twitter tags, and truthful SoftwareApplication JSON-LD with current platform/version facts.
- [ ] **Step 2: Add robots, security contact metadata, and 404 page.** Allow normal indexing, reference sitemap, provide a security reporting route pointing to GitHub’s security mechanism, and make 404 navigation useful in both languages where applicable.
- [ ] **Step 3: Audit link and content safety.** Ensure external links use `rel="noopener noreferrer"` when opening a new tab; no user-controlled HTML or remote Markdown rendering exists; all download manifest hosts are allowlisted and HTTPS.
- [ ] **Step 4: Add public-repository CI.** Pin third-party actions to full commit SHAs, set minimal `contents: read` permissions, run no production deployment on fork PRs, and keep the workflow limited to deterministic validation.
- [ ] **Step 5: Document Cloudflare Pages and future R2 setup.** Document build command `pnpm build`, output `dist`, custom domain `ohmd.us`, future `downloads.ohmd.us` R2 custom domain, immutable versioned object paths, and the fact that no R2 write integration exists in this first release.
- [ ] **Step 6: Add SEO/security assertions.** Verify every generated page has one canonical URL, title/description, valid locale metadata, and no forbidden scripts, secrets, unsafe schemes, unpinned workflow actions, or signed/notarized claims.
- [ ] **Step 7: Run checks and commit.** Run `pnpm check`, `pnpm build`, `node scripts/check-seo.mjs`, and `node scripts/check-security.mjs`; commit with `feat: harden website delivery and metadata`.

### Task 5: Full verification and final review preparation

**Files:**
- Modify: any files required by review findings only
- Test: `scripts/check-site.mjs`, `scripts/check-homepage.mjs`, `scripts/check-release-manifest.mjs`, `scripts/check-routes.mjs`, `scripts/check-seo.mjs`, `scripts/check-security.mjs`
- Create: `docs/deployment-checklist.md`

**Interfaces:**
- All checks must be runnable from the website repository with `pnpm check && pnpm build` followed by the Node check scripts.
- Deployment checklist must distinguish repository work from external Cloudflare actions.

- [ ] **Step 1: Run the complete static validation suite.** Build from a clean install and run all check scripts. Confirm all required route directories and assets exist in `dist/`.
- [ ] **Step 2: Validate generated navigation and links.** Check internal links resolve to generated routes, external links use the expected GitHub destinations, download links contain `v0.0.1` and correct filenames, and no link points to the broken updater endpoint.
- [ ] **Step 3: Validate content truthfulness.** Confirm current unsigned status, current platform support, export limitations, benchmark caveats, and no unshipped AI/plugin/sync claims.
- [ ] **Step 4: Validate accessibility and responsive structure.** Inspect generated HTML for image alt text, heading hierarchy, skip link, visible focus rules, button labels, and viewport-safe media. Use local preview/manual browser inspection if available; no external publish is performed.
- [ ] **Step 5: Write the deployment checklist.** Include Cloudflare Pages project settings, `ohmd.us` custom domain, DNS verification, future R2 bucket/custom-domain steps, production secret boundaries, and post-deployment `curl -I` checks for status 200 and no redirects when R2 is introduced.
- [ ] **Step 6: Run final tests and commit documentation.** Run the full suite again and commit with `docs: add Cloudflare deployment checklist`.

## Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
node scripts/check-site.mjs
node scripts/check-homepage.mjs
node scripts/check-release-manifest.mjs
node scripts/check-routes.mjs
node scripts/check-seo.mjs
node scripts/check-security.mjs
```

## External Actions Not Performed by This Plan

- Creating or changing Cloudflare Pages projects, DNS records, R2 buckets, custom domains, API tokens, or billing settings.
- Uploading files to R2.
- Obtaining or using code-signing certificates/private keys.
- Pushing to a remote GitHub repository.
- Changing the main `oh-my-md` repository’s Tauri updater endpoint or release workflow.
