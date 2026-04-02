# Add custom CSS and JS to your module

## Introduction

This guide will show you how to add custom CSS and JS in the head of the page.

::: warning
Adding resources directly to the head could impact the performance of the page.
We recommend adding JS and CSS code the native way. This means that the JS code is scoped to a `component` or `plugin` and the CSS is scoped to its `component`.
Hooking into `tailwind` is also a valid way of extending the app's styles, as detailed in the [tailwind](/guide/how-to/module/tailwind.md) guide.
:::

## Prerequisites / Preparation

This guide requires you to already have created a module.
If you haven't created a module yet, you can follow the [How-to create a module](/guide/how-to/module/index.md) guide.

## Create and register a plugin to inject your resources

We will use [useHead](https://nuxt.com/docs/api/composables/use-head) from nuxt to modify the page's head element.

```typescript
// runtime/plugins/customCssAndJs.ts
import { defineNuxtPlugin, useHead } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Hello from customCssAndJs.ts');

  if (import.meta.client) {
    useHead({
      // adding custom js to the head as script tag
      script: [`console.log('Hello from customCssAndJs.ts head script');`],
      // adding custom css file to the head as link
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/customcss.css',
        },
      ],
      // adding custom css into the head as style tag
      style: [
        `
                        header img {
                            background-color: green;
                        }
                    `,
      ],
    });

    // custom code directly in the plugin
    const body = document.querySelector('body');

    if (body) {
      body.style.backgroundColor = 'red';
    }
  }
});
```

register the plugin inside your `module.ts`

```typescript
// module.ts
addPlugin(resolve('./runtime/plugins/customCssAndJs'));
```
