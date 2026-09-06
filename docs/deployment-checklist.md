# Deployment checklist

This checklist separates changes that belong in this repository from actions that must be performed in the Cloudflare or DNS control planes. Task 5 only documents the delivery procedure; it does not publish the site or create external resources.

## Repository work

- [ ] Keep the site static-only: build with `pnpm build` and publish the generated `dist/` directory.
- [ ] Run the clean-install and validation suite before a release:
  - `pnpm install --frozen-lockfile`
  - `pnpm check`
  - `pnpm build`
  - `node scripts/check-site.mjs`
  - `node scripts/check-homepage.mjs`
  - `node scripts/check-release-manifest.mjs`
  - `node scripts/check-routes.mjs`
  - `node scripts/check-seo.mjs`
  - `node scripts/check-security.mjs`
  - `git diff --check`
- [ ] Keep release package URLs aligned with the typed manifest in `src/data/releases.ts`. The current v0.0.1 files are sourced from the authoritative GitHub Release; do not replace them with an unverified mirror.
- [ ] If the release manifest changes, update its exact versioned filenames, checksums, unsigned status, and release-page URL together, then rerun all checks.
- [ ] Keep deployment configuration and production credentials out of this public repository. The validation workflow requires only read access to repository contents and must not receive Cloudflare, R2, signing, or updater secrets.

## External Cloudflare Pages and DNS actions

These actions require access to the Cloudflare account and are not performed by repository changes.

- [ ] Create or select the Cloudflare Pages project for this website.
- [ ] Connect the intended GitHub repository and production branch, or upload the already-validated `dist/` artifact through the approved Pages workflow, using build command `pnpm build`, output directory `dist`, and no server-side runtime, functions, or database binding.
- [ ] Add `ohmd.us` as the production custom domain in Cloudflare Pages.
- [ ] Complete Cloudflare's domain verification and confirm that the authoritative DNS zone is the intended `ohmd.us` zone.
- [ ] Add or approve only the DNS records requested by Cloudflare for the Pages custom domain. Do not change unrelated DNS records.
- [ ] Verify the deployed site over HTTPS, including `/`, `/zh/`, `/download/`, `/docs/`, `/privacy/`, `/support/`, `/changelog/`, and their Chinese equivalents.
- [ ] Confirm that the Pages deployment does not introduce analytics, remote fonts, third-party scripts, or runtime APIs absent from the repository.

## Future R2 download delivery (not part of v0.0.1)

The current site does not require R2 and currently links directly to GitHub Releases. Perform these steps only after an approved release process decides to introduce `downloads.ohmd.us`.

- [ ] Create the R2 bucket in the intended Cloudflare account and region, using the organization's retention and access policy.
- [ ] Configure the `downloads.ohmd.us` R2 custom domain and complete its HTTPS certificate/domain verification in Cloudflare.
- [ ] Publish immutable, versioned objects such as `releases/v0.0.1/<filename>`; never overwrite an object for a published version.
- [ ] Verify object names, content types, checksums, cache headers, and access policy before changing any website manifest URL.
- [ ] Update the typed release manifest and its checks when the R2 URLs are authoritative. Keep the GitHub release page and checksum provenance documented.
- [ ] Use a scoped production token or Pages/R2 integration with the minimum required permissions. Never commit that token, bucket credentials, signing keys, or private keys.
- [ ] After DNS, custom-domain, and object propagation, check every published object with headers only. Each URL must return status 200 and must not redirect:

  ```sh
  for file in \
    oh-my-md_0.0.1_universal.dmg \
    oh-my-md_0.0.1_x64-setup.exe \
    oh-my-md_0.0.1_x64_en-US.msi \
    oh-my-md_0.0.1_amd64.AppImage \
    oh-my-md_0.0.1_amd64.deb \
    SHA256SUMS.txt
  do
    curl --fail --silent --show-error --location --head --max-redirs 0 \
      "https://downloads.ohmd.us/releases/v0.0.1/$file"
  done
  ```

  Inspect each response to confirm `HTTP/2 200` (or `HTTP/1.1 200`) and no `Location:` header. `--max-redirs 0` intentionally makes a redirect fail rather than hiding it.

## Secrets and signing boundaries

- The public repository and its pull-request workflow must contain no production secrets.
- Cloudflare API tokens, R2 credentials, deployment hooks, and billing/account access belong in Cloudflare's secret store or the organization's secret manager, not in Astro source, GitHub issues, generated HTML, or committed workflow files.
- Code-signing certificates and private keys are separate release infrastructure. This v0.0.1 site truthfully labels the published packages as unsigned; do not change that disclosure without verified signing/notarization evidence.
- No updater endpoint is configured by this website. Do not add or advertise an updater URL as part of Pages or R2 setup.

## Final external verification record

Record the Pages deployment ID, custom-domain verification result, DNS change ticket, and (when introduced) R2 bucket/custom-domain checks in the organization's deployment system. Do not add credentials or private account details to this repository.
