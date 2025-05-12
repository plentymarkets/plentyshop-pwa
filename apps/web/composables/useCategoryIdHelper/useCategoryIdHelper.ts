const currentCategoryId = ref<number>();
const currentParentCategoryId = ref<number | null>(null);
const currentCategoryName = ref<string | null>(null);
const currentCategoryPath = ref<string | null>(null);
const currentPageType = ref<string | null>(null);

export const useCategoryIdHelper = () => {
  const setCategoryId = (id: number, parentId?: number, name?: string, path?: string) => {
    currentCategoryId.value = id;
    if (parentId !== undefined) {
      currentParentCategoryId.value = parentId;
    }
    if (name !== undefined) {
      currentCategoryName.value = name;
    }
    if (path !== undefined) {
      currentCategoryPath.value = path;
    }
  };

  const setPageType = (pageType?: string) => {
    if (pageType !== undefined) {
      currentPageType.value = pageType;
    }
  };

  const getCategoryId = computed(() => currentCategoryId.value);
  const getParentCategoryId = computed(() => currentParentCategoryId.value);
  const getCategoryName = computed(() => currentCategoryName.value);
  const getCategoryPath = computed(() => currentCategoryPath.value);
  const getPageType = computed(() => currentPageType.value);

  return {
    setCategoryId,
    setPageType,
    getCategoryId,
    getParentCategoryId,
    getCategoryName,
    getCategoryPath,
    getPageType,
  };
};
