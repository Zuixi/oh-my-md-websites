# Security policy

## Reporting a vulnerability

Please report security issues privately through [GitHub Security Advisories](https://github.com/Zuixi/oh-my-md-website/security/advisories/new) when available. Do not include secrets or personal data in a public issue.

If private advisories are unavailable, open a minimal issue asking for a private reporting channel rather than disclosing vulnerability details. The same reporting route is published in `/.well-known/security.txt`.

This repository contains a static website. Do not submit production credentials, Cloudflare tokens, signing keys, GitHub tokens, or real user data.

## Delivery security baseline

The website is deployed as a static Cloudflare Pages site at `ohmd.us` using `pnpm build` with `dist` as the output directory. The future `downloads.ohmd.us` custom domain may front versioned R2 objects, but this release has no R2 write integration. Published objects must use immutable versioned paths and HTTPS-only delivery. The public validation workflow has only `contents: read` permission and does not deploy, sign, notarize, or access Cloudflare/R2 secrets.
