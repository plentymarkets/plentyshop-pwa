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

  const insertIntoParent = (newPage: CategoryEntry, nodes: CategoryEntry[]): boolean => {
    for (const node of nodes) {
      if (node.id === newPage.parentCategoryId) {
        if (!node.children) node.children = [];
        node.children.unshift(newPage);
        return true;
      }
      if (node.children && insertIntoParent(newPage, node.children)) {
        return true;
      }
    }
    return false;
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

    // If it has no parent, insert at root level
    if (!newPage.parentCategoryId) {
      targetArray?.unshift(newPage);
      return;
    }

    insertIntoParent(newPage,targetArray ?? []);
  };

  const deleteFromTree = (id: number, nodes: CategoryEntry[]): CategoryEntry[] => {
    return nodes
      .map((node) => {
        if (node.id === id) return null;

        const newNode: CategoryEntry = { ...node };

        if (node.children) {
          const updatedChildren = deleteFromTree(id, node.children);
          newNode.children = updatedChildren.length > 0 ? updatedChildren : undefined;
        }

        return newNode;
      })
      .filter(Boolean) as CategoryEntry[]; // Remove null entries
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
      const parent = findCategoryById(state.value.contentItems, parentId);
      if (!parent) {
        console.error(`Parent category with ID ${parentId} not found.`);
        return;
      }

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(...children);
    };

    const fetchMore = async () => {
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
        console.error(`Error fetching children for category ${category.id}:`, error);
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
