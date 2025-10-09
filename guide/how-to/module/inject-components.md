# How to inject components into shop areas

## Introduction
This guide shows you how to insert additional components into predefined areas of your shop.

## Prerequisites
- You need at least one Vue component that you want to render in the shop.

::: info
In order for your component to be rendered in a shop area, it must be registered globally.
For example, this could look like this:

```typescript
// src/module.ts
// in the setup function

await addComponent({
  name: 'ModuleTest',
  filePath: resolve('./runtime/components/ModuleTest.vue'),
  global: true,
});
```
:::

## Areas

### Available predefined areas
All existing predefined areas are listed in the [`apps/web/app/composables/useModuleRendering/areas.ts`](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/composables/useModuleRendering/areas.ts) file within your shop repository.

### Adding a new custom area
1. In your shop repository, open the file `apps/web/app/composables/useModuleRendering/areas.ts` and add a new entry to the areas array. If you try to inject your component into a non-existing entry, your shop will throw an error.
2. In the location of the template in which you want to display this new area, add the following:
```html
<ModuleComponentRendering area="NameOfTheArea" />
```
Wherever you place this component, the injected components for `NameOfTheArea` will be rendered.

## Injecting components
Once your component is registered globally (see the Prerequisites section above), you can inject it into a specific area by creating or editing a plugin in your module:

```typescript
// src/runtime/plugins/injectComponents.ts

import { defineNuxtPlugin } from 'nuxt/app';
import { useModuleRendering } from '~/composables/useModuleRendering';

export default defineNuxtPlugin((nuxtApp) => {
  const { addComponent } = useModuleRendering('AreaName');
  addComponent('ComponentName');
});
```

- `AreaName`  is the identifier for the shop area in which you want your component to appear.
- `ComponentName` corresponds to the name you provided when registering the component.

When your application runs, `ComponentName` will be rendered in the designated `AreaName` area of your Shop.