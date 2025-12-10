export const useUpdatePageTemplate = () => {
  const updatePageTemplate = async (): Promise<boolean> => {
    const { isEditingEnabled } = useEditor();
    const { send } = useNotification();
    const route = useRoute();

    const { saveBlocks, data } = useCategoryTemplate(
      route?.meta?.identifier as string,
      route.meta.type as string,
      useNuxtApp().$i18n.locale.value,
    );

    const { data: dataProducts } = useProducts();

    let success = false;

    try {
      const cleanedData = JSON.stringify(data.value);

      let identifier: string | number = route.meta.identifier as string | number;

      if (dataProducts.value?.category?.type === 'content' && dataProducts.value.category.id) {
        identifier = dataProducts.value.category.id;
      }

      success = await saveBlocks(identifier, route.meta.type as string, cleanedData);
      return success;
    } catch (error) {
      send({
        message: error instanceof Error ? error.message : String(error),
        type: 'negative',
      });
      console.error(error);
      return false;
    } finally {
      isEditingEnabled.value = false;
    }
  };

  return {
    updatePageTemplate,
  };
};
