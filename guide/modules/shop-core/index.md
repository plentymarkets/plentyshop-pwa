---
prev: false
next: false
---

# Shop Core

A Nuxt module for managing core shop functionality, shop events, and cookie consent.  
The Shop Core module acts as a bridge between other modules and the base app.

## Installation

The Shop Core module is preinstalled in the base app.
If you want to use it in a custom module, install it with your preferred package manager:

::: tabs
== npm

```
npm install @plentymarkets/shop-core
```

== yarn

```
yarn add @plentymarkets/shop-core
```

:::

To install the module you can add it to our projects `nuxt.config.ts` or directly install the module inside your module as [moduleDependencies](https://nuxt.com/docs/4.x/api/kit/modules#specifying-module-dependencies) inside your `module.ts/index.ts`:

```ts
 moduleDependencies: {
    '@plentymarkets/shop-core': {
      version: '>=1.13.4',
    },
  },
```

You are still able to install the module with `installModule` from `@nuxt/kit` but this has been deprecated https://nuxt.com/docs/4.x/api/kit/modules#installmodule

Outdated reference, see our [Google Analytics implementation](https://github.com/plentymarkets/shop-module-gtag/blob/main/src/module.ts#L33).

- [Nuxt documentation: Using other modules in your module](https://nuxt.com/docs/guide/going-further/modules#using-other-modules-in-your-module)

## Features

- EventBus to emit and listen to PlentyONE Shop events
- Register and manage cookies with consent
- React to cookie consent changes
- Utility composables for shop functionality
- Exposes `useSdk` composable for initializing and accessing the SDK
- Error handling.

## Available pages

- [Usage Guide](/guide/modules/shop-core/usage-guide.md)
- [Cookie Consent System](/guide/modules/shop-core/cookie-consent.md)
- [Event Bus](/guide/modules/shop-core/event-bus.md)
- [Error handling](/guide/modules/shop-core/error-handling.md)
