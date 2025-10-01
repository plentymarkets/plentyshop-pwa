import type { SortingOption } from '~/components/settings/category/sorting/category-sorting/types';

export const getEditorTranslation = (key: string): string => {
  const locale = 'en';

  const { t } = useI18n({
    locale: locale,
  });

  return t(key, 0, { locale: locale }) as string;
};

export const getMappedOptions = (options: string[]): SortingOption[] => {
  if (!options) return [];

  const locale = 'en';
  const { $i18n } = useNuxtApp();

  return options.map((key: string) => ({
    label: $i18n.t(`sortType.${key}`, {}, { locale }) as string,
    value: key,
  }));
};

export const sortingCategory = [
  'item.id_asc',
  'item.id_desc',
  'texts.name1_asc',
  'texts.name1_desc',
  'sorting.price.avg_asc',
  'sorting.price.avg_desc',
  'variation.createdAt_desc',
  'variation.createdAt_asc',
  'variation.id_asc',
  'variation.id_desc',
  'variation.number_asc',
  'variation.number_desc',
  'variation.availability.averageDays_asc',
  'variation.availability.averageDays_desc',
  'variation.updatedAt_asc',
  'variation.updatedAt_desc',
  'variation.position_asc',
  'variation.position_desc',
  'item.manufacturer.externalName_asc',
  'item.manufacturer.externalName_desc',
  'item.manufacturer.position_asc',
  'item.manufacturer.position_desc',
  'stock.net_asc',
  'stock.net_desc',
  'item.random',
];
