---
prev: false
next: false
---

# Themes

A Theme is a full Nuxt application built on top of the PlentyONE Shop foundation. It contains your pages, components, composables, layouts, middleware, and all other application code. [Modules](/guide/modules/index.md) are extensions _to_ a theme — they add or override functionality without requiring you to modify the theme's core files directly.

Because a theme tracks an upstream repository, one of the first decisions you need to make is how to manage updates from the PlentyONE core as it evolves. [Project update strategies](/guide/themes/project-update-strategies.md) covers two approaches — forking and Git mirroring with vendor branching — and explains why keeping customisations isolated in local modules reduces merge conflicts regardless of which strategy you choose.

The guides in this section are independent recipes for common theme customisation tasks. A few are worth knowing about early because they diverge from standard Nuxt conventions or are easy to get wrong.

The shop uses a custom composable (`usePriceFormatter`) instead of Nuxt i18n's built-in `$n()` function for currency output — the [currency formatter](/guide/themes/currency-formatter.md) guide explains why and how to use it correctly. Similarly, [i18n](/guide/themes/i18n.md) describes the shop's translation setup, which extends `@nuxtjs/i18n` with shop-specific conventions you need to follow.

For data fetching, the shop wraps `useAsyncData` inside composables, so you call a composable method rather than `useAsyncData` directly — [composable-centric data fetching](/guide/themes/composable-centric-data-fetching.md) covers the pattern and the common pitfall of wrapping it a second time. Finally, if you need to expose REST endpoints that the default shop API does not cover, [custom API endpoints](/guide/themes/custom-api-endpoints.md) shows how to register additional methods in the middleware configuration.
