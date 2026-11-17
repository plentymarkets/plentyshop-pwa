# Caching: URL cleaning

## Overview

This guide shows how to keep your theme's own query parameters in the URL, even though they aren't part of the CloudFront cache key.

The shop removes every query parameter that isn't part of the cache key from the address bar and from canonical links. If your theme uses such a parameter, for example `?color=red` to preselect a product option, extend `useCleanQuery`. Without the extension, the shop removes `?color=red` from the address bar after the app mounts, so reloading, sharing or bookmarking the page loses the parameter.

::: info
You can't add parameters to the CloudFront cache key from a theme. This change doesn't affect the cache key, and CloudFront still ignores your parameters when it decides whether two pages are the same.
:::

## Keep a query parameter in the URL

1. Open `apps/web/app/composables/useCleanQuery/useCleanQuery.ts` in your theme.

2. Add a list of your parameters above `useCleanQuery`. Spell each one exactly as it appears in the URL, because matching is case sensitive.

   ```ts
   // Parameters that your theme uses and that must stay in the URL
   const THEME_QUERY_PARAMS = ['color'];
   ```

3. Merge the list into the value that `getWhitelist` returns, and keep the backend allowlist in the result.

   ```ts
   const getWhitelist = (): string[] | null => {
     const list = useSiteSettings('cacheKeyQueryParams').getJsonSetting();
     return Array.isArray(list) && list.length > 0 ? [...(list as string[]), ...THEME_QUERY_PARAMS] : null;
   };
   ```

   The other functions in the composable, including `cleanQuery` and `cleanFullPath`, already use `getWhitelist`, so you don't need to change anything else.

4. Start the shop with `npm run dev` and open a page with your parameter and one that isn't on any allowlist, for example `/shoes?color=red&utm_source=test`.

5. Check the address bar and the canonical link in the `<head>`.

   The address bar shows `/shoes?color=red`. The canonical link contains `?color=red` but not `utm_source`.

::: warning
This change lives in your theme's copy of `useCleanQuery`. When you update from upstream, check this file for merge conflicts.
:::

## See also

- [CloudFront caching overview](/guide/themes/cloudfront-caching-overview.md)
- [Caching: Custom pages](/guide/themes/cloudfront-caching.md)
