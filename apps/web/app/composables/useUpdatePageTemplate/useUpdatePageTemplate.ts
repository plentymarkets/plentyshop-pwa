export const useUpdatePageTemplate = () => {
  const updatePageTemplate = async (): Promise<boolean> => {
    const { isEditingEnabled } = useEditor();
    const { send } = useNotification();
    const route = useRoute();

    const { saveBlocks, data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

    const { data: dataProducts } = useProducts();

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
