# oh-my-md website

The static product website for [oh-my-md](https://github.com/Zuixi/oh-my-md), built with Astro and intended for Cloudflare Pages at [ohmd.us](https://ohmd.us).

## Development

```sh
pnpm install
pnpm dev
```

The development server listens on all network interfaces so you can open it from another device on the same local network. Find this machine's LAN IP address using your operating system's network settings or network tools, then visit:

```text
http://<LAN-IP>:4321/
```

Allow incoming connections for port 4321 in your machine's firewall when prompted or when required by your firewall configuration. The Astro development server is intended for trusted local-network development only; do not expose it to the public Internet. For local-only access, use the loopback command instead:

```sh
pnpm dev:loopback
```

Build and run the deterministic output check with:

```sh
pnpm check
pnpm build
```

The site is static-only: it has no runtime API, accounts, ads, analytics, hosted documents, external fonts, or user uploads. All release links point to the allowlisted HTTPS GitHub Releases host.

## URL policy

The site uses Astro's `trailingSlash: 'always'` policy. Content-route canonical URLs, internal links, language alternates, and sitemap entries use trailing slashes (the root remains `/`).

## Cloudflare Pages delivery

- Build command: `pnpm build`
- Output directory: `dist`
- Production custom domain: `ohmd.us`
- Future download custom domain: `downloads.ohmd.us`, backed by an R2 bucket with a custom domain.
- Future R2 objects use immutable, versioned paths such as `releases/v0.0.1/<filename>`; never overwrite a published version.
- This first release has no R2 write integration. Downloads remain sourced from the current GitHub Release manifest.
- CI validates the static build only. Deployment credentials and production permissions are intentionally outside this public repository workflow.

## Approved public assets

- `public/logo.png` is copied byte-for-byte from `docs/images/logo.png` in the [oh-my-md repository](https://github.com/Zuixi/oh-my-md).
- `public/hero.png` is copied byte-for-byte from `docs/images/hero.png` in the [oh-my-md repository](https://github.com/Zuixi/oh-my-md).
