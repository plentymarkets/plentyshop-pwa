export const useJsonEditor = (initialJson: string) => {
  const { isEditingEnabled } = useEditor();
  const errorMessage = ref('');
  const lineCount = ref<number[]>([]);
  const textarea = ref<HTMLTextAreaElement | null>(null);
  const lineNumberContainer = ref<HTMLElement | null>(null);

  const jsonText = useState<string>('jsonText', () => initialJson);
  const originalJsonText = jsonText.value;

  const syncScroll = () => {
    if (lineNumberContainer.value && textarea.value) {
      lineNumberContainer.value.scrollTop = textarea.value.scrollTop;
    }
  };

  const updateLineCount = () => {
    if (textarea.value) {
      const lineBreaks = (jsonText.value.match(/\n/g) || []).length;
      lineCount.value = Array.from({ length: lineBreaks + 1 }, (_, index) => index + 1);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonText.value);
      errorMessage.value = '';
      isEditingEnabled.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
      isEditingEnabled.value = false;
    }
  };

  const checkInputChange = () => {
    if (jsonText.value === originalJsonText) {
      isEditingEnabled.value = false;
    }
  };

  const handleInput = () => {
    try {
      validateJson();
      updateLineCount();
      checkInputChange();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
      isEditingEnabled.value = false;
    }
  };

  onMounted(() => {
    updateLineCount();
  });

  watch(jsonText, updateLineCount);

  return {
    jsonText,
    errorMessage,
    lineCount,
    textarea,
    lineNumberContainer,
    syncScroll,
    handleInput,
  };
};
