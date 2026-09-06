# LAN Preview & Mobile Verification Checklist

This document provides a concise operator guide for running local network development preview of the oh-my-md website and verifying responsiveness across devices.

## Pre-flight & Safety Guidelines

- **Trusted network only:** Only run the LAN preview on secure, trusted private local networks (home or private office Wi-Fi/Ethernet).
- **No public tunnels:** Do not attach ngrok, Cloudflare Tunnels, localtunnel, or port-forwarding to the Astro development server.
- **Firewall settings:** Ensure incoming TCP traffic on port `4321` is permitted by your host operating system's firewall.

## 1. Finding Your Host Machine LAN IP

Identify your machine's private IPv4 address on your local network:

- **macOS:**
  ```sh
  ipconfig getifaddr en0 # Wi-Fi
  # or check System Settings > Network > Wi-Fi / Ethernet > Details
  ```
- **Linux:**
  ```sh
  ip route get 1.1.1.1 | awk '{print $7; exit}'
  # or hostname -I
  ```
- **Windows (PowerShell):**
  ```powershell
  (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*').IPAddress
  ```

## 2. Starting the Development Server

### For Local Network (LAN) Preview

To allow other devices (such as mobile phones and tablets) on your local network to access the preview:

```sh
pnpm dev
```

Astro binds to `0.0.0.0:4321`. The terminal will list available Network URLs in the format:
`http://<LAN-IP>:4321/`

### For Loopback Only (Local Host)

When testing solely on the host computer without exposing port 4321 to the LAN:

```sh
pnpm dev:loopback
```

Astro binds strictly to `127.0.0.1:4321`.

## 3. Mobile Device Verification (e.g. 390px iPhone / Android)

Connect your test device to the same Wi-Fi network and open:

1. **Homepage:** `http://<LAN-IP>:4321/` and `http://<LAN-IP>:4321/zh/`
   - Verify layout adjusts cleanly without horizontal scroll/overflow.
   - Verify navigation links and language switcher function as expected.
2. **Download Page:** `http://<LAN-IP>:4321/download/` and `http://<LAN-IP>:4321/zh/download/`
   - Verify the platform chooser collapses smoothly to a single column.
   - Verify installation guidance cards and code blocks fit within screen width without forcing page horizontal overflow.
   - Verify download buttons link directly to current v0.0.1 release assets on GitHub Releases.
   - Verify truthful unsigned software notices and verification links are legible.

## 4. Teardown

Stop the dev server with `Ctrl+C` in your terminal when testing is finished.
