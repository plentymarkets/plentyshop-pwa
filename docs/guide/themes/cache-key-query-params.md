# Caching: URL cleaning

## Overview

This guide shows how to keep your theme's own query parameters in the address bar, even though they aren't part of the CloudFront cache key.

The shop removes every query parameter that isn't part of the cache key from the address bar. If your theme uses such a parameter, for example `?color=red` to preselect a product option, the shop removes it after the app mounts. Reloading, sharing or bookmarking the page then loses the parameter.

::: warning
You can't add parameters to the CloudFront cache key from a theme. This change only affects the address bar.
:::

## Keep a query parameter in the address bar

1. Open `apps/web/app/plugins/06.clean-url.client.ts` in your theme.

2. Add a list of your parameters above `defineNuxtPlugin`. Spell each one exactly as it appears in the URL, because matching is case sensitive.

   ```ts
   // Parameters that your theme uses and that must stay in the address bar
   const THEME_QUERY_PARAMS = ['color'];
   ```

3. Replace `cleanFullPath` with your own function that merges your parameters into the cleaned query.

   ```ts
   import type { RouteLocationNormalizedLoaded } from 'vue-router';

   const { cleanQuery, buildQueryString } = useCleanQuery();

   const getTargetPath = (route: RouteLocationNormalizedLoaded) => {
     const themeQuery = Object.fromEntries(
       Object.entries(route.query).filter(([key]) => THEME_QUERY_PARAMS.includes(key)),
     );

     return `${route.path}${buildQueryString({ ...cleanQuery(route.query), ...themeQuery })}${route.hash}`;
   };
   ```

4. Use `getTargetPath` in `cleanUrl`.

   ```ts
   const target = getTargetPath(router.currentRoute.value);
   ```

5. Start the shop with `npm run dev` and open a page with your parameter and one that isn't on any allowlist, for example `/shoes?color=red&utm_source=test`.

6. Check the address bar and the canonical link in the `<head>`.

   The address bar shows `/shoes?color=red`. The canonical link contains neither `color` nor `utm_source`.

Read your parameter on the client, for example in `onNuxtReady` or `onMounted`. The server renders one page for every value of the parameter, so server-rendered content can't depend on it.

::: warning
This change lives in your theme's copy of the plugin. When you update from upstream, check this file for merge conflicts.
:::

## See also

- [CloudFront caching overview](/guide/themes/cloudfront-caching-overview.md)
- [Caching: Custom pages](/guide/themes/cloudfront-caching.md)
- [Project update strategies](/guide/themes/project-update-strategies.md)
