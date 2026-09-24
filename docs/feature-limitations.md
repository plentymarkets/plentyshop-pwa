# Extension Toggle System — Limitations

This document explains why a fully general "disable everything a module does at runtime" is
architecturally impossible in Nuxt, and what the realistic boundaries of the toggle system are.

---

## The Core Problem

A Nuxt module is a **build-time construct**. When you run `npm run build`, Nuxt calls each
module's `setup()` function. That function registers things — pages, plugins, components, server
routes, composables — and Nuxt compiles all of them into the output bundle.

By the time the server is running and a user is browsing the shop, the module's code is already
inside the compiled output. It is not a separate, removable unit. It is woven into the build
artifact.

This is not a flaw in our implementation. It is a fundamental property of how Nuxt works.

---

## What "Disabling" Actually Means at Runtime

When we say "disable an extension at runtime," we can mean two very different things:

### Soft disable
The extension's code is still in the bundle, but we intercept every surface where it would
appear to the user and hide it or redirect it. The user experiences the extension as if it
does not exist. The code is just never triggered.

### Hard disable
The extension's code is genuinely not present. Nothing it registered exists. No routes, no
plugins, no components, no server routes. This requires the module to not have been included
in the build at all.

**Tier 3 (flags.json toggle) achieves a soft disable.**
**Tier 1 (module.manifest.json `enabled: false`) achieves a hard disable, but requires a rebuild.**

---

## What a Module Can Register — and Whether We Can Disable It at Runtime

### 1. Pages / Routes

**What it does:** calls `extendPages()` in `setup()`. Nuxt adds the route to the Nitro router
and the client-side Vue Router during the build.

**Can we disable at runtime?** Yes, generically.

Shop-core's `pages:extend` hook runs during the build and tags every page that comes from an
extension with `page.meta.extensionId`. The `extension-guard` plugin then adds a global client-side
route middleware that checks this tag on every navigation:

```
user navigates to /store
→ middleware checks: does this route have meta.extensionId?
→ yes: "plenty-pwa-module-prototype"
→ checks useFeatureFlag("extension.plenty-pwa-module-prototype.enabled", true)
→ flag is false → redirect to /not-found
```

This works for any extension, for any route, with no cooperation from the extension author.
The route still exists in the router. We just prevent anyone from reaching it.

**Limitation:** the redirect only fires on client-side navigation. A direct server-side request
(e.g. someone typing `/store` in the address bar) goes through SSR first. We would need a
Nitro server middleware to block that too. Currently not implemented.

---

### 2. CMS Blocks (block palette)

**What it does:** the extension ships a `defaults.ts` file with a `getBlocksList()` export.
The PWA discovers this file via `import.meta.glob` at build time and calls it at runtime to
populate the "Add Block" palette in the editor.

**Can we disable at runtime?** Yes, generically.

`resolveBlocksList()` in `blocks-imports.ts` extracts the extension ID from the file path of
each `defaults.ts` (e.g. `node_modules/plenty-pwa-module-prototype/runtime/...` → extracts
`plenty-pwa-module-prototype`) and checks `useState('feature-flags')` before loading it.
If the extension is disabled, the `defaults.ts` is never called, and none of its blocks appear
in the palette.

This works for any extension without any cooperation from the extension author.

**Limitation:** if a block from a disabled extension was already placed on a page, that block
will still try to render. The block component is in the bundle. The rendered output would either
show the block (because `getCachedBlockComponent` still finds it) or show nothing (if the
component gracefully handles missing data). We do not currently hide already-placed blocks
when their extension is disabled.

---

### 3. Vue Plugins

**What it does:** the extension calls `addPlugin()` in `setup()`. Nuxt adds the plugin to the
list of plugins that run when the Vue app initializes on every page load.

**Can we disable at runtime?** No, not without cooperation from the module.

Plugins run during app initialization — before any component renders, before any route
middleware fires. By the time we could check a feature flag, the plugin has already executed.

The only way to prevent a plugin from having side effects is for the plugin itself to check
the flag at the very start:

```ts
// inside the module's plugin
export default defineNuxtPlugin(() => {
  const enabled = useFeatureFlag('extension.my-module.enabled', true)
  if (!enabled.value) return  // exit early, do nothing
  // ... rest of plugin
})
```

This requires the module author to write this guard. Shop-core cannot inject it automatically
because the plugin's internal logic is opaque — we do not know what it does or what side effects
it has.

**Practical impact:** for most extensions, plugins set up things like SDK clients, event listeners,
or global state. If the extension is soft-disabled (routes blocked, blocks hidden), the plugin's
side effects are largely harmless because nothing ever calls the things it set up. But technically
the code ran.

---

### 4. Registered Components (`addComponent`)

**What it does:** the extension calls `addComponent()` in `setup()`. Nuxt makes the component
globally available in templates, e.g. `<StoreHero>` and `<StoreCard>`.

**Can we disable at runtime?** Not really — but it does not matter.

The component definitions exist in the compiled bundle. Nuxt has already registered them. You
cannot un-register a Vue component at runtime.

However, components are passive. A component definition sitting in the bundle does absolutely
nothing unless something renders it. If the routes that use the component are blocked, and the
blocks that use the component are hidden from the palette, the component never renders.
The registration is effectively inert.

---

### 5. Nitro Server Routes

**What it does:** the extension may add files to `server/routes/` or use `addServerHandler()`
in `setup()`. These become HTTP endpoints in the compiled Nitro server.

**Can we disable at runtime?** Partially, with a Nitro middleware.

A global Nitro middleware could read `flags.json` and return 403 for any request path that
belongs to a disabled extension. But knowing which paths belong to which extension requires
a naming convention (e.g. all routes from `plenty-pwa-module-prototype` must be under
`/_plenty-pwa-module-prototype/`).

Currently not implemented. If the extension does not expose server routes, this is not
a concern.

---

### 6. Composables and Utilities

**What it does:** the extension calls `addImports()` in `setup()`. Functions become globally
auto-imported in the PWA — you can call `useStoreProducts()` anywhere without an import statement.

**Can we disable at runtime?** No — and it does not matter.

A composable is just a function. Its definition is in the bundle. It is not "running" until
something calls it. If no routes render and no components call it, it is simply never invoked.

---

### 7. i18n Translations

**What it does:** the extension may add translation strings via `@nuxtjs/i18n`'s module API.

**Can we disable at runtime?** No.

Translation strings are merged into the i18n message catalog at build time. They exist in
the compiled output. Removing them at runtime is not possible.

**Practical impact:** if the extension is disabled, the translation keys are still technically
available in the catalog. Nothing displays them because nothing renders. Having extra unused
keys in the catalog causes no user-visible problem.

---

## Summary Table

| What the module registers | Runtime disable? | Method | Requires module cooperation? |
|---|---|---|---|
| Pages / client routes | ✅ Soft | `pages:extend` tag + global middleware | No |
| CMS blocks in palette | ✅ Soft | Path-based filter in `resolveBlocksList()` | No |
| Already-placed CMS blocks | ❌ No | — | — |
| Vue plugins | ❌ No | Module must check flag at plugin start | Yes |
| Registered components | ✅ Irrelevant | Never render if routes are blocked | No |
| Nitro server routes | ⚠️ Partial | Global Nitro middleware (not implemented) | No (with convention) |
| Composables | ✅ Irrelevant | Never called if routes are blocked | No |
| i18n translations | ❌ No | — | — |
| SSR page requests (direct URL) | ⚠️ Not yet | Needs Nitro middleware | No |

---

## The Only Truly General Solution

If you need to guarantee that **none** of a module's code runs — no plugins execute, no server
routes exist, no components are registered, no translation strings are loaded — the answer is:

**Do not include the module in the build.**

Set `enabled: false` in `module.manifest.json` before building. Shop-core skips the module in
`moduleDependencies()`. Nuxt never loads it. The compiled output contains nothing from that
module. This is a hard disable.

This requires a rebuild. In a proper build pipeline, toggling `enabled: false` would trigger an
automated rebuild and redeploy. That is the correct production workflow for a permanent disable.

The flags.json toggle is the correct solution for **temporary** or **operational** disables — where
you want to turn something off quickly without waiting for a build pipeline, accepting that the
compiled code is still in the bundle but nothing surfaces it to the user.

---

## Practical Recommendation

Use Tier 1 (rebuild) and Tier 3 (flags.json) for different purposes:

| Scenario | Use |
|---|---|
| Permanently removing an extension from the shop | Tier 1 — set `enabled: false`, rebuild, redeploy |
| Temporarily hiding an extension during an incident | Tier 3 — flip the flag, instant effect |
| A/B testing an extension for some users | Tier 3 — flag per request (future work) |
| Extension causes a critical bug in production | Tier 3 — disable immediately, fix, re-enable |
