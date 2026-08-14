const ENCODED_SLASH = '%2F';
const ENCODED_SLASH_PATTERN = /%2F/gi;

/**
 * Restores slashes that `useLocalePath()` percent-encoded while resolving a route.
 *
 * Since `@nuxtjs/i18n` 10.6.0 a localized route is resolved by route name instead of by path, which makes
 * vue-router run the segment values through `encodeParam()`. Routes whose params legitimately contain a
 * slash — such as the single product URL scheme route `'/:slug*:sep(/a-|_):itemId'` — therefore come back
 * with `%2F` where the source path had `/`, producing links that 404.
 *
 * The decoding is only applied when the requested path had no encoded slash of its own, so genuinely
 * encoded input is left untouched.
 *
 * @param resolvedPath Path returned by `useLocalePath()`.
 * @param requestedPath Path that was passed to `useLocalePath()`.
 * @returns The resolved path with i18n-introduced `%2F` sequences turned back into `/`.
 * @example decodeLocalizedPathSlashes('/de/shirt%2Fa-42', '/shirt/a-42'); // '/de/shirt/a-42'
 */
export const decodeLocalizedPathSlashes = (resolvedPath: string, requestedPath: string): string => {
  if (!resolvedPath.toUpperCase().includes(ENCODED_SLASH)) {
    return resolvedPath;
  }

  if (requestedPath.toUpperCase().includes(ENCODED_SLASH)) {
    return resolvedPath;
  }

  return resolvedPath.replace(ENCODED_SLASH_PATTERN, '/');
};
