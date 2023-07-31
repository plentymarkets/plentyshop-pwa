import { FilterGroup } from '../../../../../plentymarkets-sdk/packages/api-client';

export type CategoryFiltersProps = {
  facets: FilterGroup[];
};

export type FilterProps = {
  facet?: FilterGroup;
};

export type FilterEmits = {
  // (event: 'update:selected', parameter: FilterProps['selected']): void;
};
