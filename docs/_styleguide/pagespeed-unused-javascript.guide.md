# PageSpeed Insights: "Unused JavaScript" for editor chunks

## Why this warning exists

PageSpeed Insights runs Lighthouse under the hood, which loads the page in a headless Chrome browser and uses the Chrome DevTools Coverage API to track which bytes of JavaScript are actually executed during the page load.

Chrome downloads and parses the entry chunk in full, then records exactly which lines of code run. It finds `__vite__mapDeps` — a lookup table Vite generates at build time — and the `__vitePreload(() => import('...'))` wrapper functions that reference editor-only chunks like `SiteConfigurationDrawer`, `Toolbar`, `BlocksConfigurationDrawer`, `AddBlockPopover`, and their associated CSS files. Because `clientPreview` is `false` for shop visitors, these wrapper functions are never called. Chrome reports those specific unexecuted lines as "unused JavaScript."

Lighthouse does evaluate runtime conditions — it is precisely because `clientPreview === false` prevents the editor components from rendering that Lighthouse flags those wrapper functions as unused bytes. The entry chunk is fully downloaded and the wrappers are allocated in memory; they just never execute.

**This is a known and acceptable trade-off, not a bug.** The editor chunks themselves are not downloaded, parsed, or executed by shop visitors.

## How Vite lazy chunks actually work

Vite wraps every `import()` call in a `__vitePreload()` function at build time. The `__vite__mapDeps` array in the entry chunk is the full registry of all filenames that could ever be needed as transitive dependencies across the whole app. Its presence in the entry chunk does not cause any of those files to be fetched.

A chunk is only actually downloaded in two cases:

1. **SSR-rendered component tree** — During server-side rendering, Nuxt walks the components that were rendered for that specific request. For each async component in the rendered tree, Nuxt injects a `<link rel="modulepreload">` into the HTML. Editor components (`SiteConfigurationDrawer`, `Toolbar`, etc.) are all behind `v-if="clientPreview"` in `app.vue`, and `clientPreview` is always `false` for shop visitors. They are never in the SSR tree, so no preload link is injected.

2. **Runtime `import()` call** — When the browser executes `__vitePreload(() => import('./SiteConfigurationDrawer...'))`, that is when the network request fires. For shop visitors `clientPreview` is `false`, so the `v-if` prevents the component from ever mounting, `defineAsyncComponent`'s internal loader is never called, and `__vitePreload` is never invoked.

The actual cost to a shop visitor is a few hundred bytes of dead function references in the entry chunk — the filenames themselves sitting in the `__vite__mapDeps` array. No editor chunk is ever fetched.

## Why we accept this

This project is a single Nuxt build that serves both the shop storefront and the editor iframe. `app.vue` is the universal entry point. Because Vite's static analysis is purely source-based, any `import()` call that appears in `app.vue`'s source — regardless of what runtime condition surrounds it — will be registered in the chunk graph and will appear in `__vite__mapDeps`.

Moving the `defineAsyncComponent` calls behind a `$isPreview` runtime check (as was attempted) has no effect on the coverage report because the `import()` call still exists in the source — Vite bundles it regardless of any runtime condition wrapping it, so Chrome still sees the unexecuted `__vitePreload` wrapper and flags it.

The real-world impact for shop visitors is zero: no extra network requests, no extra parse time, no extra execution. The PageSpeed penalty is cosmetic.

## What it would take to fix it

Eliminating the warning properly requires the `import()` calls to not appear in `app.vue`'s source at all. The only reliable approaches are:

**Two separate builds**
Maintain two Nuxt entry points — one for the shop (`app.vue`, no editor imports) and one for the editor iframe (`app.editor.vue`, with all editor imports). This requires either two separate build pipelines in CI or a Nuxt layer/module that conditionally swaps the entry at build time based on an environment variable.

**Build-time dead code elimination via `import.meta.env`**
Replace the runtime `$isPreview` check with a build-time flag such as `import.meta.env.VITE_EDITOR_BUILD`. Rollup can statically eliminate branches on `import.meta.env` constants, which means the editor `import()` calls would be physically absent from the shop build output. This still requires two builds — one with `VITE_EDITOR_BUILD=false` (shop) and one with `VITE_EDITOR_BUILD=true` (editor).

Both approaches are significant infrastructure changes with ongoing maintenance cost for a metric that has no measurable performance impact on real users.
