# Cloudflare Pages Deployment Guide

This guide walks you through deploying the `oh-my-md` website to Cloudflare Pages. The repository is already prepared for deployment; you only need to perform the Cloudflare-side configuration.

The previous general checklist still applies: see [deployment-checklist.md](./deployment-checklist.md) for repository work, future R2 work, and signed/notarized policy.

## 1. Prerequisites

- A Cloudflare account (free tier is sufficient).
- The `ohmd.us` domain in any registrar (Namecheap, GoDaddy, Aliyun, Tencent DNSPod, etc.).
- Access to the [oh-my-md-website](https://github.com/Zuixi/oh-my-md-website) GitHub repository.
- About 30 minutes for the first deployment. Subsequent updates are automatic.

## 2. One-time Cloudflare setup

### 2.1 Create the Pages project

1. Sign in at <https://dash.cloudflare.com/>.
2. In the left navigation, click **Workers & Pages** → **Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access your GitHub account, then select:
   - **Account:** your Cloudflare account.
   - **GitHub organization / user:** `Zuixi`.
   - **Repository:** `oh-my-md-website`.
   - **Production branch:** `main`.
4. In **Build settings**, fill in:

   | Field | Value |
   |---|---|
   | Framework preset | `Astro` (or `None` if Astro is not listed) |
   | Build command | `pnpm install --frozen-lockfile && pnpm build` |
   | Build output directory | `dist` |
   | Root directory (advanced) | leave empty (repo root) |
   | Environment variables | none required |

5. Click **Save and Deploy**.
   - Cloudflare will run the first build. Expect ~1–2 minutes.
   - A temporary URL `https://<project>.pages.dev` becomes available when the build succeeds.

### 2.2 Verify the temporary Pages URL

Open the temporary URL and confirm:

- All 13 routes load with HTTP 200 (`/`, `/zh/`, `/download/`, `/zh/download/`, `/docs/`, `/support/`, `/privacy/`, `/changelog/`, `/404.html`).
- The Astro dev toolbar is **not** present (it was disabled in `astro.config.mjs`).
- The Cloudflare Pages URL bar shows the project hash, not a custom domain.
- Browser DevTools → Network → response headers include:
  - `strict-transport-security: max-age=31536000; includeSubDomains; preload`
  - `x-content-type-options: nosniff`
  - `content-security-policy: default-src 'self'; ...`
  - `referrer-policy: strict-origin-when-cross-origin`
  - These come from the committed `public/_headers` file and are merged by Cloudflare.

If any header is missing, re-check that `public/_headers` is in the deployed `dist/` after a build. If only some are missing, the trailing wildcard section may be overriding earlier ones — fix the order in `public/_headers` and push.

### 2.3 Bind the custom domain `ohmd.us`

1. In the Pages project, open the **Custom domains** tab → **Set up a custom domain**.
2. Enter `ohmd.us` and click **Continue**.
3. Cloudflare will check whether `ohmd.us` is already on a Cloudflare-managed DNS zone.

**If your domain is already on Cloudflare (recommended):**

- The custom domain is added automatically and the certificate is provisioned within a few minutes.
- Skip to step 2.5 (SSL validation).

**If your domain is on another registrar (Namecheap, GoDaddy, Aliyun, etc.):**

- Cloudflare will display two authoritative nameservers, e.g. `andy.ns.cloudflare.com` and `kia.ns.cloudflare.com`.
- In the next step, you must point your registrar to these nameservers.

### 2.4 Point your registrar's nameservers (only if not on Cloudflare yet)

In your registrar's DNS control panel (Namecheap / GoDaddy / Aliyun / DNSPod / etc.):

1. Find **Domain Nameservers** or **DNS server settings**.
2. Switch from the default nameservers to **Custom nameservers**.
3. Enter the two Cloudflare nameservers from step 2.3.
4. Save.

DNS propagation typically completes in 5–60 minutes but can take up to 24–48 hours. Cloudflare will show **"Active"** on the custom domain once propagation finishes.

> Important: while DNS is propagating, do **not** change any other DNS records on the old registrar. Leave them in place until Cloudflare has fully imported the zone.

### 2.5 SSL

1. In Cloudflare Pages → your project → **SSL/TLS**, set encryption mode to **Full (Strict)**.
2. The default **Universal SSL** certificate is provisioned automatically. Wait for it to show **Active**.
3. (Optional but recommended) On the **Edge Certificates** page, enable:
   - **Always Use HTTPS** (redirects all `http://` to `https://`).
   - **HTTP/2** and **HTTP/3 (QUIC)** (default on, no action needed).
   - **0-RTT** — only if you understand the trade-off. We do not need it; leave off.

### 2.6 Configure DNS records for `www.`

`www.ohmd.us` is currently unused by the site. Two clean options:

- **Option A (recommended):** redirect `www` to apex. In Cloudflare DNS, create a `www.ohmd.us` CNAME record pointing to `ohmd.us`. Pages will issue a certificate that covers both. No code change required.
- **Option B:** leave `www` unconfigured and let it return a Cloudflare 521/525. Not recommended.

We do not need an `A` record for `ohmd.us` itself when using Cloudflare Pages — Pages inserts the correct CNAME behind the scenes.

### 2.7 Optional: Email forwarding (later)

Out of scope for this deployment, but if you want `hello@ohmd.us`:

- Add an MX record via Cloudflare Email Routing (free).
- Add a corresponding SPF record (`v=spf1 include:_spf.mx.cloudflare.net -all`).

Do not add any third-party email provider now; it would break the "zero tracking, no third-party" claim.

## 3. Post-deployment verification

Run these from any terminal after the custom domain becomes Active:

```sh
for path in / /zh/ /download/ /zh/download/ /docs/ /zh/docs/ \
            /support/ /zh/support/ /privacy/ /zh/privacy/ \
            /changelog/ /zh/changelog/ /404 /sitemap-index.xml /robots.txt; do
  printf '%s -> ' "$path"
  curl -sS -o /dev/null -w '%{http_code}\n' -L \
    --max-redirs 0 "https://ohmd.us$path" || true
done
```

Expected results:

- All real routes return **200**.
- `/404` returns **404** with the custom 404 page (not Cloudflare's default 404).
- `/sitemap-index.xml` returns **200** with `Content-Type: application/xml`.
- `/robots.txt` returns **200** with `Content-Type: text/plain; charset=utf-8`.

### 3.1 Confirm no redirect on download URLs (until R2 is enabled)

```sh
curl -sSI -o /dev/null -w '%{http_code} %{url_effective}\n' \
  "https://github.com/Zuixi/oh-my-md/releases/download/v0.0.1/oh-my-md_0.0.1_x64-setup.exe"
```

The page links to GitHub Releases; downloads still follow GitHub's redirect chain. This is expected until `downloads.ohmd.us` is implemented. The download link **on the website itself** is correctly versioned and points to the immutable release page.

### 3.2 Confirm security headers

```sh
curl -sSI "https://ohmd.us/" | grep -iE 'strict-transport|content-security|x-content-type|x-frame|referrer|permissions-policy|cross-origin'
```

Expected (order may vary):

```text
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self'; ...
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
```

If `content-security-policy` is missing or shows defaults, Cloudflare has not picked up `public/_headers`; redeploy from the Cloudflare dashboard.

### 3.3 Confirm no third-party scripts (the entire point of this site)

```sh
for host in googlesyndication googletagmanager google-analytics \
           cloudflareinsights googletagservices doubleclick \
           facebook segment.io mixpanel plausible; do
  if curl -sS "https://ohmd.us/" | grep -q "$host"; then
    echo "ALERT: $host referenced on homepage"
  fi
done
```

Expected: no output. Cloudflare Pages does not inject analytics by default; you are staying zero-tracking.

### 3.4 Run Lighthouse

Open Chrome DevTools → Lighthouse on <https://ohmd.us/>:

- Mode: **Navigation**
- Device: **Mobile** and **Desktop**
- Categories: Performance, Accessibility, Best Practices, SEO

Expected scores:

- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

If a score drops below 95, the cause is usually:

- A missing `<meta name="description">` (fix in the page frontmatter).
- A missing `alt` on an image (fix in the component).
- An oversized image (`hero.png` is 101 KB; consider compressing to < 80 KB).

## 4. Continuous deployment

Cloudflare Pages automatically:

- Re-builds on every push to the `main` branch.
- Re-builds every pull request and posts a **Cloudflare Pages** check back to GitHub.
- Keeps the last 25 builds (free tier) for instant rollback.

You do not need a separate `deploy.yml` GitHub Actions workflow. If you ever want one (e.g., to mirror builds to a Slack channel), add it later.

To roll back:

1. Cloudflare dashboard → Pages → your project → **Deployments**.
2. Click the **⋯** menu next to a previous successful deployment.
3. Choose **Rollback to this deploy**.

## 5. What you should NOT do (and why)

- **Do not** enable Cloudflare Web Analytics from the dashboard. It is not present by default; keep it off to honor the privacy claim in `docs/privacy.astro`.
- **Do not** add third-party scripts via Cloudflare's "Script" / "App" injectors. The site is zero-third-party by design.
- **Do not** enable Cloudflare R2 until the desktop app downloads are signed. R2 distribution belongs in a separate milestone, after Authenticode signing and notarization are in place.
- **Do not** change the production branch in Pages to anything other than `main`. The `validate.yml` CI and the security checks both run on `main`.
- **Do not** upload a custom SSL certificate. Cloudflare's Universal SSL covers `ohmd.us` and `www.ohmd.us` automatically.

## 6. Rollback and recovery

- **Code rollback:** `git revert <bad-commit>` and push to `main`. Cloudflare will redeploy.
- **Configuration rollback:** Cloudflare dashboard → Pages → **Deployments** → **Rollback to this deploy**.
- **Domain loss:** if you delete the project by mistake, Cloudflare preserves the GitHub connection state for 30 days. Recreate the project with the same name and re-add the custom domain; the next build will be a fresh deploy.

## 7. Summary checklist

- [ ] Cloudflare Pages project created from `Zuixi/oh-my-md-website` → `main`.
- [ ] Build command `pnpm install --frozen-lockfile && pnpm build`; output `dist`.
- [ ] Temporary `*.pages.dev` URL loads all 13 routes with HTTP 200.
- [ ] Custom domain `ohmd.us` is Active in Cloudflare.
- [ ] DNS propagation completed; Nameservers point to Cloudflare if your domain was external.
- [ ] SSL mode: Full (Strict); Universal SSL Active.
- [ ] All security headers present in `curl -I` output.
- [ ] No third-party hosts on the homepage (`grep` returns nothing).
- [ ] Lighthouse scores all ≥ 95 on mobile and desktop.
- [ ] README deploy badge (Cloudflare Pages) is green.
- [ ] `www.ohmd.us` redirects to `ohmd.us` (or is unconfigured).
- [ ] Cloudflare Pages **preview** deployments are enabled (default) so future PRs get a preview URL.

When all boxes are checked, the site is live at **<https://ohmd.us>**.
