const currentCategoryId = ref<number>();
const currentParentCategoryId = ref<number | null>(null);

export const useCategoryIdHelper = () => {
  const setCategoryId = (id: number, parentId?: number) => {
    currentCategoryId.value = id;
    if (parentId !== undefined) {
      currentParentCategoryId.value = parentId;
    }
  };

  const getCategoryId = computed(() => currentCategoryId.value);
  const getParentCategoryId = computed(() => currentParentCategoryId.value);

  return {
    setCategoryId,
    getCategoryId,
    getParentCategoryId,
  };
};
