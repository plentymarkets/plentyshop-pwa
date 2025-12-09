import type { BlockProps } from '~/types/blocks';

export type SortFilterFieldKey =
  | 'category'
  | 'sortBy'
  | 'perPage'
  | 'itemRating'
  | 'manufacturer'
  | 'price'
  | 'availability'
  | 'customizedFilters';

export type SortFilterFieldsVisibility = Record<SortFilterFieldKey, boolean>;

/**
 * SortFilter block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps with shouldLoad runtime property.
 */
export type SortFilterProps = BlockProps<SortFilterContent> & {
  shouldLoad?: boolean;
};

export type SortFilterContent = {
  fields: SortFilterFieldsVisibility;
  filtersOrder: SortFilterFieldKey[];
  filtersDisabled: SortFilterFieldKey[];
  showAllFiltersImmediately: boolean;
  numberOfFiltersToShowInitially?: number;
};

export type SortFilterFormProps = {
  uuid?: string;
};
