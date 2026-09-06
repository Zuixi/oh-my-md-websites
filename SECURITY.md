# Security policy

## Reporting a vulnerability

Please report security issues privately through [GitHub Security Advisories](https://github.com/Zuixi/oh-my-md-website/security/advisories/new) when available. Do not include secrets or personal data in a public issue.

If private advisories are unavailable, open a minimal issue asking for a private reporting channel rather than disclosing vulnerability details. The same reporting route is published in `/.well-known/security.txt`.

This repository contains a static website. Do not submit production credentials, Cloudflare tokens, signing keys, GitHub tokens, or real user data.

## Delivery security baseline

This repository configures a static Astro build for a planned Cloudflare Pages deployment: run `pnpm build` and publish `dist`. This change does not create or verify an external Cloudflare Pages project, `ohmd.us` DNS records or custom domain, or any Cloudflare account resources. The future `downloads.ohmd.us` custom domain and R2 bucket are documentation only; this release has no R2 write integration and no R2 resources were created or verified. Any published objects must use immutable versioned paths and HTTPS-only delivery. The public validation workflow has only `contents: read` permission and does not deploy, sign, notarize, or access Cloudflare/R2 secrets.
