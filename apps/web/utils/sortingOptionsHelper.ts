import type { SortingOption } from '~/components/settings/sorting-pagination/category-sorting/types';

export const getLocaleKey = (key: string, locale: 'en' | 'de'): string => {
  const { $i18n } = useNuxtApp();

  return $i18n.t(key, 0, { locale: locale }) as string;
};

export const getMappedOptions = (options: string[], locale: string): SortingOption[] => {
  if (!options) return [];

  return options.map((key: string) => ({
    label: getLocaleKey(`sortType.${key}`, locale as 'en' | 'de'),
    value: key,
  }));
};

export const getRecommendedSortingOptions = (locale: string, notSelectedOption: boolean): SortingOption[] => {
  const filteredOptions = structuredClone(sortingCategory);
  if (notSelectedOption) {
    filteredOptions.unshift({label: "sortingPriorityCategoryNotSelected", value: "notSelected"});
  }
  return filteredOptions.map((item: SortingOption ) => ({
        label: getLocaleKey(`sortingAndPagination.recommendedSorting.options.${item.label}`, locale as 'en' | 'de'),
        value: item.value
  }));
};

export const sortingCategory = [
  {label: "sortingPriorityCategoryItemIdAsc", value: "item.id_asc"},
  {label: "sortingPriorityCategoryItemIdDesc", value: "item.id_desc"},
  {label: "sortingPriorityCategoryNameAsc", value: "texts.name_asc"},
  {label: "sortingPriorityCategoryNameDesc", value: "texts.name_desc"},
  {label: "sortingPriorityCategoryPriceAsc", value: "sorting.price.avg_asc"},
  {label: "sortingPriorityCategoryPriceDesc", value: "sorting.price.avg_desc"},
  {label: "sortingPriorityCategoryVariationCreatedAtDesc", value: "variation.createdAt_desc"},
  {label: "sortingPriorityCategoryVariationCreatedAtAsc", value: "variation.createdAt_asc"},
  {label: "sortingPriorityCategoryVariationIdAsc", value: "variation.id_asc"},
  {label: "sortingPriorityCategoryVariationIdDesc", value: "variation.id_desc"},
  {label: "sortingPriorityCategoryVariationNumberAsc", value: "variation.number_asc"},
  {label: "sortingPriorityCategoryVariationNumberDesc", value: "variation.number_desc"},
  {label: "sortingPriorityCategoryAvailabilityAsc", value: "variation.availability.averageDays_asc"},
  {label: "sortingPriorityCategoryAvailabilityDesc", value: "variation.availability.averageDays_desc"},
  {label: "sortingPriorityCategoryVariationUpdatedAtAsc", value: "variation.updatedAt_asc"},
  {label: "sortingPriorityCategoryVariationUpdatedAtDesc", value: "variation.updatedAt_desc"},
  {label: "sortingPriorityCategoryVariationPositionAsc", value: "variation.position_asc"},
  {label: "sortingPriorityCategoryVariationPositionDesc", value: "variation.position_desc"},
  {label: "sortingPriorityCategoryManufacturerAsc", value: "item.manufacturer.externalName_asc"},
  {label: "sortingPriorityCategoryManufacturerDesc", value: "item.manufacturer.externalName_desc"},
  {label: "sortingPriorityCategoryManufacturerPositionAsc", value: "item.manufacturer.position_asc"},
  {label: "sortingPriorityCategoryManufacturerPositionDesc", value: "item.manufacturer.position_desc"},
  {label: "sortingPriorityCategoryStockAsc", value: "stock.net_asc"},
  {label: "sortingPriorityCategoryStockDesc", value: "stock.net_desc"},
  {label: "sortDataRandom", value: "item.random"},
];
