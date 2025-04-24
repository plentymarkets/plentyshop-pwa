const currentCategoryId = ref<number>();
const currentParentCategoryId = ref<number | null>(null);
const currentCategoryName = ref<string | null>(null);

export const useCategoryIdHelper = () => {
  const setCategoryId = (id: number, parentId?: number, name?: string) => {
    currentCategoryId.value = id;
    if (parentId !== undefined) {
      currentParentCategoryId.value = parentId;
    }
    if (name !== undefined) {
      currentCategoryName.value = name;
    }
  };

  const getCategoryId = computed(() => currentCategoryId.value);
  const getParentCategoryId = computed(() => currentParentCategoryId.value);
  const getCategoryName = computed(() => currentCategoryName.value);

  return {
    setCategoryId,
    getCategoryId,
    getParentCategoryId,
    getCategoryName,
  };
};
