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
  const route = useRoute();
  const router = useRouter();

  const getFacetsFromURL = (): GetFacetsFromURLResponse => {
    return {
      categorySlug: route.fullPath.split('/').pop(),
      page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
      sort: route.query.sort?.toString(),
      facets: route.query.facets?.toString(),
      itemsPerPage: Number(route.query.itemsPerPage as string) || defaults.DEFAULT_ITEMS_PER_PAGE,
      term: route.query.term?.toString(),
    };
  };

  const getFiltersDataFromUrl = (): GetFacetsFromURLResponse => {
    return Object.keys(route.query)
      .filter((f) => nonFilters.has(f))
      .reduce(reduceFilters(route.query), {});
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
    updateQuery({ itemsPerPage: itemsPerPage, page: 1 });
  };

  const updatePage = (page: string): void => {
    updateQuery({ page: page });
  };

  const updateSearchTerm = (term: string): void => {
    updateQuery({ term: term || undefined });
  };

  const updateSorting = (sort: string): void => {
    router.push({ query: { ...route.query, sort } });
  };

  return {
    getFacetsFromURL,
    updateFilters,
    updateItemsPerPage,
    updateSearchTerm,
    updateSorting,
    updatePage,
  };
};

export default useCategoryFilter;
