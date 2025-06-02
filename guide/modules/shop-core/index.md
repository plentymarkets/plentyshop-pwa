---
prev: false
next: false
---
# Shop Core

A Nuxt module for managing core shop functionality, shop events, and cookie consent.  
The Shop Core module acts as a bridge between other modules and the base PWA application.

## Installation

The Shop Core module is preinstalled in the base PWA application.  
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

You can also install the module in your `nuxt.config.ts` or `module.ts`/`index.ts` using `@nuxt/kit`'s `installModule`:

```typescript
await installModule('@plentymarkets/shop-core')
```

For reference, see our [Google Analytics implementation](https://github.com/plentymarkets/shop-module-gtag/blob/main/src/module.ts#L33).

- [Nuxt documentation: Using other modules in your module](https://nuxt.com/docs/guide/going-further/modules#using-other-modules-in-your-module)

## Features

- EventBus to emit and listen to PlentyONE Shop events
- Register and manage cookies with consent
- React to cookie consent changes
- Utility composables for shop functionality
- Exposes `useSdk` composable for initializing and accessing the SDK

## Available pages

- [Usage Guide](/guide/modules/shop-core/usage-guide.md)
- [Cookie Consent System](/guide/modules/shop-core/cookie-consent.md)
- [Event Bus](/guide/modules/shop-core/event-bus.md)
