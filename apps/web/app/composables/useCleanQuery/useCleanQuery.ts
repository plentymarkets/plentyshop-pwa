import { stringifyQuery } from 'vue-router';
import type { LocationQuery, RouteLocationNormalizedLoaded } from 'vue-router';

/**
 * @description Keeps only query params that are part of the CloudFront cache key.
 * The whitelist is delivered by the backend as the `cacheKeyQueryParams` setting.
 * If it is missing, nothing is stripped.
 * @example
 * ``` ts
 * const { cleanQuery, cleanFullPath } = useCleanQuery();
 * ```
 */
export const useCleanQuery = () => {
  /**
   * @description Reads the cache-key whitelist from the `cacheKeyQueryParams` setting.
   * @returns The whitelist, or `null` if the backend did not deliver one.
   */
  const getWhitelist = (): string[] | null => {
    const list = useSiteSettings('cacheKeyQueryParams').getJsonSetting();
    return Array.isArray(list) && list.length > 0 ? (list as string[]) : null;
  };

  /**
   * @description Removes all params that are not on the whitelist. Matching is case sensitive.
   * @param query The route query.
   * @returns The filtered query, or the unchanged query if there is no whitelist.
   * @example
   * ``` ts
   * cleanQuery({ page: '2', utm_source: 'x' }); // { page: '2' }
   * ```
   */
  const cleanQuery = (query: LocationQuery): LocationQuery => {
    const whitelist = getWhitelist();
    if (!whitelist) {
      return query;
    }

    return Object.fromEntries(Object.entries(query).filter(([key]) => whitelist.includes(key)));
  };

  /**
   * @description Serializes a query object like vue-router does: keys with multiple values are repeated
   * and bare keys (`?page`, parsed as `null`) stay bare.
   * @param query The route query.
   * @returns The query string including the leading `?`, or an empty string if the query is empty.
   * @example
   * ``` ts
   * buildQueryString({ tagIds: ['1', '2'], page: null }); // '?tagIds=1&tagIds=2&page'
   * ```
   */
  const buildQueryString = (query: LocationQuery): string => {
    const queryString = stringifyQuery(query);
    return queryString ? `?${queryString}` : '';
  };

  /**
   * @description Builds the path of a route with a cleaned query and the original hash.
   * @param route The route to clean.
   * @returns The cleaned path, e.g. `/shoes?page=2#top`.
   * @example
   * ``` ts
   * cleanFullPath(useRoute());
   * ```
   */
  const cleanFullPath = (route: Pick<RouteLocationNormalizedLoaded, 'path' | 'query' | 'hash'>): string => {
    return `${route.path}${buildQueryString(cleanQuery(route.query))}${route.hash ?? ''}`;
  };

  return { cleanQuery, cleanFullPath, buildQueryString };
};
