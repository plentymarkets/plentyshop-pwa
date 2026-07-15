import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { categoryTreeGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import { createSharedComposable } from '@vueuse/core';

export const useLocalization = createSharedComposable(() => {
  const isOpen = ref(false);
  const { resolvePathTrailingSlash } = useUrlTrailingSlash();
  const localePath = useLocalizedPath();

  const toggle = () => (isOpen.value = !isOpen.value);

  /**
   * @description Used to generate the category path inside the mega menu and other navigation trees.
   *
   * @param category
   * @param categoryTree
   * @returns product path that is then navigated to
   * @example buildCategoryMenuLink(category, categoryTree)
   */
  const buildCategoryMenuLink = (category: CategoryTreeItem, categoryTree: CategoryTreeItem[]) => {
    const path = categoryTreeGetters.generateCategoryLink(categoryTree, category, '');
    return resolvePathTrailingSlash(path);
  };

  /**
   * @description Used to generate the category path inside the mega menu and other navigation trees.
   *
   * @param path
   * @example getCategoryUrlFromRoute('')
   */
  const getCategoryUrlFromRoute = (path: string): string => {
    const parts = path.split('/');

    const { $i18n } = useNuxtApp();
    const { locale, defaultLocale, strategy } = $i18n;

    const shouldRemoveLocale = (strategy: string, locale: string, defaultLocale: string) => {
      if (strategy === 'prefix') {
        return true;
      }

      if (strategy === 'prefix_except_default') {
        return locale !== defaultLocale;
      }

      if (strategy === 'prefix_and_default') {
        return locale !== defaultLocale || parts[1] === locale;
      }

      return false;
    };

    if (shouldRemoveLocale(strategy, locale.value, defaultLocale)) {
      const localeIndex = parts.indexOf(locale.value);
      if (localeIndex !== -1) {
        parts.splice(localeIndex, 1);
      }
    }

    return parts.map((part) => (part.includes('?') ? part.split('?')[0] : part)).join('/');
  };

  /**
   * @description Function for creating a path with a specific locale. (useLocalePath)
   * @param path  e.g. '/login'
   * @param locale to be added to the path
   * @returns localized path with the locale prefix if necessary
   * @example createLocalePath('/login', 'de');
   */
  const createLocalePath = (path: string, locale: string): string => {
    const { locales } = useNuxtApp().$i18n;
    const localeCodes = locales.value.map((_locale) => _locale.code.toString());
    const localeSupported = localeCodes.includes(locale);
    const localizedPath = useLocalePath();

    if (localeSupported) {
      return resolvePathTrailingSlash(localizedPath(path, locale as Locale));
    }
    return localePath(path);
  };

  /**
   * @description Function for getting all available locales based on activeLanguages config.
   * @returns array of available locales
   * @example getAvailableLocales()
   */
  const getAvailableLocales = () => {
    const { localeCodes, availableLocales } = useI18n();
    const config = useRuntimeConfig();

    const activeLanguages = new Set(
      (config.public.activeLanguages as string)
        .split(',')
        .map((lang: string) => lang.trim())
        .filter((lang) => (availableLocales as string[]).includes(lang)),
    );
    return localeCodes.value.filter((localeCode) => activeLanguages.has(localeCode));
  };

  /**
   * @description Function for switching app locale.
   * @param language
   *
   * @param hideMenu
   * @example switchLocale('en')
   */
  const switchLocale = async (language: Locale, hideMenu = true) => {
    const { fetchSession } = useFetchSession();
    const switchLocalePath = useSwitchLocalePath();
    const route = useRoute();

    if (hideMenu) {
      toggle();
    }
    await navigateTo({
      path: switchLocalePath(language),
      query: route.query,
    });
    await fetchSession();
  };

  return {
    getCategoryUrlFromRoute,
    buildCategoryMenuLink,
    isOpen,
    toggle,
    switchLocale,
    createLocalePath,
    getAvailableLocales,
  };
});
