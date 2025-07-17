import type { FilterGroup } from '@plentymarkets/shop-api';

export type CategoryFiltersProps = {
  facets: FilterGroup[];
};

export type FilterProps = {
  facet?: FilterGroup;
};
