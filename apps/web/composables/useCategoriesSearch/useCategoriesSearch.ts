import type { CategoryData, CategorySearchCriteria, CategoryEntry } from '@plentymarkets/shop-api';
import type { UseCategoriesSearchMethodsReturn, UseCategoriesSearchState } from './types';

export const useCategoriesSearch: UseCategoriesSearchMethodsReturn = () => {
  const state = useState<UseCategoriesSearchState>('useCategoriesSearch', () => ({
    data: {} as CategoryData,
    contentItems: [],
    itemItems: [],
    loadingContent: false,
    loadingItem: false,
    contentPage: 1,
    itemPage: 1,
    hasMoreContent: true,
    hasMoreItem: true,
  }));

  const createEmptyCategoryData = (): CategoryData => ({
    entries: [],
    isLastPage: true,
    page: 1,
    totalsCount: 0,
    lastPageNumber: 1,
    firstOnPage: 0,
    lastOnPage: 0,
    itemsPerPage: 30,
  });
  const fetchContentCategories = async () => {
    if (state.value.loadingContent || !state.value.hasMoreContent) return;

    state.value.loadingContent = true;

    try {
      const { data } = await useAsyncData(() =>
        useSdk().plentysystems.getCategoriesSearch({
          level: 1,
          type: 'content',
          page: state.value.contentPage,
          itemsPerPage: 30,
          sortBy: 'position_asc',
          with: 'details,clients',
        }),
      );

      const result: CategoryData = data.value?.data ?? createEmptyCategoryData();
      state.value.contentItems.push(...result.entries);
      state.value.hasMoreContent = !result.isLastPage;
      state.value.contentPage++;
    } catch (error) {
      console.error('Error fetching content categories:', error);
    } finally {
      state.value.loadingContent = false;
    }
  };

  const fetchItemCategories = async () => {
    if (state.value.loadingItem || !state.value.hasMoreItem) return;

    state.value.loadingItem = true;

    try {
      const { data } = await useAsyncData(() =>
        useSdk().plentysystems.getCategoriesSearch({
          level: 1,
          type: 'item',
          page: state.value.itemPage,
          itemsPerPage: 30,
          sortBy: 'position_asc',
          with: 'details,clients',
        }),
      );

      const result: CategoryData = data.value?.data ?? createEmptyCategoryData();
      state.value.itemItems.push(...result.entries);
      state.value.hasMoreItem = !result.isLastPage;
      state.value.itemPage++;
    } catch (error) {
      console.error('Error fetching item categories:', error);
    } finally {
      state.value.loadingItem = false;
    }
  };

  const getCategories = async (params: CategorySearchCriteria) => {
    state.value.loadingContent = true;
    try {
      const { data } = await useAsyncData<{ data: CategoryData }>(() =>
        useSdk().plentysystems.getCategoriesSearch(params),
      );

      state.value.data = data?.value?.data ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loadingContent = false;
    }
  };
  const usePaginatedChildren = (parentCategoryId: number) => {
    const items = ref<CategoryEntry[]>([]);
    const loading = ref(false);
    const hasMore = ref(true);
    const page = ref(1);

    const fetchMore = async () => {
      if (loading.value || !hasMore.value) return;

      loading.value = true;
      try {
        const { data } = await useAsyncData<{ data: CategoryData }>(() =>
          useSdk().plentysystems.getCategoriesSearch({
            parentCategoryId,
            itemsPerPage: 30,
            page: page.value,
            with: 'details,clients',
          }),
        );

        const result: CategoryData = data?.value?.data ?? createEmptyCategoryData();
        items.value.push(...result.entries);
        hasMore.value = !result.isLastPage;
        page.value++;
      } catch (error) {
        console.error(`Error fetching children for category ${parentCategoryId}:`, error);
      } finally {
        loading.value = false;
      }
    };

    return {
      items,
      loading,
      hasMore,
      fetchMore,
    };
  };

  return {
    ...toRefs(state.value),
    fetchContentCategories,
    fetchItemCategories,
    getCategories,
    usePaginatedChildren,
  };
};
