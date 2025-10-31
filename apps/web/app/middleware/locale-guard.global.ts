/**
 * Middleware to guard against inactive locale prefixes in the URL.
 * If the URL contains a locale prefix that is not in the list of active languages,
 * it throws a 404 error.
 *
 * Active languages are defined in the runtime configuration under `public.activeLanguages`.
 */
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();

  const activeLanguages = (config.public.activeLanguages as string).split(',').map((lang: string) => lang.trim());

  const pathSegments = to.path.split('/').filter(Boolean);
  const pathLocale = pathSegments[0];

  const allLocales = [
    'bg',
    'cs',
    'da',
    'de',
    'en',
    'es',
    'et',
    'fi',
    'fr',
    'ga',
    'hr',
    'hu',
    'it',
    'lt',
    'lv',
    'nl',
    'no',
    'pl',
    'pt',
    'ro',
    'ru',
    'sk',
    'sv',
    'tr',
    'vi',
    'zh',
  ];
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
