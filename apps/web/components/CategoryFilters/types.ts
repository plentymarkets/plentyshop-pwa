import type { FilterGroup } from '@plentymarkets/shop-api';
import { SortFilterContent } from "~/components/blocks/SortFilter/types";

export type CategoryFiltersProps = {
  facets: FilterGroup[];
  configuration?: SortFilterContent
};

export type FilterProps = {
  facet?: FilterGroup;
  configuration?: SortFilterContent
};
