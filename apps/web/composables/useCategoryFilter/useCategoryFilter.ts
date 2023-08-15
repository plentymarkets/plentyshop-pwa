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
  return Object.keys(filters)
    .filter((key) => {
      return filters[key];
    })
    .join(',');
};

const mergeFilters = (oldFilters: Filters, filters: Filters): Filters => {
  const mergedFilters = { ...oldFilters };
  Object.keys(filters).forEach((key) => {
    mergedFilters[key] = filters[key];
  });

  return mergedFilters;
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

  const getFiltersFromUrl = (): Filters => {
    const filters: Filters = {};
    const facets = getFacetsFromURL().facets?.split(',') ?? [];

    facets.forEach((facet: string) => {
      filters[facet] = true;
    });

    return filters;
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
    const currentFilters = getFiltersFromUrl();
    const mergedFilters = mergeFilters(currentFilters, filters);
    const filtersIds = getFiltersToUpdate(mergedFilters);

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
