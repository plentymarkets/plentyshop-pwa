import type { FilterGroup } from '@plentymarkets/shop-api';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';

export type CategoryFiltersProps = {
  facets: FilterGroup[];
  configuration?: SortFilterContent;
  renderKey?: string;
  showAll?: boolean;
  limit?: number;
};

export type FilterProps = {
  facet?: FilterGroup;
  configuration?: SortFilterContent;
  renderKey?: string;
  showAll?: boolean;
  limit?: number;
};

export type FilterOpenState = {
  isopen?: boolean;
  forceOpen?: boolean;
  index?: number;
};
