# Docs & Support Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/docs/` and `/support/` (and their `/zh/` counterparts) into a rich, structured, Obsidian/Typora-inspired hub with anchor navigation, shortcut tables, syntax cards, troubleshooting, and clear community issue channels.

**Architecture:** Static Astro components, native CSS variables, wide grid layout for docs and support, zero runtime API/tracking, strictly driven by static facts.

**Tech Stack:** Astro 5, TypeScript, Native CSS.

## Global Constraints
- Target repository: `/Users/wqz/Developer/my_tools/oh-my-md-website`.
- Do not modify `/Users/wqz/Developer/my_tools/oh-my-md`.
- No third-party fonts, external analytics, ads, or runtime JS frameworks.
- Zero horizontal overflow on 390px mobile and 1280px desktop viewports.
- Maintain accurate facts: v0.0.1, unsigned builds, local-first files, Apache-2.0.
- Ensure all route checks and tests pass with `pnpm check`.
- Push to `origin main` cleanly after verification.

---

### Task 1: Component & Styling Infrastructure
**Files:**
- Create: `src/components/DocsNav.astro`
- Create: `src/components/ShortcutTable.astro`
- Create: `src/components/SupportCard.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/ContentPage.astro` (support wide/docs layouts)

### Task 2: Redesign English Pages (`/docs/` and `/support/`)
**Files:**
- Modify: `src/pages/docs.astro`
- Modify: `src/pages/support.astro`
- Modify: `src/data/site.ts` (if new centralized strings are needed)

### Task 3: Redesign Chinese Pages (`/zh/docs/` and `/zh/support/`)
**Files:**
- Modify: `src/pages/zh/docs.astro`
- Modify: `src/pages/zh/support.astro`

### Task 4: Automated Verification, Responsive Testing & Remote Sync
**Files:**
- Modify: `scripts/check-routes.mjs`
- Test: `pnpm check`, `pnpm build`, responsive layout checks
- Sync: Merge to `main` and `git push -u origin main`
