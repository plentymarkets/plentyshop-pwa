import type { SortingOption } from '~/components/settings/sorting-pagination/category-sorting/types';

export const getLocaleKey = (key: string, locale: 'en' | 'de'): string => {
  const { $i18n } = useNuxtApp();

  return $i18n.t(key, 0, { locale: locale }) as string
};

export const getMappedOptions = (options: string[], locale: string): SortingOption[] => {
  if (!options) return [];

  return options.map((key: string) => ({
    label: getLocaleKey(`sortType.${key}`, locale as 'en' | 'de'),
    value: key,
  }));
};
