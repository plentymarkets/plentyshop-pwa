import { useRoute } from 'nuxt/app';
import { Filters, GetFacetsFromURLResponse, UseCategoryFiltersResponse } from './types';

const nonFilters = new Set(['page', 'sort', 'term', 'itemsPerPage']);

const reduceFilters =
  (query: GetFacetsFromURLResponse) =>
  (previous: GetFacetsFromURLResponse, current: string): GetFacetsFromURLResponse => {
    const makeArray = Array.isArray(query[current as keyof GetFacetsFromURLResponse]) || nonFilters.has(current);

    return {
      ...previous,
      [current]: makeArray
        ? query[current as keyof GetFacetsFromURLResponse]
        : [query[current as keyof GetFacetsFromURLResponse]],
    };
  };

const getFiltersToUpdate = (filters: Filters): string => {
  return Object.values(filters)
    .filter((entry: string[]) => entry.length > 0)
    .join(',');
};

export const useCategoryFilter = (): UseCategoryFiltersResponse => {
  const { fullPath, query } = useRoute();
  const router = useRouter();

  const getFacetsFromURL = (): GetFacetsFromURLResponse => {
    return {
      categorySlug: fullPath.split('/').pop(),
      page: Number.parseInt(query.page as string) ?? defaults.DEFAULT_PAGE,
      sort: query.sort?.toString(),
      facets: query.facets?.toString(),
      itemsPerPage: Number.parseInt(query.itemsPerPage as string) ?? defaults.DEFAULT_ITEMS_PER_PAGE,
      term: query.term?.toString(),
    };
  };

  const getFiltersDataFromUrl = (): GetFacetsFromURLResponse => {
    return Object.keys(query)
      .filter((f) => nonFilters.has(f))
      .reduce(reduceFilters(query), {});
  };

  const updateQuery = (parameter?: object) => {
    router.push({ query: { ...getFiltersDataFromUrl(), ...parameter } });
  };

  const updateFilters = (filters: Filters): void => {
    const filtersIds = getFiltersToUpdate(filters);

    if (filtersIds) {
      updateQuery({ facets: filtersIds });
    } else {
      updateQuery();
    }
  };

  const updateItemsPerPage = (itemsPerPage: number): void => {
    updateQuery({ itemsPerPage: itemsPerPage });
  };

  const updateSearchTerm = (term: string): void => {
    updateQuery({ term: term || undefined });
  };

  const updateSorting = (sort: string): void => {
    router.push({ query: { ...query, sort } });
  };

  return {
    getFacetsFromURL,
    updateFilters,
    updateItemsPerPage,
    updateSearchTerm,
    updateSorting,
  };
};

export default useCategoryFilter;
