export const useUpdatePageTemplate = () => {
  const updatePageTemplate = async (): Promise<boolean> => {
    const { isEditingEnabled } = useEditor();
    const { send } = useNotification();
    const route = useRoute();

    const { saveBlocks, data } = useBlockTemplates(
      route?.meta?.identifier as string,
      route.meta.type as string,
      useNuxtApp().$i18n.locale.value,
    );

    const { data: dataProducts } = useProducts();

    try {
      const pageBlocks = data.value;
      const cleanedData = JSON.stringify(pageBlocks);

      let identifier: string | number = route.meta.identifier as string | number;

      if (dataProducts.value?.category?.type === 'content' && dataProducts.value.category.id) {
        identifier = dataProducts.value.category.id;
      }

      console.warn('[updatePageTemplate] saving to identifier:', identifier, 'type:', route.meta.type);
      console.warn('[updatePageTemplate] pageBlocks being saved:', JSON.parse(JSON.stringify(pageBlocks)));

      return await saveBlocks(identifier, route.meta.type as string, cleanedData);
    } catch (error) {
      send({
        message: `Failed to update page template: ${error instanceof Error ? error.toString() : String(error)}`,
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
