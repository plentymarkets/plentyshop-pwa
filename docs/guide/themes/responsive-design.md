# Responsive design

This article explains how responsive design works in the PlentyONE Shop PWA and why it relies on container queries instead of viewport breakpoints. Understanding this distinction is essential when authoring components that render inside the page view, because it determines whether the editor's mobile preview reflects the real mobile layout.

In the PlentyONE Shop PWA, the page view is responsive **based on container width, not viewport width**. The pages in `app.vue` are wrapped in a Tailwind `@container`, which allows the editor's mobile preview to render the page at a constrained width (e.g. 375px) inside a desktop viewport. Components react to the preview frame, not the browser window.

This means that **inside the page view you must use the `@`-prefixed container-query variants**, never the bare viewport variants. Otherwise the mobile preview in the editor would not reflect the real mobile view correctly.

| Use this (container query)          | Not this (viewport)            |
| ----------------------------------- | ------------------------------ |
| `@sm:` `@md:` `@lg:` `@xl:` `@2xl:` | `sm:` `md:` `lg:` `xl:` `2xl:` |
| `@max-md:` `@min-lg:`               | `max-md:` `min-lg:`            |
| `@mobile:` `@tablet:` `@desktop:`   | —                              |

## Container sizes

The breakpoints are defined under `theme.extend.containers` in `apps/web/app/configuration/tailwind.config.ts`:

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

Container-query support is provided by the [`@tailwindcss/container-queries`](https://github.com/tailwindlabs/tailwindcss-container-queries) plugin, which is already installed and registered in `apps/web/app/configuration/tailwind.config.ts`. In Tailwind v3 this plugin is required. From Tailwind v4 onwards container queries are built-in and the plugin is no longer needed.

## Custom CSS with container queries

When adding custom CSS to blocks through the editor, always use **container queries**, not media queries. This ensures your custom styles respond to the simulated viewport in the editor's mobile preview.

**Recommended pattern:**

```css
/* Styles for mobile & tablet (≤ 768px) */
@container (max-width: 768px) {
  .header {
    background: blue;
  }
}

/* Styles for desktop (> 768px) */
@container (min-width: 769px) {
  .header {
    background: green;
  }
}
```

**Alternative: use specific width ranges**

```css
/* Mobile preview only */
@container (max-width: 375px) {
  .header {
    font-size: 16px;
  }
}

/* Tablet preview */
@container (min-width: 376px) and (max-width: 768px) {
  .header {
    font-size: 18px;
  }
}

/* Desktop */
@container (min-width: 769px) {
  .header {
    font-size: 20px;
  }
}
```

For reference, the container sizes defined in Tailwind are documented under [Container sizes](#container-sizes).

## Where this applies

The container-query rule applies everywhere inside the page view:

- `app/pages/**`
- `app/layouts/**`
- `app/components/**` (with the exceptions listed below)
- Module components that render into the page view

## Where it does not apply (editor-only UI)

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

Many blocks under `app/components/blocks/` have a companion editor component whose name ends in `Form` (e.g. `HeaderContainerForm.vue`). The `*Form.vue` component is rendered in the editor drawer outside the page view, so it uses standard viewport variants. The block component rendered into the page view must use container-query variants.

## Enforcement

A custom ESLint rule flags bare viewport responsive variants for common breakpoint prefixes (e.g. `sm:`, `md:`, `max-md:`) used inside the affected directories. The rule is configured in `apps/web/eslint.config.mjs` and implemented in `apps/web/eslint-rules/no-bare-responsive-in-container.js`. Violations show up when running `npm run lint` or `npm run lint:fix`. Note that autofix is not yet available for this rule — `npm run lint:fix` will report the violations but cannot rewrite them automatically. The prefixes have to be replaced by hand.

If you are writing a [module](/guide/modules/index.md) whose components are rendered into the page view, follow the same convention and author your components with `@`-prefixed variants so they respond correctly to the editor's mobile preview (note: the ESLint rule currently only targets `app/pages/**`, `app/layouts/**`, and `app/components/**`).

## Related resources

- [Tailwind Container Queries](https://github.com/tailwindlabs/tailwindcss-container-queries)
- [Tailwind Documentation](https://tailwindcss.com/docs/configuration)
