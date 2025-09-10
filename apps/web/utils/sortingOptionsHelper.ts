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

export const getRecommendedSortingOptions = (notSelectedOption: boolean): SortingOption[] => {
  const filteredOptions = structuredClone(sortingCategory);
  if (notSelectedOption) {
    filteredOptions.unshift({ label: 'sortingPriorityCategoryNotSelected', value: 'notSelected' });
  }

  const { $i18n } = useNuxtApp();
  const locale = 'en';

  return filteredOptions.map((item: SortingOption) => ({
    label: $i18n.t(`sortingAndPagination.recommendedSorting.options.${item.label}`, {}, { locale }) as string,
    value: item.value,
  }));
};

export const sortingCategory = [
  { label: 'sortingPriorityCategoryItemIdAsc', value: 'item.id_asc' },
  { label: 'sortingPriorityCategoryItemIdDesc', value: 'item.id_desc' },
  { label: 'sortingPriorityCategoryNameAsc', value: 'texts.name_asc' },
  { label: 'sortingPriorityCategoryNameDesc', value: 'texts.name_desc' },
  { label: 'sortingPriorityCategoryPriceAsc', value: 'sorting.price.avg_asc' },
  { label: 'sortingPriorityCategoryPriceDesc', value: 'sorting.price.avg_desc' },
  { label: 'sortingPriorityCategoryVariationCreatedAtDesc', value: 'variation.createdAt_desc' },
  { label: 'sortingPriorityCategoryVariationCreatedAtAsc', value: 'variation.createdAt_asc' },
  { label: 'sortingPriorityCategoryVariationIdAsc', value: 'variation.id_asc' },
  { label: 'sortingPriorityCategoryVariationIdDesc', value: 'variation.id_desc' },
  { label: 'sortingPriorityCategoryVariationNumberAsc', value: 'variation.number_asc' },
  { label: 'sortingPriorityCategoryVariationNumberDesc', value: 'variation.number_desc' },
  { label: 'sortingPriorityCategoryAvailabilityAsc', value: 'variation.availability.averageDays_asc' },
  { label: 'sortingPriorityCategoryAvailabilityDesc', value: 'variation.availability.averageDays_desc' },
  { label: 'sortingPriorityCategoryVariationUpdatedAtAsc', value: 'variation.updatedAt_asc' },
  { label: 'sortingPriorityCategoryVariationUpdatedAtDesc', value: 'variation.updatedAt_desc' },
  { label: 'sortingPriorityCategoryVariationPositionAsc', value: 'variation.position_asc' },
  { label: 'sortingPriorityCategoryVariationPositionDesc', value: 'variation.position_desc' },
  { label: 'sortingPriorityCategoryManufacturerAsc', value: 'item.manufacturer.externalName_asc' },
  { label: 'sortingPriorityCategoryManufacturerDesc', value: 'item.manufacturer.externalName_desc' },
  { label: 'sortingPriorityCategoryManufacturerPositionAsc', value: 'item.manufacturer.position_asc' },
  { label: 'sortingPriorityCategoryManufacturerPositionDesc', value: 'item.manufacturer.position_desc' },
  { label: 'sortingPriorityCategoryStockAsc', value: 'stock.net_asc' },
  { label: 'sortingPriorityCategoryStockDesc', value: 'stock.net_desc' },
  { label: 'sortDataRandom', value: 'item.random' },
];
