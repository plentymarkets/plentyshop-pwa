const ENCODED_SLASH = '%2F';
const ENCODED_SLASH_PATTERN = /%2F/gi;
const QUERY_OR_HASH_PATTERN = /[?#]/;

const splitPath = (path: string) => {
  const separatorIndex = path.search(QUERY_OR_HASH_PATTERN);

  if (separatorIndex === -1) {
    return { pathname: path, suffix: '' };
  }

  return { pathname: path.slice(0, separatorIndex), suffix: path.slice(separatorIndex) };
};

/**
 * Restores slashes that `useLocalePath()` percent-encoded while resolving a route.
 *
 * Since `@nuxtjs/i18n` 10.6.0 a localized route is resolved by route name instead of by path, which makes
 * vue-router run the segment values through `encodeParam()`. Routes whose params legitimately contain a
 * slash — such as the single product URL scheme route `'/:slug*:sep(/a-|_):itemId'` — therefore come back
 * with `%2F` where the source path had `/`, producing links that 404.
 *
 * Only the path is decoded, never the query string or hash, and only when the requested path did not
 * contain an encoded slash of its own, so genuinely encoded input is left untouched.
 *
 * @param resolvedPath Path returned by `useLocalePath()`.
 * @param requestedPath Path that was passed to `useLocalePath()`.
 * @returns The resolved path with i18n-introduced `%2F` sequences turned back into `/`.
 * @example decodeLocalizedPathSlashes('/de/shirt%2Fa-42', '/shirt/a-42'); // '/de/shirt/a-42'
 */
export const decodeLocalizedPathSlashes = (resolvedPath: string, requestedPath: string): string => {
  const resolved = splitPath(resolvedPath);

  if (!resolved.pathname.toUpperCase().includes(ENCODED_SLASH)) {
    return resolvedPath;
  }

  if (splitPath(requestedPath).pathname.toUpperCase().includes(ENCODED_SLASH)) {
    return resolvedPath;
  }

  return resolved.pathname.replace(ENCODED_SLASH_PATTERN, '/') + resolved.suffix;
};
