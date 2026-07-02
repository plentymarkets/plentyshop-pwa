# How to force or enable editor mode locally

## Overview

When a merchant opens the storefront inside the PlentyONE editor, the shop runs in **editor mode**. In editor mode the `$isPreview` flag is `true`, which unlocks the editor UI (block toolbars, the settings drawer, edit/preview toggles) and changes how some blocks render — for example, [empty blocks stay visible](/guide/editor/blocks-visibility.md) so merchants can still configure them.

During local development you usually run the shop outside the editor, so editor mode is off by default. This guide shows the two supported ways to turn it on:

**Force it for the whole app** with the `NUXT_PUBLIC_IS_PREVIEW` environment variable.

## Force editor mode with an environment variable

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

## See also

- [Control block visibility](/guide/editor/blocks-visibility.md) — Blocks behave differently in editor mode
- [Blocks rendering](/guide/editor/blocks-rendering.md) — How `$isPreview` affects the render cycle
