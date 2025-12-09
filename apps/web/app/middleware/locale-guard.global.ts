/**
 * Middleware to guard against inactive locale prefixes in the URL.
 * If the URL contains a locale prefix that is not in the list of active languages,
 * it throws a 404 error.
 *
 * Active languages are defined in the runtime configuration under `public.activeLanguages`.
 */
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();
  const { availableLocales } = useNuxtApp().$i18n;
  const allLocales = availableLocales as string[];
  const activeLanguages = (config.public.activeLanguages as string)
    .split(',')
    .filter((lang) => (availableLocales as string[]).includes(lang))
    .map((lang: string) => lang.trim());
  const pathSegments = to.path.split('/').filter(Boolean);
  const pathLocale = pathSegments[0];
  const hasLocalePrefix = pathLocale ? allLocales.includes(pathLocale) : false;

  if (hasLocalePrefix && pathLocale && !activeLanguages.includes(pathLocale)) {
    if (to.name === 'error' || to.path.includes('/404')) {
      return;
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
      message: `The locale '${pathLocale}' is not available. Available locales: ${activeLanguages.join(', ')}`,
    });
  }
});
