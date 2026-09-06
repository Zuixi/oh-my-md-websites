# Website LAN Preview + Download Redesign + Remote Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local Astro development reachable over the LAN, redesign the bilingual download pages with an Obsidian-inspired platform-first hierarchy, verify the result, and push the finished website `main` branch to its configured remote.

**Architecture:** Keep the website as a static Astro site with no runtime API, telemetry, accounts, ads, remote Markdown rendering, or uploads. Bind only the development command to `0.0.0.0`, retain a loopback-only command, and use the existing typed release manifest for a wide download chooser that can later switch from GitHub Release URLs to R2 URLs without changing page components.

**Tech Stack:** Astro 5, TypeScript, native CSS, pnpm, Cloudflare Pages-compatible static output, GitHub Actions validation.

**Spec:** `docs/superpowers/specs/2026-09-06-oh-my-md-website-design.md`

## Global Constraints

- Website repository: `/Users/wqz/Developer/my_tools/oh-my-md-website`; do not modify `/Users/wqz/Developer/my_tools/oh-my-md`.
- Current branch starts at local `main`; configured remote is `https://github.com/Zuixi/oh-my-md-websites.git`; do not force-push.
- `pnpm dev` must bind Astro to `0.0.0.0`; `pnpm dev:loopback` must bind to `127.0.0.1`.
- LAN development is not production deployment; README must warn against public Internet exposure and mention firewall/LAN IP usage.
- Current release remains `0.0.1`; package URLs and filenames must remain exact and sourced from `src/data/releases.ts`.
- Current packages remain unsigned; do not claim Authenticode, notarization, Microsoft Store compatibility, or working in-app updater.
- Preserve English and Simplified Chinese routes and no-JavaScript readability.
- Use native CSS and existing visual tokens; do not add Tailwind, a UI library, third-party fonts, analytics, ads, runtime APIs, or remote content rendering.
- The download redesign may add a wider page-specific layout, but must not widen all content pages globally.
- Every download/package display value must come from typed release/display data; do not duplicate current version or package filenames in page templates.
- R2, Cloudflare Pages control-plane setup, DNS, signing, and GitHub Release asset changes remain out of scope.
- Remote synchronization is explicitly authorized by the user, but only after local verification and only with `git push -u origin main`; never overwrite unrelated remote history.

---

### Task 1: LAN development configuration

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Create: `scripts/check-dev-host.mjs`

**Interfaces:**
- `package.json` exposes scripts `dev`, `dev:loopback`, `build`, and `check`.
- `scripts/check-dev-host.mjs` reads repository files and exits nonzero for incorrect host scripts or unsafe LAN documentation.

- [ ] **Step 1: Add host-specific scripts.** Change `dev` to `astro dev --host 0.0.0.0` and add `dev:loopback` as `astro dev --host 127.0.0.1`; keep all existing build/check scripts intact.
- [ ] **Step 2: Document LAN use.** Add a README development section showing `pnpm dev`, the URL form `http://<LAN-IP>:4321/`, how to find the machine’s LAN IP conceptually, a firewall note, and an explicit warning that the Astro dev server is not for public Internet exposure. Document `pnpm dev:loopback` for local-only use.
- [ ] **Step 3: Add deterministic host assertions.** Assert the exact script host values and required warning phrases; do not make the check depend on the machine’s current IP or network state.
- [ ] **Step 4: Wire and run checks.** Add `node scripts/check-dev-host.mjs` to `pnpm check`, then run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`, and `git diff --check`.
- [ ] **Step 5: Commit.** Use `feat: support LAN website preview`.

### Task 2: Obsidian-inspired bilingual download redesign

**Files:**
- Create: `src/components/DownloadHero.astro`
- Create: `src/components/PlatformDownloadPanel.astro`
- Create: `src/components/InstallGuidance.astro`
- Create: `src/components/DownloadVerification.astro`
- Modify: `src/pages/download.astro`
- Modify: `src/pages/zh/download.astro`
- Modify: `src/components/DownloadCard.astro` if needed for the new hierarchy
- Modify: `src/data/releases.ts` only for typed display fields needed by the redesign
- Modify: `src/styles/global.css`
- Modify: `scripts/check-routes.mjs`
- Test: `scripts/check-download-layout.mjs`

**Interfaces:**
- `DownloadHero.astro` consumes the current typed release and localized copy, rendering version/release date, heading, explanation, primary platform actions, and trust facts.
- `PlatformDownloadPanel.astro` consumes `{ platform: Platform; primary: ReleasePackage; secondary?: ReleasePackage; lang: Lang; }` and renders the package hierarchy without constructing URLs.
- `InstallGuidance.astro` consumes typed localized platform notes and optional `InstallCommand` data; it never executes commands.
- `DownloadVerification.astro` consumes typed checksum/release metadata and renders verification commands/links.
- `check-download-layout.mjs` validates both generated language pages contain the new structural markers and required release facts.

- [ ] **Step 1: Extend typed release display data.** Add only the typed localized strings needed for platform hero labels, package roles, install notes, checksum verification, release notes CTA, and unsigned status. Keep URLs and filenames in `currentRelease` package records.
- [ ] **Step 2: Add the wide download layout.** Add a page-specific wrapper/class that escapes the generic 42rem content column while keeping docs/privacy/support narrow. Define responsive grid/flex behavior, cards, badges, focus states, and mobile collapse in existing CSS.
- [ ] **Step 3: Implement the download hero and platform chooser.** Show current version and date, primary heading, concise product statement, open-source/local-first facts, and three platform action cards. macOS uses Universal DMG; Windows uses x64 NSIS as recommended with MSI as managed/manual; Linux uses AppImage as primary with deb alternative.
- [ ] **Step 4: Implement platform panels and practical install guidance.** Render package metadata from the manifest. Include macOS DMG first-run note, Windows unsigned/SmartScreen note, Linux `chmod +x` and `sudo apt install` commands, and translated equivalents. Use portable `sha256sum` for Linux-style verification and clearly label shell examples.
- [ ] **Step 5: Implement prominent verification and release navigation.** Render SHA256SUMS link, immutable current release link, all-releases fallback, and changelog CTA. Keep the current unsigned warning visible and do not imply GitHub URLs are Microsoft Store no-redirect URLs.
- [ ] **Step 6: Preserve no-JavaScript behavior.** Ensure all buttons are normal anchors, all essential text is server-rendered, and copy-to-clipboard remains optional enhancement only.
- [ ] **Step 7: Strengthen generated-page assertions.** Update route checks to assert both English and Chinese pages contain platform headings, exact assets/URLs, recommendation/manual labels, unsigned state, install guidance, checksum/release links, current version, and no unsupported claims. Add explicit structural markers for the wide layout and hero chooser.
- [ ] **Step 8: Run checks and commit.** Run `pnpm check`, `pnpm build`, all explicit checks, and `git diff --check`; commit with `feat: redesign bilingual download pages`.

### Task 3: Integrated verification and authorized remote synchronization

**Files:**
- Create: `docs/lan-preview-checklist.md` if the implementation needs a dedicated operator checklist
- Modify: only files required by verification findings
- Test: all `scripts/check-*.mjs` scripts and local HTTP checks

**Interfaces:**
- The final local tree must pass `pnpm check` and `pnpm build` from `main`.
- LAN check verifies Astro reports `0.0.0.0:4321`; it does not expose the server beyond the local network or configure production infrastructure.
- Remote sync uses existing `origin` and establishes upstream with `git push -u origin main` only after `git fetch origin` and non-destructive history inspection.

- [ ] **Step 1: Run clean-install validation.** Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`, every explicit check script, and `git diff --check` on the final local tree.
- [ ] **Step 2: Start and verify LAN preview.** Run `pnpm dev` and verify the Astro log reports `http://0.0.0.0:4321/` or equivalent all-interface binding. Use read-only HTTP requests to `http://127.0.0.1:4321/`, `/zh/`, `/download/`, and `/zh/download/`; report the host machine’s LAN URL format without guessing its IP. Do not expose a public tunnel.
- [ ] **Step 3: Inspect desktop/mobile output.** Check heading order, image alt text, focus-visible styling, no horizontal overflow at desktop and 390px layouts, required release facts, and truthful unsigned wording. Use local preview inspection only.
- [ ] **Step 4: Inspect remote history safely.** Run `git remote -v`, `git fetch origin`, and compare local `main` with `origin/main` if available. If the remote has unrelated commits or fetch is unavailable, stop before push and report the exact state; do not force-push.
- [ ] **Step 5: Push authorized changes.** If history is compatible and all checks pass, run `git push -u origin main`. Record the push result and final commit hash. No other remote branches or tags are changed.
- [ ] **Step 6: Commit any checklist-only changes.** If verification added a checklist or small correction, run the complete suite again and commit with the prescribed docs/fix message before the push.

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
node scripts/check-dev-host.mjs
node scripts/check-download-layout.mjs

git diff --check
git remote -v
git fetch origin
git push -u origin main
```

## External Actions Not Performed by Code Tasks

- Cloudflare Pages project creation or deployment.
- DNS changes for `ohmd.us`.
- R2 bucket creation, custom domain activation, or uploads.
- Authenticode/Apple signing or notarization.
- GitHub Release asset replacement.
- Public tunnel or Internet exposure of the LAN dev server.
