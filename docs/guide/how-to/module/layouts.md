# Layouts Guide

## Introduction

This guide shows you how to create a new layout or override an existing layout in your shop repository from your module.

## Scenarios

### 1. Creating a new layout

To create a new layout within your module, follow these steps:

- Add the layout to your module. We recommend using the `src/runtime/layouts/` directory.
- Register the layout in your module by adding the following code:

```typescript
// src/module.ts
// in the setup function

addLayout(
  {
    src: resolve('./runtime/layouts/checkout-2.vue'),
  },
  'new-checkout-2',
); // Name of the layout
```

Your layout is now registered and can be used in your shop repository. In this example, you can use it as `layout: 'new-checkout-2'`.

### 2. Override an existing layout

To replace an existing layout in your shop repository with a custom one, follow these steps:

1. Create a layout in your module. We recommend using the `src/runtime/layouts/` directory. The name of the layout must be the same as the one you want to override. To just override an existing layout it is not necessary to use the `addLayout` function in the setup in your module.
2. Hook into the `app:resolve` hook.
3. Update the `file` property to point to your custom layout.

Example:

```typescript
// src/module.ts
// in the setup function

nuxt.hook('app:resolve', (app) => {
  app.layouts['checkout'] = {
    name: 'checkout',
    file: resolve('./runtime/layouts/checkout.vue'),
  };
});
```

This will replace the `checkout` layout in your shop repository with your custom version.
