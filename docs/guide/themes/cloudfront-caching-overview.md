# CloudFront caching overview

This article explains what CloudFront is, how it decides which requests count as the same page, and why the shop removes some query parameters from your URLs.

## What is CloudFront?

[Amazon CloudFront](https://aws.amazon.com/cloudfront/) is a content delivery network (CDN). It sits between the visitor's browser and your shop and stores copies of responses at locations close to the visitor. When another visitor requests the same page, CloudFront answers with the stored copy instead of asking the shop to render the page again. The visitor gets the page faster and the shop does less work.

To enable caching for your own pages, see [Caching: Custom pages](/guide/themes/cloudfront-caching.md).

## The cache key

CloudFront decides whether two requests ask for the same page by comparing their cache key. The cache key is built from the request path and a fixed set of request attributes, including an allowlist of query parameters.

- Two requests with the same path and the same values for the allowlisted parameters share one cached copy.
- A query parameter that is not on the allowlist is not part of the cache key. It doesn't create a separate cached copy.

For example, `/shoes?page=2` and `/shoes?page=2&utm_source=newsletter` share the same cache key, because `utm_source` is not on the allowlist.

PlentyONE maintains the cache key. You can't change it.

## Query parameters in the shop

The shop receives the allowlist from the backend as the `cacheKeyQueryParams` setting. It uses the allowlist to keep URLs consistent with the cache key. Parameters that are not on the allowlist are removed in these places:

| Place                                         | Result                                                              |
| --------------------------------------------- | ------------------------------------------------------------------- |
| Address bar                                   | The URL is cleaned after the app mounts and after every navigation. |
| Canonical link and `hreflang` alternate links | They contain only allowlisted parameters.                           |
| `url` of the `ItemList` structured data       | It contains only allowlisted parameters.                            |

Without this, every tracking parameter would produce a different canonical URL for the same page.

```
Visitor opens:   /shoes?utm_source=newsletter&page=2&fbclid=abc
Address bar:     /shoes?page=2
Canonical link:  https://shop.example.com/shoes?page=2
```

To keep your theme's own parameters in the address bar, see [Caching: URL cleaning](/guide/themes/cache-key-query-params.md).

## Related resources

- [Caching: Custom pages](/guide/themes/cloudfront-caching.md)
- [Caching: URL cleaning](/guide/themes/cache-key-query-params.md)
