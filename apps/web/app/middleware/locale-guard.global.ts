/**
 * Middleware to guard against inactive locale prefixes in the URL.
 * If the URL contains a locale prefix that is not in the list of active languages,
 * it throws a 404 error.
 *
 * Active languages are defined in the runtime configuration under `public.activeLanguages`.
 */

let cachedActiveLanguages: Set<string> | null = null;
let cachedAllLocales: string[] | null = null;

export default defineNuxtRouteMiddleware((to) => {
  const path = to.path;

  const secondSlashIndex = path.indexOf('/', 1);
  if (secondSlashIndex === -1 && path.length > 3) return;
  if (path.length === 1) return;

  const { availableLocales } = useNuxtApp().$i18n;
  const allLocales = availableLocales as string[];

  if (!cachedActiveLanguages || !cachedAllLocales) {
    const config = useRuntimeConfig();
    const activeLanguagesArray = (config.public.activeLanguages as string)
      .split(',')
      .map((lang: string) => lang.trim())
      .filter((lang) => allLocales.includes(lang));

    cachedActiveLanguages = new Set(activeLanguagesArray);
    cachedAllLocales = allLocales;
  }

  const firstSlash = secondSlashIndex === -1 ? path.length : secondSlashIndex;
  const pathLocale = path.substring(1, firstSlash);

  if (!cachedAllLocales.includes(pathLocale)) return;

  if (!cachedActiveLanguages.has(pathLocale)) {
    if (to.name === 'error' || path.includes('/404')) return;

    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
      message: `The locale '${pathLocale}' is not available. Available locales: ${Array.from(cachedActiveLanguages).join(', ')}`,
    });
  }
});
