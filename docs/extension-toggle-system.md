# Extension Toggle System — Complete Reference

This document covers everything that was built to enable runtime enabling/disabling of extensions
(Nuxt modules) in the PWA. It includes all changed and added files across three repos, code snippets,
explanations, and an honest pros/cons assessment.

**Repos involved:**

- `plentyshop-pwa` — the PWA frontend
- `shop-core` (`@plentymarkets/shop-core`) — the core Nuxt module
- `plenty-pwa-module-prototype` — the test extension used to prove the system works

---

## The Question This Answers

> _What's the mechanism for disabling a module? Is it a central helper in shop-core? Does each
> module have to handle this individually? If so, at what scale?_

**Short answer:** There is a central mechanism in shop-core that handles 80% of the work
automatically. A module author does not need to guard their own routes or know about `flags.json`.
However, if a module wants reactive behavior at the component level — e.g. hiding a banner, pausing
a timer, gracefully hiding injected content instead of just redirecting — it must opt in explicitly
using the composables shop-core exports.

The two tiers:

| Tier                       | Who does the work | What it covers                                                               |
| -------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| **Automatic (shop-core)**  | The platform      | Route navigation guard, block palette filter, SSR flag loading               |
| **Opt-in (module author)** | The module        | Component visibility, timer pause, slot registration, page override fallback |

---

## Architecture Overview

```
                     EDITOR TOGGLE (ModuleToggles.vue)
                              │
               PATCH /_shop/modules  { id, enabled }
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
        flags.json (disk)             useState('feature-flags')
        written by modules.patch.ts   updated in-memory by useModuleManifest
              │                                │
              │ every new SSR request          │ immediately, reactively
              ▼                                ▼
    feature-flags.server plugin      resolveBlocksList() re-evaluates
    reads file → populates state     → StoreHero gone from block palette

    extension-guard middleware        useExtensionEnabled() computed ref
    → /store redirects to /not-found  → CountdownBanner hides, timer pauses
    on next client navigation         → ExtensionSlot filters entries out
```

---

## The Flag Convention

Every extension flag follows one naming convention:

```
extension.<extension-id>.enabled
```

Example for `plenty-pwa-module-prototype`:

```json
{
  "extension.plenty-pwa-module-prototype.enabled": false
}
```

Setting this to `false` disables the extension. Absent key = enabled (default is always on).

---

## Part 1 — shop-core (the platform layer)

### Build time

#### `src/build/loadExtensions.ts`

Reads `module.manifest.json` from the project root. Validates entries — each must have a safe `id`
string and a valid `entry` (npm package name or `[name, options]` tuple).

```ts
// apps/web/module.manifest.json
[
  {
    id: 'plenty-pwa-module-prototype',
    entry: 'plenty-pwa-module-prototype',
    version: '0.1.0',
  },
];
```

`loadExtensionsSync` is the synchronous variant used in `moduleDependencies()` (which must be sync).
`loadExtensions` is the async variant used in `setup()`.

#### `src/build/setupExtensions.ts`

Takes the loaded entries and injects each enabled extension's settings into
`runtimeConfig.public[ext.id]` and private settings into `runtimeConfig[ext.id]`.

```ts
nuxt.options.runtimeConfig.public[ext.id] = {
  enabled: true,
  ...(ext.settings ?? {}),
};
```

#### `src/module.ts` (relevant parts)

Three things happen in the module setup relevant to this system:

**1. Extension list baked into runtimeConfig (for the GET route)**

```ts
nuxt.options.runtimeConfig.shopCoreExtensions = (_cachedExtensions ?? [])
  .filter((e) => e.enabled !== false)
  .map((e) => ({ id: e.id, version: e.version ?? null }));
```

This is what makes `GET /_shop/modules` work in production — the list is in the server bundle,
not read from the filesystem at runtime.

**2. Pages tagged with their extension ID**

```ts
nuxt.hook('pages:extend', (pages) => {
  const extensionIds = new Set((_cachedExtensions ?? []).filter((e) => e.enabled !== false).map((e) => e.id));
  for (const page of pages) {
    const match = page.file?.match(/node_modules\/(.+?)\/runtime\//) ?? page.file?.match(/modules\/(.+?)\/runtime\//);
    if (match && extensionIds.has(match[1])) {
      page.meta = { ...page.meta, extensionId: match[1] };
    }
  }
});
```

After this hook, `/store` has `meta.extensionId = 'plenty-pwa-module-prototype'` baked in.
The module does not set this itself — it is inferred from the file path.

**3. Feature flags defaults baked into runtimeConfig.public**

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

This ensures that even if `flags.json` is missing or doesn't mention the extension, the default is
`true` (enabled). The runtime plugin reads from file first, then falls back to these defaults.

---

### Runtime (plugins)

#### `src/runtime/plugins/feature-flags.server.ts`

Runs on **every SSR request**, before the page renders. Reads `flags.json` from disk (path
configurable via `JSON_FEATURE_FLAGS_FILE` env var). Puts the parsed object into
`useState('feature-flags')`, which Nuxt serializes into the SSR payload and hydrates on the client.

```ts
export default defineNuxtPlugin({
  name: 'shop-core:feature-flags',
  enforce: 'pre',
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    const flags = useState<Record<string, unknown>>('feature-flags', () => ({}));
    flags.value = await loadFeatureFlags({
      readFile,
      filePath: process.env.JSON_FEATURE_FLAGS_FILE ?? '/etc/plenty/feature-flags/flags.json',
      configFlags: runtimeConfig.public.shopCore.featureFlags,
    });
  },
});
```

**Key detail:** `configFlags` is the fallback. If the file doesn't exist (first run, no flags set),
it falls back to the defaults baked in at build time — so all extensions start as enabled.

#### `src/runtime/plugins/extension-guard.ts`

Runs on the client. Registers a global route middleware that checks every navigation target.

```ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'extension-guard',
    (to) => {
      const extensionId = to.meta?.extensionId as string | undefined;
      if (!extensionId) return;

      const enabled = useFeatureFlag(`extension.${extensionId}.enabled`, true);
      if (!enabled.value) {
        return navigateTo('/not-found', { replace: true });
      }
    },
    { global: true },
  );
});
```

Any page tagged with `extensionId` gets automatically guarded. The module author does nothing.
The redirect is client-side — if a user has `/store` bookmarked and the extension gets disabled,
the next time they navigate to it (or click a link) they hit `/not-found`.

**Limitation:** This does NOT cover SSR. If someone hits `/store` directly via URL while the server
is processing the request, the server renders the page. The guard only fires on client-side
navigation. See Pros/Cons for discussion.

---

### Runtime (composables)

#### `src/runtime/composables/useFeatureFlag.ts`

The primitive. Reads a flag by key from `useState('feature-flags')`. Returns a computed ref.

```ts
export const useFeatureFlag = (flag: string, defaultValue = false) => {
  const flags = useState<Record<string, unknown>>('feature-flags');
  return computed(() => Boolean(flags.value?.[flag] ?? defaultValue));
};
```

#### `src/runtime/composables/useExtensionEnabled.ts`

A higher-level composable that combines runtimeConfig (build-time default) with the feature flag
(runtime override). Both must be truthy for the extension to be considered enabled.

```ts
export const useExtensionEnabled = (id: string) => {
  const runtimeConfig = useRuntimeConfig();
  const flagEnabled = useFeatureFlag(`extension.${id}.enabled`, true);
  return computed(() => {
    const rcEnabled = (runtimeConfig.public[id] as { enabled?: boolean } | undefined)?.enabled !== false;
    return rcEnabled && flagEnabled.value;
  });
};
```

This is what module composables call. It is the single source of truth for a module's enabled state.

#### `src/runtime/composables/useModuleRendering.ts`

Allows a module plugin to register component names into a named rendering area. The PWA then uses
`<ModuleComponentRendering area="..." />` to render whatever was registered there. This is an
alternative to the slot system — it works with globally registered components by name.

```ts
export const useModuleRendering = (area: RenderingAreas) => {
  const state = useState(`useModuleRendering_${area}`, () => ({ components: [] as string[] }));

  const addComponent = (componentName: string) => {
    if (state.value.components.includes(componentName)) return;
    state.value.components.push(componentName);
  };

  return { addComponent, ...toRefs(state.value) };
};
```

---

### Runtime (types)

#### `src/runtime/types/extensions.ts`

```ts
export const DEFAULT_PRIORITY = 500;
export const MANIFEST_FILENAME = 'module.manifest.json';
export const LOG_PREFIX = '[shop-core | extensions]';
export const DANGEROUS_IDS = new Set(['__proto__', 'constructor', 'prototype']);

export interface ExtensionEntry {
  id: string;
  entry: ModuleEntry; // npm name or [name, options] tuple
  version?: string;
  priority?: number; // lower = loads first
  settings?: Record<string, unknown>; // public
  privateSettings?: Record<string, unknown>; // server-only
  enabled?: boolean; // false = skip at build time
}
```

---

### Runtime (utils)

#### `src/runtime/utils/featureFlagsHelper.ts`

Pure function — injectable deps for testability.

```ts
export const loadFeatureFlags = async (deps: LoadFeatureFlagsDeps): Promise<Record<string, unknown>> => {
  try {
    const parsed: unknown = JSON.parse(await deps.readFile(deps.filePath, 'utf-8'));
    if (isRecord(parsed)) return parsed;
  } catch {}
  return deps.configFlags ?? {};
};
```

---

## Part 2 — PWA server routes

#### `apps/web/server/routes/_shop/modules.get.ts`

Returns the list of installed extensions with their current enabled state, merging the build-time
list with the runtime flags file.

```ts
export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);
  // list baked in at build time — works in production
  const extensions = (runtimeConfig.shopCoreExtensions ?? []) as Array<{ id: string; version: string | null }>;
  const flags = readFlags(); // reads flags.json from disk

  return extensions.map((ext) => {
    const flagKey = `extension.${ext.id}.enabled`;
    const flagValue = flags[flagKey];
    return {
      id: ext.id,
      version: ext.version,
      enabled: flagValue !== undefined ? flagValue : true, // absent = enabled
    };
  });
});
```

#### `apps/web/server/routes/_shop/modules.patch.ts`

Writes `extension.<id>.enabled` to `flags.json`. Both routes use the same `JSON_FEATURE_FLAGS_FILE`
env var, so they always read/write the same file.

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody<PatchBody>(event);

  if (!body?.id || typeof body.enabled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'id and enabled are required' });
  }

  const flagsPath = getFlagsPath();
  let flags: Record<string, unknown> = {};

  if (existsSync(flagsPath)) {
    flags = JSON.parse(readFileSync(flagsPath, 'utf-8'));
  }

  flags[`extension.${body.id}.enabled`] = body.enabled;
  writeFileSync(flagsPath, JSON.stringify(flags, null, 2) + '\n');

  return { id: body.id, enabled: body.enabled };
});
```

---

## Part 3 — PWA composables

#### `apps/web/app/composables/useModuleManifest/useModuleManifest.ts`

Fetches the module list and handles toggling. The key detail is step 5: after the PATCH succeeds,
it writes directly into `useState('feature-flags')` so the change propagates reactively everywhere
in the same browser tab — without waiting for the next SSR request.

```ts
const toggleModule = async (id: string, enabled: boolean) => {
  loading.value = true;
  try {
    const updated = await $fetch<ModuleManifestEntry>('/_shop/modules', {
      method: 'PATCH',
      body: { id, enabled },
    });

    const index = modules.value.findIndex((module) => module.id === id);
    if (index !== -1) {
      modules.value[index] = updated;
    }

    // Instant reactive update — no page refresh needed
    const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
    featureFlags.value = { ...featureFlags.value, [`extension.${id}.enabled`]: enabled };
  } catch (error) {
    useHandleError(error as NuxtError<unknown> | null);
  } finally {
    loading.value = false;
  }
};
```

#### `apps/web/app/composables/useExtensionSlot/useExtensionSlot.ts`

The slot system. Modules register component objects (not names) into named slots. The slot then
renders them, filtered by `feature-flags` state. The component map is a plain module-level `Map`
(not reactive, not serialized) because Vue component objects cannot be serialized into SSR state.

```ts
const _componentRegistry = new Map<string, Component>();

const register = (slotName: string, component: Component, componentName: string, extensionId: string) => {
  _componentRegistry.set(componentName, component);
  if (!_slots.value[slotName]) {
    _slots.value[slotName] = [];
  }
  const alreadyRegistered = _slots.value[slotName].some((e) => e.componentName === componentName);
  if (!alreadyRegistered) {
    _slots.value[slotName].push({ componentName, extensionId });
  }
};

const getSlotEntries = (slotName: string) => {
  const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
  return computed(() => {
    return (_slots.value[slotName] ?? []).filter(({ extensionId }) => {
      return featureFlags.value[`extension.${extensionId}.enabled`] !== false;
    });
  });
};
```

When `toggleModule` updates `useState('feature-flags')`, `getSlotEntries`'s computed re-evaluates,
and Vue removes the disabled extension's component from the DOM. No page refresh.

---

## Part 4 — PWA components

#### `apps/web/app/components/ui/ExtensionSlot/ExtensionSlot.vue`

A thin wrapper around `useExtensionSlot`. Accepts a `name` prop and renders whatever components are
registered for that slot name and are currently enabled.

```vue
<template>
  <component :is="getSlotComponent(entry.componentName)" v-for="entry in entries" :key="entry.componentName" />
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
const { getSlotEntries, getSlotComponent } = useExtensionSlot();
const entries = getSlotEntries(props.name);
</script>
```

#### `apps/web/app/components/settings/modules/extensions/1.module-list/ModuleToggles.vue`

The editor toggle UI. Uses `SfSwitch` from Storefront UI. Calls `handleToggle` which
chains `toggleModule` → `getBlocksLists()` to update both the flag and the block palette.

```vue
<SfSwitch
  :model-value="mod.enabled !== false"
  :disabled="loading"
  @update:model-value="(val) => handleToggle(mod.id, val === true)"
/>
```

```ts
const handleToggle = async (id: string, enabled: boolean) => {
  await toggleModule(id, enabled);
  await getBlocksLists(); // refreshes block palette
};
```

---

## Part 5 — PWA pages (modified)

#### `apps/web/app/pages/index.vue`

Two additions to the homepage. First, the slot:

```vue
<UiExtensionSlot name="homepage-top" />
```

Modules register components here. When a module is disabled, its component disappears from this
slot reactively. Second, the `CountdownBanner` component (added by the module):

```vue
<CountdownBanner />
```

The banner checks `useExtensionEnabled` inside its composable and hides itself when disabled.

---

## Part 6 — Module (plenty-pwa-module-prototype)

This is a concrete example of a module using all three patterns.

### Module definition — `index.ts`

```ts
export default defineNuxtModule({
  meta: { name: 'plenty-pwa-module-prototype' },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    addComponent({ name: 'PlentyRocks', filePath: resolver.resolve('./runtime/components/PlentyRocks.vue') });

    addPlugin(resolver.resolve('./runtime/plugins/extension-state'));
    addPlugin(resolver.resolve('./runtime/plugins/slots'));
    addPlugin({ src: resolver.resolve('./runtime/plugins/shortcuts'), mode: 'client' });

    addImportsDir(resolver.resolve('./runtime/composables'));

    extendPages((pages) => {
      // New page
      pages.push({ name: 'store', path: '/store', file: resolver.resolve('./runtime/pages/store.vue') });

      // Page overrides — swap the file, save the original as an alias
      const checkoutPage = pages.find((p) => p.path === '/checkout');
      if (checkoutPage?.file) {
        _nuxt.options.alias['#pwa-checkout-original'] = checkoutPage.file;
        checkoutPage.file = resolver.resolve('./runtime/pages/checkout.vue');
      }

      const tacPage = pages.find((p) => p.path === '/terms-and-conditions');
      if (tacPage?.file) {
        _nuxt.options.alias['#pwa-tac-original'] = tacPage.file;
        tacPage.file = resolver.resolve('./runtime/pages/terms-and-conditions.vue');
      }
    });
  },
});
```

### Plugin: `runtime/plugins/slots.ts` — Slot registration

```ts
export default defineNuxtPlugin(() => {
  const { register } = useExtensionSlot();
  // Registers PlentyRocks into the 'homepage-top' slot.
  // The slot filters it out automatically when the extension is disabled.
  register('homepage-top', PlentyRocks, 'PlentyRocks', 'plenty-pwa-module-prototype');
});
```

The module must explicitly call `register`. This is intentional — the slot system cannot auto-
discover what should go where; the module author decides that.

### Plugin: `runtime/plugins/extension-state.ts` — Cookie sync

```ts
const EXTENSION_ID = 'plenty-pwa-module-prototype';
export default defineNuxtPlugin(() => {
  const flags = useState<Record<string, boolean>>('feature-flags', () => ({}));
  const cookie = useCookie<boolean>(`ext_${EXTENSION_ID}_enabled`, { default: () => true });

  const enabled = computed(() => flags.value[`extension.${EXTENSION_ID}.enabled`] !== false);

  // Keep a cookie in sync — useful for SSR decisions in server routes.
  watch(
    enabled,
    (val) => {
      cookie.value = val;
    },
    { immediate: true },
  );

  return { provide: { plentyModulePrototypeEnabled: enabled } };
});
```

### Plugin: `runtime/plugins/shortcuts.ts` — Client keyboard shortcut (guarded)

```ts
export default defineNuxtPlugin(() => {
  const enabled = useExtensionEnabled(EXTENSION_ID);
  const router = useRouter();

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!enabled.value) return; // no-op when disabled
    if (event.shiftKey && event.key === 'S') {
      router.push('/store');
    }
  });
});
```

### Composable: `runtime/composables/usePlentyModuleState.ts`

A module-specific wrapper around `useExtensionEnabled`. Prevents the module's own code from
hard-coding the extension ID in multiple places.

```ts
const EXTENSION_ID = 'plenty-pwa-module-prototype';

export const usePlentyModuleState = () => {
  const isEnabled = useExtensionEnabled(EXTENSION_ID);
  return { isEnabled };
};
```

### Composable: `runtime/composables/useCountdown.ts`

An example of component-level reactive behavior. The timer pauses when disabled, resumes when
re-enabled. Uses `usePlentyModuleState()` — not `useFeatureFlag` directly.

```ts
watch(
  enabled,
  (isEnabled) => {
    if (isEnabled) {
      start();
    } else {
      stop(); // timer pauses
    }
  },
  { immediate: true },
);
```

### New page: `runtime/pages/store.vue`

A completely new route `/store` added by the module. Guarded by shop-core's `extension-guard`
(automatic). Additionally, the page itself watches `enabled` and calls `showError({ statusCode: 404 })`
as an extra safeguard for the case where the guard fires during SSR.

```ts
const enabled = useExtensionEnabled('plenty-pwa-module-prototype');

watch(
  enabled,
  (val) => {
    if (!val) showError({ statusCode: 404, fatal: true });
  },
  { immediate: true },
);
```

### Overridden page: `runtime/pages/checkout.vue`

The module replaces `/checkout` entirely. To support graceful degradation when disabled, it imports
the original PWA checkout via the alias that was set up in `index.ts`, and switches between them
with `v-if` based on `isEnabled`.

```vue
<template>
  <PwaCheckout v-if="!isEnabled" />
  <div v-else>
    <!-- Module checkout UI -->
  </div>
</template>

<script setup lang="ts">
import PwaCheckout from '#pwa-checkout-original';
const { isEnabled } = usePlentyModuleState();
</script>
```

### Overridden page: `runtime/pages/terms-and-conditions.vue`

Same pattern as checkout. The alias `#pwa-tac-original` points to the original PWA page.

```vue
<template>
  <PwaTaC v-if="!isEnabled" />
  <div v-else>
    <!-- Module TaC content -->
  </div>
</template>

<script setup lang="ts">
import PwaTaC from '#pwa-tac-original';
const { isEnabled } = usePlentyModuleState();
</script>
```

---

## Part 7 — The Three Extension Patterns

### Pattern A: Slot injection

The module registers a component into a named slot at app startup. The PWA renders the slot via
`<UiExtensionSlot name="..." />`. When disabled, the component disappears reactively.

- **Module effort:** call `register()` in a plugin
- **PWA effort:** place `<UiExtensionSlot>` wherever injection is wanted
- **Works on disable:** immediately, in same tab, no refresh

### Pattern B: New page

The module adds a new route (`/store`). The route is automatically tagged by shop-core's
`pages:extend` hook. The `extension-guard` middleware redirects away when the extension is disabled.

- **Module effort:** `pages.push(...)` in `extendPages` — standard Nuxt
- **PWA effort:** none
- **Works on disable:** on next client-side navigation; SSR hit of the URL still renders (see Cons)

### Pattern C: Page override

The module swaps an existing PWA page file (`/checkout`, `/terms-and-conditions`). It stores the
original under a Nuxt alias and imports it back. The replacement page uses `v-if` on `isEnabled`
to switch between the module UI and the original.

- **Module effort:** set up alias + override in `extendPages`, implement `v-if` in the page
- **PWA effort:** none (the original page is untouched at the filesystem level)
- **Works on disable:** immediately — `v-if` reacts to flag change with no refresh

---

## Pros and Cons

### What works well

**No rebuild required.** Flipping a flag in `flags.json` (or via the editor toggle) is reflected
on the very next page load without touching the compiled server bundle.

**Mostly automatic for module authors.** Route guarding, block palette filtering, and SSR flag
loading require zero work from the module. A module that does nothing special still gets its routes
guarded and its blocks hidden automatically.

**Reactive in the browser.** The `useState('feature-flags')` → computed ref chain means that the
moment `toggleModule` writes the new state, every `useFeatureFlag`, `useExtensionEnabled`,
`useExtensionSlot`, and any `v-if` reading from them updates immediately. No page refresh.

**Consistent flag storage.** Both the server plugin and the PATCH route use `JSON_FEATURE_FLAGS_FILE`,
so they always read/write the same file regardless of environment.

**Extension list is production-safe.** `runtimeConfig.shopCoreExtensions` is serialized into the
Nitro bundle at build time. The GET route works correctly even when the filesystem layout changes
in production (`.output/server/`).

---

### Known limitations

**Route guarding is client-side only.** `extension-guard` is a client-side Nuxt plugin. If a user
hits a disabled extension's URL directly (e.g. bookmarked `/store`), the server processes the SSR
request and renders the page before the guard fires. The guard then redirects, causing a flash or
a visible redirect after hydration.

Mitigations in place: `store.vue` calls `showError({ statusCode: 404, fatal: true })` on mount so
the rendered page immediately throws a 404 in the browser. But this is a workaround, not a proper
solution.

A proper fix would be a Nuxt server middleware that reads `flags.json` and redirects at the edge
before SSR runs. Not implemented yet.

**Page overrides need module effort.** Pattern C (page override) requires the module to write the
`v-if` logic and set up the alias. If the module forgets, disabling it leaves the module page
rendered with no fallback. There is no framework-level enforcement.

**Slots require PWA opt-in.** An extension can only inject into slots that the PWA has explicitly
placed a `<UiExtensionSlot name="..." />` for. Modules cannot inject into arbitrary places without
PWA changes.

**Module is still compiled in.** All of this is runtime flag control, not build-time exclusion.
The extension's JavaScript bundle is always downloaded by the client. You cannot use this to
reduce bundle size.

**The timer/component pattern is boilerplate.** Any module that has reactive components (timers,
banners, etc.) needs to wire `useExtensionEnabled` manually. There is no hook or lifecycle the
platform calls automatically.

---

## Summary — What Lives Where

| File                                                 | Repo      | When it runs            | What it does                                               |
| ---------------------------------------------------- | --------- | ----------------------- | ---------------------------------------------------------- |
| `module.manifest.json`                               | PWA       | Build time (read)       | Declares which extensions are installed                    |
| `src/build/loadExtensions.ts`                        | shop-core | Build time              | Reads + validates the manifest                             |
| `src/build/setupExtensions.ts`                       | shop-core | Build time              | Injects settings into runtimeConfig                        |
| `src/module.ts` (`pages:extend` hook)                | shop-core | Build time              | Tags extension pages with extensionId                      |
| `src/module.ts` (`runtimeConfig.shopCoreExtensions`) | shop-core | Build time              | Bakes extension list into server bundle                    |
| `src/runtime/plugins/feature-flags.server.ts`        | shop-core | Every SSR request       | Reads flags.json → populates useState                      |
| `src/runtime/plugins/extension-guard.ts`             | shop-core | Every client navigation | Redirects disabled extension routes                        |
| `src/runtime/composables/useFeatureFlag.ts`          | shop-core | Runtime (Vue)           | Primitive computed ref over feature-flags state            |
| `src/runtime/composables/useExtensionEnabled.ts`     | shop-core | Runtime (Vue)           | Combines runtimeConfig + flag; module composables use this |
| `src/runtime/composables/useModuleRendering.ts`      | shop-core | Runtime (Vue)           | Alternative slot system using component names              |
| `src/runtime/utils/featureFlagsHelper.ts`            | shop-core | Runtime (Node)          | Pure helper for reading flags file                         |
| `server/routes/_shop/modules.get.ts`                 | PWA       | Runtime (server)        | Returns extension list with current enabled state          |
| `server/routes/_shop/modules.patch.ts`               | PWA       | Runtime (server)        | Writes flag to flags.json                                  |
| `composables/useModuleManifest/`                     | PWA       | Runtime (Vue)           | Fetches list + PATCH toggle; updates useState instantly    |
| `composables/useExtensionSlot/`                      | PWA       | Runtime (Vue)           | Slot registry; filters by feature-flags state              |
| `components/ui/ExtensionSlot/`                       | PWA       | Runtime (Vue)           | Renders slot entries for a named slot                      |
| `components/settings/modules/…/ModuleToggles.vue`    | PWA       | Runtime (editor)        | Toggle UI — the thing humans click                         |
| `pages/index.vue`                                    | PWA       | Runtime                 | Places `<UiExtensionSlot name="homepage-top" />`           |
| `runtime/plugins/slots.ts`                           | module    | App startup             | Registers PlentyRocks into homepage-top slot               |
| `runtime/plugins/extension-state.ts`                 | module    | App startup             | Syncs enabled state to a cookie                            |
| `runtime/plugins/shortcuts.ts`                       | module    | App startup (client)    | Keyboard shortcut, guarded by enabled state                |
| `runtime/composables/usePlentyModuleState.ts`        | module    | Runtime (Vue)           | Module's own wrapper around useExtensionEnabled            |
| `runtime/composables/useCountdown.ts`                | module    | Runtime (Vue)           | Timer that pauses when extension is disabled               |
| `runtime/pages/store.vue`                            | module    | Runtime                 | New route; has extra showError guard                       |
| `runtime/pages/checkout.vue`                         | module    | Runtime                 | Overrides /checkout; falls back to original via v-if       |
| `runtime/pages/terms-and-conditions.vue`             | module    | Runtime                 | Overrides /terms-and-conditions; same pattern              |
