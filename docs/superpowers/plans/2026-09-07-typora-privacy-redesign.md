# Typora-Style Typography & Privacy Page Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor typography scale (no 80px h1 on prose pages), introduce Typora-like paper aesthetics, and transform Privacy Policy into a dignified, standard policy page.

**Architecture:** Astro 5, Native CSS, static output.

## Global Constraints
- Target repository: `/Users/wqz/Developer/my_tools/oh-my-md-website`.
- Do not modify `/Users/wqz/Developer/my_tools/oh-my-md`.
- No third-party fonts, external analytics, ads, or runtime JS frameworks.
- Zero horizontal overflow on 390px mobile and 1280px desktop viewports.
- All checks pass with `pnpm check`.
- Push to `origin main` cleanly after verification.

---

### Task 1: Refactor global typography scale and Typora design tokens in global.css
**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Hero.astro` (use `.hero-title` for the homepage banner)

### Task 2: Redesign English Privacy Policy page
**Files:**
- Modify: `src/pages/privacy.astro`

### Task 3: Redesign Chinese Privacy Policy page
**Files:**
- Modify: `src/pages/zh/privacy.astro`

### Task 4: Automated Verification, Responsive Inspection & Remote Sync
**Files:**
- Test: `pnpm check`, `pnpm build`, Playwright inspection
- Sync: Merge to `main` and `git push -u origin main`
