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
  [key: string]: boolean;
}

export interface UseCategoryFiltersResponse {
  getFacetsFromURL(): GetFacetsFromURLResponse;
  updateFilters(filters: Filters): void;
  updateItemsPerPage(itemsPerPage: number): void;
  updateSearchTerm(term: string): void;
  updateSorting(sort: string): void;
}
