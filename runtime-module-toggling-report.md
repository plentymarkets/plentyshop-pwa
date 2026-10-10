# Runtime Module Toggling — Technical Report

**Date:** 2026-08-26  
**Repos touched:** `plentyshop-pwa`, `shop-core`, `plenty-pwa-module-prototype` (new)

---

## 1. Goal

Design and implement a system that allows PWA extensions (Nuxt modules published to npm) to be **enabled or disabled at runtime** — no rebuild, no server restart — and surface this as a toggle switch in the editor's settings panel.

The secondary goal was to establish a clean contract: **the module should not need to know about the toggle mechanism**. Shop-core and the PWA own it entirely.

---

## 2. Background — How the PWA Loads Extension Modules

The PWA uses a file called `module.manifest.json` (in `apps/web/`) to declare which extensions are installed:

```json
[
  {
    "id": "plenty-pwa-module-prototype",
    "entry": "plenty-pwa-module-prototype",
    "version": "0.1.0"
  }
]
```

At build time, `@plentymarkets/shop-core` reads this file in its `moduleDependencies()` hook and returns each entry's `entry` field as a Nuxt module dependency. Nuxt then loads those modules during the build, registering their components, pages, and plugins. This is **Tier 1** — it requires a full rebuild to enable or disable a module.

---

## 3. Architecture — Three-Tier Toggle System

We designed (and partially implemented) a three-tier hierarchy:

| Tier | Mechanism | Requires |
|------|-----------|----------|
| 1 | `enabled: false` in `module.manifest.json` | Rebuild |
| 2 | `NUXT_PUBLIC_<ID>_ENABLED=false` env var | Server restart |
| 3 | `extension.<id>.enabled: false` in `flags.json` | **Nothing — live** |

Tier 3 is the primary deliverable. It leverages shop-core's existing `feature-flags.server` plugin which already reads a JSON file **per request** and populates `useState('feature-flags')` — the same mechanism used for feature flags throughout the PWA.

---

## 4. The Test Module — `plenty-pwa-module-prototype`

**Location:** `/Users/alexolteanplenty/workspace/plenty-pwa-module-prototype`

Created entirely from scratch to replace the old broken `plenty-products-module`. The module demonstrates what a third-party PWA extension looks like.

### Structure

```
plenty-pwa-module-prototype/
├── index.ts                              # Nuxt module entry point
├── package.json
└── runtime/
    ├── components/
    │   ├── StoreCard.vue                 # Product card UI component
    │   └── blocks/
    │       └── StoreHero/
    │           ├── StoreHero.vue         # CMS block renderer
    │           ├── StoreHeroForm.vue     # Editor form panel
    │           ├── defaults.ts           # Block palette registration
    │           └── types.ts
    └── pages/
        └── store.vue                     # /store route
```

### `index.ts` — Nuxt Module Entry

```ts
export default defineNuxtModule({
  meta: { name: 'plenty-pwa-module-prototype', configKey: 'plentyPwaModulePrototype' },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addComponent({ name: 'StoreCard', filePath: resolver.resolve('./runtime/components/StoreCard.vue') })
    addComponent({ name: 'StoreHero', filePath: resolver.resolve('./runtime/components/blocks/StoreHero/StoreHero.vue') })
    extendPages((pages) => {
      pages.push({ name: 'store', path: '/store', file: resolver.resolve('./runtime/pages/store.vue') })
    })
  },
})
```

### Key External Module Constraint

Files in external npm modules **do not receive Nuxt's auto-import transforms**. This means:
- `ref`, `computed`, etc. must be explicitly imported from `'vue'`
- Nuxt composables must be imported from `'#imports'`
- This applies to `.vue` files in `pages/` and any non-block components

Block components (`StoreHero.vue`, `StoreHeroForm.vue`) loaded via `import.meta.glob` at runtime **do** get transforms, so they can use auto-imported composables normally.

### `defaults.ts` — Block Palette Registration

```ts
export const getBlocksList = (): BlocksList => ({
  storeHero: {
    category: 'storeHero',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Store Hero',
    blockName: 'StoreHero',
    variations: [{ ... }],
  },
})
```

This is the contract for CMS blocks. `getBlocksList()` is called by `resolveBlocksList()` in the PWA at runtime to populate the AddBlockPopover palette.

---

## 5. Block Discovery — The Glob Problem

### How Block Discovery Works

The PWA discovers blocks via Vite's `import.meta.glob` in `apps/web/app/utils/blocks/blocks-imports.ts`. At dev server startup, Vite resolves three glob patterns and creates a static map of file paths to lazy import functions:

```ts
// Core PWA blocks
const coreBlocks = import.meta.glob('@/components/**/blocks/**/*.vue', ...)

// Local modules (apps/web/modules/*)
const nuxtModuleBlocks = import.meta.glob('~~/modules/*/runtime/components/blocks/**/*.vue', ...)

// npm packages in apps/web/node_modules/
const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', ...)
```

### The Problem

In a **npm workspaces monorepo**, packages are hoisted to the root `node_modules/` (`plentyshop-pwa/node_modules/`). Vite's `/node_modules/*/` pattern resolves **relative to the Vite root** (`apps/web/`), so it looks in `apps/web/node_modules/` — the wrong place.

The module is at `plentyshop-pwa/node_modules/plenty-pwa-module-prototype/`, not `apps/web/node_modules/`.

### The Fix

Added a fourth glob pattern using a **relative path** from `blocks-imports.ts` to the monorepo root `node_modules/` (5 levels up):

```ts
// apps/web/app/utils/blocks/blocks-imports.ts
const workspaceCustomerBlocks = import.meta.glob(
  '../../../../../node_modules/*/runtime/components/blocks/**/*.vue',
  { import: 'default' },
)

const workspaceCustomerBlockListLoaders = import.meta.glob(
  '../../../../../node_modules/*/runtime/components/blocks/**/defaults.ts',
)
```

The same relative path is used for both the Vue component loaders and the `defaults.ts` loaders. Both are merged into their respective registries.

### Abandoned Approaches

1. **Symlink in `apps/web/modules/`** — Created `apps/web/modules/plenty-pwa-module-prototype → /workspace/plenty-pwa-module-prototype`. This broke because Nuxt 4 **auto-scans the `modules/` directory** and loaded the module a second time (double-load), causing conflicts.

2. **Symlink in `apps/web/node_modules/`** — Technically correct for the existing `/node_modules/*/` glob, but fragile: `npm install` wipes `apps/web/node_modules/` and the symlink is lost.

---

## 6. Feature Flags — The Live Toggle Mechanism

### How shop-core's Feature Flags Work

`shop-core` ships a `feature-flags.server` plugin that runs with `enforce: 'pre'` on every SSR request:

```ts
// shop-core/src/runtime/plugins/feature-flags.server.ts
export default defineNuxtPlugin({
  enforce: 'pre',
  async setup() {
    const flags = useState('feature-flags', () => ({}))
    flags.value = await loadFeatureFlags({
      filePath: process.env.JSON_FEATURE_FLAGS_FILE ?? '/etc/plenty/feature-flags/flags.json',
      configFlags: runtimeConfig.public.shopCore.featureFlags,
    })
  },
})
```

The file is read fresh on **every request**. No caching. This means any change to `flags.json` takes effect on the next page request — no restart needed.

### Local Development Setup

`apps/web/.env`:
```
JSON_FEATURE_FLAGS_FILE='./flags.json'
```

`apps/web/flags.json`:
```json
{
  "extension.plenty-pwa-module-prototype.enabled": true
}
```

### shop-core Changes — Seeding Extension Flags

In `shop-core/src/module.ts`, after loading extensions, default flags are seeded into `runtimeConfig.public.shopCore.featureFlags`:

```ts
featureFlags: {
  ...Object.fromEntries(
    (_cachedExtensions ?? [])
      .filter((e) => e.enabled !== false)
      .map((e) => [`extension.${e.id}.enabled`, true]),
  ),
  ...(_options.featureFlags ?? {}),
},
```

This registers `extension.plenty-pwa-module-prototype.enabled = true` as a default. The JSON file can then override it to `false` — the `loadFeatureFlags` utility merges file values over config defaults.

### shop-core Changes — `enabled` in runtimeConfig

`shop-core/src/build/setupExtensions.ts` was updated to inject an `enabled: true` field into `runtimeConfig.public[ext.id]` for every active extension:

```ts
nuxt.options.runtimeConfig.public[ext.id] = {
  enabled: true,
  ...(hasPublicSettings ? ext.settings : {}),
};
```

This gives Tier 2: setting `NUXT_PUBLIC_PLENTY_PWA_MODULE_PROTOTYPE_ENABLED=false` as an env var overrides this at server start.

---

## 7. Block Palette Filtering

`resolveBlocksList()` in `blocks-imports.ts` was updated to filter out blocks from disabled extensions **before** loading their `defaults.ts`:

```ts
const extensionIdFromPath = (path: string): string | null => {
  const match = path.match(/node_modules\/(.+?)\/runtime\//)
    || path.match(/modules\/(.+?)\/runtime\//);
  return match?.[1] ?? null;
};

export const resolveBlocksList = async (): Promise<BlocksList> => {
  const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));

  const isDisabled = (path: string): boolean => {
    const extId = extensionIdFromPath(path);
    if (!extId) return false;
    const key = `extension.${extId}.enabled`;
    return key in featureFlags.value && featureFlags.value[key] === false;
  };

  const entries = Object.entries(allBlockListLoaders).filter(([path]) => !isDisabled(path));
  const modules = await Promise.all(entries.map(([, loader]) => loader()));
  // ... merge and return
};
```

The extension ID is extracted **from the file path** (e.g. `../../../../../node_modules/plenty-pwa-module-prototype/runtime/...` → `plenty-pwa-module-prototype`). No cooperation from the module is required.

---

## 8. Route Guarding

### First Attempt — Module-Owned Guard (wrong)

Added `useFeatureFlag` check directly to the module's `store.vue`:

```ts
const extensionEnabled = useFeatureFlag("extension.plenty-pwa-module-prototype.enabled", true)
if (!extensionEnabled.value) {
  await navigateTo("/not-found", { replace: true })
}
```

**This was reverted.** The module should not own the toggle mechanism.

### Correct Approach — shop-core Owned Guard

Two additions to shop-core:

**1. `pages:extend` hook in `module.ts`** — tags every page registered by an extension with `meta.extensionId`:

```ts
nuxt.hook('pages:extend', (pages) => {
  const extensionIds = new Set((_cachedExtensions ?? [])
    .filter((e) => e.enabled !== false).map((e) => e.id));

  for (const page of pages) {
    if (!page.file) continue;
    const match = page.file.match(/node_modules\/(.+?)\/runtime\//)
      ?? page.file.match(/modules\/(.+?)\/runtime\//);
    if (!match?.[1]) continue;
    if (extensionIds.has(match[1])) {
      page.meta = { ...page.meta, extensionId: match[1] };
    }
  }
});
```

**2. `extension-guard.ts` plugin** — registers a global client-side route middleware:

```ts
// shop-core/src/runtime/plugins/extension-guard.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('extension-guard', (to) => {
    const extensionId = to.meta?.extensionId as string | undefined;
    if (!extensionId) return;

    const enabled = useFeatureFlag(`extension.${extensionId}.enabled`, true);
    if (!enabled.value) {
      return navigateTo('/not-found', { replace: true });
    }
  }, { global: true });
});
```

The module's `store.vue` is clean. The guard fires automatically on every navigation to any route that was contributed by a registered extension.

**Status:** Implemented in shop-core source but not yet verified end-to-end because shop-core's `dist/` needs to be rebuilt (`npm run prepack` in `shop-core/`).

---

## 9. Settings UI — Editor Toggle Panel

A full settings panel was added to the PWA editor following the existing pattern used by General, SEO, and Checkout settings.

### File Structure

```
apps/web/app/
├── components/settings/modules/
│   ├── ToolbarTrigger.vue                        # Layers icon in editor sidebar
│   ├── View.vue                                  # Main panel description
│   └── extensions/
│       ├── View.vue                              # "Extensions" subcategory header
│       └── 1.module-list/
│           └── ModuleToggles.vue                 # Toggle list
│
└── composables/useModuleManifest/
    ├── index.ts
    ├── types.ts
    └── useModuleManifest.ts
```

### Auto-Discovery

The settings framework uses `import.meta.glob` to discover panels automatically:
- `utils/settings-groups-imports/index.ts` discovers `@/components/**/settings/**/*.vue`
- `utils/triggers-imports/index.ts` discovers `@/components/**/settings/*/*ToolbarTrigger.vue`

No registration is needed — placing files in the right directory is enough.

### `useModuleManifest` Composable

```ts
// Fetches module list with enabled state from /_shop/modules
const fetchModules = async () => {
  modules.value = await $fetch('/_shop/modules')
}

// Writes to flags.json AND updates useState('feature-flags') client-side
const toggleModule = async (id: string, enabled: boolean) => {
  const updated = await $fetch('/_shop/modules', { method: 'PATCH', body: { id, enabled } })
  modules.value[index] = updated

  // Instant client-side update — no page reload needed
  const featureFlags = useState('feature-flags', () => ({}))
  featureFlags.value = { ...featureFlags.value, [`extension.${id}.enabled`]: enabled }
}
```

After `toggleModule`, `ModuleToggles.vue` calls `getBlocksLists()` to re-run `resolveBlocksList()` so the block palette updates immediately.

### Server Routes

**`GET /_shop/modules`** (`server/routes/_shop/modules.get.ts`):
- Reads `module.manifest.json` for the module list
- Reads `flags.json` (via `JSON_FEATURE_FLAGS_FILE` env var) for the enabled state of each module
- Merges: if `extension.<id>.enabled` exists in flags, that wins; otherwise falls back to manifest's `enabled` field

**`PATCH /_shop/modules`** (`server/routes/_shop/modules.patch.ts`):
- Body: `{ id: string, enabled: boolean }`
- Reads `flags.json`, sets `extension.<id>.enabled`, writes back
- The next SSR request will pick up the new value via the `feature-flags.server` plugin

---

## 10. Instant Client-Side Update Flow

When the user flips a toggle:

```
1. SfSwitch @update:model-value fires
2. handleToggle(id, enabled) called in ModuleToggles.vue
3. PATCH /_shop/modules → flags.json updated on disk
4. useState('feature-flags') updated in-memory on the client
5. getBlocksLists() called → resolveBlocksList() re-runs with new flags
6. StoreHero disappears from / reappears in AddBlockPopover immediately
7. useFeatureFlag('extension.<id>.enabled') computed refs update reactively
   (affects any component currently watching the flag)
```

For the route guard: the middleware fires on the **next navigation** to a guarded route. If the user is already on `/store` when the toggle is flipped, they are not immediately kicked out. The next time they navigate to `/store`, they are redirected.

---

## 11. What Works

| Feature | Status |
|---------|--------|
| StoreHero block appears in AddBlockPopover | ✅ Working |
| Block palette filtering when extension disabled | ✅ Working |
| `flags.json` toggle persisted via editor UI | ✅ Working |
| Instant palette update after toggle | ✅ Working |
| Module toggle panel in editor sidebar | ✅ Working |
| `useState('feature-flags')` client-side sync | ✅ Working |
| `pages:extend` hook tagging extension pages | ✅ Implemented |
| `extension-guard` global route middleware | ✅ Implemented |
| Module owns zero toggle logic | ✅ Achieved |

## 12. What Needs Verification

| Feature | Blocker |
|---------|---------|
| Route guard via `extension-guard` plugin | shop-core `dist/` must be rebuilt (`npm run prepack` in `shop-core/`) |

---

## 13. Key Files Changed

### `plentyshop-pwa`

| File | Change |
|------|--------|
| `apps/web/app/utils/blocks/blocks-imports.ts` | Added workspace root `node_modules` glob patterns; `resolveBlocksList()` now filters disabled extensions via `useState('feature-flags')` |
| `apps/web/app/components/settings/modules/**` | New: full settings panel (ToolbarTrigger, View, ModuleToggles) |
| `apps/web/app/composables/useModuleManifest/**` | New: composable for fetching and toggling modules |
| `apps/web/server/routes/_shop/modules.get.ts` | New: reads manifest + flags, returns merged state |
| `apps/web/server/routes/_shop/modules.patch.ts` | New: writes `extension.<id>.enabled` to `flags.json` |
| `apps/web/flags.json` | New: local feature flags file for dev |
| `apps/web/.env` | Added `JSON_FEATURE_FLAGS_FILE='./flags.json'` |

### `shop-core`

| File | Change |
|------|--------|
| `src/build/setupExtensions.ts` | Injects `enabled: true` into `runtimeConfig.public[ext.id]` for each extension |
| `src/module.ts` | Seeds `extension.<id>.enabled: true` into featureFlags defaults; adds `pages:extend` hook; registers `extension-guard` plugin |
| `src/runtime/plugins/extension-guard.ts` | New: global route middleware that blocks navigation to pages from disabled extensions |

### `plenty-pwa-module-prototype`

| File | Change |
|------|--------|
| `runtime/pages/store.vue` | Reverted — removed the `useFeatureFlag` guard that was incorrectly placed here |

---

## 14. Architecture Invariants

- **The module is passive.** It publishes routes and blocks using standard Nuxt APIs (`extendPages`, `addComponent`, `getBlocksList`). It has no knowledge of the toggle system.
- **Flag key convention:** `extension.<npm-package-id>.enabled` — derived from the module's `id` in `module.manifest.json`.
- **Path-based extension detection:** Both `resolveBlocksList()` and the `pages:extend` hook extract the extension ID from file paths (`/node_modules/<id>/runtime/`). No manifest metadata needed in individual block files.
- **flags.json is the source of truth for runtime state.** `module.manifest.json` declares what is installed. `flags.json` declares what is active.
