---
name: run-in-browser
description: Start the plentyshop-pwa dev server and drive it with a real browser (via the repo's own playwright-core dependency) to visually verify code changes, reproduce bugs, or debug console/network errors. Use whenever the user asks to "check this in the browser", "see if this works", "debug this on the running app", or wants a screenshot/console output of a page after a code change.
---

# Run and Check

Start the Nuxt dev server, then drive a real Chromium browser against it to see what actually renders — screenshots, console output, page errors, and failed network requests. No MCP server needed: this repo already depends on `playwright-core` (see root `package.json`), so a plain Node script drives the browser directly.

## 1. Start the dev server

From the repo root:

```bash
npm run dev
```

This runs `turbo run dev`, which starts the `web` app (and `server` app if present) via Nuxt. The shop is served at `http://localhost:3000/`. Hot reload is on, so code edits apply without a restart.

- Run this in the background (`run_in_background: true` for the Bash tool, or `&` outside the harness) — it does not exit on its own.
- First boot takes ~10-20s (Nitro/Vite build). Poll with `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` until it returns `200`, or watch the log for `Vite client warmed up`.
- Requires `apps/web/.env` with at least `API_ENDPOINT` and `API_SECURITY_TOKEN`. If missing, copy `apps/web/.env.example` and fill in a target PlentyONE system — ask the user which one if unclear.
- If port 3000 is already in use, check `lsof -i :3000` before starting a second instance — someone (or a previous run) may already have it up.
- When done, stop the background process rather than leaving it running indefinitely.

## 2. Drive it with the browser script

Use `scripts/browse.mjs` in this skill folder. It launches Chromium headless via the repo's `playwright-core` install, navigates, runs any actions you pass, and prints console messages, page errors, and failed requests at the end.

```bash
node .github/skills/run-in-browser/scripts/browse.mjs <url> [options] [actions...]
```

Options (before actions):

- `--viewport WxH` — e.g. `--viewport 1280x800` (default). Use a mobile size like `390x844` to check responsive behavior.
- `--timeout ms` — default 15000.
- `--headed` — show the actual browser window instead of headless. Only useful when a human is watching; default (headless) is right for autonomous checks.

Actions (run in order given):

- `--wait <selector>` — wait for a selector before continuing
- `--click <selector>` — click it (Playwright selector syntax, e.g. `button:has-text('Accept All')`)
- `--fill <selector> <value>` — fill an input
- `--eval <js>` — run JS in page context, prints the result (use to read DOM state, counts, computed styles, etc.)
- `--screenshot <path>` — full-page screenshot to a file, then use the Read tool to view it
- `--sleep <ms>` — pause, e.g. to let an animation or async fetch settle

### Examples

Check the homepage renders and capture a screenshot:

```bash
node .claude/skills/run-in-browser/scripts/browse.mjs http://localhost:3000/ --screenshot /tmp/check.png
```

Then `Read` `/tmp/check.png` to see it.

Dismiss the cookie banner (present on first load of any page) before interacting further:

```bash
node .claude/skills/run-in-browser/scripts/browse.mjs http://localhost:3000/ \
  --wait "button:has-text('Accept All')" --click "button:has-text('Accept All')" \
  --sleep 500 --screenshot /tmp/check.png
```

Check a specific page after a code change, e.g. a product page:

```bash
node .claude/skills/run-in-browser/scripts/browse.mjs http://localhost:3000/some-product-slug --screenshot /tmp/check.png
```

## 3. Reading the output

The script prints, in order: the loaded URL and title, one line per action, then three sections — Console messages, Page errors, Failed requests.

- **Console messages**: includes Vite's own `[vite] connecting...`/`connected.` debug noise on every load — ignore those. Look for `[error]`/`[warning]` entries from app code.
- **Page errors**: uncaught JS exceptions. Any entry here is a real bug.
- **Failed requests**: `net::ERR_ABORTED` entries are expected and harmless if they happen right after a `--click` that triggers a full page navigation/reload (e.g. accepting the cookie banner reloads the SPA) — those are just in-flight module requests cut off by the reload, not real failures. Treat `ERR_ABORTED` as noise only when it immediately follows a navigating click; other failed-request errors (4xx/5xx, `ERR_CONNECTION_REFUSED`, etc. on API calls) are real and worth investigating.

## Notes

- The matching `chromium-headless-shell` build is fetched automatically by the root `postinstall` script (`scripts/postinstall.js`) on every `npm install`, so it stays in sync whenever `playwright-core` bumps versions. If the browser is still missing (e.g. `browserType.launch: Executable doesn't exist...`), run `npm install` from the repo root rather than `npx playwright install` — `npx` resolves the latest global `playwright` CLI, which pins a different browser revision than the repo's locally installed `playwright-core` and downloads the wrong build.
- For anything beyond simple checks (multi-step flows, auth, cart/checkout), extend `scripts/browse.mjs` with more `--eval`/`--click` steps rather than writing a one-off script; keep the CLI shape.
- This complements, not replaces, the existing Cypress e2e suite (`npm run test:cypress-dev`) — use Cypress for regression tests that should live in the repo, use this skill for ad-hoc "does this look right / what's broken" checks during development.
