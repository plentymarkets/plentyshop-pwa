import { AgnosticCategoryTree } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src/getters/agnostic.types';

export interface GetFacetsFromURLResponse {
  categorySlug?: string;
  facets?: string;
  itemsPerPage?: number;
  page?: number;
  sort?: string;
  term?: string;
  categoryId?: string;
}

export interface Filters {
  [key: number]: string;
}

export interface UseCategoryFiltersResponse {
  getFacetsFromURL(): GetFacetsFromURLResponse;
  getCatLink(category: AgnosticCategoryTree): string;
  updateFilters(filters: Filters): void;
  updateItemsPerPage(itemsPerPage: number): void;
  updateSearchTerm(term: string): void;
  updateSorting(sort: string): void;
}
