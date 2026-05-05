---
prev: false
next: false
---

# Modules

Modules are a way to extend PlentyONE Shop without modifying a [Theme](/guide/themes/index.md) directly.
In the future, modules will be available on [plentyMarketplace](https://marketplace.plentymarkets.com/).
However, distribution is still under construction.

You may still want to create a module and register them as local modules in your application.
This makes it easier to [keep your fork or mirror up-to-date](/guide/themes/project-update-strategies.md) by reducing the number of potential merge conflicts.
To register a local module, place it in the `apps/web/modules` directory.
For further information, refer to the [Nuxt documentation](https://nuxt.com/docs/guide/directory-structure/modules).

To get started with developing your own module, check out our [boilerplate](https://github.com/plentymarkets/pwa-module-boilerplate)

## Guides

The guides below walk you through the most common module extension points, from adding new UI elements to configuring routing and translations.

### UI and layout

Modules can introduce entirely new UI building blocks or quietly swap out existing ones. The [Components](/guide/modules/components.md) guide shows how to register a new Vue component so it becomes available across the shop, as well as how to replace a built-in component — for example, swapping `UiButton` for a custom version — without touching the core codebase. In the same spirit, the [Layouts](/guide/modules/layouts.md) guide covers adding new page layouts and overriding existing ones such as the checkout layout. For situations where you need to surface a component inside a predefined region of an existing page rather than own the full layout, [Inject components into shop areas](/guide/modules/inject-components.md) describes the `ModuleComponentRendering` system and the `useModuleRendering` composable that make targeted injection possible.

### Pages and routing

When a module needs to own a full page, the [Pages](/guide/modules/pages.md) guide explains how to register a new route via `extendPages` and how to replace an existing route — including the product detail page — with a custom implementation from inside the module. Route middleware — guards, redirects, analytics hooks — is a natural companion: the [Middlewares](/guide/modules/middlewares.md) guide covers both global middleware that runs on every navigation and named middleware tied to specific routes, including how to override an existing middleware such as `auth-guard`.

### Styling

Because Tailwind's build step only processes classes it discovers at compile time, module components need to be explicitly added to its content scan. The [Tailwind](/guide/modules/tailwind.md) guide shows how to hook into `tailwindcss:config` to include your module's files and, optionally, to override design tokens such as brand colours. For cases where you need to inject arbitrary scripts or stylesheets into the page `<head>`, the [Custom CSS &amp; JS](/guide/modules/custom-js-css.md) guide demonstrates the plugin-based approach using Nuxt's `useHead` composable.

### Translations

If your module introduces new UI strings, the [i18n](/guide/modules/i18n.md) guide explains how to register additional translation files through the `i18n:registerModule` hook so they are merged into the shop's existing locale setup. Existing translations from the main repository are available without any extra configuration.

## Core Utilities

The [Shop Core](/guide/modules/shop-core/index.md) module (`@plentymarkets/shop-core`) acts as a shared foundation for all other modules. It exposes composables and infrastructure that modules can rely on instead of reimplementing common concerns, and it serves as the bridge between custom modules and the base application.

Three utilities cover the most frequently needed cross-cutting concerns.

The [Cookie Consent](/guide/modules/shop-core/cookie-consent.md) system lets you register new cookies into the shop's consent bar, group them by purpose, and reactively respond to a user's consent decisions — including automatically removing cookies or scripts when consent is revoked.

The [Event Bus](/guide/modules/shop-core/event-bus.md) provides decoupled communication across the app through a set of predefined shop events, so modules can react to user actions without direct component dependencies.

Finally, [Error Handling](/guide/modules/shop-core/error-handling.md) gives you a single composable that translates API errors into localised user-facing notifications, keeping error presentation consistent across the shop.

## Further reading

- [https://nuxt.com/docs/guide/going-further/modules](https://nuxt.com/docs/guide/going-further/modules)
