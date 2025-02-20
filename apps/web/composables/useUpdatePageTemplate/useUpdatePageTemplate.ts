const stripArrayBrackets = (jsonString: string): string => {
  jsonString = jsonString.trim();
  if (jsonString.startsWith('[') && jsonString.endsWith(']')) {
    jsonString = jsonString.slice(1, -1);
  }
  return jsonString;
};

const updatePageTemplate = async (): Promise<void> => {
  const { setCategoryTemplate } = useCategoryTemplate();
  const { isEditingEnabled } = useEditor();
  const { initialBlocks } = useHomepage();
  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
  const { data, loading } = useHomepage();
  const { send } = useNotification();
  const { $i18n } = useNuxtApp();
  loading.value = true;
  try {
    const cleanedData = stripArrayBrackets(JSON.stringify(data.value));
    await setCategoryTemplate(homepageCategoryId, cleanedData);
    send({
      message: [$i18n.t('errorMessages.editor.save.success'), $i18n.t('errorMessages.editor.save.editor')],
      type: 'positive',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    send({ message: $i18n.t('errorMessages.editor.save.error'), type: 'negative' });
  } finally {
    loading.value = false;
    initialBlocks.value = data.value.blocks.map((block) => toRaw(block));
    isEditingEnabled.value = false;
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
