import type { Filters, GetFacetsFromURLResponse, UseCategoryFiltersResponse } from './types';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
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

/**
 * @description Composable for managing category filter.
 * @returns UseCategoryFiltersResponse
 * @example
 * ``` ts
 * const {
 * getFacetsFromURL, updateFilters, updateItemsPerPage, updateSearchTerm, updateSorting, updatePage, updatePrices
 * } = useCategoryFilter();
 * ```
 */
export const useCategoryFilter = (to?: RouteLocationNormalizedGeneric): UseCategoryFiltersResponse => {
  const route = to ?? useNuxtApp().$router.currentRoute.value;

  /**
   * @description Function for getting facets from url.
   * @return GetFacetsFromURLResponse
   * @example
   * ``` ts
   * getFacetsFromURL();
   * ```
   */
  const getFacetsFromURL = (): GetFacetsFromURLResponse => {
    const { getCategoryUrlFromRoute } = useLocalization();
    const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');
    const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
    const config = useRuntimeConfig().public;

    const currentRoute = useNuxtApp().$router.currentRoute.value;

    const defaultOption =
      useNuxtApp().$router.currentRoute.value.path === '/search' ? defaultSortingSearch() : defaultSortingOption();
    console.log('currentRoute: ', currentRoute);

    return {
      categoryUrlPath: getCategoryUrlFromRoute(currentRoute.fullPath),
      page: Number(currentRoute.query.page as string) || defaults.DEFAULT_PAGE,
      sort: currentRoute.query.sort?.toString() ?? defaultOption,
      facets: currentRoute.query.facets?.toString(),
      feedbackPage: Number(currentRoute.query.feedbackPage as string) || defaults.DEFAULT_FEEDBACK_PAGE,
      feedbacksPerPage: Number(currentRoute.query.feedbacksPerPage as string) || config.defaultItemsPerPage,
      itemsPerPage: Number(currentRoute.query.itemsPerPage as string) || defaults.DEFAULT_ITEMS_PER_PAGE,
      term: currentRoute.query.term?.toString(),
      priceMin: currentRoute.query.priceMin?.toString(),
      priceMax: currentRoute.query.priceMax?.toString(),
    };
  };

  /**
   * @description Function for getting filters from url.
   * @return Filters
   * @example
   * ``` ts
   * getFiltersFromUrl();
   * ```
   */
  const getFiltersFromUrl = (): Filters => {
    const filters: Filters = {};
    const facets = getFacetsFromURL().facets?.split(',') ?? [];

    facets.forEach((facet: string) => {
      filters[facet] = true;
    });

    return filters;
  };

  /**
   * @description Function for getting filters data from url.
   * @return GetFacetsFromURLResponse
   * @example
   * ``` ts
   * getFiltersDataFromUrl();
   * ```
   */
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

    if (import.meta.client) {
      navigateTo({ query: updateQuery });
    }
  };

  /**
   * @description Function for updating filters.
   * @param filters { Filters }
   * @return void
   * @example
   * ``` ts
   * updateFilters(filters);
   * ```
   */
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

  /**
   * @description Function for updating prices.
   * @param priceMin
   * @param priceMax
   * @return void
   * @example
   * ``` ts
   * updatePrices('1', '1');
   * ```
   */
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

  /**
   * @description Function for updating items per page.
   * @param itemsPerPage
   * @return void
   * @example
   * ``` ts
   * updateItemsPerPage(1);
   * ```
   */
  const updateItemsPerPage = (itemsPerPage: number): void => {
    updateQuery({ itemsPerPage: itemsPerPage, page: 1 });
  };

  /**
   * @description Function for updating the page.
   * @param page
   * @param currentPageName
   * @return void
   * @example
   * ``` ts
   * updatePage('1', 'page');
   * ```
   */
  const updatePage = (page: string, currentPageName: string): void => {
    updateQuery({ [currentPageName]: page });
  };

  /**
   * @description Function for updating the search term.
   * @param term
   * @return void
   * @example
   * ``` ts
   * updateSearchTerm('1');
   * ```
   */
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

  /**
   * @description Function for updating the sorting.
   * @param sort
   * @return void
   * @example
   * ``` ts
   * updateSorting('1');
   * ```
   */
  const updateSorting = (sort: string): void => {
    const query = { ...route.query };
    if (sort) query.sort = sort;
    else delete query.sort;
    navigateTo({ query });
  };

  /**
   * @description Function for validating selected filters in the url.
   * @return void
   * @example
   * ``` ts
   * checkFiltersInURL();
   * ```
   */
  const checkFiltersInURL = (): void => {
    const { data: productsCatalog } = useProducts();
    const facetsFromUrl = getFacetsFromURL();
    const facetsFromResponse = productsCatalog.value.facets;

    if (facetsFromUrl.facets) {
      const facets = facetsFromUrl.facets.split(',');

      const updatedFacets = facets.filter((facet) => {
        return facetsFromResponse.some((facetItem) => {
          if (facetItem.values) {
            return facetItem.values.some((facetValue) => facetValue.id.toString() === facet);
          }
          return false;
        });
      });

      updateQuery({ facets: updatedFacets.join(',') });
    }
  };

  return {
    getFacetsFromURL,
    updateFilters,
    updateItemsPerPage,
    updateSearchTerm,
    updateSorting,
    updatePage,
    updatePrices,
    updateQuery,
    checkFiltersInURL,
  };
};

export default useCategoryFilter;
