# Experimental features

An experimental feature describes functionality that's part of the code, but not available to users yet.
For example, such functionality may not be displayed in a UI or there may be a condition that prevents code execution.

::: warning :warning: Repository forks
In your repository fork or mirror, you may decide to enable experimental features yourself.
However, note that the functionality is likely still in development and may be incomplete or not fully tested.
If you enable an experimental feature, you do so at your own risk.
:::

This page lists current experimental features and how to enable them.
It doesn't include progress status, a release timeline, or similar information.

## Blockified Item Details Page

Date added: 21 October 2025 <br />
Date removed: -

- Enable with `ENABLE_PRODUCT_EDITING=1`
- Controls content on `product/[slug].vue`
- Shifts item details from rendering static content to rendering blocks

## Additional editor settings

Date added: 09 October 2025 <br />
Date removed: -

- Enable with `ENABLE_ALL_EDITOR_SETTINGS=1`
- Controls content in `SiteConfigurationDrawer.vue`
- Adds additional settings; refer to `editorSettingsDevFlag` in `nuxt.config.ts` for a complete list

## History

### Blockified Item Category Page

Date added: 02 October 2025 <br />
Date removed: 20 November 2025

- Enable with `ENABLE_CATEGORY_EDITING=1`
- Controls content on `[...slug].vue`
- Shifts item categories from rendering static content to rendering blocks
