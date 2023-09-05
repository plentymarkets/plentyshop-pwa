import { useRoute } from 'nuxt/app';
import { Filters, GetFacetsFromURLResponse, UseCategoryFiltersResponse } from './types';

const nonFilters = new Set(['page', 'sort', 'term', 'facets', 'itemsPerPage', 'priceMin', 'priceMax']);

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

const getCategorySlugsFromPath = (path: string): string[] => {
  const parts = path.split('/');
  const categoryIndex = parts.indexOf('category');

  return parts.slice(categoryIndex + 1).map((part) => (part.includes('?') ? part.split('?')[0] : part));
};

export const useCategoryFilter = (): UseCategoryFiltersResponse => {
  const route = useRoute();
  const router = useRouter();

  const getFacetsFromURL = (): GetFacetsFromURLResponse => {
    return {
      categoryUrlPath: getCategorySlugsFromPath(route.fullPath).join('/'),
      page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
      sort: route.query.sort?.toString(),
      facets: route.query.facets?.toString(),
      itemsPerPage: Number(route.query.itemsPerPage as string) || defaults.DEFAULT_ITEMS_PER_PAGE,
      term: route.query.term?.toString(),
      priceMin: route.query.priceMin?.toString(),
      priceMax: route.query.priceMax?.toString(),
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

  /***
   * Update the query string with the new parameters
   * Remove the parameters that are null
   * Example: { page: 1, sort: 'name', facets: null } => ?page=1&sort=name
   ***/
  const updateQuery = (parameter?: object) => {
    const query = { ...getFiltersDataFromUrl(), ...parameter };
    const entries = Object.entries(query);
    const updateQuery: { [key: string]: string } = {};
    entries.forEach(([key, value]) => {
      if (value !== null) {
        updateQuery[key] = value.toString();
      }
    });

    router.push({ query: updateQuery });
  };

  const updateFilters = (filters: Filters): void => {
    const currentFilters = getFiltersFromUrl();
    const mergedFilters = mergeFilters(currentFilters, filters);
    const filtersIds = getFiltersToUpdate(mergedFilters);

    if (filtersIds) {
      updateQuery({ facets: filtersIds });
    } else {
      updateQuery({ facets: null });
    }
  };

  const updatePrices = (priceMin: string, priceMax: string): void => {
    if (priceMin.length > 0 && priceMax.length === 0) {
      updateQuery({ priceMin: priceMin });
    } else if (priceMax.length > 0 && priceMin.length === 0) {
      updateQuery({ priceMax: priceMax });
    } else if (priceMax.length > 0 && priceMin.length > 0) {
      updateQuery({ priceMin: priceMin, priceMax: priceMax });
    } else {
      updateQuery({ priceMin: null, priceMax: null });
    }
  };

  const updateItemsPerPage = (itemsPerPage: number): void => {
    updateQuery({ itemsPerPage: itemsPerPage, page: 1 });
  };

  const updatePage = (page: string): void => {
    updateQuery({ page: page });
  };

  const updateSearchTerm = (term: string): void => {
    updateQuery({
      term: term || undefined,
      categorySlugs: null,
      categorySlug: null,
      page: null,
      sort: null,
      facets: null,
      itemsPerPage: null,
      priceMin: null,
      priceMax: null,
    });
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
    updatePrices,
  };
};

export default useCategoryFilter;
