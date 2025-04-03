export const useProductFilters = () => {
  const route = useRoute();
  const router = useRouter();

  const activeFilters = computed<string[]>(() =>
    (route.query.facets?.toString().split(',') || []).filter(Boolean)
  );

  const priceRange = computed(() => ({
    priceMin: route.query.priceMin?.toString(),
    priceMax: route.query.priceMax?.toString()
  }));

  const sort = computed(() => route.query.sorting?.toString() || 'texts.name1_asc');
  const itemsPerPage = computed(() =>
    Number(route.query.itemsPerPage) || defaults.DEFAULT_ITEMS_PER_PAGE
  );

  const updateFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters.value);
    newFilters.has(filterId) ? newFilters.delete(filterId) : newFilters.add(filterId);
    updateQueryParams({ facets: Array.from(newFilters).join(',') });
  };

  const updatePrice = (min: string, max: string) => {
    updateQueryParams({
      priceMin: min || undefined,
      priceMax: max || undefined
    });
  };

  const resetPriceFilter = () => {
    updateQueryParams({
      priceMin: undefined,
      priceMax: undefined
    });
  };

  const updateSort = (sorting: string) => {
    updateQueryParams({ sorting });
  };

  const updateItemsPerPage = (count: number) => {
    updateQueryParams({ itemsPerPage: count });
  };

  const updateQueryParams = (params: Record<string, unknown>) => {
    router.push({
      query: {
        ...route.query,
        ...params,
        page: 1
      }
    });
  };

  return {
    activeFilters,
    priceRange,
    sort,
    itemsPerPage,
    updateFilter,
    updatePrice,
    resetPriceFilter,
    updateSort,
    updateItemsPerPage
  };
};
