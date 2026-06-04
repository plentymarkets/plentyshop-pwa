# Styling

Most of the shop uses [Tailwind](https://tailwindcss.com/) for styling.
To edit your theme, open `tailwind.config.ts`.
Note that parts of the theme are imported from [Storefront UI](https://docs.storefrontui.io/v2/?path=%2Fstory%2Fwelcome--page).

In some cases, you can't directly apply classes to elements to style them, for example when using certain component libraries.
You may also prefer stylesheets over using Tailwind.
To style your shop without using Tailwind, you can either use the `<style>` tag of [Vue SFCs](https://vuejs.org/api/sfc-css-features.html) or add your stylesheets to [Nuxt's assets directory](https://nuxt.com/docs/4.x/directory-structure/app/assets).

## Responsive design: container queries instead of viewport breakpoints

The shop is responsive **based on container width, not viewport width**. The pages in `app.vue` are wrapped in a Tailwind `@container`, which allows the editor's mobile preview to render the storefront at a constrained width (e.g. 375px) inside a desktop viewport. Components react to the preview frame, not the browser window.

This means that **inside the storefront you must use the `@`-prefixed container-query variants**, never the bare viewport variants. Otherwise the mobile preview in the Editor would not reflect the real mobile view correctly.

| Use this (container query) | Not this (viewport) |
| -------------------------- | ------------------- |
| `@sm:` `@md:` `@lg:` `@xl:` `@2xl:` | `sm:` `md:` `lg:` `xl:` `2xl:` |
| `@max-md:` `@min-lg:` | `max-md:` `min-lg:` |
| `@mobile:` `@tablet:` `@desktop:` | — |

The breakpoints are defined under `theme.extend.containers` in `tailwind.config.ts`:

```ts
containers: {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  '2xs': '360px',
  xs: '376px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1366px',
  '3xl': '1536px',
  '4xl': '1920px',
},
```

Container-query support is provided by the [`@tailwindcss/container-queries`](https://github.com/tailwindlabs/tailwindcss-container-queries) plugin, which is already installed and registered in `tailwind.config.ts`. In Tailwind v3 this plugin is required; from Tailwind v4 onwards container queries are built-in and the plugin is no longer needed.

### Where this applies

The container-query rule applies everywhere inside the page view:

- `app/pages/**`
- `app/layouts/**`
- `app/components/**` (with the exceptions listed below)
- Module components that render into the page view

### Where it does not apply (editor-only UI)

A handful of components live **outside** the `@container` because they are part of the editor (toolbars, drawers, modals, settings panels). These components keep using the standard viewport variants (`sm:`, `md:`, `lg:`, …) and are excluded from the lint rule:

- `app/components/SafeModeBanner/**`
- `app/components/SettingsToolbar/**`
- `app/components/SiteConfigurationDrawer/**`
- `app/components/AddBlockPopover/**`
- `app/components/ui/Toolbar/**`
- `app/components/ui/PageModal/**`
- `app/components/ui/UnlinkCategoryModal/**`
- `app/components/ui/ResetProductPageModal/**`
- `app/components/ui/Notifications/**`
- `app/components/settings/**`
- `app/components/editor/**`
- `app/components/blocks/**/*Form.vue`

Each block under `app/components/blocks/` comes as a pair: the block component itself, which is rendered into the page view, and a sibling component whose name ends in `Form` (e.g. `HeaderContainerForm.vue`), which is shown in the editor drawer outside the page view. Because the `*Form.vue` component is editor UI, it uses standard viewport variants. The block component must use container-query variants.

### Enforcement

A custom ESLint rule flags any bare viewport variant used inside the affected directories. The rule is configured in `apps/web/eslint.config.mjs` and implemented from `apps/web/eslint-rules/no-bare-responsive-in-container.js`. Violations show up when running `npm run lint` or `npm run lint:fix`. Note that autofix is not yet available for this rule — `npm run lint:fix` will report the violations but cannot rewrite them automatically; the prefixes have to be replaced by hand.

If you are writing a [module](/guide/modules/index.md) whose components are rendered into the storefront, the same rule applies. Author your components with `@`-prefixed variants so they respond correctly to the editor's mobile preview.

## References

- [Tailwind Documentation](https://tailwindcss.com/docs/configuration)
- [Tailwind Container Queries](https://github.com/tailwindlabs/tailwindcss-container-queries)
- [Storefront UI: Theming](https://docs.storefrontui.io/v2/vue/customization/theming.html)
- [Storefront UI: Overriding Default Styles](https://docs.storefrontui.io/v2/vue/customization/overriding-default-styles.html)
- [Storefront UI: Typography](https://docs.storefrontui.io/v2/vue/customization/typography.html)
- [Colour Palette Generator](https://uicolors.app/create)
- [Nuxt Assets](https://nuxt.com/docs/4.x/getting-started/assets)
