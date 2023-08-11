import { useRoute } from 'nuxt/app';
import { Filters, GetFacetsFromURLResponse, UseCategoryFiltersResponse } from './types';
import {computed} from "#build/imports";

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
  console.log('oldFilters', oldFilters);
  const mergedFilters = { ...oldFilters };
  Object.keys(filters).forEach((key) => {
    mergedFilters[key] = filters[key];
  });

  return mergedFilters;
};

export const useCategoryFilter = (): UseCategoryFiltersResponse => {
  const { fullPath, query } = useRoute();
  const router = useRouter();

  const getFacetsFromURL = (): GetFacetsFromURLResponse => {
    const { query: nQuery } = useRoute();
    const itemsPerPage = Number.parseInt(query.itemsPerPage as string);

    return {
      categorySlug: fullPath.split('/').pop(),
      page: Number.parseInt(query.page as string) ?? defaults.DEFAULT_PAGE,
      sort: query.sort?.toString(),
      facets: nQuery.facets?.toString(),
      itemsPerPage: Number.isInteger(itemsPerPage) ? itemsPerPage : defaults.DEFAULT_ITEMS_PER_PAGE,
      term: query.term?.toString(),
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
    return Object.keys(query)
      .filter((f) => nonFilters.has(f))
      .reduce(reduceFilters(query), {});
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
