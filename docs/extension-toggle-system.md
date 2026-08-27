# Extension Toggle System — Complete Explanation

This document explains what was built, why it works the way it does, and what each moving part does.
It assumes no prior knowledge of the implementation.

---

## The Problem We Were Solving

The PWA supports external Nuxt modules (called "extensions") that add new routes, CMS blocks, and
components to the shop. For example: `plenty-pwa-module-prototype` adds a `/store` page and a
`StoreHero` CMS block.

These extensions are currently registered at **build time**. Once you build the PWA, the extension's
routes and components are compiled into the output. If you want to disable an extension, you have to
rebuild the entire PWA and redeploy it. That's slow and expensive.

**The goal:** be able to turn an extension on or off while the server is running, with no rebuild, no
redeploy, and no server restart.

---

## Part 1 — How the PWA Already Knows About Extensions

### `module.manifest.json`

There is a file at `apps/web/module.manifest.json`. It lists which extensions are installed:

```json
[
  {
    "id": "plenty-pwa-module-prototype",
    "entry": "plenty-pwa-module-prototype",
    "version": "0.1.0"
  }
]
```

- `id` — the unique identifier, used as the key for all flag names
- `entry` — the npm package name that Node.js will `require()`
- `version` — informational

When Nuxt starts building, `@plentymarkets/shop-core` reads this file and adds each `entry` as a Nuxt
module dependency. Nuxt then loads those modules, which register their pages, components, and blocks
into the build.

This all happens at **build time**. Changing this file after a build does nothing until you rebuild.

### The npm package

The extension lives at `node_modules/plenty-pwa-module-prototype/`. Its `index.ts` file is the Nuxt
module entry point — it calls `addComponent`, `extendPages`, etc. to register its content.

---

## Part 2 — The Feature Flag System (pre-existing in shop-core)

Before we touched anything, shop-core already had a feature flag system. Here is how it works:

### The flags file

A JSON file on disk holds boolean flags:

```json
{
  "some-feature.enabled": true,
  "another-feature.enabled": false
}
```

In production this file lives at a configured path on the server.
In development you can point to a local copy by setting the `JSON_FEATURE_FLAGS_FILE` environment
variable to a path of your choice.

### The server plugin — `feature-flags.server.ts`

This plugin runs on **every single SSR request**, before the page renders:

```
User visits page → server receives request → plugin runs → reads flags.json from disk
→ puts contents into useState('feature-flags') → page renders using those flags
```

`useState('feature-flags')` is Nuxt's built-in shared state. It is populated on the server and
sent to the browser as part of the SSR payload. The client picks it up without a second fetch.

Because the file is read fresh on every request, you can edit `flags.json` on disk and the very
next page request will see the new values. No restart needed.

### `useFeatureFlag()` composable

Any Vue component or composable can call:

```ts
const isEnabled = useFeatureFlag('some-feature.enabled', true)
// isEnabled is a computed ref — it reads from useState('feature-flags')
// the second argument is the default value if the flag is not in the file
```

Because it is a computed ref over `useState('feature-flags')`, if the state updates, the computed
ref updates too — reactively.

---

## Part 3 — What We Built on Top of This

We agreed on a naming convention: the flag key for an extension is always:

```
extension.<extension-id>.enabled
```

For our test module:

```
extension.plenty-pwa-module-prototype.enabled
```

Set this to `false` in `flags.json` and the extension should be disabled. Set it to `true` and it
should be active. The whole system we built makes this actually do something.

---

## Part 4 — Disabling Blocks in the Editor Palette

### How blocks are discovered (background)

When you open the "Add Block" panel in the editor, the PWA needs to show a list of available blocks.
The list is built by a function called `resolveBlocksList()` in `blocks-imports.ts`.

This function uses Vite's `import.meta.glob` — a special build-time feature that scans the
filesystem for files matching a pattern. For extension blocks, it scans:

```
node_modules/*/runtime/components/blocks/**/defaults.ts
```

Each `defaults.ts` file exports a `getBlocksList()` function that returns the block definitions for
that package. `resolveBlocksList()` calls all of them and merges the results.

### The monorepo problem

`import.meta.glob('/node_modules/...')` looks in `apps/web/node_modules/`. But in a monorepo with
npm workspaces, packages are installed at the root: `plentyshop-pwa/node_modules/`. The pattern
never finds them.

**Fix:** we added a second glob pattern using a relative path from the source file to the monorepo
root's node_modules (5 levels up from `blocks-imports.ts`):

```ts
import.meta.glob('../../../../../node_modules/*/runtime/components/blocks/**/defaults.ts')
```

This is in `apps/web/app/utils/blocks/blocks-imports.ts`.

### The filter

We updated `resolveBlocksList()` to check the feature flags before loading each `defaults.ts`:

```ts
const featureFlags = useState('feature-flags', () => ({}))

const isDisabled = (path: string): boolean => {
  // extract "plenty-pwa-module-prototype" from the file path
  const extId = path.match(/node_modules\/(.+?)\/runtime\//)?.[1]
  if (!extId) return false
  return featureFlags.value[`extension.${extId}.enabled`] === false
}

// only load defaults.ts files from enabled extensions
const entries = Object.entries(allBlockListLoaders).filter(([path]) => !isDisabled(path))
```

The extension ID is extracted **from the file path automatically**. The module does not need to
declare its own ID anywhere — the path already contains it.

Result: when `extension.plenty-pwa-module-prototype.enabled` is `false` in `useState('feature-flags')`,
the `StoreHero/defaults.ts` is never loaded, and StoreHero does not appear in the block palette.

---

## Part 5 — Disabling Routes

### The problem

Nuxt bakes page routes into the router at **build time**. The `/store` route always exists in the
compiled output. You cannot remove it at runtime. What you can do is intercept navigation to it and
redirect away.

### Nuxt route middleware

Nuxt supports "route middleware" — functions that run before every page navigation. A **global**
route middleware runs on every navigation to every page.

### What shop-core does automatically

We added two things to `shop-core/src/module.ts`:

**Step 1 — Tag extension pages at build time**

A `pages:extend` hook runs during the build. It looks at every registered page and checks if its
file path belongs to a known extension:

```ts
nuxt.hook('pages:extend', (pages) => {
  for (const page of pages) {
    // does this page come from an extension's node_modules folder?
    const match = page.file.match(/node_modules\/(.+?)\/runtime\//)
    if (match && extensionIds.has(match[1])) {
      // tag the page with the extension ID
      page.meta = { ...page.meta, extensionId: match[1] }
    }
  }
})
```

After this, the `/store` route has `meta.extensionId = 'plenty-pwa-module-prototype'` baked in.

**Step 2 — Guard tagged pages at runtime**

A new plugin (`extension-guard.ts`) is added to shop-core. It runs in the browser and registers a
global route middleware:

```ts
addRouteMiddleware('extension-guard', (to) => {
  const extensionId = to.meta?.extensionId
  if (!extensionId) return // not an extension page, let it through

  const enabled = useFeatureFlag(`extension.${extensionId}.enabled`, true)
  if (!enabled.value) {
    return navigateTo('/not-found', { replace: true })
  }
}, { global: true })
```

Before every navigation, this middleware checks: does the destination page belong to a disabled
extension? If yes, redirect to `/not-found`.

**The module's `store.vue` does nothing special.** The guard is invisible to the extension author.

---

## Part 6 — The Editor Settings UI

We built a settings panel in the PWA editor that shows a list of installed extensions with toggles.

### File structure

```
apps/web/app/
├── components/settings/modules/
│   ├── ToolbarTrigger.vue                  ← the layers icon in the editor sidebar
│   ├── View.vue                            ← the panel title and description
│   └── extensions/
│       ├── View.vue                        ← "Extensions" subcategory header
│       └── 1.module-list/
│           └── ModuleToggles.vue           ← the actual toggle list
│
└── composables/useModuleManifest/
    ├── types.ts
    ├── useModuleManifest.ts                ← fetches and toggles modules
    └── index.ts
```

The settings framework **auto-discovers** these components via `import.meta.glob`. Placing a file
in the right folder is enough — no registration needed.

### How the toggle works

When you flip a switch in the editor:

1. `ModuleToggles.vue` calls `handleToggle(id, enabled)`
2. `handleToggle` calls `toggleModule(id, enabled)` from `useModuleManifest`
3. `toggleModule` sends a `PATCH` request to `/_shop/modules`
4. The server route writes the new value to `flags.json` on disk
5. `toggleModule` also updates `useState('feature-flags')` **directly in the browser** so the
   change is immediate — no page reload needed
6. `handleToggle` then calls `getBlocksLists()` which re-runs `resolveBlocksList()` with the
   updated flags — the block palette updates instantly

### The server routes

We created two Nitro server routes in `apps/web/server/routes/_shop/`:

**`modules.get.ts` — GET `/_shop/modules`**

Returns the list of installed extensions with their current enabled state.

- The extension list comes from **`runtimeConfig.shopCoreExtensions`** — this is baked into the
  server at build time by shop-core, so it works in both dev and production (no filesystem lookup
  for the manifest at runtime).
- The enabled state comes from reading `flags.json` directly (since this is a server route running
  in Node.js, it can read files).

**`modules.patch.ts` — PATCH `/_shop/modules`**

Accepts `{ id, enabled }` and writes the flag to `flags.json`.

```json
{ "extension.plenty-pwa-module-prototype.enabled": false }
```

The file path is read from the `JSON_FEATURE_FLAGS_FILE` env var (same env var that
`feature-flags.server.ts` uses), so both sides always read and write the same file.

---

## Part 7 — Why It Works in Both Dev and Production

The original `GET /_shop/modules` route read `module.manifest.json` at runtime using
`process.cwd()`. In development this is `apps/web/` and the file is there. In production, the
compiled server starts from a different directory (`.output/server/`) and the file is not there —
the list came back empty.

The fix: shop-core injects the extension list into `runtimeConfig` at **build time**:

```ts
// shop-core/src/module.ts — runs at build time
nuxt.options.runtimeConfig.shopCoreExtensions = (_cachedExtensions ?? [])
  .filter((e) => e.enabled !== false)
  .map((e) => ({ id: e.id, version: e.version ?? null }))
```

`runtimeConfig` is serialized into the Nitro server bundle. The GET route reads it with
`useRuntimeConfig(event)` — this works everywhere, regardless of working directory.

---

## Part 8 — The Complete Picture

```
                        EDITOR
                           │
                    flip toggle OFF
                           │
              PATCH /_shop/modules
              { id: "plenty-pwa-module-prototype", enabled: false }
                           │
              ┌────────────┴──────────────┐
              ▼                           ▼
        flags.json                useState('feature-flags')
        updated on disk            updated in browser memory
              │                           │
              │ next SSR request          │ immediately
              ▼                           ▼
    feature-flags.server        resolveBlocksList() re-runs
    plugin reads file           → StoreHero gone from palette
    → new SSR requests
      see flag = false

    extension-guard middleware
    → /store redirects to /not-found
    on next navigation
```

---

## Part 9 — What the Extension Module Does NOT Need to Do

This is important. The extension module (`plenty-pwa-module-prototype`) does not need to:

- Know about `flags.json`
- Call `useFeatureFlag()`
- Guard its own routes
- Register its own ID anywhere special
- Have any awareness of the toggle system

It just uses standard Nuxt module APIs (`extendPages`, `addComponent`, `getBlocksList`). Everything
else is handled by shop-core and the PWA automatically.

---

## Summary — What Lives Where

| What | Where | When it runs |
|------|-------|-------------|
| Extension manifest | `apps/web/module.manifest.json` | Read at build time |
| Extension list in bundle | `runtimeConfig.shopCoreExtensions` (set in shop-core) | Build time |
| Flags storage | `apps/web/flags.json` (dev) or `/etc/plenty/feature-flags/flags.json` (prod) | Runtime, per-request |
| Flags loaded into state | `shop-core` `feature-flags.server` plugin | Every SSR request |
| Block palette filter | `apps/web/app/utils/blocks/blocks-imports.ts` | Called when editor opens palette |
| Route tag | `shop-core` `pages:extend` hook | Build time |
| Route guard | `shop-core` `extension-guard` plugin | Every client-side navigation |
| Toggle UI | `apps/web/app/components/settings/modules/` | Editor only |
| Toggle API | `apps/web/server/routes/_shop/modules.get.ts` + `modules.patch.ts` | Runtime |
| Client-side instant sync | `useModuleManifest.toggleModule` updates `useState` | After PATCH |
