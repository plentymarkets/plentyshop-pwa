---
prev: false
next: false
---

# Extension Activation

Not every module installed into a shop is necessarily licensed for that shop. PlentyONE tracks which
extensions are actually active per shop, and `@plentymarkets/shop-core` fetches that list once per
server request and exposes it through a small set of helpers. If your module is an **extension**
(gated behind PlentyONE licensing rather than always-on), it must declare a config with
`defineExtensionConfig` and use the helpers below to gate its own code — otherwise your module's
features will run even when the shop isn't licensed for them.

::: tip Not building a licensed extension?
If your module should simply always be active once installed, none of this applies — just follow the
regular [Modules guides](/guide/modules/index.md).
:::

## 1. Declare your extension config

Create `extension.config.ts` at the root of your module and declare its name with
`defineExtensionConfig`:

```ts
// my-module/extension.config.ts
import { defineExtensionConfig } from '#imports';

export default defineExtensionConfig({
  name: '@plentymarkets/four-seasons',
});
```

The `name` must exactly match your module's own package name — the `name` field in its
`package.json` (`@plentymarkets/four-seasons` in this example). That's the same identifier
PlentyONE licenses the extension under, so it has to match exactly. Every other file in your module
imports this one config object rather than repeating that string.

`defineExtensionConfig` relies on the `#imports` auto-import, which only resolves in runtime files
(plugins, components, composables) processed by Nuxt's Vite build. Your module's own `index.ts` — the
one with `defineNuxtModule`, loaded directly by Nuxt Kit in Node — has no access to `#imports`, so it
needs the same name written as its own literal:

```ts
// my-module/index.ts
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  meta: { name: '@plentymarkets/four-seasons' },
  // ...
});
```

So the name is written as a literal in two places — `meta.name` and the `defineExtensionConfig`
call — rather than one, but every plugin, composable, and component after that reads it from
`extension.config.ts` instead of repeating the string.

## 2. Gate your code

Your module's code can be reached through a few different entry points — a plugin, a composable
called from a component, a component mounted directly — and each one needs its own check. Pick
whichever of the following matches each call site.

### Plugins — `defineExtensionPlugin`

Use `defineExtensionPlugin` instead of `defineNuxtPlugin` when a plugin's whole purpose is gated
behind the extension. It skips `setup` entirely when the extension isn't active:

```ts
// my-module/runtime/plugins/some.plugin.ts
import { defineExtensionPlugin } from '#imports';
import extensionConfig from '../../extension.config';

export default defineExtensionPlugin(extensionConfig.name, (nuxtApp) => {
  // only runs when the extension is active
});
```

It also accepts the object form of `defineNuxtPlugin` when you need `name`, `enforce`, or additional
`dependsOn` entries:

```ts
export default defineExtensionPlugin(extensionConfig.name, {
  name: 'my-module:four-seasons',
  setup(nuxtApp) {
    // only runs when the extension is active
  },
});
```

This only gates the plugin's own `setup`. Code reached independently of this plugin still needs one
of the checks below.

### Composables and utils — `isActive()`

The config returned by `defineExtensionConfig` carries an `isActive()` method that re-evaluates on
every call, so it's safe to hold onto the same `extensionConfig` object everywhere rather than
re-importing it each time. Use it for early returns anywhere that isn't a full
`defineExtensionPlugin`/`ExtensionBoundary` call site:

```ts
// my-module/runtime/composables/useSomething.ts
import extensionConfig from '../../extension.config';

export function useSomething() {
  if (!extensionConfig.isActive()) return;
  // ...
}
```

### Component trees — `ExtensionBoundary`

Wrap the subtree in `ExtensionBoundary` instead of checking activity in every component's `setup`.
Vue slots are lazy, so the `v-if` inside `ExtensionBoundary` prevents the slot content's
`setup()`/render from running at all when the extension isn't active — not just its visibility:

```vue
<script setup lang="ts">
import extensionConfig from '../extension.config';
</script>

<template>
  <ExtensionBoundary :name="extensionConfig.name">
    <FourSeasonsWidget />
  </ExtensionBoundary>
</template>
```

An optional `fallback` slot renders instead when the extension is not active:

```vue
<ExtensionBoundary :name="extensionConfig.name">
  <FourSeasonsWidget />
  <template #fallback>
    <DefaultWidget />
  </template>
</ExtensionBoundary>
```

`ExtensionBoundary` is just a convenience helper, not a requirement — it's the same `isActive()`
check from above, wrapped in a component so you get slot laziness and a `fallback` slot for free.
A plain `v-if="extensionConfig.isActive()"` in your own component works just as well if you don't
need those.

### Checking a different extension — `isExtensionAuthorized`

`isActive()` is shorthand for checking your own extension's name. If you need to check whether
*another* extension is active — a cross-extension dependency, for example — use the lower-level
`isExtensionAuthorized` composable directly with that extension's name:

```ts
import { isExtensionAuthorized } from '#imports';

if (isExtensionAuthorized('@plentymarkets/some-other-extension')) {
  // ...
}
```

## Editor settings don't need gating

If your extension adds a [site setting](/guide/editor/site-settings-architecture.md), you don't need
to gate it with any of the helpers above. Settings for inactive extensions are hidden from the editor's
settings drawer automatically — add the setting the normal way and licensing is handled for you.
