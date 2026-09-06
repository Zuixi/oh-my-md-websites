# oh-my-md website

The static product website for [oh-my-md](https://github.com/Zuixi/oh-my-md), built with Astro and intended for Cloudflare Pages at [ohmd.us](https://ohmd.us).

## Development

```sh
pnpm install
pnpm dev
```

Build and run the deterministic output check with:

```sh
pnpm check
pnpm build
```

The site is static-only: it has no runtime API, accounts, ads, analytics, hosted documents, external fonts, or user uploads.

## Approved public assets

- `public/logo.png` is copied byte-for-byte from `docs/images/logo.png` in the [oh-my-md repository](https://github.com/Zuixi/oh-my-md).
- `public/hero.png` is copied byte-for-byte from `docs/images/hero.png` in the [oh-my-md repository](https://github.com/Zuixi/oh-my-md).
