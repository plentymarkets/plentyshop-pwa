const updatePageTemplate = async (): Promise<boolean> => {
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();
  const { saveBlocks, data } = useCategoryTemplate();

  const { data: dataProducts } = useProducts();
  const route = useRoute();
  try {
    const cleanedData = JSON.stringify(data.value);
    if (route.path === '/') {
      await saveBlocks('index', 'immutable', cleanedData);
    } else {
      await saveBlocks(dataProducts.value.category.id, 'category', cleanedData);
    }

    return true;
  } catch (error) {
    if (error) {
      send({
        message: error.toString(),
        type: 'negative',
      });
      console.error(error);
    }
    return false;
  } finally {
    isEditingEnabled.value = false;
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
