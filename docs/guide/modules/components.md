# Components Guide

## Introduction

This guide will show you how to create a new component in your module and how to override an existing component in your shop repository from your module.

## Scenarios

### 1. Creating a new component

To create a new component within your module, follow these steps:

- Add the component to your module. We recommend using the `src/runtime/components/` directory.
- Register the component in your module by adding the following code:

```typescript
// src/module.ts
// in the setup function

await addComponent({
  name: 'ModuleTest',
  filePath: resolve('./runtime/components/ModuleTest.vue'),
});
```

Your component is now registered and can be used in your shop repository.
In this example, you can use it as `<ModuleTest />`.

### 2. Override an existing component

To replace an existing component in your shop repository with a custom one, follow these steps:

1. Create a component in your module. We recommend using the `src/runtime/components/` directory. The name of the new component must be the same as the one you want to override. To override an existing component, it is not necessary to use the `addComponent` function in the setup in your module.
2. Hook into the `components:extend` hook.
3. Locate the component you want to override.
4. Update its `filePath` property to point to your custom component.

Example:

```typescript
// src/module.ts
// in the setup function

nuxt.hook('components:extend', (components) => {
  const uiButton = components.find((c) => c.pascalName === 'UiButton');
  if (uiButton) {
    uiButton.filePath = resolve('./runtime/components/UiButton.vue');
  }
});
```

This will replace the `UiButton` component in your shop repository with your custom version.
