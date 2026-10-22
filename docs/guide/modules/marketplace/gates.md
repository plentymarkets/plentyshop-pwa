---
prev: true
next: false
---

# Gates

Once your module has an `extension.config.ts` (see [Setup](/guide/modules/marketplace/setup.md)), use the helpers below to gate its code.
Your module's code can be reached through a few different entry points — a plugin, a composable called from a component, a component mounted directly — and each one needs its own check.
Pick whichever of the following matches each call site.
If your extension adds a [site setting](/guide/editor/site-settings-architecture.md), it will gate it automatically.

## Plugins — `defineExtensionPlugin`

Use `defineExtensionPlugin` instead of `defineNuxtPlugin` when a plugin's whole purpose is gated behind the extension.
It skips `setup` entirely when the extension isn't active:

```ts
// my-module/runtime/plugins/some.plugin.ts
import { defineExtensionPlugin } from '#imports';
import extensionConfig from '../extension.config';

export default defineExtensionPlugin(extensionConfig.name, (nuxtApp) => {
  // only runs when the extension is active
});
```

It also accepts the object form of `defineNuxtPlugin` when you need `name`, `enforce`, or additional `dependsOn` entries:

```ts
export default defineExtensionPlugin(extensionConfig.name, {
  name: 'my-module:four-seasons',
  setup(nuxtApp) {
    // only runs when the extension is active
  },
});
```

## Composables and utils — `isActive()`

The config returned by `defineExtensionConfig` carries an `isActive()` method that re-evaluates on every call, so it's safe to hold onto the same `extensionConfig` object everywhere rather than re-importing it each time.
Use it for early returns anywhere that isn't a full `defineExtensionPlugin`/`ExtensionBoundary` call site:

```ts
// my-module/runtime/composables/useSomething.ts
import extensionConfig from '../extension.config';

export function useSomething() {
  if (!extensionConfig.isActive()) return;
  // ...
}
```

## Component trees — `ExtensionBoundary`

Wrap the subtree in `ExtensionBoundary` instead of checking activity in every component's `setup`.
Vue slots are lazy, so the `v-if` inside `ExtensionBoundary` prevents the slot content's `setup()`/render from running at all when the extension isn't active — not just its visibility:

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

`ExtensionBoundary` is just a convenience helper, not a requirement — it's the same `isActive()` check from above, wrapped in a component so you get slot laziness and a `fallback` slot for free.
A plain `v-if="extensionConfig.isActive()"` in your own component works just as well if you don't need those.
