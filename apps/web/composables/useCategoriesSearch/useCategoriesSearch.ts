import type { CategoryData, CategoryEntry, CategorySearchCriteria } from '@plentymarkets/shop-api';
import type { UseCategoriesSearchMethodsReturn, UseCategoriesSearchState } from './types';

export const useCategoriesSearch: UseCategoriesSearchMethodsReturn = () => {
  const state = useState<UseCategoriesSearchState>('useCategoriesSearch', () => ({
    data: {} as CategoryData,
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

  const insertIntoParent = (newPage: CategoryEntry, nodes: CategoryEntry[]): boolean => {
    return nodes.some((node) => {
      if (node.id === newPage.parentCategoryId) {
        node.children = node.children || [];
        node.children.unshift(newPage);
        return true;
      }
      return node.children ? insertIntoParent(newPage, node.children) : false;
    });
  };

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

    if (!newPage.parentCategoryId) {
      targetArray?.unshift(newPage);
      return;
    }

    insertIntoParent(newPage, targetArray ?? []);
  };

  const deleteFromTree = (id: number, nodes: CategoryEntry[]): CategoryEntry[] => {
    return nodes.reduce<CategoryEntry[]>((acc, node) => {
      if (node.id === id) return acc;

      const updatedNode: CategoryEntry = { ...node };

      if (node.children) {
        const prunedChildren = deleteFromTree(id, node.children);
        if (prunedChildren.length) {
          updatedNode.children = prunedChildren;
        } else {
          delete updatedNode.children;
        }
      }

      acc.push(updatedNode);
      return acc;
    }, []);
  };

  const deletePageFromTree = (id: number) => {
    state.value.contentItems = deleteFromTree(id, state.value.contentItems);
    state.value.itemItems = deleteFromTree(id, state.value.itemItems);
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

  const filterNewlyAddedPages = (entries: CategoryEntry[]) => {
    return entries.filter((entry) => !state.value.newPages.includes(entry.id));
  };

  const usePaginatedChildren = (category: CategoryEntry) => {
    const items = ref<CategoryEntry[]>([]);
    const loading = ref(false);
    const hasMore = ref(true);
    const page = ref(1);

    const findCategoryById = (nodes: CategoryEntry[], id: number): CategoryEntry | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findCategoryById(node.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const addChildrenToParent = (parentId: number, children: CategoryEntry[]) => {
      const { send } = useNotification();
      const parent = findCategoryById([...state.value.contentItems, ...state.value.itemItems], parentId);
      if (!parent) {
        send({ message: `Parent category with ID ${parentId} not found.`, type: 'negative' });
        return;
      }

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(...children);
    };

    const fetchMore = async () => {
      const { send } = useNotification();
      if (loading.value || !hasMore.value) return;

      loading.value = true;
      try {
        const { data } = await useAsyncData<{ data: CategoryData }>(() =>
          useSdk().plentysystems.getCategoriesSearch({
            parentCategoryId: category.id,
            itemsPerPage: 30,
            page: page.value,
            with: 'details,clients',
          }),
        );

        const result: CategoryData = data?.value?.data ?? createEmptyCategoryData();

        addChildrenToParent(category.id, result.entries);

        items.value.push(...result.entries);
        hasMore.value = !result.isLastPage;
        page.value++;
      } catch (error) {
        send({ message: `Error fetching children for category ${category.id}: ${error}`, type: 'negative' });
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
    getCategories,
  };
};
