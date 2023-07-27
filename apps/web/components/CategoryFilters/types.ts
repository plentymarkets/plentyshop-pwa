import { Filter, FilterGroup } from '../../../../../plentymarkets-sdk/packages/api-client';

export type CategoryFiltersProps = {
  facets: FilterGroup[];
};

export type FilterProps = {
  facet?: FilterGroup;
  selected: string[];
  type: 'size' | 'color';
};

export type FilterEmits = {
  (event: 'update:selected', parameter: Filter['selected']): void;
};
