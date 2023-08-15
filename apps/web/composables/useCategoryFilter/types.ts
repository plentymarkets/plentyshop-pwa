import { FacetSearchCriteria } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface GetFacetsFromURLResponse extends FacetSearchCriteria {
  term?: string;
  priceMin?: string;
  priceMax?: string;
}

export interface Filters {
  [key: string]: boolean;
}

export interface UseCategoryFiltersResponse {
  getFacetsFromURL(): GetFacetsFromURLResponse;
  updateFilters(filters: Filters): void;
  updatePrices(priceMin: string, priceMax: string): void;
  updateItemsPerPage(itemsPerPage: number): void;
  updateSearchTerm(term: string): void;
  updateSorting(sort: string): void;
  updatePage(page: string): void;
}
