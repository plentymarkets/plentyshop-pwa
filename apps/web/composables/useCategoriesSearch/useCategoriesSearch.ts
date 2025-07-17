import type { CategoryData, CategoryEntry, CategorySearchCriteria } from '@plentymarkets/shop-api';
import type { UseCategoriesSearchMethodsReturn, UseCategoriesSearchState } from './types';

export const useCategoriesSearch: UseCategoriesSearchMethodsReturn = () => {
  const state = useState<UseCategoriesSearchState>('useCategoriesSearch', () => ({
    data: {} as CategoryData,
    contentItems: [],
    itemItems: [],
    newPages: [],
    allItems: [],
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
        node.hasChildren = true;
        if (node.children) {
          if (!node.children.some((c) => c.id === newPage.id)) {
            node.children.unshift(newPage);
          }
        }
        return true;
      }
      return node.children ? insertIntoParent(newPage, node.children) : false;
    });
  };
  const getLevel = (cat: CategoryEntry): number => cat.level ?? 0;

  const insertPageIntoTree = (page: CategoryEntry, target: CategoryEntry[]) => {
    if (!page.parentCategoryId) {
      target.unshift(page);
      return;
    }
    insertIntoParent(page, target);
  };

  const movePagesInTree = (pages: CategoryEntry | CategoryEntry[]): void => {
    const list = Array.isArray(pages) ? pages : [pages];

    for (const p of list) {
      state.value.contentItems = deleteFromTree(p.id, state.value.contentItems);
      state.value.itemItems = deleteFromTree(p.id, state.value.itemItems);

      if (!state.value.newPages.includes(p.id)) {
        state.value.newPages.push(p.id);
      }
    }

    list.sort((a, b) => getLevel(a) - getLevel(b));

    for (const p of list) {
      const target = p.type === 'content' ? state.value.contentItems : state.value.itemItems;

      insertPageIntoTree(p, target);
    }
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
    return nodes.filter((node) => {
      if (node.id === id) return false;

      if (node.children) {
        node.children = deleteFromTree(id, node.children);
        if (node.children.length === 0) {
          node.hasChildren = false;
          delete node.children;
        }
      }

      return true;
    });
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
      const { data } = await useAsyncData(`categories-search-${categoryType}`, () =>
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
      const getCategoriesResult = await useSdk().plentysystems.getCategoriesSearch(params);

      state.value.data = getCategoriesResult.data ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loadingContent = false;
    }
  };

  const resetCategories = () => {
    state.value.contentItems = [];
    state.value.contentPage = 1;
    state.value.hasMoreContent = true;
    state.value.itemItems = [];
    state.value.itemPage = 1;
    state.value.hasMoreItem = true;
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
        const data = await useSdk().plentysystems.getCategoriesSearch({
          parentCategoryId: category.id,
          itemsPerPage: 30,
          page: page.value,
          with: 'details,clients',
        });

        const result: CategoryData = data.data ?? createEmptyCategoryData();

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

  const noneCategoryItem: CategoryEntry = {
    id: 0,
    type: 'none',
    itemCount: [],
    childCount: 0,
    right: 'all',
    details: [
      {
        name: 'None',
        lang: '',
        nameUrl: '',
        metaTitle: '',
        imagePath: '',
        image2Path: '',
        canonicalLink: '',
        categoryId: '0',
        description: '',
        description2: '',
        fulltext: 'N',
        image: 0,
        image2: '',
        itemListView: '',
        metaDescription: '',
        metaKeywords: '',
        metaRobots: '',
        pageView: '',
        position: '0',
        previewUrl: '',
        plenty_category_details_image_path: '',
        plenty_category_details_image2_path: '',
        plentyId: 0,
        shortDescription: '',
        singleItemView: '',
        updatedAt: '',
        updatedBy: '',
      },
    ],
    clients: [],
    level: 0,
    linklist: '',
    parentCategoryId: 0,
    sitemap: 'N',
    isLinkedToWebstore: false,
    hasChildren: false,
  };

  const flattenCategories = (categories: CategoryEntry[]): CategoryEntry[] => {
    const flat: CategoryEntry[] = [];
    function recurse(nodes: CategoryEntry[]) {
      for (const node of nodes) {
        flat.push(node);
        if (node.children && Array.isArray(node.children)) {
          recurse(node.children);
        }
      }
    }
    recurse(categories);
    return flat;
  };

  const allItems = computed(() =>
    flattenCategories([...[noneCategoryItem], ...state.value.contentItems, ...state.value.itemItems]),
  );

  return {
    ...toRefs(state.value),
    fetchCategories,
    usePaginatedChildren,
    addNewPageToTree,
    deletePageFromTree,
    getCategories,
    resetCategories,
    allItems,
    insertPageIntoTree,
    movePagesInTree,
  };
};
