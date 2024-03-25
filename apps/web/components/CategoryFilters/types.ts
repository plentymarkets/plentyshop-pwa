import type { FilterGroup } from '@plentymarkets/shop-api';

export type CategoryFiltersProps = {
  facets: FilterGroup[];
};

export type FilterProps = {
  facet?: FilterGroup;
};

export type FilterEmits = {
  // (event: 'update:selected', parameter: FilterProps['selected']): void;
};
