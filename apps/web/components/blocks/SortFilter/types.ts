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

export type SortFilterProps = {
  name: string;
  type: string;
  configuration?: object;
  content: SortFilterContent;
  index?: number;
  meta: {
    uuid: string;
  };
  shouldLoad?: boolean;
};

export type SortFilterContent = {
  enableFilters: boolean;
  fields: SortFilterFieldsVisibility;
  filtersOrder: SortFilterFieldKey[];
  filtersDisabled: SortFilterFieldKey[];
  showAllFiltersImmediately: boolean;
  numberOfFiltersToShowInitially?: number;
  itemsPerPage: '10' | '20' | '50' | '100';
};

export type SortFilterFormProps = {
  uuid?: string;
};
