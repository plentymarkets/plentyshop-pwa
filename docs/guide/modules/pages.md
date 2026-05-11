# Pages Guide

## Introduction

This guide explains how to create a new page in your module or override an existing page in your shop repository from your module.

## Scenarios

### 1. Creating a new page

To create a new page within your module, follow these steps:

- Add the page to your module. We recommend using the `src/runtime/pages/` directory.
- Register the page in your module by adding the following code:

```typescript
// src/module.ts
import type { NuxtPage } from '@nuxt/schema';

// in the setup function
extendPages((pages: NuxtPage[]) => {
  pages.push({
    name: 'page-name',
    file: resolve('./runtime/pages/my-page.vue'),
    path: '/my-path',
  });
});
```

Your page is now registered and can be used in your shop repository. In this example, your page is available at `/my-path`.

### 2. Override an existing page

To replace an existing page in your shop repository with a custom one, follow these steps:

1. Create a page in your module. We recommend using the `src/runtime/pages/` directory. The name of the page must be the same as the one you want to override.
2. Use the `extendPages` function to find the page you want to override.
3. Update its `file` property to point to your custom page.

Example:

```typescript
// src/module.ts
import type { NuxtPage } from '@nuxt/schema';

// in the setup function
extendPages((pages: NuxtPage[]) => {
  const overridePage = pages.find((p) => p.name === 'page-to-override');
  if (overridePage) {
    overridePage.file = resolve('./runtime/pages/my-page.vue');
  }

  // Override the product page
  const productPage = pages.find((p) => p.name === 'product-slug');
  if (productPage) {
    productPage.file = resolve('./runtime/pages/product/[slug].vue');
  }
});
```

This will replace the page in your shop repository with your custom version.

To make sure you get the correct page name, you can log all pages in the `extendRoutes` function:

```typescript
// src/module.ts
import type { NuxtPage } from '@nuxt/schema';

// in the setup function
extendPages((pages: NuxtPage[]) => {
  console.log(pages);
});
```
