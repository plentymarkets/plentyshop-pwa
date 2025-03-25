const updatePageTemplate = async (): Promise<boolean> => {
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();
  const { saveBlocks, data } = useCategoryTemplate();

  try {
    const cleanedData = JSON.stringify(data.value);
    await saveBlocks('index', 'immutable', cleanedData);

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
