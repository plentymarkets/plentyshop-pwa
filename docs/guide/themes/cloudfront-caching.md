# CloudFront Caching

## Introduction

With our [latest release](https://github.com/plentymarkets/plentyshop-pwa/releases/tag/v2.32.0), we introduced support for CloudFront full-site caching. This means that you can now cache specific pages of your shop. By default, the following pages are cached:

- Home page
- Category pages
- Product pages

::: warning
With the introduction of CloudFront caching, it is crucial to never load user-specific data (e.g., cart information, user account details) directly on the server side. Doing so can lead to caching of sensitive information, which may be exposed to other users. Always ensure that user-specific data is loaded on the client side after the page has been rendered to maintain security and privacy. Use hooks like `onNuxtReady` or `onMounted` (or guard execution with `if (import.meta.client)`) to load user-specific data on the client side.
:::

## Requirements

- @plentymarkets/shop-core version 1.27.1 or higher
- @plentymarkets/shop-api version 0.173.0 or higher

## Enable caching defaults

If you are using a custom theme (Git integration), make sure you implement [these changes](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes) to be compatible with the new CloudFront caching feature.

Required changes are in:

- [apps/web/app/composables/useInitialSetup/useInitialSetup.ts](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes#diff-aaf5cd43bdc2bd5a97f53945f093a9bb631ac42c332cfe5568d3be2968691f4e)
- [apps/web/app/composables/useInitialSetup/types.ts](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes#diff-da352a4601293ac8f596ec5e8e270f220000061b31c898dda86dabbf67d80167)
- [apps/web/app/plugins/00.init-initial-data.client.ts](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes#diff-7096d397657599ed4d91b2dad701fca0bd10965a215d83bc7d8d4966f346f23d)
- [apps/web/app/plugins/00.init-initial-data.server.ts](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes#diff-8e6c3c95d79db1cc67531c93278c92023d638b9a47224cf3a77db196e586c585)
- [apps/web/app/plugins/04.generate-color-palette.server.ts](https://github.com/plentymarkets/plentyshop-pwa/pull/2362/changes#diff-b1c89d6dd86b3dc94bc05965aa5033cdc6920fd097118a5abca0ea170665f254)

## Enable caching for a custom page

To enable CloudFront caching for a specific page, set the Cache-Control response header for the document.
To set the header, add the auto-imported helper function `getCacheControl` to the page metadata.

```vue
// index.vue
<template>
  <div>
    <!-- page content -->
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  cacheControl: getCacheControl(),
});
</script>
```

This adds the following `Cache-Control` header to the document response:
`cache-control: public, max-age=30, stale-while-revalidate=900`

This means that the page will be cached for 30 seconds and can be served stale for up to 15 minutes while it is being revalidated in the background.

## Configure timings (optional)

If you want to have more control over the cache control header, you can also pass your own values to the `getCacheControl` function.

```vue
<script setup lang="ts">
definePageMeta({
  cacheControl: getCacheControl({
    type: 'public',
    maxAge: 60, // cache for 60 seconds
    staleWhileRevalidate: 300, // serve stale for up to 5 minutes
  }),
});
</script>
```

## Verify the results

Inside the browser DevTools, check the Network tab and filter for the document request.

- If the page is cached, you will see the header `x-cache: Hit from cloudfront` and `cache-control: public, max-age=30, stale-while-revalidate=900`.
- If the page is not cached, you will see the header `x-cache: Miss from cloudfront`
