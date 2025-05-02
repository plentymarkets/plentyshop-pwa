import type { CategoryData, CategoryEntry } from '@plentymarkets/shop-api';
import type { UseCategoriesSearchMethodsReturn, UseCategoriesSearchState } from './types';

export const useCategoriesSearch: UseCategoriesSearchMethodsReturn = () => {
  const state = useState<UseCategoriesSearchState>('useCategoriesSearch', () => ({
    contentItems: [],
    itemItems: [],
    newPages: [],
    loadingContent: false,
    loadingItem: false,
    contentPage: 1,
    itemPage: 1,
    hasMoreContent: true,
    hasMoreItem: true,
  }));

  const addNewPageToTree = (newPage: CategoryEntry) => {
    if (state.value.contentItems.length === 0 && state.value.itemItems.length === 0) {
      return;
    }

    if (!state.value.newPages.includes(newPage.id)) {
      state.value.newPages.push(newPage.id);
    }

    const targetArray = {
      content: state.value.contentItems,
      item: state.value.itemItems,
    }[newPage.type];

    targetArray?.unshift(newPage);
  };

  const deletePageFromTree = (id: number) => {
    state.value.contentItems = state.value.contentItems.filter((item) => item.id !== id);
    state.value.itemItems = state.value.itemItems.filter((item) => item.id !== id);
  };

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

  const fetchCategories = async (categoryType: 'item' | 'content') => {
    const loadingKey = categoryType === 'item' ? 'loadingItem' : 'loadingContent';
    const hasMoreKey = categoryType === 'item' ? 'hasMoreItem' : 'hasMoreContent';
    const pageKey = categoryType === 'item' ? 'itemPage' : 'contentPage';
    const itemsKey = categoryType === 'item' ? 'itemItems' : 'contentItems';

    if (state.value[loadingKey] || !state.value[hasMoreKey]) return;

    state.value[loadingKey] = true;

    try {
      const { data } = await useAsyncData(() =>
        useSdk().plentysystems.getCategoriesSearch({
          level: 1,
          type: categoryType,
          page: state.value[pageKey],
          itemsPerPage: 30,
          sortBy: 'position_asc',
          with: 'details,clients',
        }),
      );

      const result: CategoryData = data.value?.data ?? createEmptyCategoryData();
      state.value[itemsKey].push(...filterNewlyAddedPages(result.entries));
      state.value[hasMoreKey] = !result.isLastPage;
      state.value[pageKey]++;
    } catch (error) {
      console.error(`Error fetching ${categoryType} categories:`, error);
    } finally {
      state.value[loadingKey] = false;
    }
  };

  const filterNewlyAddedPages = (entries: CategoryEntry[]) => {
    return entries.filter((entry) => !state.value.newPages.includes(entry.id));
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
    fetchCategories,
    usePaginatedChildren,
    addNewPageToTree,
    deletePageFromTree,
  };
};
