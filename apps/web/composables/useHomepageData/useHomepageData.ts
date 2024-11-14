export const useHomepageData = async () => {
  const { data: categoryTree } = useCategoryTree();
  const recommendedProductsCategoryId = ref('');
  watch(
    () => categoryTree.value,
    () => {
      const firstCategoryId = categoryTree.value?.[0]?.id;
      if (firstCategoryId) recommendedProductsCategoryId.value = firstCategoryId.toString();
    },
    { immediate: true },
  );

  return {
    recommendedProductsCategoryId,
  };
};
export default useHomepageData;
