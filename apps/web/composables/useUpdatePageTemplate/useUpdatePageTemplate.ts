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
  loading.value = true;
  try {
    const cleanedData = stripArrayBrackets(JSON.stringify(data.value));
    await setCategoryTemplate(homepageCategoryId, cleanedData);
  } finally {
    loading.value = false;
    isEditingEnabled.value = false;
    initialBlocks.value = data.value.blocks.map((block) => toRaw(block));
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
