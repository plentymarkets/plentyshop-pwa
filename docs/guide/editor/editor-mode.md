# How to force or enable editor mode locally

## Overview

When a merchant opens the storefront inside the PlentyONE editor, the shop runs in **editor mode**. In editor mode the `$isPreview` flag is `true`, which unlocks the editor UI (block toolbars, the settings drawer, edit/preview toggles) and changes how some blocks render — for example, [empty blocks stay visible](/guide/editor/blocks-visibility.md) so merchants can still configure them.

During local development you usually run the shop outside the editor, so editor mode is off by default. This guide shows the two supported ways to turn it on:

1. **Force it for the whole app** with the `NUXT_PUBLIC_IS_PREVIEW` environment variable.
2. **Enable it for your browser session** by setting the `pwa` cookie to a valid hash.

## Option 1 — Force editor mode with an environment variable

Set the `NUXT_PUBLIC_IS_PREVIEW` environment variable. It maps to the `isPreview` public runtime config key, and when truthy `resolvePreviewState` short-circuits and returns `true` before any cookie or backend check runs.

Add it to `apps/web/.env`:

```bash
# apps/web/.env
NUXT_PUBLIC_IS_PREVIEW=1
```

Then restart the dev server so Nuxt picks up the new value:

```bash
npm run dev
```

Only setting it in the `.env` file ensures that the editor will only show locally, while the production build remains unaffected.

## Option 2 — Set the `pwa` cookie with a valid hash

If you want editor mode to behave exactly like a real editor session — gated on backend validation and scoped to your browser only — set the `pwa` cookie instead of the environment flag.

The cookie value is a session hash that the backend validates through `useSdk().plentysystems.getPreviewValid()`. The shop only enables editor mode when that endpoint confirms the hash is `valid` **and** grants `write` permission, so an arbitrary value will not work — you need a hash from a genuine editor session.

1. Log into your PlentyONE system.
2. Go to **Shop » Management**.
3. Open the Editor.
4. In your browser's developer tools, open **Application → Cookies** and copy the value of the `pwa` cookie set on that session.
5. On your local shop's origin, add a cookie with:
   - **Name:** `pwa`
   - **Value:** the hash you copied
6. Reload the page. The `pwa-cookie` plugin sends the cookie with the SSR request, `getPreviewValid()` confirms it, and `$isPreview` becomes `true`.

When editor mode is on you should see the editor toolbars and settings drawer in the storefront, and empty blocks remain visible instead of being suppressed.

## See also

- [Control block visibility](/guide/editor/blocks-visibility.md) — Blocks behave differently in editor mode
- [Blocks rendering](/guide/editor/blocks-rendering.md) — How `$isPreview` affects the render cycle
