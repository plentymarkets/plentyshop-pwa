const stripArrayBrackets = (jsonString: string): string => {
  jsonString = jsonString.trim();
  if (jsonString.startsWith('[') && jsonString.endsWith(']')) {
    jsonString = jsonString.slice(1, -1);
  }
  return jsonString;
};

const updatePageTemplate = async (): Promise<void> => {
  const { isEditingEnabled } = useEditor();
  const { saveBlocks, data } = useCategoryTemplate();

  try {
    const cleanedData = JSON.stringify(data.value);
    await saveBlocks('index', 'immutable', cleanedData);
  } finally {
    isEditingEnabled.value = false;
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
