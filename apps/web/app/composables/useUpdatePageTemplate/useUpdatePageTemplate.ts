export const useUpdatePageTemplate = () => {
  const updatePageTemplate = async (): Promise<boolean> => {
    const { isEditingEnabled } = useEditor();
    const { send } = useNotification();
    const { saveBlocks, data } = useCategoryTemplate();

    const { data: dataProducts } = useProducts();
    const route = useRoute();
    try {
      const cleanedData = JSON.stringify(data.value);
      const identifier = ref(route.meta.identifier as string | number);

      if (dataProducts.value.category?.type === 'content') {
        identifier.value = dataProducts.value.category?.id;
      }

      await saveBlocks(identifier.value, route.meta.type as string, cleanedData);

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

  return {
    updatePageTemplate,
  };
};
