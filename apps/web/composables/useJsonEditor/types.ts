export interface UseJsonEditorReturn {
  jsonText: Ref<string>;
  errorMessage: Ref<string>;
  lineCount: Ref<number[]>;
  textarea: Ref<HTMLTextAreaElement | null>;
  lineNumberContainer: Ref<HTMLElement | null>;
  syncScroll: () => void;
  handleInput: () => void;
  formatJson: () => void;
  purgeJson: () => void;
  clearText: () => void;
}
